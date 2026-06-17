# Deploy rápido

Este documento descreve passos mínimos para publicar o projeto.

Frontend (Vercel)
- Conecte o repositório GitHub no Vercel (https://vercel.com).
- Import project → selecione `DroneExpressfull`.
- Build command: `npm run build` (ou `vite build`).
- Output dir: `dist` (ajuste conforme seu `package.json`).

Backend (orders-service) — Render (Docker) ou Railway
- Render: New → Web Service → Connect GitHub → apontar para `services/orders-service`.
  - Use Dockerfile existente (`services/orders-service/Dockerfile`) ou escolha `Node` and run `npm start`.
- Railway: Create new project → add Postgres plugin → create Service (from GitHub) → apontar para `services/orders-service`.

Banco de dados
- Provisionar Postgres via Railway/Render ou usar Managed Postgres.
- Ajustar `DATABASE_URL` nas variáveis de ambiente do serviço backend.

Variáveis de ambiente necessárias (exemplo)
- `DATABASE_URL=postgres://user:pass@host:5432/dbname`
- `PORT=3001`

Observações
- Vercel funciona melhor para frontend SPAs. Para backend em Docker, Render/Railway são mais diretos.
- Depois de publicar, cole aqui os links que eu testo rapidamente.
