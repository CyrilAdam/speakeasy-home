-- Speakeasy Home — SQLite Schema

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Bottles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bottles (
  id       TEXT    PRIMARY KEY,
  name     TEXT    NOT NULL,
  category TEXT    NOT NULL,
  color    TEXT    NOT NULL,
  owned    INTEGER NOT NULL DEFAULT 0,  -- boolean: 0 | 1
  pantry   INTEGER NOT NULL DEFAULT 0   -- boolean: 0 | 1 (toujours disponible)
);

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
