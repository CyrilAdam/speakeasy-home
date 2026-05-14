export interface Bottle {
  id: string;
  name: string;
  category: string;
  color: string;
  owned: boolean;
  pantry: boolean;
}

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

export interface Cocktail {
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
}

export interface CocktailWithIngredients extends Cocktail {
  ingredients: CocktailIngredient[];
  canMake: boolean;
  missingCount: number;
}

export interface CocktailListItem extends Cocktail {
  canMake: boolean;
  missingCount: number;
}
