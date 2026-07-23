# Guia de Deploy — Infinitus Digital Cursos

Este projeto tem **2 partes que se publicam separadamente na Vercel**:

1. `apps/api` — Backend NestJS + Prisma (API REST)
2. `apps/web` — Frontend Next.js

## 1. Base de dados PostgreSQL

Precisamos de um Postgres acessível pela internet. Opções gratuitas:

- Neon: https://neon.tech (recomendado, grátis, serverless Postgres)
- Supabase: https://supabase.com

Passos:
1. Cria uma conta e um novo projeto/base de dados.
2. Copia a "Connection string" (formato `postgresql://user:password@host/db?sslmode=require`).
3. Guarda esse valor — vai para a variável `DATABASE_URL`.

## 2. Deploy da API (`apps/api`)

Na Vercel:
1. "Add New Project" → importar este repositório GitHub.
2. Em "Root Directory", escolhe `apps/api`.
3. Framework Preset: Other.
4. Variáveis de ambiente:
   - `DATABASE_URL` — connection string do Neon/Supabase
   - `JWT_ACCESS_SECRET` — uma string aleatória longa (ex: gerar com `openssl rand -hex 32`)
   - `WEB_ORIGIN` — URL do frontend (preencher depois do passo 3, ex: `https://infinitus-web.vercel.app`)
5. Deploy.
6. Depois do primeiro deploy, corre as migrações Prisma uma vez (a partir do teu computador ou via Vercel CLI):
   ```
   cd apps/api
   npx prisma migrate deploy
   ```
   (precisa do `DATABASE_URL` no `.env` local apontando para a mesma base de dados)

## 3. Deploy do Frontend (`apps/web`)

Na Vercel:
1. "Add New Project" → mesmo repositório.
2. Root Directory: `apps/web`.
3. Framework Preset: Next.js (detetado automaticamente).
4. Variável de ambiente:
   - `NEXT_PUBLIC_API_URL` — URL da API + `/api`, ex: `https://infinitus-api.vercel.app/api`
5. Deploy.

## 4. Atualizar CORS

Depois de teres a URL final do frontend, volta ao projeto da API na Vercel e atualiza `WEB_ORIGIN` com essa URL, depois faz redeploy.

## 5. Testar

- Abre o frontend → Criar conta → deves cair no `/dashboard`.
- Cria um curso em "Meus Cursos".
- Confirma que aparece no dashboard e na tabela "Últimos cursos".
