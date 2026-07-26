/**
 * Rattache à chaque cocktail ses deux visuels.
 *
 * Les images sont servies par le frontend depuis `frontend/public/cocktails/`,
 * que Vite recopie tel quel dans `dist/` — le même dossier que le déploiement
 * rsync sur le VPS. On stocke donc un chemin local et non une URL externe :
 * l'affichage est instantané et ne dépend pas d'un service tiers.
 *
 * Convention de nommage : <id>-scene.jpg (fond héro, 390×260) et
 * <id>-glass.jpg (verre détouré sur fond noir, 300×420).
 *
 * La liste est explicite plutôt qu'un UPDATE global : un cocktail créé depuis
 * l'app garde ses propres visuels, on ne lui invente pas un fichier absent.
 */

import type { DatabaseSync } from '../client.js';

const ILLUSTRES = [
  'americano', 'amaretto-sour', 'amaretto-sour-morgenthaler', 'bees-knees',
  'bijou', 'boulevardier', 'caipirinha', 'clover-club', 'daiquiri',
  'espresso-martini', 'gimlet', 'gin-basil-smash', 'gin-tonic', 'john-collins',
  'last-word', 'london-mule', 'manhattan', 'margarita', 'margarita-givree',
  'martini', 'martini-50-50', 'mojito', 'moscow-mule', 'negroni',
  'old-fashioned', 'paper-plane', 'pina-colada', 'pornstar-martini',
  'red-lion', 'reverse-manhattan', 'reverse-martini', 'rhum-daisy',
  'spritz', 'ti-punch', 'tom-collins', 'whisky-sour',
];

export function seed(db: DatabaseSync) {
  const update = db.prepare(`
    UPDATE cocktails
       SET scene_url = ?, glass_url = ?
     WHERE id = ?
  `);

  for (const id of ILLUSTRES) {
    update.run(`/cocktails/${id}-scene.jpg`, `/cocktails/${id}-glass.jpg`, id);
  }
}
