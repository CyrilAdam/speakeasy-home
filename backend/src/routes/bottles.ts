import { Hono } from 'hono';
import type { DatabaseSync } from 'node:sqlite';
import type { Bottle } from '../types.js';

function rowToBottle(row: Record<string, unknown>): Bottle {
  return {
    id:           row.id            as string,
    name:         row.name          as string,
    category:     row.category      as string,
    color:        row.color         as string,
    owned:        row.owned         === 1,
    pantry:       row.pantry        === 1,
    genericId:    (row.generic_id   as string | null) ?? null,
    variantCount: (row.variant_count as number | undefined) ?? 0,
  };
}

export function createBottlesRouter(db: DatabaseSync) {
  const app = new Hono();

  /** Toujours relire via la vue : le `owned` renvoyé est la possession effective. */
  function findEffective(id: string) {
    return db.prepare('SELECT * FROM bottles_effective WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  }

  // GET /api/bottles
  app.get('/', (c) => {
    const rows = db.prepare('SELECT * FROM bottles_effective ORDER BY category, name').all() as Record<string, unknown>[];
    return c.json(rows.map(rowToBottle));
  });

  // GET /api/bottles/:id
  app.get('/:id', (c) => {
    const row = findEffective(c.req.param('id'));
    if (!row) return c.json({ error: 'Bouteille introuvable' }, 404);
    return c.json(rowToBottle(row));
  });

  // POST /api/bottles
  app.post('/', async (c) => {
    const body = await c.req.json<
      Omit<Bottle, 'pantry' | 'genericId' | 'variantCount'> & { pantry?: boolean; genericId?: string | null }
    >();

    if (!body.id || !body.name || !body.category || !body.color) {
      return c.json({ error: 'Champs requis : id, name, category, color' }, 400);
    }

    if (body.genericId && !db.prepare('SELECT id FROM bottles WHERE id = ?').get(body.genericId)) {
      return c.json({ error: 'Générique introuvable' }, 400);
    }

    db.prepare(`
      INSERT INTO bottles (id, name, category, color, owned, pantry, generic_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(body.id, body.name, body.category, body.color, body.owned ? 1 : 0, body.pantry ? 1 : 0, body.genericId ?? null);

    return c.json(rowToBottle(findEffective(body.id)!), 201);
  });

  // PATCH /api/bottles/:id
  app.patch('/:id', async (c) => {
    const id = c.req.param('id');
    const existing = db.prepare('SELECT * FROM bottles WHERE id = ?').get(id);
    if (!existing) return c.json({ error: 'Bouteille introuvable' }, 404);

    const body = await c.req.json<Partial<Omit<Bottle, 'id' | 'variantCount'>>>();

    if (body.genericId) {
      if (body.genericId === id) return c.json({ error: 'Une bouteille ne peut pas être son propre générique' }, 400);
      if (!db.prepare('SELECT id FROM bottles WHERE id = ?').get(body.genericId)) {
        return c.json({ error: 'Générique introuvable' }, 400);
      }
    }

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.name      !== undefined) { fields.push('name = ?');       values.push(body.name); }
    if (body.category  !== undefined) { fields.push('category = ?');   values.push(body.category); }
    if (body.color     !== undefined) { fields.push('color = ?');      values.push(body.color); }
    if (body.owned     !== undefined) { fields.push('owned = ?');      values.push(body.owned ? 1 : 0); }
    if (body.pantry    !== undefined) { fields.push('pantry = ?');     values.push(body.pantry ? 1 : 0); }
    if (body.genericId !== undefined) { fields.push('generic_id = ?'); values.push(body.genericId); }

    if (fields.length === 0) return c.json({ error: 'Aucun champ à mettre à jour' }, 400);

    db.prepare(`UPDATE bottles SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);

    return c.json(rowToBottle(findEffective(id)!));
  });

  // DELETE /api/bottles/:id
  app.delete('/:id', (c) => {
    const id = c.req.param('id');

    const inUse = db.prepare(
      'SELECT COUNT(*) as cnt FROM cocktail_ingredients WHERE bottle_id = ?'
    ).get(id) as { cnt: number } | undefined;

    if (inUse && inUse.cnt > 0) {
      return c.json({ error: `Cette bouteille est utilisée dans ${inUse.cnt} recette(s)` }, 409);
    }

    const variants = db.prepare(
      'SELECT COUNT(*) as cnt FROM bottles WHERE generic_id = ?'
    ).get(id) as { cnt: number } | undefined;

    if (variants && variants.cnt > 0) {
      return c.json({ error: `${variants.cnt} bouteille(s) sont rattachée(s) à ce générique` }, 409);
    }

    const result = db.prepare('DELETE FROM bottles WHERE id = ?').run(id) as { changes: number };
    if (result.changes === 0) return c.json({ error: 'Bouteille introuvable' }, 404);

    return c.body(null, 204);
  });

  return app;
}
