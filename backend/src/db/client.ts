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

/**
 * Migrations à appliquer AVANT le schéma : la vue bottles_effective référence
 * des colonnes qui peuvent manquer sur une base créée par une version
 * antérieure. Sur une base neuve, PRAGMA ne renvoie rien et tout est ignoré.
 */
function migrate() {
  const columns = (db.prepare('PRAGMA table_info(bottles)').all() as { name: string }[])
    .map(c => c.name);

  if (columns.length > 0 && !columns.includes('generic_id')) {
    db.exec('ALTER TABLE bottles ADD COLUMN generic_id TEXT');
  }
}

migrate();

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
