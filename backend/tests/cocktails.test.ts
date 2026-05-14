import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createTestApp, COCKTAILS } from './helpers.js';
import type { CocktailListItem, CocktailWithIngredients } from '../src/types.js';

let ctx: ReturnType<typeof createTestApp>;

describe('GET /api/cocktails', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('retourne tous les cocktails', async () => {
    const res = await ctx.app.request('/api/cocktails');
    assert.equal(res.status, 200);
    const cocktails: CocktailListItem[] = await res.json();
    assert.equal(cocktails.length, Object.keys(COCKTAILS).length);
  });

  it('canMake=true quand tous les ingrédients sont disponibles', async () => {
    const cocktails: CocktailListItem[] = await (await ctx.app.request('/api/cocktails')).json();
    const gimlet = cocktails.find(c => c.id === 'gimlet')!;
    assert.equal(gimlet.canMake, true);
    assert.equal(gimlet.missingCount, 0);
  });

  it('canMake=false quand un ingrédient manque', async () => {
    const cocktails: CocktailListItem[] = await (await ctx.app.request('/api/cocktails')).json();
    const mule = cocktails.find(c => c.id === 'mule')!;
    assert.equal(mule.canMake, false);
    assert.equal(mule.missingCount, 1);
  });

  it('met à jour canMake après achat d\'une bouteille', async () => {
    await ctx.app.request('/api/bottles/vodka', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owned: true }),
    });
    const cocktails: CocktailListItem[] = await (await ctx.app.request('/api/cocktails')).json();
    const mule = cocktails.find(c => c.id === 'mule')!;
    assert.equal(mule.canMake, true);
    assert.equal(mule.missingCount, 0);
  });

  it('désérialise moods, steps et theme depuis JSON', async () => {
    const cocktails: CocktailListItem[] = await (await ctx.app.request('/api/cocktails')).json();
    const gimlet = cocktails.find(c => c.id === 'gimlet')!;
    assert.ok(Array.isArray(gimlet.moods));
    assert.ok(Array.isArray(gimlet.steps));
    assert.equal(typeof gimlet.theme, 'object');
    assert.ok(gimlet.theme.bg);
  });
});

describe('GET /api/cocktails/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('retourne le cocktail avec ses ingrédients joints', async () => {
    const res = await ctx.app.request('/api/cocktails/gimlet');
    assert.equal(res.status, 200);
    const cocktail: CocktailWithIngredients = await res.json();
    assert.equal(cocktail.id, 'gimlet');
    assert.equal(cocktail.ingredients.length, 2);
    assert.equal(cocktail.ingredients[0].bottleId, 'gin');
    assert.equal(cocktail.ingredients[0].bottleName, 'Gin');
    assert.equal(cocktail.ingredients[0].amount, '6 cl');
  });

  it('retourne canMake et missingCount corrects', async () => {
    const gimlet: CocktailWithIngredients = await (await ctx.app.request('/api/cocktails/gimlet')).json();
    const mule: CocktailWithIngredients   = await (await ctx.app.request('/api/cocktails/mule')).json();

    assert.equal(gimlet.canMake, true);
    assert.equal(gimlet.missingCount, 0);
    assert.equal(mule.canMake, false);
    assert.equal(mule.missingCount, 1);
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/cocktails/inexistant');
    assert.equal(res.status, 404);
  });
});

describe('POST /api/cocktails', () => {
  const newCocktail = {
    id: 'gimlet-v2', name: 'Gimlet V2', tagline: 'La version améliorée', difficulty: 1,
    time: '5 min', glass: 'Verre à cocktail', garnish: 'Zeste de lime',
    moods: ['frais', 'léger'], steps: ['Shaker', 'Filtrer', 'Servir'],
    theme: { bg: '#001510', from: '#1B4332', to: '#2ECC71', accent: '#52E08A', text: '#E8FCF0', mid: '#1A9D4A' },
    ingredients: [{ id: 'gin', amount: '5 cl' }, { id: 'lime', amount: '2.5 cl' }],
  };

  beforeEach(() => { ctx = createTestApp(); });

  it('crée un cocktail avec ses ingrédients en une transaction', async () => {
    const res = await ctx.app.request('/api/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail),
    });
    assert.equal(res.status, 201);
    const created: CocktailWithIngredients = await res.json();
    assert.equal(created.id, 'gimlet-v2');
    assert.equal(created.ingredients.length, 2);
    assert.equal(created.canMake, true);
  });

  it('retourne 400 si un champ requis manque', async () => {
    const res = await ctx.app.request('/api/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test', name: 'Test' }),
    });
    assert.equal(res.status, 400);
  });

  it('le cocktail créé apparaît dans la liste', async () => {
    await ctx.app.request('/api/cocktails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCocktail),
    });
    const list: CocktailListItem[] = await (await ctx.app.request('/api/cocktails')).json();
    assert.ok(list.some(c => c.id === 'gimlet-v2'));
  });
});

describe('PATCH /api/cocktails/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('met à jour les champs scalaires sans toucher les ingrédients', async () => {
    const res = await ctx.app.request('/api/cocktails/gimlet', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Gimlet Revisité', difficulty: 2 }),
    });
    assert.equal(res.status, 200);
    const cocktail: CocktailWithIngredients = await res.json();
    assert.equal(cocktail.name, 'Gimlet Revisité');
    assert.equal(cocktail.difficulty, 2);
    assert.equal(cocktail.ingredients.length, 2);
  });

  it('remplace intégralement les ingrédients quand fournis', async () => {
    const res = await ctx.app.request('/api/cocktails/gimlet', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: [{ id: 'gin', amount: '4 cl' }] }),
    });
    assert.equal(res.status, 200);
    const cocktail: CocktailWithIngredients = await res.json();
    assert.equal(cocktail.ingredients.length, 1);
    assert.equal(cocktail.ingredients[0].amount, '4 cl');
  });

  it('recalcule canMake après changement d\'ingrédients', async () => {
    const res = await ctx.app.request('/api/cocktails/gimlet', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: [{ id: 'gin', amount: '5 cl' }, { id: 'vodka', amount: '2 cl' }],
      }),
    });
    const cocktail: CocktailWithIngredients = await res.json();
    assert.equal(cocktail.canMake, false);
    assert.equal(cocktail.missingCount, 1);
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/cocktails/inexistant', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    assert.equal(res.status, 404);
  });
});

describe('DELETE /api/cocktails/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('supprime le cocktail et ses ingrédients en cascade', async () => {
    const res = await ctx.app.request('/api/cocktails/gimlet', { method: 'DELETE' });
    assert.equal(res.status, 204);

    const check = await ctx.app.request('/api/cocktails/gimlet');
    assert.equal(check.status, 404);

    // Vérifier la cascade sur les ingrédients
    const ings = ctx.db.prepare(
      'SELECT COUNT(*) as cnt FROM cocktail_ingredients WHERE cocktail_id = ?'
    ).get('gimlet') as { cnt: number };
    assert.equal(ings.cnt, 0);
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/cocktails/inexistant', { method: 'DELETE' });
    assert.equal(res.status, 404);
  });
});
