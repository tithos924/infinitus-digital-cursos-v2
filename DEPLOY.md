# Guia de Deploy — Infinitus Digital Cursos

Este projeto tem **2 partes com hospedagem diferente**:

1. `apps/api` — Backend NestJS + Prisma → **Render.com** (servidor Node normal, "sempre ligado")
2. `apps/web` — Frontend Next.js → **Vercel**

(A API não fica bem na Vercel porque a Vercel só corre funções serverless isoladas, o que não combina com um servidor NestJS tradicional.)

## 1. Base de dados PostgreSQL

Já configurado com o Neon (https://neon.tech). A connection string vai na variável `DATABASE_URL`.

## 2. Deploy da API no Render

1. Cria conta em https://render.com (podes usar login do GitHub).
2. "New" → "Web Service" → escolhe o repositório `infinitus-digital-cursos-v2`.
3. Root Directory: `apps/api`
4. Runtime: Node
5. Build Command: `npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build`
6. Start Command: `npm run start:prod`
7. Plano: Free
8. Variáveis de ambiente:
   - `DATABASE_URL` — connection string do Neon
   - `JWT_ACCESS_SECRET` — string aleatória longa
   - `WEB_ORIGIN` — URL do site na Vercel (atualizar depois do passo 3)
9. Cria o serviço. O Render vai buildar e o teu primeiro deploy demora ~3-5 min.
10. Copia o URL final (algo como `https://infinitus-digital-cursos-api.onrender.com`).

Nota: no plano free do Render, o servidor "adormece" após 15 min sem uso e demora ~30s a acordar no primeiro pedido — normal, não é erro.

## 3. Deploy do Frontend na Vercel

1. "Add New Project" → mesmo repositório.
2. Root Directory: `apps/web`
3. Framework: Next.js (automático)
4. Variável de ambiente:
   - `NEXT_PUBLIC_API_URL` — URL da API do Render + `/api`, ex: `https://infinitus-digital-cursos-api.onrender.com/api`
5. Deploy.

## 4. Atualizar CORS

Depois de teres o URL final do site, volta ao Render → o teu serviço → Environment → atualiza `WEB_ORIGIN` com esse URL → guarda (o Render reinicia sozinho).

## 5. Testar

- Abre o site → Criar conta → deves cair no `/dashboard`.
- Cria um curso em "Meus Cursos".
- Confirma que aparece no dashboard e na tabela "Últimos cursos".
