import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db', () => ({ query: vi.fn() }));
vi.mock('@fastify/cors', () => ({ default: () => async () => {} }));
import { query } from '../src/db';
import { buildApp } from '../src/index';

beforeEach(() => { (query as any).mockReset(); });

describe('orders patch route', () => {
  it('PATCH /orders/:id updates fields and returns updated', async () => {
    const updated = { id: 'ORD-1234', customer: 'Test', address: 'R', weight: '1.0', priority: 'normal', status: 'delivered', created_at: new Date().toISOString(), drone_id: null };
    (query as any).mockResolvedValueOnce({ rows: [updated] });
    const app = await buildApp();
    const res = await app.inject({ method: 'PATCH', url: '/orders/ORD-1234', payload: { status: 'delivered' } });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload.status).toBe('delivered');
  });

  it('PATCH /orders/:id returns 400 when no fields provided', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'PATCH', url: '/orders/ORD-0000', payload: {} });
    expect(res.statusCode).toBe(400);
  });
});
