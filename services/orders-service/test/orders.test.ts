import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db', () => ({ query: vi.fn() }));
vi.mock('@fastify/cors', () => ({ default: () => async () => {} }));
import { query } from '../src/db';
import { buildApp } from '../src/index';

beforeEach(() => {
  (query as any).mockReset();
});

describe('orders routes', () => {
  it('GET /orders returns list', async () => {
    const rows = [
      { id: 'ORD-0001', customer: 'Ana', address: 'Rua A', weight: 1.5, priority: 'normal', status: 'pending', created_at: new Date().toISOString() },
    ];
    (query as any).mockResolvedValueOnce({ rows });

      const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/orders' });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toEqual(rows);
  });

  it('POST /orders creates and returns order', async () => {
    const newOrder = { id: 'ORD-9999', customer: 'Bruno', address: 'Rua B', weight: 2, priority: 'high', status: 'pending', created_at: new Date().toISOString() };
    // first call = insert, we return empty; second call = select returning the created row
    (query as any).mockResolvedValueOnce({});
    (query as any).mockResolvedValueOnce({ rows: [newOrder] });

      const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/orders', payload: { customer: newOrder.customer, address: newOrder.address, weight: newOrder.weight, priority: newOrder.priority } });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload).toEqual(newOrder);
  });
});
