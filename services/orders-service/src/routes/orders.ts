import { FastifyInstance } from 'fastify';
import { query } from '../db';

export default async function ordersRoutes(app: FastifyInstance) {
  app.get('/orders', async () => {
    const res = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    return res.rows;
  });

  app.post('/orders', async (req, reply) => {
    const body = req.body as any;
    if (!body.customer || !body.address) {
      return reply.status(400).send({ error: 'customer and address are required' });
    }
    const id = body.id ?? `ORD-${Date.now()}`;
    const route = body.route ?? null;
    const destination_x = body.destination?.x ?? null;
    const destination_y = body.destination?.y ?? null;
    const created_at = new Date();
    await query(
      `INSERT INTO orders(id, customer, address, weight, priority, status, created_at, drone_id, route, destination_x, destination_y)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, body.customer, body.address, body.weight ?? 0, body.priority ?? 'normal', body.status ?? 'pending', created_at, body.drone_id ?? null, route, destination_x, destination_y],
    );
    const res = await query('SELECT * FROM orders WHERE id = $1', [id]);
    return res.rows[0];
  });

  app.patch('/orders/:id', async (req, reply) => {
    const id = req.params['id'] as string;
    const body = req.body as any;
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (body.status !== undefined) { fields.push(`status = $${idx++}`); values.push(body.status); }
    if (body.drone_id !== undefined) { fields.push(`drone_id = $${idx++}`); values.push(body.drone_id); }
    if (body.destination_x !== undefined) { fields.push(`destination_x = $${idx++}`); values.push(body.destination_x); }
    if (body.destination_y !== undefined) { fields.push(`destination_y = $${idx++}`); values.push(body.destination_y); }
    if (fields.length === 0) return reply.status(400).send({ error: 'no fields to update' });
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);
    const res = await query(sql, values);
    return res.rows[0];
  });
}
