import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: +(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'drone_user',
  password: process.env.DB_PASS || 'drone_pass',
  database: process.env.DB_NAME || 'drone_db',
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export default pool;
