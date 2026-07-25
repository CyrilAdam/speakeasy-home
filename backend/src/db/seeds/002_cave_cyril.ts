/**
 * Le bar réel — 25 bouteilles + l'épicerie.
 *
 * Ce seed introduit la distinction générique / marque :
 *   • les GÉNÉRIQUES ("Gin", "Rhum blanc") sont ce que les recettes citent ;
 *   • les MARQUES ("Tanqueray", "Havana Club 3 Años") sont ce qu'il y a sur
 *     l'étagère, rattachées à leur générique via generic_id.
 *
 * La vue bottles_effective fait le reste : un générique est possédé dès qu'une
 * de ses marques l'est. Décocher la Tanqueray ne casse donc plus le Negroni
 * tant que la Citadelle est là.
 *
 * Idempotent : tout passe par un upsert, le seed peut être rejoué.
 */

import type { DatabaseSync } from '../client.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BottleSeed {
  id: string;
  name: string;
  category: string;
  color: string;
  owned?: boolean;
  pantry?: boolean;
  /** Générique auquel rattacher cette marque. */
  generic?: string;
}

// ── Génériques ────────────────────────────────────────────────────────────────
// Jamais `owned` en propre : leur disponibilité découle des marques.
// Certains existent déjà (seed 001) — on les normalise au passage.

const GENERICS: BottleSeed[] = [
  { id: 'gin',            name: 'Gin',                category: 'Gin',              color: '#B2EBF2' },
  { id: 'vodka',          name: 'Vodka',              category: 'Vodka',            color: '#90CAF9' },
  { id: 'rhum',           name: 'Rhum blanc',         category: 'Rhum',             color: '#F5E6C8' },
  { id: 'rhum-ambre',     name: 'Rhum ambré',         category: 'Rhum',             color: '#A0522D' },
  { id: 'cachaca',        name: 'Cachaça',            category: 'Cachaça',          color: '#E8DCA0' },
  { id: 'tequila',        name: 'Tequila',            category: 'Tequila',          color: '#D4A017' },
  { id: 'bourbon',        name: 'Bourbon',            category: 'Whiskey',          color: '#C8963C' },
  { id: 'vermouth-rouge', name: 'Vermouth rouge',     category: 'Vermouth',         color: '#8B1C1C' },
  { id: 'vermouth-blanc', name: 'Vermouth blanc',     category: 'Vermouth',         color: '#F5F0DC' },
  { id: 'amaretto',       name: 'Amaretto',           category: 'Liqueur',          color: '#8B4513' },
  { id: 'liqueur-cafe',   name: 'Liqueur de café',    category: 'Liqueur café',     color: '#3D1A00' },
  { id: 'liqueur-orange', name: "Liqueur d'orange",   category: "Liqueur d'orange", color: '#FFB347' },
];

// ── Les 25 bouteilles de l'étagère ────────────────────────────────────────────

const BOTTLES: BottleSeed[] = [
  // Gin
  { id: 'gin-tanqueray',        name: 'Tanqueray London Dry',   category: 'Gin',              color: '#1F7A4D', generic: 'gin' },
  { id: 'gin-citadelle',        name: 'Citadelle Original',     category: 'Gin',              color: '#7FC4CE', generic: 'gin' },

  // Vodka
  { id: 'vodka-smirnoff',       name: 'Smirnoff No. 21',        category: 'Vodka',            color: '#C0392B', generic: 'vodka' },
  { id: 'vodka-absolut',        name: 'Absolut',                category: 'Vodka',            color: '#90CAF9', generic: 'vodka' },
  { id: 'vodka-beluga',         name: 'Beluga Noble',           category: 'Vodka',            color: '#CFE8F5', generic: 'vodka' },

  // Rhum & cachaça
  { id: 'havana-club-3',        name: 'Havana Club 3 Años',     category: 'Rhum',             color: '#EDE0C0', generic: 'rhum' },
  { id: 'saint-james-blanc',    name: 'Saint James Blanc',      category: 'Rhum',             color: '#F7F1DE', generic: 'rhum' },
  { id: 'appleton-12',          name: 'Appleton Estate 12 ans', category: 'Rhum',             color: '#A0522D', generic: 'rhum-ambre' },
  { id: 'cachaca-yaguara',      name: 'Yaguara Cachaça',        category: 'Cachaça',          color: '#E8DCA0', generic: 'cachaca' },

  // Agave & whiskey
  { id: 'sierra-reposado',      name: 'Sierra Tequila Reposado', category: 'Tequila',         color: '#D4A017', generic: 'tequila' },
  { id: 'buffalo-trace',        name: 'Buffalo Trace',          category: 'Whiskey',          color: '#C8963C', generic: 'bourbon' },

  // Vermouths
  { id: 'professore-rosso',     name: 'Del Professore Rosso',   category: 'Vermouth',         color: '#8B1C1C', generic: 'vermouth-rouge' },
  { id: 'gancia-americano',     name: 'Gancia Americano',       category: 'Vermouth',         color: '#A8321E', generic: 'vermouth-rouge' },
  { id: 'noilly-prat-dry',      name: 'Noilly Prat Original Dry', category: 'Vermouth',       color: '#F5F0DC', generic: 'vermouth-blanc' },

  // Liqueurs rattachées à un générique
  { id: 'amaretto-giori',       name: 'Amaretto Giori',         category: 'Liqueur',          color: '#8B4513', generic: 'amaretto' },
  { id: 'flor-de-cana-spresso', name: 'Flor de Caña Spresso',   category: 'Liqueur café',     color: '#2B1408', generic: 'liqueur-cafe' },

  // Produits autonomes — la marque EST l'ingrédient
  { id: 'aperol',               name: 'Aperol',                 category: 'Amer',             color: '#FF6A13' },
  { id: 'malibu',               name: 'Malibu',                 category: 'Liqueur',          color: '#F0EDE4' },
  { id: 'passoa',               name: 'Passoã',                 category: 'Liqueur',          color: '#B0004E' },
  { id: 'pisang-ambon',         name: 'Pisang Ambon',           category: 'Liqueur',          color: '#4BAA2E' },
  { id: 'amaro-pisoni',         name: 'Amaro Pisoni',           category: 'Amaro',            color: '#4A2410' },
  { id: 'sljivovica',           name: 'Šljivovica (prune)',     category: 'Eau-de-vie',       color: '#E0D5C0' },
  // campari / chartreuse / grand-marnier existent déjà (seed 001) — voir plus bas
];

// ── Épicerie : ce qui est toujours sous la main ───────────────────────────────

const PANTRY: BottleSeed[] = [
  { id: 'lait-coco',    name: 'Lait de coco',        category: 'Épicerie', color: '#FFFDF7' },
  { id: 'menthe',       name: 'Menthe fraîche',      category: 'Frais',    color: '#4CAF50' },
  { id: 'framboise',    name: 'Framboises',          category: 'Frais',    color: '#C2185B' },
  { id: 'blanc-oeuf',   name: "Blanc d'œuf",         category: 'Frais',    color: '#FFF8E1' },
  { id: 'olive',        name: 'Olives',              category: 'Frais',    color: '#8A9A5B' },
  { id: 'sucre-canne',  name: 'Sucre de canne',      category: 'Épicerie', color: '#C89F65' },
  { id: 'sirop-vanille', name: 'Sirop de vanille',   category: 'Sirop',    color: '#F3E5AB' },
  { id: 'sirop-agave',  name: "Sirop d'agave",       category: 'Sirop',    color: '#D9A441' },
  { id: 'miel',         name: 'Miel',                category: 'Sirop',    color: '#E8A317' },
];

/**
 * Bouteilles du seed 001 qui passent en « possédée » — elles se vident, donc
 * décochables ensuite.
 *
 * Campari, Chartreuse et Grand Marnier font partie des 25 de l'étagère : on
 * l'affirme au lieu de l'hériter, sinon un décochage antérieur dans l'app
 * casserait silencieusement le Negroni, le Boulevardier et l'Americano.
 */
const NOW_OWNED = ['prosecco', 'angostura', 'campari', 'chartreuse', 'grand-marnier'];

/** Idem, mais toujours sous la main : elles rejoignent l'épicerie. */
const NOW_PANTRY = ['tonic', 'ginger-beer', 'jus-ananas'];

/** Bouteilles du seed 001 déjà présentes qui deviennent des marques. */
const REATTACH: Record<string, string> = {
  'grand-marnier': 'liqueur-orange',
  'cointreau':     'liqueur-orange',
  'triple-sec':    'liqueur-orange',
  'kahlua':        'liqueur-cafe',
};

/**
 * Recettes du seed 001 qui pointaient vers une marque : on les fait pointer
 * vers le générique, sinon elles restent prisonnières d'une bouteille précise.
 */
const REPOINT: [from: string, to: string][] = [
  ['grand-marnier', 'liqueur-orange'],
  ['cointreau',     'liqueur-orange'],
  ['kahlua',        'liqueur-cafe'],
];

// ── Seed ──────────────────────────────────────────────────────────────────────

export function seed(db: DatabaseSync) {
  const upsert = db.prepare(`
    INSERT INTO bottles (id, name, category, color, owned, pantry, generic_id)
    VALUES (@id, @name, @category, @color, @owned, @pantry, @generic)
    ON CONFLICT(id) DO UPDATE SET
      name       = excluded.name,
      category   = excluded.category,
      color      = excluded.color,
      owned      = excluded.owned,
      pantry     = excluded.pantry,
      generic_id = excluded.generic_id
  `);

  const put = (b: BottleSeed, defaults: Partial<BottleSeed> = {}) => {
    const merged = { ...defaults, ...b };
    upsert.run({
      id:       merged.id,
      name:     merged.name,
      category: merged.category,
      color:    merged.color,
      owned:    merged.owned  ? 1 : 0,
      pantry:   merged.pantry ? 1 : 0,
      generic:  merged.generic ?? null,
    });
  };

  // 1. Les génériques d'abord — les marques y font référence.
  for (const g of GENERICS) put(g, { owned: false, pantry: false });

  // 2. L'étagère.
  for (const b of BOTTLES) put(b, { owned: true, pantry: false });

  // 3. L'épicerie.
  for (const p of PANTRY) put(p, { owned: true, pantry: true });

  // 4. Bouteilles du seed 001 qui passent en possédée.
  const own = db.prepare('UPDATE bottles SET owned = 1 WHERE id = ?');
  for (const id of NOW_OWNED) own.run(id);

  const stock = db.prepare('UPDATE bottles SET owned = 1, pantry = 1 WHERE id = ?');
  for (const id of NOW_PANTRY) stock.run(id);

  // 5. Rattachement des marques héritées du seed 001.
  const attach = db.prepare('UPDATE bottles SET generic_id = ? WHERE id = ?');
  for (const [id, generic] of Object.entries(REATTACH)) attach.run(generic, id);

  // 6. Recettes : marque → générique. OR IGNORE au cas où le générique serait
  //    déjà présent dans la même recette (la PK est (cocktail_id, bottle_id)).
  const repoint = db.prepare('UPDATE OR IGNORE cocktail_ingredients SET bottle_id = ? WHERE bottle_id = ?');
  for (const [from, to] of REPOINT) repoint.run(to, from);
}
