import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import db from './db/client.js';
import { createApp } from './app.js';

const app = createApp(db);
app.use('*', logger());

const PORT = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`✓  Speakeasy API démarrée sur http://localhost:${PORT}`);
});
