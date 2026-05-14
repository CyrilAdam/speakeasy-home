import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA = readFileSync(join(__dirname, '../src/db/schema.sql'), 'utf-8');

/** Bouteilles de référence pour les tests */
export const BOTTLES = {
  gin:   { id: 'gin',   name: 'Gin',          category: 'Gin',   color: '#B2EBF2', owned: 1, pantry: 0 },
  lime:  { id: 'lime',  name: 'Jus de lime',   category: 'Jus',   color: '#DCEDC8', owned: 1, pantry: 1 },
  vodka: { id: 'vodka', name: 'Vodka',          category: 'Vodka', color: '#90CAF9', owned: 0, pantry: 0 },
  sirop: { id: 'sirop', name: 'Sirop de sucre', category: 'Sirop', color: '#FFF9C4', owned: 1, pantry: 1 },
} as const;

/** Cocktails de référence pour les tests */
export const COCKTAILS = {
  /** Cocktail réalisable : gin (owned) + lime (owned) */
  gimlet: {
    id: 'gimlet', name: 'Gimlet', tagline: 'Le gin frais', difficulty: 1,
    time: '4 min', glass: 'Verre à cocktail', garnish: 'Zeste de lime',
    moods: ['frais'], steps: ['Shaker', 'Filtrer'],
    theme: { bg: '#001510', from: '#1B4332', to: '#2ECC71', accent: '#52E08A', text: '#E8FCF0', mid: '#1A9D4A' },
    ingredients: [
      { bottleId: 'gin',  amount: '6 cl' },
      { bottleId: 'lime', amount: '2 cl' },
    ],
  },
  /** Cocktail non réalisable : vodka (not owned) */
  mule: {
    id: 'mule', name: 'Moscow Mule', tagline: 'Le cuivré', difficulty: 1,
    time: '4 min', glass: 'Mug en cuivre', garnish: 'Citron vert',
    moods: ['festif'], steps: ['Remplir de glace', 'Verser'],
    theme: { bg: '#180900', from: '#7B3F00', to: '#D2691E', accent: '#E8A87C', text: '#FFF3E0', mid: '#A0522D' },
    ingredients: [
      { bottleId: 'vodka', amount: '5 cl' },
      { bottleId: 'lime',  amount: '2 cl' },
    ],
  },
} as const;

/** Crée une DB SQLite en mémoire avec le schéma et des données de test. */
export function createTestDb(): DatabaseSync {
  const db = new DatabaseSync(':memory:');
  db.exec(SCHEMA);

  // Bouteilles
  const insertBottle = db.prepare(
    'INSERT INTO bottles (id, name, category, color, owned, pantry) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const b of Object.values(BOTTLES)) {
    insertBottle.run(b.id, b.name, b.category, b.color, b.owned, b.pantry);
  }

  // Cocktails
  const insertCocktail = db.prepare(`
    INSERT INTO cocktails (id, name, tagline, difficulty, time, glass, garnish, moods, steps, theme)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertIng = db.prepare(
    'INSERT INTO cocktail_ingredients (cocktail_id, bottle_id, amount, sort_order) VALUES (?, ?, ?, ?)'
  );

  for (const c of Object.values(COCKTAILS)) {
    insertCocktail.run(
      c.id, c.name, c.tagline, c.difficulty, c.time, c.glass, c.garnish,
      JSON.stringify(c.moods), JSON.stringify(c.steps), JSON.stringify(c.theme),
    );
    c.ingredients.forEach((ing, i) => insertIng.run(c.id, ing.bottleId, ing.amount, i));
  }

  return db;
}

/** Crée une app Hono avec une DB de test isolée en mémoire. */
export function createTestApp() {
  const db = createTestDb();
  return { app: createApp(db), db };
}

/** Helper : parse le JSON d'une Response Hono. */
export async function json<T = unknown>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}
