-- Speakeasy Home — SQLite Schema

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Bottles ─────────────────────────────────────────────────────────────────
-- Deux natures de bouteilles cohabitent dans cette table :
--   • les GÉNÉRIQUES ("Gin", "Vodka") — ce que les recettes référencent ;
--   • les MARQUES ("Tanqueray", "Citadelle") — ce qu'il y a réellement sur
--     l'étagère, rattachées à leur générique via generic_id.
-- Une marque sans generic_id est un produit qui se suffit à lui-même (Campari).
--
-- Note : pas de FOREIGN KEY sur generic_id — SQLite ne sait pas ajouter une
-- contrainte FK par ALTER TABLE, la base déjà déployée ne pourrait donc pas
-- l'obtenir. On garde le même comportement partout, l'intégrité est assurée
-- côté route (refus de supprimer un générique qui a des marques).
CREATE TABLE IF NOT EXISTS bottles (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  category   TEXT    NOT NULL,
  color      TEXT    NOT NULL,
  owned      INTEGER NOT NULL DEFAULT 0,  -- boolean: 0 | 1
  pantry     INTEGER NOT NULL DEFAULT 0,  -- boolean: 0 | 1 (toujours disponible)
  generic_id TEXT                         -- → bottles.id du générique, ou NULL
);

-- ── Vue : possession effective ───────────────────────────────────────────────
-- Un générique est considéré possédé dès qu'au moins une de ses marques l'est.
-- C'est cette vue que lisent les routes : une recette au « Gin » reste
-- réalisable tant qu'il reste un gin sur l'étagère, peu importe lequel.
DROP VIEW IF EXISTS bottles_effective;
CREATE VIEW bottles_effective AS
SELECT
  b.id,
  b.name,
  b.category,
  b.color,
  b.pantry,
  b.generic_id,
  CASE
    WHEN b.owned = 1 THEN 1
    WHEN EXISTS (SELECT 1 FROM bottles v WHERE v.generic_id = b.id AND v.owned = 1) THEN 1
    ELSE 0
  END AS owned,
  (SELECT COUNT(*) FROM bottles v WHERE v.generic_id = b.id) AS variant_count
FROM bottles b;

-- ── Cocktails ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cocktails (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  tagline    TEXT    NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty IN (1, 2, 3)),
  time       TEXT    NOT NULL,
  glass      TEXT    NOT NULL,
  garnish    TEXT    NOT NULL,
  moods      TEXT    NOT NULL DEFAULT '[]',  -- JSON: string[]
  steps      TEXT    NOT NULL DEFAULT '[]',  -- JSON: string[]
  theme      TEXT    NOT NULL DEFAULT '{}',  -- JSON: { bg, from, to, mid, accent, text }
  scene_url  TEXT,
  glass_url  TEXT
);

-- ── Ingrédients d'un cocktail ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cocktail_ingredients (
  cocktail_id TEXT    NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
  bottle_id   TEXT    NOT NULL REFERENCES bottles(id)   ON DELETE RESTRICT,
  amount      TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (cocktail_id, bottle_id)
);

-- ── Tracking des seeds appliqués ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS _seeds (
  name       TEXT     PRIMARY KEY,
  applied_at TEXT     NOT NULL DEFAULT (datetime('now'))
);
