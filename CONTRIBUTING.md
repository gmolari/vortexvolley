# Guia do Desenvolvedor — Vortex Volley

Documentação técnica completa para desenvolvedores que vão trabalhar no projeto.

---

## Índice

1. [Arquitetura](#arquitetura)
2. [Setup do Ambiente](#setup-do-ambiente)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Banco de Dados](#banco-de-dados)
5. [Autenticação](#autenticação)
6. [Padrões de Código](#padrões-de-código)
7. [Camada de Serviços](#camada-de-serviços)
8. [Hooks (React Query)](#hooks-react-query)
9. [Stores (Zustand)](#stores-zustand)
10. [Validação (Zod)](#validação-zod)
11. [Componentes UI](#componentes-ui)
12. [Sistema de Temas](#sistema-de-temas)
13. [Landing Page Dinâmica](#landing-page-dinâmica)
14. [Sistema de Pedidos](#sistema-de-pedidos)
15. [Email](#email)
16. [Audit Logs](#audit-logs)
17. [CopFacil (Campeonatos)](#copafacil-campeonatos)
18. [Receitas Comuns](#receitas-comuns)

---

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│                                                  │
│  Pages (App Router)                              │
│    ├── (public)/ → SSR pages                     │
│    └── admin/    → Client pages + Server layout  │
│                                                  │
│  Components                                      │
│    ├── ui/       → Primitivos reutilizáveis      │
│    ├── layout/   → Header, Footer, Sidebar       │
│    ├── landing/  → Seções da LP                  │
│    └── providers/→ Session, Query, Theme         │
│                                                  │
│  State                                           │
│    ├── React Query (server state)                │
│    └── Zustand (client state)                    │
├─────────────────────────────────────────────────┤
│                    BACKEND                       │
│                                                  │
│  Server Actions ("use server")                   │
│    ├── lib/services/  → Lógica de negócio + DB   │
│    └── lib/actions/   → Wrappers para client     │
│                                                  │
│  Auth (NextAuth v5)                              │
│    ├── Credentials provider                      │
│    ├── JWT strategy                              │
│    └── Middleware → /admin/*                      │
│                                                  │
│  Database (Drizzle ORM + PostgreSQL)             │
│    ├── drizzle/schema/  → Tabelas e relações     │
│    └── drizzle/migrations/ → Migrações           │
└─────────────────────────────────────────────────┘
```

### Princípios

1. **Server Actions como API** — Não há API routes customizadas. Toda comunicação com o banco passa por server actions (`"use server"`).
2. **Separação client/server** — Hooks React Query chamam server actions. Nunca importe `db` ou módulos Node em componentes `"use client"`.
3. **Validação na borda** — Zod valida entrada do usuário nos formulários. Serviços confiam nos dados recebidos.
4. **Audit por padrão** — Operações de mutação logam no `audit_logs` automaticamente.

---

## Setup do Ambiente

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20 LTS)
- **PostgreSQL** 13+ (recomendado: [Neon](https://neon.tech) serverless)
- **npm** (lockfile: `package-lock.json`)

### Instalação

```bash
git clone <repo-url>
cd vortexvolley
npm install
cp .env.example .env
```

### Variáveis de Ambiente

```env
# ═══ OBRIGATÓRIAS ═══
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
NEXTAUTH_SECRET=gerar-com-openssl-rand-base64-32

# ═══ OPCIONAIS ═══
NEXTAUTH_URL=http://localhost:3000          # Necessário em produção
SMTP_HOST=smtp.gmail.com                     # Para envio de emails
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=senha-de-app-google
COPAFACIL_API_KEY=chave-api-copafacil       # Para integração de campeonatos
```

As variáveis são validadas em `config/env.ts` com Zod. O build falha se as obrigatórias não existirem.

### Banco de Dados

```bash
# Aplicar migrações existentes
npx drizzle-kit migrate

# Visualizar dados (GUI)
npx drizzle-kit studio

# Após alterar schema: gerar nova migração
npx drizzle-kit generate

# Aplicar nova migração
npx drizzle-kit migrate
```

### Criar Usuário Admin

Via Drizzle Studio ou script:

```bash
node -e "require('bcryptjs').hash('suasenha', 10).then(h => console.log(h))"
```

Insira no banco:

```sql
INSERT INTO users (id, username, password, first_name, last_name, role)
VALUES (gen_random_uuid(), 'admin', '<hash-bcrypt>', 'Admin', 'User', 'OWNER');
```

### Executar

```bash
npm run dev          # Dev com hot reload (localhost:3000)
npm run build        # Build de produção
npm start            # Servidor de produção
npm run lint         # ESLint
```

---

## Estrutura de Pastas

```
vortexvolley/
├── config/
│   └── env.ts                          # Validação de env vars (Zod)
│
├── drizzle/
│   ├── schema/                         # Definição de tabelas
│   │   ├── enums/                      # pgEnum definitions
│   │   │   ├── user-role.ts            # MEMBER, ADMIN, OWNER
│   │   │   ├── field-type.enum.ts      # TEXT, NUMBER, SELECT...
│   │   │   ├── sale-item-status.enum.ts# ACTIVE, INACTIVE, EXPIRED, NEAR, DRAFT
│   │   │   ├── order-status.enum.ts    # PENDING, CONFIRMED, DELIVERED, CANCELLED
│   │   │   ├── section-layout.enum.ts  # CAROUSEL, GRID, HIGHLIGHT, BANNER, TEXT
│   │   │   └── section-status.enum.ts  # ACTIVE, INACTIVE, DRAFT
│   │   ├── user.ts
│   │   ├── address.ts
│   │   ├── sale-item.ts
│   │   ├── sale-item-image.ts
│   │   ├── sale-item-field.ts
│   │   ├── sale-item-field-option.ts
│   │   ├── order.ts
│   │   ├── order-value.ts
│   │   ├── landing-section.ts
│   │   ├── landing-item.ts
│   │   ├── tournament.ts
│   │   ├── audit-log.ts
│   │   ├── site-settings.ts
│   │   └── index.ts                    # Re-exporta tudo
│   └── migrations/                     # Migrações SQL geradas
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout (providers, fonts, metadata)
│   │   ├── (public)/                   # Rotas públicas
│   │   │   ├── layout.tsx              # Header + Footer
│   │   │   ├── page.tsx                # Homepage / Landing
│   │   │   └── loja/
│   │   │       ├── page.tsx            # Catálogo
│   │   │       └── [slug]/
│   │   │           ├── page.tsx        # Detalhe do item (SSR)
│   │   │           └── order-form.tsx  # Formulário de pedido (client)
│   │   ├── admin/                      # Painel admin (protegido)
│   │   │   ├── layout.tsx              # Auth guard + sidebar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── itens/
│   │   │   │   ├── page.tsx            # Listagem
│   │   │   │   ├── novo/page.tsx       # Criação (com imagens e campos inline)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # Edição (tabs)
│   │   │   │       ├── preview/page.tsx# Preview público
│   │   │   │       └── components/     # InfoTab, ImagesTab, FieldsTab, OrdersTab
│   │   │   ├── pedidos/
│   │   │   │   ├── page.tsx            # Listagem com filtros e export
│   │   │   │   └── [id]/page.tsx       # Detalhe + status + delete
│   │   │   ├── landing/
│   │   │   │   ├── page.tsx            # Editor de seções
│   │   │   │   └── components/         # SectionForm, ItemForm
│   │   │   ├── campeonatos/page.tsx    # CRUD torneios (desativado no sidebar)
│   │   │   ├── configuracoes/page.tsx  # Settings
│   │   │   └── logs/page.tsx           # Audit logs
│   │   ├── api/auth/[...nextauth]/     # NextAuth route handler
│   │   └── login/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                         # ~25 componentes primitivos
│   │   ├── layout/                     # Header, Footer, AdminSidebar, AdminHeader
│   │   ├── providers/                  # Session, Query, Theme
│   │   └── landing/                    # Seções dinâmicas da LP
│   │       └── dynamic-section/        # Carousel, Grid, Highlight, Banner
│   │
│   ├── lib/
│   │   ├── auth/index.ts              # NextAuth config
│   │   ├── db/index.ts                # Drizzle client (postgres driver)
│   │   ├── services/                   # Server actions ("use server")
│   │   │   ├── sale-item.service.ts    # CRUD itens + imagens + campos
│   │   │   ├── order.service.ts        # CRUD pedidos + export
│   │   │   ├── landing.service.ts      # CRUD seções + itens da LP
│   │   │   ├── email.service.ts        # Nodemailer
│   │   │   ├── audit-log.service.ts    # Logging
│   │   │   ├── user.service.ts         # CRUD usuários
│   │   │   ├── settings.service.ts     # Key-value settings
│   │   │   ├── copafacil.service.ts    # API CopFacil
│   │   │   └── tournament.service.ts   # CRUD torneios
│   │   ├── actions/                    # Server actions extras (wrappers)
│   │   ├── hooks/                      # React Query hooks
│   │   ├── stores/                     # Zustand stores
│   │   ├── validators/                 # Zod schemas
│   │   └── utils/                      # cn(), slugify(), etc.
│   │
│   ├── types/                          # TypeScript types
│   │   ├── next-auth.d.ts             # Session augmentation
│   │   ├── sale-item.ts
│   │   ├── order.ts
│   │   ├── landing.ts
│   │   └── copafacil.ts
│   │
│   └── styles/
│       └── globals.css                 # Design tokens (oklch) + tema dark
│
├── drizzle.config.ts                   # Drizzle Kit config
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Banco de Dados

### Diagrama de Relações

```
users ─────────────┐
  │                │
  └─ addresses     │
                   │
sale_items ────────┤
  ├─ sale_item_images
  ├─ sale_item_fields
  │    └─ sale_item_field_options
  ├─ orders
  │    └─ order_values ──→ sale_item_fields
  └─ landing_items
       └─ landing_sections

tournaments (standalone)
audit_logs ──→ users
site_settings (standalone, key-value)
```

### Enums do PostgreSQL

| Enum | Valores |
|---|---|
| `user_role` | MEMBER, ADMIN, OWNER |
| `field_type` | TEXT, NUMBER, SELECT, CHECKBOX, TEXTAREA, EMAIL, PHONE, SIZE |
| `sale_item_status` | ACTIVE, INACTIVE, EXPIRED, NEAR, DRAFT |
| `order_status` | PENDING, CONFIRMED, DELIVERED, CANCELLED |
| `section_layout` | CAROUSEL, GRID, HIGHLIGHT, BANNER, TEXT |
| `section_status` | ACTIVE, INACTIVE, DRAFT |

### Convenções

- **IDs**: UUID v4 (`defaultRandom()`)
- **Timestamps**: `createdAt` (auto) + `updatedAt` (manual no update)
- **Soft delete**: Não utilizado — deletes são permanentes
- **Cascade**: `onDelete: "cascade"` para relações filhas, `"set null"` para referências opcionais

### Adicionar Nova Tabela

1. Criar arquivo em `drizzle/schema/nova-tabela.ts`
2. Definir a tabela com `pgTable()` e relações com `relations()`
3. Exportar no `drizzle/schema/index.ts`
4. Gerar migração: `npx drizzle-kit generate`
5. Aplicar: `npx drizzle-kit migrate`

---

## Autenticação

### Configuração

**Arquivo**: `src/lib/auth/index.ts`

```typescript
// Provider: Credentials (username + password bcrypt)
// Strategy: JWT (30 dias)
// Protected: /admin/* via middleware
// Roles: MEMBER, ADMIN, OWNER
```

### Session Type

```typescript
// src/types/next-auth.d.ts
interface Session {
  user: {
    id: string;
    name: string;
    email: string;     // = username
    role: string;      // MEMBER | ADMIN | OWNER
  }
}
```

### Uso no Servidor

```typescript
import { auth } from "@/lib/auth";

const session = await auth();
session?.user.id       // UUID do usuário
session?.user.name     // "Nome Sobrenome"
session?.user.role     // "ADMIN" | "OWNER"
```

### Proteção de Rotas

O `src/app/admin/layout.tsx` verifica a sessão e redireciona para `/login` se o usuário não for ADMIN ou OWNER.

O `src/middleware.ts` aplica o middleware do NextAuth em todas as rotas `/admin/*`.

---

## Padrões de Código

### Server Actions vs API Routes

**Não usamos API routes.** Toda comunicação client→server passa por server actions:

```typescript
// ✅ CORRETO — Server action
// src/lib/services/meu.service.ts
"use server";
import { db } from "@/lib/db";

export async function getMeusDados() {
  return db.query.minhaTabela.findMany();
}

// ✅ CORRETO — Hook chama server action
// src/lib/hooks/use-meus-dados.ts
import { getMeusDados } from "@/lib/services/meu.service";

export function useMeusDados() {
  return useQuery({ queryKey: ["meus-dados"], queryFn: getMeusDados });
}
```

```typescript
// ❌ ERRADO — Importar db em componente client
"use client";
import { db } from "@/lib/db"; // ERRO: fs, net, tls not found
```

### Quando usar `lib/actions/` vs `lib/services/`

- **services/** → Contém a lógica de negócio real. Marcados com `"use server"`. Podem ser importados tanto de server components quanto de hooks.
- **actions/** → Wrappers finos quando um serviço importa módulos que causam problemas de bundling no client. Exemplo: o serviço do CopFacil faz `fetch` externo e é encapsulado em uma action.

### Importações

```typescript
// Path alias configurado no tsconfig
import { db } from "@/lib/db";
import { Button } from "@/components/ui";
import { orders } from "@/../drizzle/schema";  // Nota: drizzle/ está fora do src/
```

---

## Camada de Serviços

Todos os serviços ficam em `src/lib/services/` com a diretiva `"use server"`.

### Estrutura de um Serviço

```typescript
"use server";

import { db } from "@/lib/db";
import { minhaTabela } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";
import { createAuditLog } from "./audit-log.service";
import { auth } from "@/lib/auth";

// Leitura — sem audit
export async function getItems() {
  return db.query.minhaTabela.findMany();
}

// Mutação — com audit
export async function createItem(data: { name: string }) {
  const [item] = await db.insert(minhaTabela).values(data).returning();

  // Audit log (não bloqueia)
  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "CREATE",
      entity: "minha_entidade",
      entityId: item.id,
      details: { name: data.name },
    }).catch(() => {});
  }

  return item;
}
```

### Serviços Existentes

| Arquivo | Entidade | Operações |
|---|---|---|
| `sale-item.service.ts` | Itens da loja | CRUD + imagens + campos + opções |
| `order.service.ts` | Pedidos | CRUD + filtros + paginação + export |
| `landing.service.ts` | Seções e itens da LP | CRUD + reorder |
| `user.service.ts` | Usuários | CRUD (bcrypt) |
| `settings.service.ts` | Configurações | get/set key-value |
| `email.service.ts` | Emails | Envio via SMTP |
| `audit-log.service.ts` | Logs | create + list |
| `copafacil.service.ts` | API externa | fetch stages, matches, etc. |
| `tournament.service.ts` | Torneios | CRUD |

---

## Hooks (React Query)

Todos os hooks ficam em `src/lib/hooks/` e são re-exportados via `index.ts`.

### Convenções

```typescript
// Leitura
export function useEntidades() {
  return useQuery({
    queryKey: KEYS.list(),
    queryFn: getEntidades,
  });
}

// Mutação
export function useCreateEntidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInput) => createEntidade(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
```

### Query Keys

Cada hook define um objeto `KEYS` com chaves hierárquicas para invalidação granular:

```typescript
const KEYS = {
  all: ["entidades"] as const,
  list: (filters?: object) => [...KEYS.all, "list", filters] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
};
```

Invalidar `KEYS.all` limpa todos os caches da entidade.

### Hooks Disponíveis

| Arquivo | Hooks |
|---|---|
| `use-sale-items.ts` | `useSaleItems`, `useActiveSaleItems`, `useSaleItemBySlug`, `useSaleItemById`, `useCreateSaleItem`, `useUpdateSaleItem`, `useDeleteSaleItem`, `useAddImage`, `useRemoveImage`, `useAddField`, `useUpdateField`, `useDeleteField` |
| `use-orders.ts` | `useOrders`, `useOrderById`, `useOrdersBySaleItem`, `useCreateOrder`, `useUpdateOrderStatus`, `useDeleteOrder`, `useExportOrders` |
| `use-landing.ts` | `useSections`, `useVisibleSections`, `useCreateSection`, `useUpdateSection`, `useDeleteSection`, `useReorderSections`, `useCreateLandingItem`, `useUpdateLandingItem`, `useDeleteLandingItem`, `useReorderLandingItems` |
| `use-settings.ts` | `useGlobalEmail`, `useSetGlobalEmail` |
| `use-tournaments.ts` | `useTournaments`, `useCreateTournament`, `useUpdateTournament`, `useDeleteTournament` |
| `use-championships.ts` | `useTournamentsData` |

---

## Stores (Zustand)

Stores gerenciam estado puramente client-side. Ficam em `src/lib/stores/`.

| Store | Estado | Persistência |
|---|---|---|
| `ui.store.ts` | `sidebarOpen`, `toggleSidebar` | localStorage (`vortex-ui`) |
| `auth.store.ts` | `user`, `setUser`, `clearUser` | Não |
| `admin.store.ts` | `selectedSaleItemId`, `orderFilters` | Não |
| `landing-editor.store.ts` | `editingSection`, `editingItem`, `isDragging` | Não |

---

## Validação (Zod)

Schemas ficam em `src/lib/validators/` e são usados com React Hook Form:

```typescript
// No validator
import { z } from "zod";

export const meuSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  price: z.number().positive(),
});

export type MeuInput = z.infer<typeof meuSchema>;
```

```typescript
// No componente
import { zodResolver } from "@hookform/resolvers/zod";
import { meuSchema, type MeuInput } from "@/lib/validators";

const { register, handleSubmit } = useForm<MeuInput>({
  resolver: zodResolver(meuSchema),
});
```

### Schemas Existentes

| Arquivo | Schemas |
|---|---|
| `sale-item.ts` | `createSaleItemSchema`, `updateSaleItemSchema` |
| `sale-item-field.ts` | `createFieldSchema`, `updateFieldSchema` |
| `landing-section.ts` | `createLandingSectionSchema`, `updateLandingSectionSchema` |
| `landing-item.ts` | `createLandingItemSchema`, `updateLandingItemSchema` |
| `order.ts` | `createOrderSchema`, `updateOrderStatusSchema` |
| `login.ts` | `loginSchema` |
| `site-settings.ts` | `updateSettingsSchema`, `globalEmailSchema` |

---

## Componentes UI

Todos em `src/components/ui/`. Usam tokens do tema (nunca hex/rgb hardcoded).

### Principais

| Componente | Uso |
|---|---|
| `Button` | Variantes: default, outline, ghost, destructive |
| `Input` | Input padrão com focus ring |
| `FormField` | Label + input + error message |
| `Select` | Select nativo estilizado |
| `Checkbox` | Checkbox com label |
| `Dialog` / `DialogContent` | Modal overlay |
| `Table` / `TableHeader` / `TableBody` / `TableRow` / `TableCell` | Tabelas |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` | Navegação por abas |
| `Badge` | Labels coloridos inline |
| `Card` / `CardContent` | Container com borda |
| `Spinner` | Loading indicator |
| `EmptyState` | Placeholder para listas vazias |
| `RichTextEditor` | TipTap editor (headings, cores, links) |
| `StatusBadge` | Badge específico para status |
| `InlineStatusSelect` | Dropdown inline para mudar status |

### Utilitário cn()

```typescript
import { cn } from "@/lib/utils";

// Merge de classes Tailwind
<div className={cn("base-class", active && "active-class", className)} />
```

---

## Sistema de Temas

### Design Tokens

Definidos em `src/styles/globals.css` usando **oklch color space**:

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0.02 260);
  --primary: oklch(0.35 0.12 260);
  --destructive: oklch(0.55 0.2 25);
  --success: oklch(0.5 0.15 145);
  --warning: oklch(0.75 0.15 85);
  /* ... */
}

.dark {
  --background: oklch(0.12 0.02 260);
  --foreground: oklch(0.95 0.01 260);
  /* ... */
}
```

### Uso no Tailwind

```html
<!-- ✅ CORRETO -->
<div className="bg-background text-foreground border-border" />
<button className="bg-primary text-primary-foreground" />
<span className="text-destructive" />

<!-- ❌ ERRADO -->
<div className="bg-white text-black" />
<div style={{ color: '#1e40af' }} />
```

### Tokens Disponíveis

| Token | Light | Dark | Uso |
|---|---|---|---|
| `background` | Branco | Azul escuro | Fundo da página |
| `foreground` | Azul muito escuro | Quase branco | Texto principal |
| `card` | Branco | Azul escuro claro | Cards |
| `primary` | Azul | Azul claro | Botões, links, destaques |
| `secondary` | Cinza claro | Cinza escuro | Elementos secundários |
| `muted` | Cinza muito claro | Cinza azulado | Backgrounds sutis |
| `accent` | Cinza azulado | Azul escuro | Hover states |
| `destructive` | Vermelho | Vermelho claro | Ações destrutivas |
| `success` | Verde | Verde claro | Status positivo |
| `warning` | Amarelo | Amarelo | Alertas |
| `border` | Cinza | Cinza escuro | Bordas |
| `input` | Cinza | Cinza escuro | Input borders |
| `ring` | Azul | Azul claro | Focus outlines |

---

## Landing Page Dinâmica

### Como Funciona

1. Admin cria **seções** com um layout (CAROUSEL, GRID, HIGHLIGHT, BANNER, TEXT)
2. Cada seção tem **itens** com título, descrição, imagem e link
3. O `src/components/landing/dynamic-section.tsx` renderiza cada seção com o componente correto
4. Items sem título mas com imagem são renderizados como "image-only" (sem overlay de texto)

### Componentes por Layout

| Layout | Componente | Comportamento |
|---|---|---|
| CAROUSEL | `carousel-section.tsx` | Embla Carousel, 1 item → 65% width desktop |
| GRID | `grid-section.tsx` | CSS Grid responsivo |
| HIGHLIGHT | `highlight-section.tsx` | 1 grande + N pequenos |
| BANNER | `banner-section.tsx` | Full-width image |
| TEXT | `text-section.tsx` | Rich text HTML |

### Config JSONB

O campo `config` da seção é JSONB flexível. Exemplo para carousel:

```json
{
  "autoplay": true,
  "interval": 5000,
  "itemsPerSlide": 3
}
```

---

## Sistema de Pedidos

### Fluxo

```
1. Cliente preenche formulário em /loja/[slug]
2. createOrder() salva em orders + order_values
3. Email enviado ao admin (se SMTP configurado)
4. Admin vê pedido em /admin/pedidos
5. Admin altera status: PENDING → CONFIRMED → DELIVERED
6. Cada alteração gera audit log
```

### Campos Dinâmicos

Os campos do formulário são definidos por item (`sale_item_fields`). Os valores preenchidos pelo cliente são salvos em `order_values` com referência ao `field_id`.

```
sale_item_fields (definição)     order_values (respostas)
┌─────────────────────┐          ┌──────────────────────┐
│ id: abc              │  ←───── │ fieldId: abc         │
│ label: "Tamanho"    │          │ value: "G"           │
│ type: SELECT        │          │ orderId: xyz         │
│ options: [P,M,G,GG] │          └──────────────────────┘
└─────────────────────┘
```

### Export Excel

`getOrdersForExport()` transforma os pedidos em um array de objetos onde cada campo dinâmico vira uma coluna adicional.

---

## Email

### Configuração

O serviço de email (`src/lib/services/email.service.ts`) usa Nodemailer com SMTP.

**Se as variáveis SMTP não estiverem configuradas**, o sistema apenas loga no console e segue normalmente — nunca bloqueia o fluxo.

### Template

O email é HTML inline com:
- Header azul com "VORTEX VOLLEY"
- Dados do pedido (item, preço, ID)
- Dados do cliente (nome, email, telefone)
- Tabela com valores dos campos dinâmicos
- Footer

### Destinatário

Prioridade:
1. `notificationEmail` do item específico
2. `global_notification_email` das configurações do sistema

---

## Audit Logs

### Como Adicionar a um Novo Serviço

```typescript
import { createAuditLog } from "./audit-log.service";
import { auth } from "@/lib/auth";

export async function minhaOperacao(data: any) {
  // ... operação no banco ...

  const session = await auth();
  if (session?.user) {
    createAuditLog({
      userId: session.user.id,
      username: session.user.name || "admin",
      action: "CREATE",                    // CREATE | UPDATE | DELETE | UPDATE_STATUS
      entity: "minha_entidade",            // Nome da entidade
      entityId: resultado.id,              // ID do registro afetado
      details: { campo: "valor" },         // Contexto adicional (opcional)
    }).catch(() => {});                    // Nunca bloqueia a operação principal
  }
}
```

### Ações Registradas

| Ação | Entidades |
|---|---|
| CREATE | sale_item, landing_section |
| UPDATE | sale_item |
| DELETE | sale_item, order, landing_section |
| UPDATE_STATUS | order |

### Visualização

A página `/admin/logs` exibe os últimos 100 logs com data, usuário, ação, entidade e detalhes.

---

## CopFacil (Campeonatos)

### Status Atual

**Desativado** — O link no sidebar está comentado e a seção na homepage está desativada.

**Motivo:** A API CopFacil v2 não oferece endpoint para listar torneios. O ID do campeonato precisa ser informado manualmente.

### Como Funciona (quando ativado)

1. Admin cadastra torneios em `/admin/campeonatos` com o `copafacilId`
2. O serviço `copafacil.service.ts` busca dados via API v2 (classificação, rodadas, jogos)
3. A `championships-section` na homepage exibe tabela de classificação e últimos jogos

### Para Reativar

1. Descomentar o link no `admin-sidebar.tsx`
2. Descomentar a seção de campeonatos em `src/app/(public)/page.tsx`
3. Configurar `COPAFACIL_API_KEY` no `.env`

---

## Receitas Comuns

### Adicionar Nova Entidade (CRUD completo)

1. **Schema**: Criar tabela em `drizzle/schema/` + exportar no `index.ts`
2. **Migração**: `npx drizzle-kit generate && npx drizzle-kit migrate`
3. **Tipos**: Criar em `src/types/`
4. **Validator**: Criar schemas Zod em `src/lib/validators/`
5. **Service**: Criar em `src/lib/services/` com `"use server"` + audit logs
6. **Hook**: Criar em `src/lib/hooks/` com React Query
7. **Página admin**: Criar em `src/app/admin/nova-entidade/page.tsx`
8. **Sidebar**: Adicionar link em `admin-sidebar.tsx`

### Adicionar Campo a uma Tabela Existente

1. Editar o schema em `drizzle/schema/`
2. `npx drizzle-kit generate`
3. Revisar a migração gerada em `drizzle/migrations/`
4. `npx drizzle-kit migrate`
5. Atualizar o service/hook/componentes conforme necessário

### Adicionar Novo Layout de Seção

1. Adicionar ao enum `section_layout` em `drizzle/schema/enums/section-layout.enum.ts`
2. Gerar/aplicar migração
3. Criar componente em `src/components/landing/dynamic-section/`
4. Registrar no `dynamic-section.tsx`
5. Adicionar opção no form de criação de seção

### Adicionar Novo Tipo de Campo

1. Adicionar ao enum `field_type` em `drizzle/schema/enums/field-type.enum.ts`
2. Gerar/aplicar migração
3. Atualizar o array `fieldTypes` em `fields-tab.tsx` e `novo/page.tsx`
4. Adicionar renderização no `order-form.tsx`

---

## Dependências Principais

| Pacote | Versão | Propósito |
|---|---|---|
| `next` | 16.1.1 | Framework full-stack |
| `react` | 19.2.3 | UI |
| `drizzle-orm` | 0.45.1 | ORM type-safe |
| `postgres` | 3.4.7 | Driver PostgreSQL |
| `next-auth` | 5.0.0-beta.30 | Autenticação |
| `@tanstack/react-query` | 5.91.0 | Cache e fetching |
| `zustand` | 5.0.12 | Estado client |
| `zod` | 4.2.1 | Validação |
| `react-hook-form` | 7.71.2 | Formulários |
| `tailwindcss` | 4 | CSS |
| `@tiptap/react` | 3.20.4 | Editor rich text |
| `nodemailer` | 7.0.13 | SMTP |
| `embla-carousel-react` | 8.6.0 | Carrossel |
| `motion` | 12.38.0 | Animações |
| `xlsx` | 0.18.5 | Export Excel |
| `bcryptjs` | 3.0.3 | Hash de senhas |
| `lucide-react` | 0.577.0 | Ícones |
| `sonner` | 2.0.7 | Toast notifications |
| `next-themes` | 0.4.6 | Tema dark/light |
