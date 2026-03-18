# Vortex Volley

**Plataforma oficial do Vortex Londrina** — time de voleibol amador de Londrina/PR.

Sistema web completo para gerenciamento do time, com loja online de itens personalizados, landing page dinâmica, painel administrativo e integração com campeonatos.

---

## Visão Geral

O Vortex Volley é uma plataforma all-in-one que permite ao time:

- **Apresentar o time** com uma landing page moderna e personalizável
- **Vender itens** como camisetas, uniformes e acessórios com formulários dinâmicos
- **Gerenciar pedidos** com fluxo completo de status (pendente → confirmado → entregue)
- **Acompanhar campeonatos** via integração com a API CopFacil
- **Administrar tudo** através de um painel admin completo e intuitivo

---

## Funcionalidades

### Para o Público

| Funcionalidade | Descrição |
|---|---|
| **Landing Page Dinâmica** | Seções configuráveis com layouts de carrossel, grid, destaque, banner e texto |
| **Loja Online** | Catálogo de itens com imagens, preços, datas de disponibilidade e status |
| **Formulários de Pedido** | Campos dinâmicos por item (texto, número, select, tamanho, checkbox, etc.) |
| **Tema Claro/Escuro** | Troca automática ou manual de tema |
| **Responsivo** | Interface adaptada para desktop, tablet e mobile |

### Para Administradores

| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Visão geral com contadores de itens, pedidos, pendentes e entregues |
| **Gestão de Itens** | CRUD completo com imagens, campos personalizados e preview |
| **Gestão de Pedidos** | Listagem com filtros, busca, paginação, alteração de status e exportação Excel |
| **Editor de Landing Page** | Criar/editar seções e itens com drag-and-drop e preview em tempo real |
| **Campeonatos** | Integração com CopFacil para exibir classificação e resultados |
| **Configurações** | Email global de notificação e preferências do sistema |
| **Logs de Auditoria** | Histórico completo de ações dos administradores |
| **Notificações por Email** | Email automático ao administrador quando um novo pedido é realizado |

---

## Fluxo do Pedido

```
Cliente acessa a Loja → Escolhe um item → Preenche o formulário de pedido
    ↓
Pedido criado com status PENDENTE
    ↓
Admin recebe notificação por email (se SMTP configurado)
    ↓
Admin confirma pedido → Status: CONFIRMADO
    ↓
Admin marca como entregue → Status: ENTREGUE
```

O administrador também pode cancelar pedidos ou excluí-los quando necessário.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Linguagem** | TypeScript |
| **Banco de Dados** | PostgreSQL + Drizzle ORM |
| **Autenticação** | NextAuth v5 (Credentials, JWT) |
| **Estilização** | Tailwind CSS v4 (oklch color space) |
| **State Management** | React Query (servidor) + Zustand (cliente) |
| **Formulários** | React Hook Form + Zod |
| **Editor de Texto** | TipTap (headings, cores, links, alinhamento) |
| **Carrossel** | Embla Carousel |
| **Animações** | Motion (framer-motion) |
| **Email** | Nodemailer (SMTP) |
| **Exportação** | XLSX (Excel) |
| **Ícones** | Lucide React |
| **Toasts** | Sonner |

---

## Como Usar (Deploy Rápido)

### Pré-requisitos

- Node.js 18+
- PostgreSQL 13+ (recomendado: [Neon](https://neon.tech) para serverless)

### 1. Clone e instale

```bash
git clone <repo-url>
cd vortexvolley
npm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
# Obrigatório
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
NEXTAUTH_SECRET=sua-chave-secreta-com-no-minimo-32-caracteres

# Opcional
NEXTAUTH_URL=https://seudominio.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASS=senha-de-app
COPAFACIL_API_KEY=sua-api-key
```

### 3. Configure o banco de dados

```bash
npx drizzle-kit migrate
```

### 4. Crie o primeiro admin

Use o Drizzle Studio para inserir um usuário com role `ADMIN` ou `OWNER`:

```bash
npx drizzle-kit studio
```

A senha deve ser hasheada com bcrypt. Você pode gerar uma com:

```bash
node -e "require('bcryptjs').hash('suasenha', 10).then(console.log)"
```

### 5. Execute

```bash
npm run dev      # Desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm start        # Servidor de produção
```

---

## Estrutura de Páginas

### Públicas

| Rota | Descrição |
|---|---|
| `/` | Landing page com hero, sobre, seções dinâmicas e preview da loja |
| `/loja` | Catálogo de itens disponíveis |
| `/loja/[slug]` | Página do item com galeria de imagens e formulário de pedido |
| `/login` | Acesso ao painel administrativo |

### Administrativas (requer login)

| Rota | Descrição |
|---|---|
| `/admin/dashboard` | Painel com estatísticas gerais |
| `/admin/itens` | Gerenciar itens da loja |
| `/admin/itens/novo` | Criar item com imagens e campos inline |
| `/admin/itens/[id]` | Editar item (info, imagens, campos, pedidos) |
| `/admin/itens/[id]/preview` | Visualizar item como o público vê |
| `/admin/pedidos` | Listar, filtrar e exportar pedidos |
| `/admin/pedidos/[id]` | Detalhes do pedido e alteração de status |
| `/admin/landing` | Editor visual da landing page |
| `/admin/campeonatos` | Gerenciar torneios CopFacil |
| `/admin/configuracoes` | Configurações gerais |
| `/admin/logs` | Histórico de ações do sistema |

---

## Layouts da Landing Page

O editor de landing page suporta 5 tipos de layout para seções:

| Layout | Descrição |
|---|---|
| **Carrossel** | Itens em slider horizontal com navegação |
| **Grid** | Cards em grade responsiva |
| **Destaque** | Um item principal grande + itens menores ao lado |
| **Banner** | Imagem full-width com sobreposição opcional |
| **Texto** | Bloco de conteúdo rico (HTML) |

Cada item de seção pode ter título, descrição (rich text), imagem, link e associação a um item da loja.

---

## Campos Dinâmicos dos Itens

Cada item da loja pode ter campos personalizados no formulário de pedido:

| Tipo | Exemplo de Uso |
|---|---|
| **TEXT** | Nome no uniforme |
| **NUMBER** | Número da camisa |
| **SELECT** | Tamanho (P, M, G, GG) |
| **SIZE** | Tamanho com opções customizadas |
| **CHECKBOX** | "Quero nome nas costas?" |
| **TEXTAREA** | Observações adicionais |
| **EMAIL** | Email secundário |
| **PHONE** | Telefone para contato |

---

## Notificações por Email

O sistema envia emails automáticos quando um novo pedido é criado. O email é enviado para:

1. O email de notificação configurado no item (campo `notificationEmail`)
2. Ou o email global configurado em `/admin/configuracoes`

**Requisito:** As variáveis SMTP devem estar configuradas no `.env`. Sem elas, o sistema apenas loga no console.

---

## Exportação de Dados

Os pedidos podem ser exportados para Excel (.xlsx) direto do painel de pedidos. O arquivo inclui:

- ID, item, nome do cliente, email, telefone, status, data
- Todos os campos personalizados do formulário como colunas adicionais

---

## Segurança

- Senhas hasheadas com **bcrypt**
- Sessões via **JWT** com expiração de 30 dias
- Rotas admin protegidas por **middleware** (roles ADMIN/OWNER)
- Validação de entrada com **Zod** em todas as operações
- **Audit logs** registrando todas as ações administrativas

---

## Licença

Projeto privado do Vortex Londrina. Todos os direitos reservados.
