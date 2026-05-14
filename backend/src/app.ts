import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { DatabaseSync } from 'node:sqlite';
import { createBottlesRouter } from './routes/bottles.js';
import { createCocktailsRouter } from './routes/cocktails.js';

export function createApp(db: DatabaseSync) {
  const app = new Hono();

  app.use('*', cors({ origin: '*' }));

  app.route('/api/bottles', createBottlesRouter(db));
  app.route('/api/cocktails', createCocktailsRouter(db));

  app.get('/health', (c) => c.json({ status: 'ok' }));

  return app;
}
