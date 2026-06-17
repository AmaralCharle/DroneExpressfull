import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db', () => ({ query: vi.fn() }));
vi.mock('@fastify/cors', () => ({ default: () => async () => {} }));
import { query } from '../src/db';
import { buildApp } from '../src/index';

beforeEach(() => { (query as any).mockReset(); });

describe('drones routes', () => {
  it('GET /drones returns list mapped', async () => {
    const rows = [
      { id: 'DRN-0001', name: 'Alpha', type: 'light', battery: '80', speed: '60', max_load: '2', status: 'idle', location_x: '50', location_y: '50', current_order_id: null },
    ];
    (query as any).mockResolvedValueOnce({ rows });
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/drones' });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload[0].id).toBe('DRN-0001');
    expect(payload[0].battery).toBe(80);
    expect(payload[0].location).toEqual({ x: 50, y: 50 });
  });

  it('POST /drones returns 400 when missing type', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/drones', payload: { name: 'NoType' } });
    expect(res.statusCode).toBe(400);
  });

  it('POST /drones inserts and returns created drone', async () => {
    const created = { id: 'DRN-9999', name: 'Beta', type: 'fast', battery: '88', speed: '70', max_load: '3', status: 'idle', location_x: '50', location_y: '50', current_order_id: null };
    (query as any).mockResolvedValueOnce({}); // insert
    (query as any).mockResolvedValueOnce({ rows: [created] }); // select
    const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/drones', payload: { type: 'fast', name: 'Beta' } });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload.id).toBe(created.id);
    expect(payload.type).toBe('fast');
  });

  it('POST /drones/:id/commands returns updated drone', async () => {
    const updated = { id: 'DRN-0001', status: 'flying', location_x: '50', location_y: '50' };
    (query as any).mockResolvedValueOnce({}); // update
    (query as any).mockResolvedValueOnce({ rows: [updated] }); // select
    const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/drones/DRN-0001/commands', payload: { command: 'takeoff' } });
    expect(res.statusCode).toBe(200);
    const payload = JSON.parse(res.payload);
    expect(payload.status).toBe('flying');
  });
});
