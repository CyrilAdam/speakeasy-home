import type { DatabaseSync } from '../client.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Bottle {
  id: string;
  name: string;
  category: string;
  color: string;
  owned: boolean;
  pantry?: boolean;
}

interface CocktailIngredient {
  id: string;
  amount: string;
}

interface CocktailTheme {
  bg: string;
  from: string;
  to: string;
  mid: string;
  accent: string;
  text: string;
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
  theme: CocktailTheme;
  ingredients: CocktailIngredient[];
  steps: string[];
}

// ── Données ───────────────────────────────────────────────────────────────────

const BOTTLES: Bottle[] = [
  // Owned
  { id: 'grand-marnier',  name: 'Grand Marnier',     category: "Liqueur d'orange", color: '#E8642A', owned: true  },
  { id: 'tequila',        name: 'Tequila Sierra',    category: 'Tequila',           color: '#D4A017', owned: true  },
  { id: 'campari',        name: 'Campari',           category: 'Amer',              color: '#C4180A', owned: true  },
  { id: 'chartreuse',     name: 'Chartreuse Verte',  category: 'Liqueur',           color: '#5A9E1A', owned: true  },
  // Pantry
  { id: 'jus-citron',     name: 'Jus de citron',     category: 'Jus',               color: '#FFF176', owned: true, pantry: true },
  { id: 'jus-lime',       name: 'Jus de lime',       category: 'Jus',               color: '#DCEDC8', owned: true, pantry: true },
  { id: 'sirop-sucre',    name: 'Sirop de sucre',    category: 'Sirop',             color: '#FFF9C4', owned: true, pantry: true },
  { id: 'eau-gazeuse',    name: 'Eau gazeuse',       category: 'Soda',              color: '#E8F5E9', owned: true, pantry: true },
  // Not yet owned
  { id: 'vodka',          name: 'Vodka',             category: 'Vodka',             color: '#90CAF9', owned: false },
  { id: 'rhum',           name: 'Rhum Blanc',        category: 'Rhum',              color: '#F5E6C8', owned: false },
  { id: 'gin',            name: 'Gin',               category: 'Gin',               color: '#B2EBF2', owned: false },
  { id: 'bourbon',        name: 'Bourbon',           category: 'Whiskey',           color: '#C8963C', owned: false },
  { id: 'vermouth-rouge', name: 'Vermouth Rouge',    category: 'Vermouth',          color: '#8B1C1C', owned: false },
  { id: 'vermouth-blanc', name: 'Vermouth Blanc',    category: 'Vermouth',          color: '#F5F0DC', owned: false },
  { id: 'cointreau',      name: 'Cointreau',         category: "Liqueur d'orange",  color: '#FFB347', owned: false },
  { id: 'amaretto',       name: 'Amaretto',          category: 'Liqueur',           color: '#8B4513', owned: false },
  { id: 'kahlua',         name: 'Kahlúa',            category: 'Liqueur café',      color: '#3D1A00', owned: false },
  { id: 'baileys',        name: 'Baileys',           category: 'Liqueur crème',     color: '#D2B48C', owned: false },
  { id: 'prosecco',       name: 'Prosecco',          category: 'Pétillant',         color: '#F5DEB3', owned: false },
  { id: 'triple-sec',     name: 'Triple Sec',        category: "Liqueur d'orange",  color: '#FFA500', owned: false },
  { id: 'angostura',      name: 'Bitters Angostura', category: 'Bitters',           color: '#7B3F00', owned: false },
  { id: 'jus-cranberry',  name: 'Jus de cranberry',  category: 'Jus',               color: '#E53935', owned: false },
  { id: 'ginger-beer',    name: 'Ginger Beer',       category: 'Soda',              color: '#FFE0B2', owned: false },
  { id: 'tonic',          name: 'Eau tonique',       category: 'Soda',              color: '#E3F2FD', owned: false },
  { id: 'jus-ananas',     name: "Jus d'ananas",      category: 'Jus',               color: '#FFF9C4', owned: false },
];

const COCKTAILS: Cocktail[] = [
  {
    id: 'margarita',
    name: 'Margarita',
    tagline: 'Le classique mexicain',
    moods: ['festif', 'été'],
    difficulty: 1,
    time: '5 min',
    theme: { bg: '#071A0F', from: '#1B5E35', to: '#52B788', accent: '#74C69D', text: '#D8F3DC', mid: '#2D9E5A' },
    ingredients: [
      { id: 'tequila',       amount: '5 cl'   },
      { id: 'grand-marnier', amount: '2 cl'   },
      { id: 'jus-lime',      amount: '3 cl'   },
      { id: 'sirop-sucre',   amount: '0.5 cl' },
    ],
    steps: [
      'Frotter le bord du verre avec un citron vert et le tremper dans du sel fin.',
      'Remplir le shaker de glaçons.',
      'Verser la tequila, le Grand Marnier et le jus de lime.',
      'Secouer énergiquement pendant 15 secondes.',
      'Double filtrer dans le verre givré.',
      "Décorer d'une rondelle de citron vert.",
    ],
    glass: 'Verre à Margarita',
    garnish: 'Sel + citron vert',
  },
  {
    id: 'negroni',
    name: 'Negroni',
    tagline: "L'amer élégant",
    moods: ['classique', 'amer'],
    difficulty: 1,
    time: '3 min',
    theme: { bg: '#190505', from: '#7B1D1D', to: '#E74C3C', accent: '#FF6B6B', text: '#FDEDEC', mid: '#C0392B' },
    ingredients: [
      { id: 'campari',        amount: '3 cl' },
      { id: 'gin',            amount: '3 cl' },
      { id: 'vermouth-rouge', amount: '3 cl' },
    ],
    steps: [
      'Remplir un verre old fashioned de glaçons.',
      'Verser le gin, le Campari et le vermouth rouge.',
      "Mélanger délicatement avec une cuillère de bar pendant 30 secondes.",
      "Décorer d'un zeste d'orange.",
    ],
    glass: 'Old Fashioned',
    garnish: "Zeste d'orange",
  },
  {
    id: 'moscow-mule',
    name: 'Moscow Mule',
    tagline: 'Le cuivré piquant',
    moods: ['festif', 'été', 'pétillant'],
    difficulty: 1,
    time: '4 min',
    theme: { bg: '#180900', from: '#7B3F00', to: '#D2691E', accent: '#E8A87C', text: '#FFF3E0', mid: '#A0522D' },
    ingredients: [
      { id: 'vodka',       amount: '5 cl'  },
      { id: 'ginger-beer', amount: '15 cl' },
      { id: 'jus-lime',    amount: '2 cl'  },
    ],
    steps: [
      'Remplir un mug en cuivre de glace pilée.',
      'Verser la vodka et le jus de lime.',
      'Compléter avec la ginger beer.',
      'Mélanger très délicatement.',
      'Décorer d\'une rondelle de citron vert et de gingembre frais.',
    ],
    glass: 'Mug en cuivre',
    garnish: 'Citron vert + gingembre',
  },
  {
    id: 'mojito',
    name: 'Mojito',
    tagline: 'La fraîcheur cubaine',
    moods: ['été', 'frais', 'festif'],
    difficulty: 2,
    time: '7 min',
    theme: { bg: '#021208', from: '#00441B', to: '#40916C', accent: '#74C69D', text: '#CCFBCC', mid: '#1B7A42' },
    ingredients: [
      { id: 'rhum',        amount: '5 cl'  },
      { id: 'sirop-sucre', amount: '2 cl'  },
      { id: 'jus-lime',    amount: '3 cl'  },
      { id: 'eau-gazeuse', amount: '10 cl' },
    ],
    steps: [
      'Effeuiller la menthe et la déposer dans un verre.',
      'Piler délicatement la menthe avec un pilon (sans la déchirer).',
      'Ajouter la glace pilée.',
      'Verser le rhum et le jus de lime.',
      "Compléter avec l'eau gazeuse.",
      'Remuer doucement et décorer de menthe fraîche.',
    ],
    glass: 'Verre Highball',
    garnish: 'Menthe + citron vert',
  },
  {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    tagline: 'Le rose glamour',
    moods: ['festif', 'élégant'],
    difficulty: 2,
    time: '5 min',
    theme: { bg: '#150010', from: '#880035', to: '#E91E8C', accent: '#F48FB1', text: '#FCE4EC', mid: '#C2185B' },
    ingredients: [
      { id: 'vodka',         amount: '4 cl'   },
      { id: 'cointreau',     amount: '2 cl'   },
      { id: 'jus-cranberry', amount: '3 cl'   },
      { id: 'jus-lime',      amount: '1.5 cl' },
    ],
    steps: [
      'Refroidir un verre à martini avec des glaçons.',
      'Remplir le shaker de glace.',
      'Ajouter la vodka, le Cointreau, le jus de cranberry et le jus de lime.',
      "Secouer vigoureusement jusqu'à ce que le shaker soit givré.",
      'Vider le verre à martini, filtrer le cocktail dedans.',
      "Décorer d'un zeste d'orange.",
    ],
    glass: 'Verre à martini',
    garnish: "Zeste d'orange",
  },
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    tagline: "Le whiskey d'antan",
    moods: ['classique', 'fort'],
    difficulty: 2,
    time: '5 min',
    theme: { bg: '#120800', from: '#4A2000', to: '#B8860B', accent: '#DAA520', text: '#FFF8DC', mid: '#8B6400' },
    ingredients: [
      { id: 'bourbon',     amount: '6 cl'     },
      { id: 'sirop-sucre', amount: '1 cl'     },
      { id: 'angostura',   amount: '2 traits' },
    ],
    steps: [
      "Imbiber un morceau de sucre de bitters dans un verre à whisky.",
      'Écraser le sucre avec un pilon.',
      "Ajouter un glaçon entier de taille généreuse.",
      'Verser le bourbon en plusieurs fois en remuant entre chaque ajout.',
      "Décorer d'un zeste d'orange et d'une cerise cocktail.",
    ],
    glass: 'Old Fashioned',
    garnish: "Zeste d'orange + cerise",
  },
  {
    id: 'last-word',
    name: 'Last Word',
    tagline: 'La prohibition revisitée',
    moods: ['classique', 'herbacé'],
    difficulty: 2,
    time: '5 min',
    theme: { bg: '#081200', from: '#2D5016', to: '#84A000', accent: '#A8D500', text: '#F0FFC0', mid: '#5A8000' },
    ingredients: [
      { id: 'gin',        amount: '2.5 cl' },
      { id: 'chartreuse', amount: '2.5 cl' },
      { id: 'jus-lime',   amount: '2.5 cl' },
      { id: 'sirop-sucre',amount: '0.5 cl' },
    ],
    steps: [
      'Remplir un shaker de glace.',
      'Verser le gin, la Chartreuse Verte et le jus de lime à parts égales.',
      'Secouer vigoureusement pendant 15 secondes.',
      'Double filtrer dans un verre à cocktail.',
      'Décorer d\'un zeste de lime.',
    ],
    glass: 'Verre à cocktail',
    garnish: 'Zeste de lime',
  },
  {
    id: 'paper-plane',
    name: 'Paper Plane',
    tagline: 'Le contemporain équilibré',
    moods: ['moderne', 'amer'],
    difficulty: 2,
    time: '5 min',
    theme: { bg: '#150900', from: '#6B3000', to: '#E8A000', accent: '#FFB830', text: '#FFF8E0', mid: '#B87800' },
    ingredients: [
      { id: 'bourbon',       amount: '2.5 cl' },
      { id: 'campari',       amount: '2.5 cl' },
      { id: 'grand-marnier', amount: '2.5 cl' },
      { id: 'jus-citron',    amount: '2.5 cl' },
    ],
    steps: [
      'Remplir un shaker de glace.',
      'Verser tous les ingrédients à parts égales.',
      'Secouer vigoureusement.',
      'Double filtrer dans un verre à cocktail refroidi.',
      "Décorer d'un zeste de citron.",
    ],
    glass: 'Verre à cocktail',
    garnish: 'Zeste de citron',
  },
  {
    id: 'spritz',
    name: 'Aperol Spritz',
    tagline: "L'apéritif à l'italienne",
    moods: ['apéro', 'été', 'pétillant'],
    difficulty: 1,
    time: '3 min',
    theme: { bg: '#190700', from: '#7B2800', to: '#FF7043', accent: '#FFAB91', text: '#FBE9E7', mid: '#C83A10' },
    ingredients: [
      { id: 'campari',     amount: '6 cl' },
      { id: 'prosecco',    amount: '9 cl' },
      { id: 'eau-gazeuse', amount: '3 cl' },
    ],
    steps: [
      'Remplir un grand verre à vin de glaçons.',
      'Verser le Campari.',
      'Ajouter le Prosecco.',
      "Compléter avec l'eau gazeuse.",
      "Remuer délicatement et décorer d'une rondelle d'orange.",
    ],
    glass: 'Verre à vin',
    garnish: "Rondelle d'orange",
  },
  {
    id: 'gimlet',
    name: 'Gimlet',
    tagline: 'Le gin tout en fraîcheur',
    moods: ['frais', 'léger'],
    difficulty: 1,
    time: '4 min',
    theme: { bg: '#001510', from: '#1B4332', to: '#2ECC71', accent: '#52E08A', text: '#E8FCF0', mid: '#1A9D4A' },
    ingredients: [
      { id: 'gin',         amount: '6 cl'   },
      { id: 'jus-lime',    amount: '2 cl'   },
      { id: 'sirop-sucre', amount: '1.5 cl' },
    ],
    steps: [
      'Remplir un shaker de glace.',
      'Verser le gin, le jus de lime et le sirop de sucre.',
      'Secouer vigoureusement.',
      'Filtrer dans un verre à cocktail refroidi.',
      'Décorer d\'un zeste de lime.',
    ],
    glass: 'Verre à cocktail',
    garnish: 'Zeste de lime',
  },
  {
    id: 'tequila-sunrise',
    name: 'Tequila Sunrise',
    tagline: 'Le lever de soleil',
    moods: ['festif', 'coloré', 'été'],
    difficulty: 1,
    time: '4 min',
    theme: { bg: '#160400', from: '#8B1A00', to: '#FFA000', accent: '#FFD54F', text: '#FFFDE7', mid: '#D47000' },
    ingredients: [
      { id: 'tequila',     amount: '5 cl'  },
      { id: 'jus-ananas',  amount: '10 cl' },
      { id: 'sirop-sucre', amount: '1 cl'  },
    ],
    steps: [
      'Remplir un grand verre de glaçons.',
      "Verser la tequila puis le jus d'ananas.",
      'Mélanger légèrement.',
      "Verser lentement la grenadine le long du bord intérieur pour créer l'effet dégradé.",
      'Ne pas remuer — servir immédiatement pour conserver les couches.',
    ],
    glass: 'Verre Highball',
    garnish: "Rondelle d'orange + cerise",
  },
  {
    id: 'b52',
    name: 'B-52',
    tagline: 'Le shot en trois couches',
    moods: ['shot', 'fort'],
    difficulty: 3,
    time: '5 min',
    theme: { bg: '#0D0400', from: '#3D1A00', to: '#C8963C', accent: '#E8B84B', text: '#FFF8E1', mid: '#8B5A00' },
    ingredients: [
      { id: 'kahlua',        amount: '2 cl' },
      { id: 'baileys',       amount: '2 cl' },
      { id: 'grand-marnier', amount: '2 cl' },
    ],
    steps: [
      'Verser le Kahlúa dans un verre à shot.',
      'Superposer le Baileys très délicatement en versant sur le dos d\'une cuillère.',
      'Finir avec le Grand Marnier de la même façon.',
      'Servir sans mélanger pour conserver les couches distinctes.',
    ],
    glass: 'Verre à shot',
    garnish: 'Aucun',
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────

export function seed(db: DatabaseSync) {
  const insertBottle = db.prepare(`
    INSERT INTO bottles (id, name, category, color, owned, pantry)
    VALUES (@id, @name, @category, @color, @owned, @pantry)
  `);

  const insertCocktail = db.prepare(`
    INSERT INTO cocktails (id, name, tagline, difficulty, time, glass, garnish, moods, steps, theme)
    VALUES (@id, @name, @tagline, @difficulty, @time, @glass, @garnish, @moods, @steps, @theme)
  `);

  const insertIngredient = db.prepare(`
    INSERT INTO cocktail_ingredients (cocktail_id, bottle_id, amount, sort_order)
    VALUES (@cocktailId, @bottleId, @amount, @sortOrder)
  `);

  for (const bottle of BOTTLES) {
    insertBottle.run({
      ...bottle,
      owned: bottle.owned ? 1 : 0,
      pantry: bottle.pantry ? 1 : 0,
    });
  }

  for (const cocktail of COCKTAILS) {
    insertCocktail.run({
      id:         cocktail.id,
      name:       cocktail.name,
      tagline:    cocktail.tagline,
      difficulty: cocktail.difficulty,
      time:       cocktail.time,
      glass:      cocktail.glass,
      garnish:    cocktail.garnish,
      moods:      JSON.stringify(cocktail.moods),
      steps:      JSON.stringify(cocktail.steps),
      theme:      JSON.stringify(cocktail.theme),
    });

    cocktail.ingredients.forEach((ing, i) => {
      insertIngredient.run({
        cocktailId: cocktail.id,
        bottleId:   ing.id,
        amount:     ing.amount,
        sortOrder:  i,
      });
    });
  }
}
