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

describe('Génériques et marques', () => {
  beforeEach(() => { ctx = createTestApp(); });

  /** Rattache deux gins de marque au générique `gin`, qui n'est plus possédé en propre. */
  const setupGins = () => {
    ctx.db.exec(`
      UPDATE bottles SET owned = 0 WHERE id = 'gin';
      INSERT INTO bottles (id, name, category, color, owned, pantry, generic_id)
      VALUES ('tanqueray', 'Tanqueray', 'Gin', '#1F7A4D', 1, 0, 'gin'),
             ('citadelle', 'Citadelle', 'Gin', '#7FC4CE', 1, 0, 'gin');
    `);
  };

  const getBottle = async (id: string): Promise<Bottle> =>
    (await ctx.app.request(`/api/bottles/${id}`)).json();

  it('un générique est possédé dès qu\'une de ses marques l\'est', async () => {
    setupGins();
    const gin = await getBottle('gin');
    assert.equal(gin.owned, true);
    assert.equal(gin.variantCount, 2);
  });

  it('décocher une marque ne suffit pas si une autre reste', async () => {
    setupGins();
    await ctx.app.request('/api/bottles/tanqueray', {
      method: 'PATCH', body: JSON.stringify({ owned: false }),
    });
    assert.equal((await getBottle('gin')).owned, true);
  });

  it('le générique retombe indisponible quand toutes ses marques le sont', async () => {
    setupGins();
    for (const id of ['tanqueray', 'citadelle']) {
      await ctx.app.request(`/api/bottles/${id}`, {
        method: 'PATCH', body: JSON.stringify({ owned: false }),
      });
    }
    assert.equal((await getBottle('gin')).owned, false);
  });

  it('la faisabilité d\'un cocktail suit la possession effective', async () => {
    setupGins();
    // gimlet cite le générique `gin` : il reste réalisable via les marques
    const before = await (await ctx.app.request('/api/cocktails/gimlet')).json() as { canMake: boolean };
    assert.equal(before.canMake, true);

    ctx.db.exec(`UPDATE bottles SET owned = 0 WHERE generic_id = 'gin'`);
    const after = await (await ctx.app.request('/api/cocktails/gimlet')).json() as { canMake: boolean };
    assert.equal(after.canMake, false);
  });

  it('POST rattache une marque à son générique', async () => {
    const res = await ctx.app.request('/api/bottles', {
      method: 'POST',
      body: JSON.stringify({ id: 'hendricks', name: "Hendrick's", category: 'Gin', color: '#2E5E4E', owned: true, genericId: 'gin' }),
    });
    assert.equal(res.status, 201);
    const created: Bottle = await res.json();
    assert.equal(created.genericId, 'gin');
    assert.equal((await getBottle('gin')).variantCount, 1);
  });

  it('POST refuse un générique inconnu', async () => {
    const res = await ctx.app.request('/api/bottles', {
      method: 'POST',
      body: JSON.stringify({ id: 'x', name: 'X', category: 'Gin', color: '#000', owned: true, genericId: 'fantome' }),
    });
    assert.equal(res.status, 400);
  });

  it('PATCH refuse qu\'une bouteille soit son propre générique', async () => {
    const res = await ctx.app.request('/api/bottles/vodka', {
      method: 'PATCH', body: JSON.stringify({ genericId: 'vodka' }),
    });
    assert.equal(res.status, 400);
  });

  it('DELETE refuse de supprimer un générique qui a des marques', async () => {
    ctx.db.exec(`
      INSERT INTO bottles (id, name, category, color, owned, pantry, generic_id)
      VALUES ('absolut', 'Absolut', 'Vodka', '#90CAF9', 1, 0, 'vodka')
    `);
    // vodka n'est utilisée que dans `mule` → on retire d'abord la contrainte recette
    ctx.db.exec(`DELETE FROM cocktail_ingredients WHERE bottle_id = 'vodka'`);
    const res = await ctx.app.request('/api/bottles/vodka', { method: 'DELETE' });
    assert.equal(res.status, 409);
    const body: { error: string } = await res.json();
    assert.match(body.error, /rattachée/);
  });
});
