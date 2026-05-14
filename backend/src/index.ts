import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import bottles from './routes/bottles.js';
import cocktails from './routes/cocktails.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: '*' }));

app.route('/api/bottles', bottles);
app.route('/api/cocktails', cocktails);

app.get('/health', (c) => c.json({ status: 'ok' }));

const PORT = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`✓  Speakeasy API démarrée sur http://localhost:${PORT}`);
});
