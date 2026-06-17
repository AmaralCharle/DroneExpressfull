// Lightweight mock API to serve orders/drones when backend is unreachable
(function(){
  const sampleOrders = [
    { id: 'ORD-1001', customer: 'Aluno Teste', address: 'Rua Exemplo 123', weight: 1.2, priority: 'normal', status: 'pending', created_at: new Date().toISOString() }
  ];
  const sampleDrones = [
    { id: 'DR-1', name: 'Drone A', type: 'small', battery: 87, speed: 12, max_load: 2, status: 'idle', location_x: 0, location_y: 0 }
  ];

  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(input, init){
    try{
      const url = typeof input === 'string' ? input : input.url;
      // intercept orders/drones endpoints
      if(/\/orders(\/|$)/.test(url)){
        if((init && init.method && init.method.toUpperCase()!=='GET')){
          // For POST/PATCH, return a created/updated sample
          return new Response(JSON.stringify(sampleOrders[0]), { status: 201, headers: {'Content-Type':'application/json'} });
        }
        return new Response(JSON.stringify(sampleOrders), { status: 200, headers: {'Content-Type':'application/json'} });
      }
      if(/\/drones(\/|$)/.test(url)){
        return new Response(JSON.stringify(sampleDrones), { status: 200, headers: {'Content-Type':'application/json'} });
      }
      // respond to GraphQL host with an empty data object to avoid null .data errors
      if(url.includes('bff.prod.coingoback.com')){
        // if GraphQL endpoint
        if(url.includes('/graphql')){
          return new Response(JSON.stringify({ data: {} }), { status: 200, headers: {'Content-Type':'application/json'} });
        }
        return new Response(null, { status: 204 });
      }
    }catch(e){
      console.error('mock-api error', e);
    }
    return originalFetch(input, init);
  };
})();
