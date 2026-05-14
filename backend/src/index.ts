import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import bottles from './routes/bottles.ts';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: '*' }));

app.route('/api/bottles', bottles);

app.get('/health', (c) => c.json({ status: 'ok' }));

const PORT = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`✓  Speakeasy API démarrée sur http://localhost:${PORT}`);
});
