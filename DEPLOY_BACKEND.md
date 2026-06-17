Deploy do backend (orders-service) — passos práticos

Opção A — Render (recomendado para containers/Node):

1. Acesse https://render.com e faça login.
2. Clique em "New" → "Web Service" → Connect a repository → selecione o repositório `AmaralCharle/DroneExpressfull`.
3. Em "Root Directory" escolha `services/orders-service`.
4. Em "Environment" escolha "Docker" se quiser usar o `Dockerfile`, ou "Node" e configure `Build Command: npm ci && npm run build` e `Start Command: npm start`.
5. Configure variáveis de ambiente (Environment):
   - `DB_HOST` (ou `DATABASE_URL`) — host do Postgres
   - `DB_PORT` — 5432
   - `DB_USER` — usuário do Postgres
   - `DB_PASS` — senha
   - `DB_NAME` — nome do banco
   - `PORT` — 3001
6. Deploy: clique em "Create Service" e aguarde o build. Teste `https://<seu-service>.onrender.com/orders`.

Opção B — Railway (rápido para protótipos com Postgres integrado):

1. Acesse https://railway.app e conecte seu GitHub.
2. Crie um novo Project → Connect to Repository → selecione `services/orders-service`.
3. Adicione o plugin Postgres (Create Plugin → Postgres). Railway cria as variáveis de ambiente automaticamente (DATABASE_URL). Copie a URL de conexão.
4. Nas configurações do serviço, adicione `PORT=3001` se necessário.
5. Deploy automático: após o push o Railway irá buildar e subir. Teste a rota `/orders` na URL gerada.

Observações importantes
- CORS: configure o backend para permitir o domínio do frontend (Vercel) ou `*` durante testes.
- Banco: se usar um serviço gerenciado, execute `infra/db/init.sql` para criar a estrutura inicial (pode ser via script de inicialização ou conexão direta ao banco).
- Logs: verifique logs do serviço para diagnosticar erros de build ou runtime.

Depois de publicar o backend, copie a URL pública e coloque em `VITE_API_URL` nas Environment Variables do projeto no Vercel.
