-- Inicialização do schema do Droneexpress
-- Cria tabelas básicas: drones, orders, notifications

BEGIN;

CREATE TABLE IF NOT EXISTS drones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  battery NUMERIC NOT NULL,
  speed NUMERIC NOT NULL,
  max_load NUMERIC NOT NULL,
  status TEXT NOT NULL,
  location_x NUMERIC NOT NULL,
  location_y NUMERIC NOT NULL,
  current_order_id TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  address TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  drone_id TEXT,
  route TEXT,
  destination_x NUMERIC,
  destination_y NUMERIC
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_drone ON orders(drone_id);
CREATE INDEX IF NOT EXISTS idx_drones_status ON drones(status);

COMMIT;
