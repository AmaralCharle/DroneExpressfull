import { FastifyInstance } from 'fastify';
import { query } from '../db';

export default async function dronesRoutes(app: FastifyInstance) {
  app.get('/drones', async () => {
    const res = await query('SELECT * FROM drones ORDER BY id');
    return res.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      battery: Number(r.battery),
      speed: Number(r.speed),
      max_load: Number(r.max_load),
      status: r.status,
      location: { x: Number(r.location_x), y: Number(r.location_y) },
      currentOrderId: r.current_order_id ?? null,
    }));
  });

  app.post('/drones', async (req, reply) => {
    const body = req.body as any;
    if (!body.type) return reply.status(400).send({ error: 'type is required' });
    const id = body.id ?? `DRN-${Date.now()}`;
    const name = body.name ?? `${body.type}-${id.slice(-4)}`;
    const battery = body.battery ?? 100;
    const speed = body.speed ?? 60;
    const max_load = body.maxLoad ?? 5;
    const status = body.status ?? 'idle';
    const lx = body.location?.x ?? 50;
    const ly = body.location?.y ?? 50;
    await query(`INSERT INTO drones(id,name,type,battery,speed,max_load,status,location_x,location_y,current_order_id)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [id, name, body.type, battery, speed, max_load, status, lx, ly, null]);
    const res = await query('SELECT * FROM drones WHERE id = $1', [id]);
    return res.rows[0];
  });

  app.post('/drones/:id/commands', async (req, reply) => {
    const id = req.params['id'] as string;
    const body = req.body as any;
    // For demo: support commands: takeoff, land, return
    const cmd = body.command;
    if (!cmd) return reply.status(400).send({ error: 'command required' });
    // naive: update status accordingly
    let newStatus = null;
    if (cmd === 'takeoff') newStatus = 'flying';
    else if (cmd === 'land') newStatus = 'idle';
    else if (cmd === 'return') newStatus = 'returning';
    else if (cmd === 'cancel') newStatus = 'idle';
    if (newStatus) {
      await query('UPDATE drones SET status = $1 WHERE id = $2', [newStatus, id]);
    }
    const res = await query('SELECT * FROM drones WHERE id = $1', [id]);
    return res.rows[0];
  });
}
