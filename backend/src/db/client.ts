import { DatabaseSync } from 'node:sqlite';
export type { DatabaseSync };
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_PATH = process.env.DB_PATH ?? join(__dirname, '../../../db/speakeasy.db');

// Créer le répertoire db/ si besoin
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

// Appliquer le schéma au démarrage (idempotent grâce aux IF NOT EXISTS)
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

/** Wrapper de transaction manuelle (node:sqlite n'a pas de .transaction()) */
export function withTransaction<T>(fn: () => T): T {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export default db;
