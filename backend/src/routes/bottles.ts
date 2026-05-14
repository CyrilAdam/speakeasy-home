import { Hono } from 'hono';
import db from '../db/client.ts';
import type { Bottle } from '../types.ts';

const app = new Hono();

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToBottle(row: Record<string, unknown>): Bottle {
  return {
    id:       row.id       as string,
    name:     row.name     as string,
    category: row.category as string,
    color:    row.color    as string,
    owned:    row.owned    === 1,
    pantry:   row.pantry   === 1,
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/bottles
app.get('/', (c) => {
  const rows = db.prepare('SELECT * FROM bottles ORDER BY category, name').all() as Record<string, unknown>[];
  return c.json(rows.map(rowToBottle));
});

// GET /api/bottles/:id
app.get('/:id', (c) => {
  const row = db.prepare('SELECT * FROM bottles WHERE id = ?').get(c.req.param('id')) as Record<string, unknown> | undefined;
  if (!row) return c.json({ error: 'Bouteille introuvable' }, 404);
  return c.json(rowToBottle(row));
});

// POST /api/bottles
app.post('/', async (c) => {
  const body = await c.req.json<Omit<Bottle, 'pantry'> & { pantry?: boolean }>();

  if (!body.id || !body.name || !body.category || !body.color) {
    return c.json({ error: 'Champs requis : id, name, category, color' }, 400);
  }

  db.prepare(`
    INSERT INTO bottles (id, name, category, color, owned, pantry)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(body.id, body.name, body.category, body.color, body.owned ? 1 : 0, body.pantry ? 1 : 0);

  const created = db.prepare('SELECT * FROM bottles WHERE id = ?').get(body.id) as Record<string, unknown>;
  return c.json(rowToBottle(created), 201);
});

// PATCH /api/bottles/:id
app.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const existing = db.prepare('SELECT * FROM bottles WHERE id = ?').get(id);
  if (!existing) return c.json({ error: 'Bouteille introuvable' }, 404);

  const body = await c.req.json<Partial<Omit<Bottle, 'id'>>>();

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.name     !== undefined) { fields.push('name = ?');     values.push(body.name); }
  if (body.category !== undefined) { fields.push('category = ?'); values.push(body.category); }
  if (body.color    !== undefined) { fields.push('color = ?');    values.push(body.color); }
  if (body.owned    !== undefined) { fields.push('owned = ?');    values.push(body.owned ? 1 : 0); }
  if (body.pantry   !== undefined) { fields.push('pantry = ?');   values.push(body.pantry ? 1 : 0); }

  if (fields.length === 0) return c.json({ error: 'Aucun champ à mettre à jour' }, 400);

  db.prepare(`UPDATE bottles SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);

  const updated = db.prepare('SELECT * FROM bottles WHERE id = ?').get(id) as Record<string, unknown>;
  return c.json(rowToBottle(updated));
});

// DELETE /api/bottles/:id
app.delete('/:id', (c) => {
  const id = c.req.param('id');

  const inUse = db.prepare(
    'SELECT COUNT(*) as cnt FROM cocktail_ingredients WHERE bottle_id = ?'
  ).get(id) as { cnt: number };

  if (inUse.cnt > 0) {
    return c.json({ error: `Cette bouteille est utilisée dans ${inUse.cnt} recette(s)` }, 409);
  }

  const result = db.prepare('DELETE FROM bottles WHERE id = ?').run(id);
  if ((result as { changes: number }).changes === 0) {
    return c.json({ error: 'Bouteille introuvable' }, 404);
  }

  return c.body(null, 204);
});

export default app;
