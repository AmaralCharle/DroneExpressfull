import Fastify from 'fastify';
import ordersRoutes from './routes/orders';
import dronesRoutes from './routes/drones';
import pool from './db';
import cors from '@fastify/cors';

export async function buildApp() {
  const app = Fastify({ logger: true });
  // Skip CORS registration in test environment to avoid plugin startup delays
  if (process.env.NODE_ENV !== 'test') {
    await app.register(cors, { origin: true });
  }
  app.register(ordersRoutes);
  app.register(dronesRoutes);
  return app;
}

if (require.main === module) {
  (async () => {
    try {
      const app = await buildApp();
      const PORT = +(process.env.PORT || 3001);
      await app.listen({ port: PORT, host: '0.0.0.0' });
      console.log(`Orders service listening on ${PORT}`);
    } catch (err) {
      console.error('Failed to start', err);
      process.exit(1);
    }
  })();
}

process.on('SIGINT', async () => {
  try { await pool.end(); } catch {}
  process.exit(0);
});
