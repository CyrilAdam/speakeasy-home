/**
 * Seed runner — applique les seeds en attente dans l'ordre alphabétique.
 *
 * Usage:
 *   npm run seed          → applique les seeds manquants
 *   npm run seed:reset    → vide la DB et réapplique tous les seeds
 */

import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import db, { withTransaction } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEEDS_DIR = join(__dirname, 'seeds');

const isReset = process.argv.includes('--reset');

if (isReset) {
  console.log('🗑  Reset : suppression des données existantes...');
  db.exec(`
    DELETE FROM cocktail_ingredients;
    DELETE FROM cocktails;
    DELETE FROM bottles;
    DELETE FROM _seeds;
  `);
  console.log('✓  Tables vidées.\n');
}

/**
 * Le même seed s'appelle .ts en dev (tsx) et .js en production (compilé).
 * On le suit sur son nom sans extension, sinon un seed déjà appliqué serait
 * rejoué après un changement d'environnement — et rejouer un INSERT casse le
 * démarrage sur une contrainte d'unicité.
 *
 * Rétrocompatible : les lignes déjà en base ("001_initial_data.js") se
 * normalisent vers la même clé que le fichier correspondant.
 */
const key = (name: string) => name.replace(/\.(ts|js)$/, '');

const applied = new Set(
  (db.prepare('SELECT name FROM _seeds').all() as { name: string }[]).map(r => key(r.name))
);

const files = readdirSync(SEEDS_DIR)
  .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
  .sort();

const pending = files.filter(f => !applied.has(key(f)));

if (pending.length === 0) {
  console.log('✓  Aucun seed en attente.');
  process.exit(0);
}

console.log(`→  ${pending.length} seed(s) à appliquer : ${pending.join(', ')}\n`);

for (const file of pending) {
  process.stdout.write(`  Applying ${file}... `);

  // pathToFileURL : sous Windows un chemin absolu (C:\…) n'est pas une URL ESM valide.
  const { seed } = await import(pathToFileURL(join(SEEDS_DIR, file)).href);

  withTransaction(() => {
    seed(db);
    db.prepare('INSERT INTO _seeds (name) VALUES (?)').run(key(file));
  });

  console.log('✓');
}

console.log('\n✓  Seeding terminé.');
