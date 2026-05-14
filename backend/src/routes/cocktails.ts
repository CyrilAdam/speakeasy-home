import { Hono } from 'hono';
import db, { withTransaction } from '../db/client.js';
import type { CocktailListItem, CocktailWithIngredients, CocktailIngredient, CocktailTheme } from '../types.js';

const app = new Hono();

// ── Types internes ────────────────────────────────────────────────────────────

interface CocktailRow {
  id: string;
  name: string;
  tagline: string;
  difficulty: number;
  time: string;
  glass: string;
  garnish: string;
  moods: string;
  steps: string;
  theme: string;
  scene_url: string | null;
  glass_url: string | null;
}

interface IngredientRow {
  bottle_id: string;
  bottle_name: string;
  amount: string;
  sort_order: number;
  owned: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToCocktailBase(row: CocktailRow) {
  return {
    id:         row.id,
    name:       row.name,
    tagline:    row.tagline,
    difficulty: row.difficulty as 1 | 2 | 3,
    time:       row.time,
    glass:      row.glass,
    garnish:    row.garnish,
    moods:      JSON.parse(row.moods) as string[],
    steps:      JSON.parse(row.steps) as string[],
    theme:      JSON.parse(row.theme) as CocktailTheme,
    sceneUrl:   row.scene_url,
    glassUrl:   row.glass_url,
  };
}

function getIngredients(cocktailId: string): { ingredients: CocktailIngredient[]; missingCount: number } {
  const rows = (db.prepare(`
    SELECT ci.bottle_id, b.name AS bottle_name, ci.amount, ci.sort_order, b.owned
    FROM cocktail_ingredients ci
    JOIN bottles b ON b.id = ci.bottle_id
    WHERE ci.cocktail_id = ?
    ORDER BY ci.sort_order
  `).all(cocktailId) as unknown) as IngredientRow[];

  const ingredients: CocktailIngredient[] = rows.map(r => ({
    bottleId:   r.bottle_id,
    bottleName: r.bottle_name,
    amount:     r.amount,
    sortOrder:  r.sort_order,
  }));

  return { ingredients, missingCount: rows.filter(r => r.owned === 0).length };
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/cocktails
app.get('/', (c) => {
  const rows = (db.prepare(`
    SELECT
      c.*,
      SUM(CASE WHEN b.owned = 0 THEN 1 ELSE 0 END) AS missing_count
    FROM cocktails c
    LEFT JOIN cocktail_ingredients ci ON ci.cocktail_id = c.id
    LEFT JOIN bottles b ON b.id = ci.bottle_id
    GROUP BY c.id
    ORDER BY c.name
  `).all() as unknown) as (CocktailRow & { missing_count: number })[];

  const result: CocktailListItem[] = rows.map(row => ({
    ...rowToCocktailBase(row),
    canMake:      row.missing_count === 0,
    missingCount: row.missing_count,
  }));

  return c.json(result);
});

// GET /api/cocktails/:id
app.get('/:id', (c) => {
  const id = c.req.param('id');
  const row = db.prepare('SELECT * FROM cocktails WHERE id = ?').get(id) as unknown as CocktailRow | undefined;
  if (!row) return c.json({ error: 'Cocktail introuvable' }, 404);

  const { ingredients, missingCount } = getIngredients(id);
  const result: CocktailWithIngredients = {
    ...rowToCocktailBase(row),
    ingredients,
    canMake:      missingCount === 0,
    missingCount,
  };

  return c.json(result);
});

// POST /api/cocktails
app.post('/', async (c) => {
  const body = await c.req.json<{
    id: string;
    name: string;
    tagline: string;
    difficulty: 1 | 2 | 3;
    time: string;
    glass: string;
    garnish: string;
    moods: string[];
    steps: string[];
    theme: Record<string, string>;
    ingredients: { id: string; amount: string }[];
    sceneUrl?: string;
    glassUrl?: string;
  }>();

  if (!body.id || !body.name || !body.tagline || !body.difficulty) {
    return c.json({ error: 'Champs requis : id, name, tagline, difficulty' }, 400);
  }

  withTransaction(() => {
    db.prepare(`
      INSERT INTO cocktails (id, name, tagline, difficulty, time, glass, garnish, moods, steps, theme, scene_url, glass_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.id, body.name, body.tagline, body.difficulty,
      body.time ?? '', body.glass ?? '', body.garnish ?? '',
      JSON.stringify(body.moods ?? []),
      JSON.stringify(body.steps ?? []),
      JSON.stringify(body.theme ?? {}),
      body.sceneUrl ?? null,
      body.glassUrl ?? null,
    );

    const insertIngredient = db.prepare(`
      INSERT INTO cocktail_ingredients (cocktail_id, bottle_id, amount, sort_order)
      VALUES (?, ?, ?, ?)
    `);

    (body.ingredients ?? []).forEach((ing, i) => {
      insertIngredient.run(body.id, ing.id, ing.amount, i);
    });
  });

  const row = db.prepare('SELECT * FROM cocktails WHERE id = ?').get(body.id) as unknown as CocktailRow;
  const { ingredients, missingCount } = getIngredients(body.id);

  return c.json({ ...rowToCocktailBase(row), ingredients, canMake: missingCount === 0, missingCount }, 201);
});

// PATCH /api/cocktails/:id
app.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const existing = db.prepare('SELECT id FROM cocktails WHERE id = ?').get(id);
  if (!existing) return c.json({ error: 'Cocktail introuvable' }, 404);

  const body = await c.req.json<{
    name?: string;
    tagline?: string;
    difficulty?: 1 | 2 | 3;
    time?: string;
    glass?: string;
    garnish?: string;
    moods?: string[];
    steps?: string[];
    theme?: Record<string, string>;
    ingredients?: { id: string; amount: string }[];
    sceneUrl?: string | null;
    glassUrl?: string | null;
  }>();

  withTransaction(() => {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.name       !== undefined) { fields.push('name = ?');       values.push(body.name); }
    if (body.tagline    !== undefined) { fields.push('tagline = ?');     values.push(body.tagline); }
    if (body.difficulty !== undefined) { fields.push('difficulty = ?');  values.push(body.difficulty); }
    if (body.time       !== undefined) { fields.push('time = ?');        values.push(body.time); }
    if (body.glass      !== undefined) { fields.push('glass = ?');       values.push(body.glass); }
    if (body.garnish    !== undefined) { fields.push('garnish = ?');     values.push(body.garnish); }
    if (body.moods      !== undefined) { fields.push('moods = ?');       values.push(JSON.stringify(body.moods)); }
    if (body.steps      !== undefined) { fields.push('steps = ?');       values.push(JSON.stringify(body.steps)); }
    if (body.theme      !== undefined) { fields.push('theme = ?');       values.push(JSON.stringify(body.theme)); }
    if (body.sceneUrl   !== undefined) { fields.push('scene_url = ?');   values.push(body.sceneUrl); }
    if (body.glassUrl   !== undefined) { fields.push('glass_url = ?');   values.push(body.glassUrl); }

    if (fields.length > 0) {
      db.prepare(`UPDATE cocktails SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }

    if (body.ingredients !== undefined) {
      db.prepare('DELETE FROM cocktail_ingredients WHERE cocktail_id = ?').run(id);
      const insertIngredient = db.prepare(`
        INSERT INTO cocktail_ingredients (cocktail_id, bottle_id, amount, sort_order)
        VALUES (?, ?, ?, ?)
      `);
      body.ingredients.forEach((ing, i) => {
        insertIngredient.run(id, ing.id, ing.amount, i);
      });
    }
  });

  const row = db.prepare('SELECT * FROM cocktails WHERE id = ?').get(id) as unknown as CocktailRow;
  const { ingredients, missingCount } = getIngredients(id);

  return c.json({ ...rowToCocktailBase(row), ingredients, canMake: missingCount === 0, missingCount });
});

// DELETE /api/cocktails/:id
app.delete('/:id', (c) => {
  const id = c.req.param('id');
  // Les ingrédients sont supprimés en cascade (ON DELETE CASCADE dans le schéma)
  const result = db.prepare('DELETE FROM cocktails WHERE id = ?').run(id) as { changes: number };
  if (result.changes === 0) return c.json({ error: 'Cocktail introuvable' }, 404);
  return c.body(null, 204);
});

export default app;
