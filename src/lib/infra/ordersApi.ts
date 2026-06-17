const BASE = (import.meta.env?.VITE_ORDERS_API as string) ?? 'http://localhost:3001';

export async function fetchOrders() {
  try {
    const res = await fetch(`${BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('ordersApi.fetchOrders', err);
    return [];
  }
}

export async function createOrderApi(payload: any) {
  try {
    const res = await fetch(`${BASE}/orders`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
  } catch (err) {
    console.error('ordersApi.createOrder', err);
    throw err;
  }
}

export async function updateOrderApi(id: string, payload: any) {
  const res = await fetch(`${BASE}/orders/${id}`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return await res.json();
}

export async function fetchDrones() {
  const res = await fetch(`${BASE}/drones`);
  if (!res.ok) throw new Error('Failed to fetch drones');
  return await res.json();
}

export async function createDroneApi(payload: any) {
  const res = await fetch(`${BASE}/drones`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create drone');
  return await res.json();
}

export async function sendDroneCommandApi(id: string, payload: any) {
  const res = await fetch(`${BASE}/drones/${id}/commands`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send command');
  return await res.json();
}
