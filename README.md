# DroneExpress — Entrega Acadêmica

Resumo rápido
- Projeto demonstrativo de um sistema de despacho de entregas por drones. Contém uma interface frontend (Vite + React) e um microserviço `orders-service` (Fastify + Postgres) para persistência.

Requisitos cobridos e mapeamento
- Descrição do problema: documentação em [ARCHITECTURE.md](ARCHITECTURE.md).
- Microserviços: `services/orders-service` (API de orders & drones). Frontend em `src/`.
- Arquitetura Limpa e justificativa: [ARCHITECTURE.md](ARCHITECTURE.md).
- Princípios SOLID & Clean Code: aplicado nas camadas do serviço e no `ControlCenter` (veja comentários em `src/lib/patterns/ControlCenter.ts`).
- Design Patterns (mín. 4): Singleton, Factory, Strategy, Observer, Command — mapeados em `src/lib/patterns/`.
- Testes TDD: unit tests em `services/orders-service/test` (Vitest). E2E: `tests/e2e` (Playwright).
- BDD: cenários comportamentais (integração via Playwright) — ver `tests/e2e`.
- Docker / Docker Compose: `docker-compose.yml` + `infra/db/init.sql` (Postgres init).
- Deploy: orientações em `ARCHITECTURE.md` → sugestões Render/Railway/Heroku.
- Deploy: orientações em `ARCHITECTURE.md` → sugestões Render/Railway/Heroku.

CI Badge

![CI](https://github.com/AmaralCharle/DroneExpressfull/actions/workflows/ci.yml/badge.svg)

Como rodar localmente

1. Subir infra com Docker Compose (Postgres + orders-service):

```bash
docker-compose up --build -d
```

2. Rodar frontend em dev (Vite):

```bash
npm install
npm run dev
# aberto em http://localhost:8081
```

3. Rodar testes unitários do serviço (opcional):

```bash
cd services/orders-service
npm install
npx vitest run
```

4. Rodar testes E2E (Playwright):

```bash
npm install
npx playwright test
```

Arquivos importantes
- Frontend: [src/](src/)
- Componente central: [src/lib/patterns/ControlCenter.ts](src/lib/patterns/ControlCenter.ts)
- Adapter API (frontend): [src/lib/infra/ordersApi.ts](src/lib/infra/ordersApi.ts)
- Orders UI: [src/components/drone/OrdersModal.tsx](src/components/drone/OrdersModal.tsx) e [src/routes/orders.tsx](src/routes/orders.tsx)
- Orders service: [services/orders-service](services/orders-service)
- Docker compose: [docker-compose.yml](docker-compose.yml)

Checklist de evidências
- Logs e exemplos de requests nos terminais (uso durante o desenvolvimento).
- Testes unitários e E2E incluídos e executados localmente.

Próximos passos sugeridos
- Adicionar CI (GitHub Actions) para rodar lints, unit tests e E2E.
- Publicar o serviço (p.ex. Render ou Railway) e colocar link aqui.

Contato
- Este repositório foi preparado para entrega acadêmica; se quiser, eu prossigo com CI e deploy.
