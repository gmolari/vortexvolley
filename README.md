# Vortex Volley

Projeto base com **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **PostgreSQL**, **Drizzle ORM**, temas claro/escuro e arquitetura em camadas.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS v4** (cores via CSS variables, sem cores hardcoded)
- **PostgreSQL** + **Drizzle ORM**
- **next-themes** (light/dark)
- **Zod** (validação)
- **React Hook Form** + **@hookform/resolvers** (formulários)

## Estrutura de pastas

```
/app
  /(public)          → rotas públicas (ex: Home)
  /(admin)           → área admin
    /rachao
    /campeonatos
/components
  /ui                → componentes de interface (Button, Input, etc.)
  /layout            → ThemeToggle, etc.
  /providers         → ThemeProvider
/lib
  /db                → cliente Drizzle (camada de banco)
  /validators        → schemas Zod (validação)
  /services          → server actions / serviços (camada de serviço)
  /utils             → cn, etc.
/drizzle
  /schema            → definição das tabelas Drizzle
  /migrations        → migrations geradas
```

## Regras de arquitetura

1. **Cores**: usar apenas tokens do tema (ex: `bg-background`, `text-foreground`, `border-border`). Nada de hex/rgb hardcoded.
2. **Tema**: light/dark via `next-themes`; variáveis em `src/styles/globals.css` e `@theme` Tailwind.
3. **Camadas**:
   - **Banco**: `lib/db` + `drizzle/schema` (acesso a dados).
   - **Serviços**: `lib/services` (regras de negócio, server actions).
   - **UI**: `components/*` (apresentação).
4. **Formulários**: Zod para schemas em `lib/validators`, React Hook Form nos componentes, resolver com `zodResolver(schema)`.

## Manutenção

### Ambiente

- Copiar `.env.example` para `.env` e preencher `DATABASE_URL` (PostgreSQL).
- Variáveis validadas em `config/env.ts` (Zod).

### Comandos

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Lint
npm run lint
```

### Banco de dados (Drizzle)

- **Schema**: editar arquivos em `drizzle/schema/`.
- **Gerar migrations** (após alterar schema):
  ```bash
  npx drizzle-kit generate
  ```
- **Aplicar migrations**:
  ```bash
  npx drizzle-kit migrate
  ```
- **Studio** (visualizar dados):
  ```bash
  npx drizzle-kit studio
  ```

### Adicionar nova rota pública

- Criar pasta/arquivo em `src/app/(public)/...` (ex: `src/app/(public)/sobre/page.tsx`).

### Adicionar nova área admin

- Criar pasta em `src/app/(admin)/...` (ex: `src/app/(admin)/nova-area/page.tsx`).
- Incluir link no layout admin em `src/app/(admin)/layout.tsx`.

### Adicionar novo componente UI

- Colocar em `src/components/ui/` usando classes de tema (`bg-background`, `text-foreground`, etc.).
- Usar `cn()` de `@/lib/utils` para mesclar classes.

### Adicionar validação (Zod)

- Criar schema em `lib/validators/` (ex: `lib/validators/meu-form.ts`).
- Exportar no `lib/validators/index.ts`.
- Em formulários: `useForm` com `resolver: zodResolver(meuFormSchema)`.

### Adicionar serviço / server action

- Criar em `lib/services/` (ex: `lib/services/meu-servico.action.ts`).
- Usar `"use server"` para server actions.
- Importar `db` de `@/lib/db` para acesso ao banco.

## Referência rápida de tokens de tema

| Token (Tailwind)     | Uso principal        |
|----------------------|------------------------|
| `background`         | Fundo da página       |
| `foreground`         | Texto principal       |
| `muted` / `muted-foreground` | Fundo/texto secundário |
| `card` / `card-foreground`   | Cards                 |
| `border` / `input`   | Bordas e inputs       |
| `primary` / `primary-foreground` | Botão principal   |
| `secondary` / `accent`       | Botões secundários   |
| `destructive`        | Ações destrutivas    |
| `ring`              | Focus/outline        |

Todos definidos em `src/styles/globals.css` para `:root` (light) e `.dark`.
