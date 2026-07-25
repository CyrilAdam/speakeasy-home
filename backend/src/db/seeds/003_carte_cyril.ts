/**
 * La carte — 32 cocktails choisis, calés sur les bouteilles réellement là.
 *
 * Les recettes citent des GÉNÉRIQUES ("gin", "rhum", "vermouth-rouge") pour
 * rester réalisables quelle que soit la marque ouverte. Deux exceptions
 * assumées, où la bouteille EST la recette : le Ti Punch veut du rhum agricole
 * (Saint James), le Paper Plane veut un amaro (Pisoni).
 *
 * Quatre cocktails sont volontairement non réalisables : il leur manque un
 * ingrédient frais (café espresso, basilic, jus d'orange, fruit de la passion).
 * Ils apparaissent dans l'app avec leur ligne de courses.
 *
 * Idempotent : upsert sur les cocktails, ingrédients réécrits à chaque passage.
 */

import type { DatabaseSync } from '../client.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Theme {
  bg: string; from: string; to: string; mid: string; accent: string; text: string;
}

interface Cocktail {
  id: string;
  name: string;
  tagline: string;
  moods: string[];
  difficulty: 1 | 2 | 3;
  time: string;
  glass: string;
  garnish: string;
  theme: Theme;
  ingredients: { id: string; amount: string }[];
  steps: string[];
}

// ── Palettes ──────────────────────────────────────────────────────────────────
// Chaque verre emprunte la couleur de ce qu'il y a dedans.

const T: Record<string, Theme> = {
  amerRouge:  { bg: '#190505', from: '#7B1D1D', mid: '#C0392B', to: '#E74C3C', accent: '#FF6B6B', text: '#FDEDEC' },
  ambre:      { bg: '#120800', from: '#4A2000', mid: '#8B6400', to: '#B8860B', accent: '#DAA520', text: '#FFF8DC' },
  aperol:     { bg: '#190700', from: '#7B2800', mid: '#C83A10', to: '#FF7043', accent: '#FFAB91', text: '#FBE9E7' },
  lime:       { bg: '#021208', from: '#00441B', mid: '#1B7A42', to: '#40916C', accent: '#74C69D', text: '#CCFBCC' },
  herbace:    { bg: '#081200', from: '#2D5016', mid: '#5A8000', to: '#84A000', accent: '#A8D500', text: '#F0FFC0' },
  cafe:       { bg: '#0D0400', from: '#2B1408', mid: '#5A3020', to: '#8B5A2B', accent: '#C89F65', text: '#F5EBE0' },
  gin:        { bg: '#001018', from: '#0E3A47', mid: '#1A6B7A', to: '#4FB3C7', accent: '#8FE0EE', text: '#E6FAFF' },
  framboise:  { bg: '#150010', from: '#880035', mid: '#C2185B', to: '#E91E8C', accent: '#F48FB1', text: '#FCE4EC' },
  citron:     { bg: '#150F00', from: '#6B5000', mid: '#B89000', to: '#E8C200', accent: '#FFE066', text: '#FFFBE0' },
  coco:       { bg: '#0E0B06', from: '#4A3B26', mid: '#8A7454', to: '#D9C9A8', accent: '#F0E4CC', text: '#FFFDF7' },
  agave:      { bg: '#160400', from: '#8B1A00', mid: '#D47000', to: '#FFA000', accent: '#FFD54F', text: '#FFFDE7' },
  cristal:    { bg: '#050A10', from: '#1E3A4A', mid: '#4A7A8C', to: '#9FC5D4', accent: '#D6ECF5', text: '#F2FAFF' },
  passion:    { bg: '#170A00', from: '#8B4000', mid: '#D08000', to: '#F5B301', accent: '#FFD966', text: '#FFF6DC' },
};

// ── Ingrédients à acheter ─────────────────────────────────────────────────────
// Pas encore à la maison : ils rendent 4 recettes incomplètes, et c'est voulu.

const A_ACHETER = [
  { id: 'cafe-espresso', name: 'Café espresso',      category: 'Épicerie', color: '#3D2314' },
  { id: 'basilic',       name: 'Basilic frais',      category: 'Frais',    color: '#3E8E41' },
  { id: 'jus-orange',    name: "Jus d'orange",       category: 'Jus',      color: '#FFA000' },
  { id: 'fruit-passion', name: 'Fruit de la passion', category: 'Frais',   color: '#E5B93C' },
];

/** Recettes du seed 001 devenues sans objet : les bouteilles ne sont pas là. */
const A_RETIRER = ['b52', 'cosmopolitan', 'tequila-sunrise'];

// ── La carte ──────────────────────────────────────────────────────────────────

const COCKTAILS: Cocktail[] = [
  // ── Amers & spiritueux ────────────────────────────────────────────────────
  {
    id: 'negroni', name: 'Negroni', tagline: "L'amer élégant",
    moods: ['classique', 'amer'], difficulty: 1, time: '3 min', theme: T.amerRouge,
    glass: 'Old Fashioned', garnish: "Zeste d'orange",
    ingredients: [
      { id: 'gin',            amount: '3 cl' },
      { id: 'campari',        amount: '3 cl' },
      { id: 'vermouth-rouge', amount: '3 cl' },
    ],
    steps: [
      'Remplir un verre old fashioned de glaçons.',
      'Verser le gin, le Campari et le vermouth rouge à parts égales.',
      'Remuer à la cuillère de bar pendant 30 secondes.',
      "Exprimer un zeste d'orange au-dessus du verre, puis l'y déposer.",
    ],
  },
  {
    id: 'boulevardier', name: 'Boulevardier', tagline: 'Le Negroni passé au bourbon',
    moods: ['classique', 'amer', 'fort'], difficulty: 1, time: '3 min', theme: T.ambre,
    glass: 'Old Fashioned', garnish: "Zeste d'orange",
    ingredients: [
      { id: 'bourbon',        amount: '4 cl' },
      { id: 'campari',        amount: '3 cl' },
      { id: 'vermouth-rouge', amount: '3 cl' },
    ],
    steps: [
      'Verser bourbon, Campari et vermouth rouge dans un verre à mélange rempli de glace.',
      'Remuer 30 secondes — le mélange doit être franchement froid.',
      'Filtrer sur un gros glaçon dans un verre old fashioned.',
      "Exprimer un zeste d'orange et le déposer dans le verre.",
    ],
  },
  {
    id: 'americano', name: 'Americano', tagline: "L'ancêtre du Negroni, en plus léger",
    moods: ['apéro', 'amer', 'pétillant'], difficulty: 1, time: '3 min', theme: T.amerRouge,
    glass: 'Verre Highball', garnish: "Rondelle d'orange",
    ingredients: [
      { id: 'campari',        amount: '3 cl' },
      { id: 'vermouth-rouge', amount: '3 cl' },
      { id: 'eau-gazeuse',    amount: '8 cl' },
    ],
    steps: [
      'Remplir un verre highball de glaçons.',
      'Verser le Campari puis le vermouth rouge.',
      "Allonger à l'eau gazeuse.",
      "Remuer une fois et décorer d'une rondelle d'orange.",
    ],
  },
  {
    id: 'manhattan', name: 'Manhattan', tagline: 'Le classique de New York',
    moods: ['classique', 'élégant', 'fort'], difficulty: 1, time: '4 min', theme: T.ambre,
    glass: 'Verre à cocktail', garnish: "Zeste d'orange",
    ingredients: [
      { id: 'bourbon',        amount: '6 cl'     },
      { id: 'vermouth-rouge', amount: '3 cl'     },
      { id: 'angostura',      amount: '2 traits' },
    ],
    steps: [
      'Refroidir un verre à cocktail au congélateur ou avec des glaçons.',
      'Verser bourbon, vermouth rouge et bitters dans un verre à mélange rempli de glace.',
      'Remuer 30 secondes.',
      'Filtrer dans le verre refroidi.',
      "Exprimer un zeste d'orange au-dessus du verre.",
    ],
  },
  {
    id: 'reverse-manhattan', name: 'Reverse Manhattan', tagline: 'Les proportions inversées, la soirée sauvée',
    moods: ['classique', 'apéro', 'léger'], difficulty: 1, time: '4 min', theme: T.amerRouge,
    glass: 'Verre à cocktail', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'vermouth-rouge', amount: '6 cl'     },
      { id: 'bourbon',        amount: '3 cl'     },
      { id: 'angostura',      amount: '2 traits' },
    ],
    steps: [
      'Verser le vermouth rouge, le bourbon et les bitters sur de la glace.',
      'Remuer 30 secondes — le vermouth mène la danse.',
      'Filtrer dans un verre à cocktail refroidi.',
      'Exprimer un zeste de citron au-dessus du verre.',
    ],
  },
  {
    id: 'bijou', name: 'Bijou', tagline: 'Diamant, émeraude et rubis dans un verre',
    moods: ['classique', 'herbacé', 'élégant'], difficulty: 2, time: '4 min', theme: T.herbace,
    glass: 'Verre à cocktail', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'gin',            amount: '3 cl'    },
      { id: 'chartreuse',     amount: '3 cl'    },
      { id: 'vermouth-rouge', amount: '3 cl'    },
      { id: 'angostura',      amount: '1 trait' },
    ],
    steps: [
      'Verser gin, Chartreuse Verte et vermouth rouge à parts égales sur de la glace.',
      'Ajouter le trait de bitters.',
      "Remuer 30 secondes — la Chartreuse a besoin d'un peu de dilution.",
      'Filtrer dans un verre à cocktail refroidi.',
      'Exprimer un zeste de citron.',
    ],
  },

  // ── Martinis ──────────────────────────────────────────────────────────────
  {
    id: 'martini', name: 'Martini', tagline: 'Le verre le plus sérieux du bar',
    moods: ['classique', 'élégant', 'fort'], difficulty: 2, time: '4 min', theme: T.cristal,
    glass: 'Verre à martini', garnish: 'Olive',
    ingredients: [
      { id: 'gin',            amount: '6 cl' },
      { id: 'vermouth-blanc', amount: '1 cl' },
      { id: 'olive',          amount: '1 à 3' },
    ],
    steps: [
      'Mettre le verre à martini au congélateur 10 minutes.',
      'Verser gin et vermouth dry dans un verre à mélange rempli de glace.',
      'Remuer 30 secondes, sans brutaliser.',
      'Filtrer dans le verre glacé.',
      'Piquer une à trois olives et les déposer dans le verre.',
    ],
  },
  {
    id: 'martini-50-50', name: '50/50 Martini', tagline: 'Moitié gin, moitié vermouth',
    moods: ['classique', 'apéro', 'léger'], difficulty: 1, time: '4 min', theme: T.cristal,
    glass: 'Verre à martini', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'gin',            amount: '4.5 cl' },
      { id: 'vermouth-blanc', amount: '4.5 cl' },
    ],
    steps: [
      'Verser gin et vermouth dry à parts strictement égales sur de la glace.',
      'Remuer 30 secondes.',
      'Filtrer dans un verre à martini refroidi.',
      'Exprimer un zeste de citron au-dessus du verre.',
    ],
  },
  {
    id: 'reverse-martini', name: 'Reverse Martini', tagline: "Le Martini qui se boit à l'apéro",
    moods: ['apéro', 'léger', 'frais'], difficulty: 1, time: '3 min', theme: T.cristal,
    glass: 'Verre à vin', garnish: 'Zeste de citron + olive',
    ingredients: [
      { id: 'vermouth-blanc', amount: '6 cl' },
      { id: 'gin',            amount: '2 cl' },
    ],
    steps: [
      'Remplir un verre à vin de glaçons.',
      'Verser le vermouth dry puis le gin.',
      'Remuer brièvement.',
      "Décorer d'un zeste de citron et d'une olive.",
    ],
  },

  // ── Sours ─────────────────────────────────────────────────────────────────
  {
    id: 'whisky-sour', name: 'Whisky Sour', tagline: 'Le sour de référence',
    moods: ['classique', 'frais', 'fort'], difficulty: 2, time: '6 min', theme: T.ambre,
    glass: 'Old Fashioned', garnish: "Traits d'Angostura",
    ingredients: [
      { id: 'bourbon',     amount: '5 cl'     },
      { id: 'jus-citron',  amount: '2.5 cl'   },
      { id: 'sirop-sucre', amount: '1.5 cl'   },
      { id: 'blanc-oeuf',  amount: '1'        },
      { id: 'angostura',   amount: '3 traits' },
    ],
    steps: [
      'Verser bourbon, citron, sirop et blanc d\'œuf dans le shaker, sans glace.',
      'Secouer 15 secondes à sec — c\'est ce qui fait la mousse.',
      'Ajouter la glace et secouer à nouveau 15 secondes.',
      'Double filtrer dans un verre old fashioned.',
      "Déposer trois traits d'Angostura sur la mousse et les dessiner à la pique.",
    ],
  },
  {
    id: 'amaretto-sour', name: 'Amaretto Sour', tagline: "L'amande qui se laisse boire",
    moods: ['frais', 'élégant'], difficulty: 2, time: '6 min', theme: T.cafe,
    glass: 'Old Fashioned', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'amaretto',    amount: '5 cl'   },
      { id: 'jus-citron',  amount: '2.5 cl' },
      { id: 'sirop-sucre', amount: '1 cl'   },
      { id: 'blanc-oeuf',  amount: '1'      },
    ],
    steps: [
      'Verser amaretto, citron, sirop et blanc d\'œuf dans le shaker sans glace.',
      'Secouer 15 secondes à sec.',
      'Ajouter la glace, secouer encore 15 secondes.',
      'Double filtrer sur un gros glaçon.',
      'Exprimer un zeste de citron au-dessus de la mousse.',
    ],
  },
  {
    id: 'amaretto-sour-morgenthaler', name: "Amaretto Sour de Morgenthaler", tagline: 'La version qui a réhabilité le verre',
    moods: ['moderne', 'élégant', 'fort'], difficulty: 3, time: '8 min', theme: T.cafe,
    glass: 'Old Fashioned', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'amaretto',    amount: '4.5 cl' },
      { id: 'bourbon',     amount: '2 cl'   },
      { id: 'jus-citron',  amount: '3 cl'   },
      { id: 'sirop-sucre', amount: '1 cl'   },
      { id: 'blanc-oeuf',  amount: '1/2'    },
    ],
    steps: [
      "Le bourbon est la clé : c'est lui qui coupe le sucre de l'amaretto.",
      'Tout verser dans le shaker sans glace et secouer 15 secondes.',
      'Ajouter la glace et secouer encore 15 secondes.',
      'Double filtrer sur un gros glaçon dans un verre old fashioned.',
      'Exprimer un zeste de citron et le déposer sur la mousse.',
    ],
  },
  {
    id: 'clover-club', name: 'Clover Club', tagline: 'Rose, mousseux, redoutable',
    moods: ['élégant', 'frais', 'festif'], difficulty: 3, time: '8 min', theme: T.framboise,
    glass: 'Verre à cocktail', garnish: 'Framboise fraîche',
    ingredients: [
      { id: 'gin',         amount: '5 cl'   },
      { id: 'jus-citron',  amount: '2 cl'   },
      { id: 'sirop-sucre', amount: '1.5 cl' },
      { id: 'framboise',   amount: '5'      },
      { id: 'blanc-oeuf',  amount: '1'      },
    ],
    steps: [
      'Piler les framboises avec le sirop au fond du shaker.',
      "Ajouter gin, citron et blanc d'œuf, sans glace.",
      'Secouer 15 secondes à sec pour monter la mousse.',
      'Ajouter la glace et secouer encore 15 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      'Déposer une framboise sur la mousse.',
    ],
  },
  {
    id: 'bees-knees', name: "Bee's Knees", tagline: 'Gin, citron, miel — trois ingrédients, zéro fausse note',
    moods: ['classique', 'frais', 'léger'], difficulty: 1, time: '5 min', theme: T.citron,
    glass: 'Verre à cocktail', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'gin',        amount: '6 cl' },
      { id: 'jus-citron', amount: '2 cl' },
      { id: 'miel',       amount: '2 cl' },
    ],
    steps: [
      "Détendre le miel avec un trait d'eau chaude pour qu'il se mélange (3 parts miel, 1 part eau).",
      'Verser gin, citron et sirop de miel dans un shaker rempli de glace.',
      'Secouer vigoureusement 15 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      'Exprimer un zeste de citron au-dessus du verre.',
    ],
  },

  // ── Rhum & canne ──────────────────────────────────────────────────────────
  {
    id: 'daiquiri', name: 'Daiquiri', tagline: 'Trois ingrédients, aucun droit à l\'erreur',
    moods: ['classique', 'frais', 'été'], difficulty: 1, time: '5 min', theme: T.lime,
    glass: 'Verre à cocktail', garnish: 'Zeste de lime',
    ingredients: [
      { id: 'rhum',        amount: '6 cl'   },
      { id: 'jus-lime',    amount: '2.5 cl' },
      { id: 'sirop-sucre', amount: '1.5 cl' },
    ],
    steps: [
      'Refroidir le verre à cocktail.',
      'Verser rhum blanc, jus de lime et sirop dans un shaker rempli de glace.',
      'Secouer vigoureusement 12 secondes.',
      'Double filtrer dans le verre refroidi.',
      'Décorer d\'un zeste de lime.',
    ],
  },
  {
    id: 'ti-punch', name: 'Ti Punch', tagline: "Le rhum agricole dans son plus simple appareil",
    moods: ['classique', 'fort'], difficulty: 1, time: '3 min', theme: T.lime,
    glass: 'Old Fashioned', garnish: 'Rondelle de citron vert',
    ingredients: [
      { id: 'saint-james-blanc', amount: '6 cl' },
      { id: 'sirop-sucre',       amount: '1 cl' },
      { id: 'jus-lime',          amount: '1 cl' },
    ],
    steps: [
      "Le rhum agricole n'est pas négociable ici : c'est lui qui fait le verre.",
      'Verser le sirop de canne au fond du verre.',
      'Presser une rondelle de citron vert épaisse et la laisser tomber dedans.',
      'Ajouter le rhum et remuer.',
      'Se boit sans glace, ou avec un seul glaçon. « Chacun prépare sa propre mort. »',
    ],
  },
  {
    id: 'caipirinha', name: 'Caïpirinha', tagline: 'Le Brésil en trois gestes',
    moods: ['festif', 'été', 'frais'], difficulty: 1, time: '4 min', theme: T.lime,
    glass: 'Old Fashioned', garnish: 'Quartier de citron vert',
    ingredients: [
      { id: 'cachaca',     amount: '6 cl'        },
      { id: 'jus-lime',    amount: '3 cl'        },
      { id: 'sucre-canne', amount: '2 c. à café' },
    ],
    steps: [
      'Couper un citron vert en quartiers et les mettre au fond du verre.',
      'Ajouter le sucre de canne et piler pour libérer le jus et les huiles du zeste.',
      'Remplir de glace pilée.',
      'Verser la cachaça et remuer de bas en haut à la cuillère.',
    ],
  },
  {
    id: 'mojito', name: 'Mojito', tagline: 'La fraîcheur cubaine',
    moods: ['été', 'frais', 'festif'], difficulty: 2, time: '7 min', theme: T.lime,
    glass: 'Verre Highball', garnish: 'Menthe + citron vert',
    ingredients: [
      { id: 'rhum',        amount: '5 cl'      },
      { id: 'menthe',      amount: '10 feuilles' },
      { id: 'jus-lime',    amount: '3 cl'      },
      { id: 'sirop-sucre', amount: '2 cl'      },
      { id: 'eau-gazeuse', amount: '10 cl'     },
    ],
    steps: [
      'Déposer les feuilles de menthe et le sirop au fond du verre.',
      'Presser la menthe avec le pilon sans la déchirer — juste la réveiller.',
      'Remplir de glace pilée.',
      'Verser le rhum et le jus de lime, remuer de bas en haut.',
      "Compléter à l'eau gazeuse et couronner d'un beau bouquet de menthe.",
    ],
  },
  {
    id: 'rhum-daisy', name: 'Rhum Daisy', tagline: "L'ancêtre oublié de la Margarita",
    moods: ['classique', 'frais', 'été'], difficulty: 2, time: '5 min', theme: T.agave,
    glass: 'Verre Highball', garnish: 'Menthe + zeste de citron',
    ingredients: [
      { id: 'rhum',           amount: '5 cl'   },
      { id: 'jus-citron',     amount: '2 cl'   },
      { id: 'liqueur-orange', amount: '1.5 cl' },
      { id: 'sirop-sucre',    amount: '1 cl'   },
    ],
    steps: [
      'Verser tous les ingrédients dans un shaker rempli de glace.',
      'Secouer vigoureusement 12 secondes.',
      'Filtrer sur de la glace pilée dans un verre highball.',
      "Couronner d'un bouquet de menthe et d'un zeste de citron.",
    ],
  },
  {
    id: 'pina-colada', name: 'Piña Colada', tagline: 'Les vacances, servies en verre',
    moods: ['été', 'festif', 'coloré'], difficulty: 2, time: '6 min', theme: T.coco,
    glass: 'Verre Highball', garnish: "Tranche d'ananas",
    ingredients: [
      { id: 'rhum',       amount: '5 cl'  },
      { id: 'lait-coco',  amount: '4 cl'  },
      { id: 'jus-ananas', amount: '10 cl' },
    ],
    steps: [
      'Bien secouer la brique de lait de coco avant de doser.',
      'Verser rhum, lait de coco et jus d\'ananas dans un shaker rempli de glace.',
      'Secouer énergiquement 15 secondes — il faut émulsionner le coco.',
      'Verser sans filtrer dans un grand verre rempli de glace pilée.',
      "Décorer d'une tranche d'ananas.",
    ],
  },

  // ── Long drinks ───────────────────────────────────────────────────────────
  {
    id: 'gin-tonic', name: 'Gin Tonic', tagline: 'Le plus simple, le plus difficile à rater',
    moods: ['apéro', 'frais', 'pétillant'], difficulty: 1, time: '2 min', theme: T.gin,
    glass: 'Verre à vin', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'gin',   amount: '5 cl'  },
      { id: 'tonic', amount: '15 cl' },
    ],
    steps: [
      'Remplir un grand verre à vin de glaçons jusqu\'en haut — moins de glace, plus de dilution.',
      'Verser le gin.',
      'Ajouter le tonic en le faisant glisser le long d\'une cuillère pour garder les bulles.',
      'Ne pas remuer. Exprimer un zeste de citron.',
    ],
  },
  {
    id: 'london-mule', name: 'London Mule', tagline: 'Le Moscow Mule qui a traversé la Manche',
    moods: ['festif', 'pétillant', 'frais'], difficulty: 1, time: '4 min', theme: T.gin,
    glass: 'Mug en cuivre', garnish: 'Citron vert + menthe',
    ingredients: [
      { id: 'gin',         amount: '5 cl'  },
      { id: 'jus-lime',    amount: '2 cl'  },
      { id: 'ginger-beer', amount: '12 cl' },
    ],
    steps: [
      'Remplir un mug en cuivre de glace pilée.',
      'Verser le gin et le jus de lime.',
      'Compléter avec la ginger beer.',
      "Remuer une fois et décorer d'une rondelle de citron vert et de menthe.",
    ],
  },
  {
    id: 'john-collins', name: 'John Collins', tagline: 'Le Collins au whiskey',
    moods: ['classique', 'frais', 'pétillant'], difficulty: 1, time: '4 min', theme: T.ambre,
    glass: 'Verre Highball', garnish: 'Rondelle de citron',
    ingredients: [
      { id: 'bourbon',     amount: '5 cl'   },
      { id: 'jus-citron',  amount: '3 cl'   },
      { id: 'sirop-sucre', amount: '1.5 cl' },
      { id: 'eau-gazeuse', amount: '8 cl'   },
    ],
    steps: [
      'Secouer bourbon, citron et sirop avec de la glace pendant 10 secondes.',
      'Filtrer dans un verre highball rempli de glaçons.',
      "Compléter à l'eau gazeuse.",
      "Remuer une fois et décorer d'une rondelle de citron.",
    ],
  },
  {
    id: 'tom-collins', name: 'Tom Collins', tagline: 'Le même, au gin',
    moods: ['classique', 'frais', 'pétillant'], difficulty: 1, time: '4 min', theme: T.gin,
    glass: 'Verre Highball', garnish: 'Rondelle de citron',
    ingredients: [
      { id: 'gin',         amount: '5 cl'   },
      { id: 'jus-citron',  amount: '3 cl'   },
      { id: 'sirop-sucre', amount: '1.5 cl' },
      { id: 'eau-gazeuse', amount: '8 cl'   },
    ],
    steps: [
      'Secouer gin, citron et sirop avec de la glace pendant 10 secondes.',
      'Filtrer dans un verre highball rempli de glaçons.',
      "Compléter à l'eau gazeuse.",
      "Remuer une fois et décorer d'une rondelle de citron.",
    ],
  },
  {
    id: 'spritz', name: 'Aperol Spritz', tagline: "L'apéritif à l'italienne",
    moods: ['apéro', 'été', 'pétillant'], difficulty: 1, time: '3 min', theme: T.aperol,
    glass: 'Verre à vin', garnish: "Rondelle d'orange",
    ingredients: [
      { id: 'aperol',      amount: '6 cl' },
      { id: 'prosecco',    amount: '9 cl' },
      { id: 'eau-gazeuse', amount: '3 cl' },
    ],
    steps: [
      'Remplir un grand verre à vin de glaçons.',
      "L'ordre compte : le Prosecco d'abord, l'Aperol ensuite.",
      "Compléter d'un trait d'eau gazeuse.",
      "Remuer délicatement et décorer d'une rondelle d'orange.",
    ],
  },

  // ── Agave ─────────────────────────────────────────────────────────────────
  {
    id: 'margarita', name: 'Margarita', tagline: 'Le classique mexicain',
    moods: ['festif', 'été'], difficulty: 1, time: '5 min', theme: T.lime,
    glass: 'Verre à Margarita', garnish: 'Sel + citron vert',
    ingredients: [
      { id: 'tequila',        amount: '5 cl'   },
      { id: 'liqueur-orange', amount: '2 cl'   },
      { id: 'jus-lime',       amount: '3 cl'   },
      { id: 'sirop-sucre',    amount: '0.5 cl' },
    ],
    steps: [
      'Frotter le bord du verre avec un citron vert et le tremper dans du sel fin.',
      'Remplir le shaker de glaçons.',
      'Verser la tequila, la liqueur d\'orange et le jus de lime.',
      'Secouer énergiquement 15 secondes.',
      'Double filtrer dans le verre givré.',
      "Décorer d'une rondelle de citron vert.",
    ],
  },
  {
    id: 'margarita-givree', name: 'Margarita givrée', tagline: 'Au fruit du moment, passée au blender',
    moods: ['été', 'festif', 'coloré'], difficulty: 2, time: '6 min', theme: T.framboise,
    glass: 'Verre à Margarita', garnish: 'Fruit frais + sel',
    ingredients: [
      { id: 'tequila',        amount: '5 cl'                        },
      { id: 'liqueur-orange', amount: '2 cl'                        },
      { id: 'jus-lime',       amount: '2.5 cl'                      },
      { id: 'framboise',      amount: '80 g (ou le fruit du moment)' },
      { id: 'sirop-agave',    amount: '1 cl'                        },
    ],
    steps: [
      'Framboise, fraise, mangue, pêche : prendre ce qui est là, surgelé de préférence.',
      'Givrer le bord du verre au sel et le placer au congélateur.',
      'Mettre tous les ingrédients au blender avec un grand verre de glace pilée.',
      'Mixer 20 secondes jusqu\'à obtenir une texture de neige.',
      'Verser dans le verre givré et servir tout de suite, avec une paille.',
    ],
  },

  // ── Amers modernes ────────────────────────────────────────────────────────
  {
    id: 'paper-plane', name: 'Paper Plane', tagline: 'Quatre parts égales, aucun compromis',
    moods: ['moderne', 'amer', 'élégant'], difficulty: 2, time: '5 min', theme: T.aperol,
    glass: 'Verre à cocktail', garnish: 'Zeste de citron',
    ingredients: [
      { id: 'bourbon',      amount: '2.5 cl' },
      { id: 'aperol',       amount: '2.5 cl' },
      { id: 'amaro-pisoni', amount: '2.5 cl' },
      { id: 'jus-citron',   amount: '2.5 cl' },
    ],
    steps: [
      'Verser les quatre ingrédients à parts strictement égales dans un shaker rempli de glace.',
      'Secouer vigoureusement 12 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      'Exprimer un zeste de citron au-dessus du verre.',
    ],
  },

  // ── Il manque un ingrédient frais ─────────────────────────────────────────
  {
    id: 'espresso-martini', name: 'Espresso Martini', tagline: 'Réveille-toi, puis fais la fête',
    moods: ['moderne', 'festif', 'fort'], difficulty: 2, time: '6 min', theme: T.cafe,
    glass: 'Verre à cocktail', garnish: '3 grains de café',
    ingredients: [
      { id: 'vodka',         amount: '4 cl' },
      { id: 'liqueur-cafe',  amount: '2 cl' },
      { id: 'cafe-espresso', amount: '3 cl' },
      { id: 'sirop-sucre',   amount: '1 cl' },
    ],
    steps: [
      "L'espresso doit être fraîchement tiré : c'est lui qui fait la mousse.",
      'Verser tous les ingrédients dans un shaker rempli de glace.',
      'Secouer très vigoureusement 20 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      'Déposer trois grains de café sur la mousse.',
    ],
  },
  {
    id: 'gin-basil-smash', name: 'Gin Basil Smash', tagline: 'Un jardin dans le verre',
    moods: ['moderne', 'herbacé', 'frais'], difficulty: 2, time: '6 min', theme: T.herbace,
    glass: 'Old Fashioned', garnish: 'Bouquet de basilic',
    ingredients: [
      { id: 'gin',         amount: '6 cl'       },
      { id: 'basilic',     amount: '1 poignée'  },
      { id: 'jus-citron',  amount: '2.5 cl'     },
      { id: 'sirop-sucre', amount: '1.5 cl'     },
    ],
    steps: [
      'Piler généreusement le basilic avec le sirop au fond du shaker.',
      'Ajouter gin, citron et beaucoup de glace.',
      'Secouer vigoureusement 12 secondes.',
      'Double filtrer sur de la glace fraîche dans un verre old fashioned.',
      "Claquer une feuille de basilic entre les mains et la poser sur le verre.",
    ],
  },
  {
    id: 'red-lion', name: 'Red Lion', tagline: 'Gin et orange, cuvée 1933',
    moods: ['classique', 'festif', 'coloré'], difficulty: 1, time: '5 min', theme: T.agave,
    glass: 'Verre à cocktail', garnish: "Zeste d'orange",
    ingredients: [
      { id: 'gin',            amount: '3 cl'   },
      { id: 'liqueur-orange', amount: '3 cl'   },
      { id: 'jus-orange',     amount: '3 cl'   },
      { id: 'jus-citron',     amount: '1.5 cl' },
    ],
    steps: [
      'Verser les quatre ingrédients dans un shaker rempli de glace.',
      'Secouer vigoureusement 12 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      "Exprimer un zeste d'orange au-dessus du verre.",
    ],
  },
  {
    id: 'pornstar-martini', name: 'Pornstar Martini', tagline: 'Le verre, et le shot de Prosecco à côté',
    moods: ['festif', 'moderne', 'coloré'], difficulty: 2, time: '7 min', theme: T.passion,
    glass: 'Verre à cocktail', garnish: 'Demi fruit de la passion',
    ingredients: [
      { id: 'vodka',         amount: '5 cl'          },
      { id: 'passoa',        amount: '2 cl'          },
      { id: 'fruit-passion', amount: '1 (la pulpe)'  },
      { id: 'sirop-vanille', amount: '1 cl'          },
      { id: 'jus-lime',      amount: '1 cl'          },
      { id: 'prosecco',      amount: '4 cl (à part)' },
    ],
    steps: [
      'Récupérer la pulpe d\'un fruit de la passion dans le shaker.',
      'Ajouter vodka, Passoã, sirop de vanille, jus de lime et de la glace.',
      'Secouer vigoureusement 15 secondes.',
      'Double filtrer dans un verre à cocktail refroidi.',
      'Faire flotter une demi-coque de fruit de la passion sur le dessus.',
      'Servir avec un shot de Prosecco bien froid à côté — on alterne.',
    ],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────

export function seed(db: DatabaseSync) {
  // 1. Les ingrédients qui manquent encore : présents, mais pas possédés.
  const insertBottle = db.prepare(`
    INSERT INTO bottles (id, name, category, color, owned, pantry, generic_id)
    VALUES (@id, @name, @category, @color, 0, 0, NULL)
    ON CONFLICT(id) DO NOTHING
  `);
  for (const b of A_ACHETER) insertBottle.run(b);

  // 2. Recettes devenues sans objet (les ingrédients partent en cascade).
  const drop = db.prepare('DELETE FROM cocktails WHERE id = ?');
  for (const id of A_RETIRER) drop.run(id);

  // 3. La carte.
  const upsertCocktail = db.prepare(`
    INSERT INTO cocktails (id, name, tagline, difficulty, time, glass, garnish, moods, steps, theme)
    VALUES (@id, @name, @tagline, @difficulty, @time, @glass, @garnish, @moods, @steps, @theme)
    ON CONFLICT(id) DO UPDATE SET
      name       = excluded.name,
      tagline    = excluded.tagline,
      difficulty = excluded.difficulty,
      time       = excluded.time,
      glass      = excluded.glass,
      garnish    = excluded.garnish,
      moods      = excluded.moods,
      steps      = excluded.steps,
      theme      = excluded.theme
  `);

  const clearIngredients = db.prepare('DELETE FROM cocktail_ingredients WHERE cocktail_id = ?');
  const insertIngredient = db.prepare(`
    INSERT INTO cocktail_ingredients (cocktail_id, bottle_id, amount, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  for (const c of COCKTAILS) {
    upsertCocktail.run({
      id:         c.id,
      name:       c.name,
      tagline:    c.tagline,
      difficulty: c.difficulty,
      time:       c.time,
      glass:      c.glass,
      garnish:    c.garnish,
      moods:      JSON.stringify(c.moods),
      steps:      JSON.stringify(c.steps),
      theme:      JSON.stringify(c.theme),
    });

    // Réécriture complète : le seed reste la source de vérité de la recette.
    clearIngredients.run(c.id);
    c.ingredients.forEach((ing, i) => insertIngredient.run(c.id, ing.id, ing.amount, i));
  }
}
