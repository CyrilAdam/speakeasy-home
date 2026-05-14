import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createTestApp, BOTTLES } from './helpers.js';
import type { Bottle } from '../src/types.js';

// node:test crée un worker par fichier → un createTestApp() par describe suffit
// pour l'isolation, on recrée l'app avant chaque test

let ctx: ReturnType<typeof createTestApp>;

describe('GET /api/bottles', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('retourne toutes les bouteilles', async () => {
    const res = await ctx.app.request('/api/bottles');
    assert.equal(res.status, 200);
    const bottles: Bottle[] = await res.json();
    assert.equal(bottles.length, Object.keys(BOTTLES).length);
    assert.ok(bottles.every(b => typeof b.id === 'string'));
  });

  it('désérialise owned/pantry en booléens', async () => {
    const res = await ctx.app.request('/api/bottles');
    const bottles: Bottle[] = await res.json();

    const gin = bottles.find(b => b.id === 'gin')!;
    assert.equal(gin.owned, true);
    assert.equal(gin.pantry, false);

    const lime = bottles.find(b => b.id === 'lime')!;
    assert.equal(lime.owned, true);
    assert.equal(lime.pantry, true);

    const vodka = bottles.find(b => b.id === 'vodka')!;
    assert.equal(vodka.owned, false);
  });
});

describe('GET /api/bottles/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('retourne la bouteille demandée', async () => {
    const res = await ctx.app.request('/api/bottles/gin');
    assert.equal(res.status, 200);
    const bottle: Bottle = await res.json();
    assert.equal(bottle.id, 'gin');
    assert.equal(bottle.name, 'Gin');
    assert.equal(bottle.owned, true);
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/bottles/inexistant');
    assert.equal(res.status, 404);
  });
});

describe('POST /api/bottles', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('crée une nouvelle bouteille', async () => {
    const res = await ctx.app.request('/api/bottles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'rhum', name: 'Rhum Blanc', category: 'Rhum', color: '#F5E6C8', owned: false }),
    });
    assert.equal(res.status, 201);
    const bottle: Bottle = await res.json();
    assert.equal(bottle.id, 'rhum');
    assert.equal(bottle.owned, false);
    assert.equal(bottle.pantry, false);
  });

  it('retourne 400 si un champ requis manque', async () => {
    const res = await ctx.app.request('/api/bottles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'rhum', name: 'Rhum' }),
    });
    assert.equal(res.status, 400);
  });
});

describe('PATCH /api/bottles/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('met à jour le statut owned', async () => {
    const res = await ctx.app.request('/api/bottles/vodka', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owned: true }),
    });
    assert.equal(res.status, 200);
    const bottle: Bottle = await res.json();
    assert.equal(bottle.owned, true);
  });

  it('met à jour plusieurs champs à la fois', async () => {
    const res = await ctx.app.request('/api/bottles/gin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Gin Hendricks', color: '#AABBCC' }),
    });
    assert.equal(res.status, 200);
    const bottle: Bottle = await res.json();
    assert.equal(bottle.name, 'Gin Hendricks');
    assert.equal(bottle.color, '#AABBCC');
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/bottles/inexistant', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owned: true }),
    });
    assert.equal(res.status, 404);
  });

  it('retourne 400 si aucun champ fourni', async () => {
    const res = await ctx.app.request('/api/bottles/gin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
  });
});

describe('DELETE /api/bottles/:id', () => {
  beforeEach(() => { ctx = createTestApp(); });

  it('supprime une bouteille non utilisée', async () => {
    // sirop n'est utilisé dans aucun cocktail de test
    const res = await ctx.app.request('/api/bottles/sirop', { method: 'DELETE' });
    assert.equal(res.status, 204);
    const check = await ctx.app.request('/api/bottles/sirop');
    assert.equal(check.status, 404);
  });

  it('retourne 409 si la bouteille est utilisée dans une recette', async () => {
    // gin est utilisé dans gimlet
    const res = await ctx.app.request('/api/bottles/gin', { method: 'DELETE' });
    assert.equal(res.status, 409);
    const body: { error: string } = await res.json();
    assert.match(body.error, /recette/);
  });

  it('retourne 404 pour un id inconnu', async () => {
    const res = await ctx.app.request('/api/bottles/inexistant', { method: 'DELETE' });
    assert.equal(res.status, 404);
  });
});
