export interface Bottle {
  id: string;
  name: string;
  category: string;
  color: string;
  /** Possession effective : vraie si la bouteille ou l'une de ses marques est possédée. */
  owned: boolean;
  pantry: boolean;
  /** Générique auquel cette marque est rattachée (null = produit autonome). */
  genericId: string | null;
  /** Nombre de marques rattachées. > 0 ⇒ générique abstrait, masqué de l'inventaire. */
  variantCount: number;
}

/** Un générique qui a des marques n'existe que pour les recettes — pas sur l'étagère. */
export const isAbstract = (b: Bottle) => b.variantCount > 0;

export interface CocktailTheme {
  bg: string;
  from: string;
  to: string;
  mid: string;
  accent: string;
  text: string;
}

export interface CocktailIngredient {
  bottleId: string;
  bottleName: string;
  amount: string;
  sortOrder: number;
}

export interface CocktailListItem {
  id: string;
  name: string;
  tagline: string;
  difficulty: 1 | 2 | 3;
  time: string;
  glass: string;
  garnish: string;
  moods: string[];
  steps: string[];
  theme: CocktailTheme;
  sceneUrl: string | null;
  glassUrl: string | null;
  canMake: boolean;
  missingCount: number;
}

export interface CocktailWithIngredients extends CocktailListItem {
  ingredients: CocktailIngredient[];
}

export type Palette = {
  bg1: string;
  bg2: string;
  accent: string;
  blobs: [string, string, string];
};

export const PALETTES: Record<string, Palette> = {
  'ébène':      { bg1: '#0C0C19', bg2: '#0F0F1E', accent: '#A0C4FF', blobs: ['#C0392B', '#52B788', '#E8A000'] },
  'speakeasy':  { bg1: '#100800', bg2: '#180D00', accent: '#DAA520', blobs: ['#8B4513', '#D4860B', '#C04000'] },
  'botanik':    { bg1: '#050F08', bg2: '#081A0C', accent: '#7BC42A', blobs: ['#2D6A2D', '#5A9E1A', '#1B5E35'] },
  'velvet':     { bg1: '#0D0515', bg2: '#130820', accent: '#C5A3FF', blobs: ['#6A1B9A', '#AD1457', '#4527A0'] },
  'terracotta': { bg1: '#130800', bg2: '#1A0D04', accent: '#FF8A65', blobs: ['#BF360C', '#E64A19', '#FF6F00'] },
};

export const BOTTLE_CATEGORIES = [
  { label: 'Tequila',            color: '#D4A017' }, { label: 'Vodka',            color: '#90CAF9' },
  { label: 'Rhum',               color: '#F5DEB3' }, { label: 'Gin',              color: '#B2EBF2' },
  { label: 'Cachaça',            color: '#E8DCA0' }, { label: 'Eau-de-vie',       color: '#E0D5C0' },
  { label: 'Whiskey',            color: '#C8963C' }, { label: 'Cognac',           color: '#8B4513' },
  { label: 'Liqueur',            color: '#FF7043' }, { label: 'Vermouth',         color: '#8B1C1C' },
  { label: "Liqueur d'orange",   color: '#FFB347' }, { label: 'Liqueur café',     color: '#3D1A00' },
  { label: 'Liqueur crème',      color: '#D2B48C' },
  { label: 'Amer',               color: '#C4180A' }, { label: 'Amaro',            color: '#6B3410' },
  { label: 'Bitters',            color: '#7B3F00' },
  { label: 'Pétillant',          color: '#F5DEB3' }, { label: 'Vin',              color: '#722F37' },
  { label: 'Jus',                color: '#FFF176' }, { label: 'Soda',             color: '#E3F2FD' },
  { label: 'Sirop',              color: '#FFE0B2' }, { label: 'Frais',            color: '#8BC34A' },
  { label: 'Épicerie',           color: '#BCAAA4' }, { label: 'Autre',            color: '#9E9E9E' },
] as const;
