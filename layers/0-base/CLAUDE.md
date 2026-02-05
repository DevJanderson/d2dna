# Layer 0-base - CLAUDE.md

Fundação + UI da aplicação. Contém arquivos globais do Nuxt, componentes shadcn-vue, utils e tipos compartilhados.

## Estrutura

```
layers/0-base/
├── nuxt.config.ts              # CSS global + alias #shared
├── app/
│   ├── app.vue                 # Root component
│   ├── error.vue               # Página de erro (404, 500)
│   ├── assets/css/
│   │   └── main.css            # Tailwind CSS + variáveis de tema + estilos MX
│   ├── components/
│   │   ├── ui/                 # shadcn-vue (auto-import)
│   │   └── common/             # Componentes compartilhados
│   ├── layouts/
│   │   └── default.vue         # Layout padrão
│   ├── pages/                  # Páginas internas (app/, docs/)
│   └── utils/
│       └── utils.ts            # cn() para classes
├── server/
│   └── api/
│       └── health.get.ts       # GET /api/health
└── shared/
    └── types/                  # Tipos compartilhados (app + server)
```

## Responsabilidades

| Item | Descrição |
|------|-----------|
| `app.vue` | Root component com `<NuxtLayout>` e `<NuxtPage>` |
| `error.vue` | Página de erro global |
| `main.css` | Tailwind v4, variáveis CSS, estilos MX (scanlines, cursor-blink) |
| `components/ui/` | Componentes shadcn-vue (primitivos de UI) |
| `components/common/` | Componentes globais reutilizáveis |
| `layouts/default.vue` | Layout padrão da aplicação |
| `utils/` | Funções utilitárias (cn, formatters) |
| `shared/types/` | Tipos TypeScript compartilhados |

## Design MX (Machine Experience)

Estilos globais do design MX ficam nesta layer (CSS, fontes). Componentes da home foram movidos para `layers/2-home/`.

### z-index para scanlines
O efeito scanlines usa `z-index: 10`. Para elementos ficarem **acima** do efeito (sem as linhas), adicione `relative z-20`:

```vue
<div class="relative z-20 bg-white ...">
  <!-- Conteúdo sem scanlines por cima -->
</div>
```

### Espaçamento (8pt Grid)
- Entre seções: 48-64px (Tailwind 12-16)
- Dentro de seções: 32px (Tailwind 8)
- Entre elementos: 24px (Tailwind 6)

## Adicionar Componentes shadcn-vue

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
```

Os componentes são instalados automaticamente em `app/components/ui/`.

## Customização

- **Tema**: Edite as variáveis CSS em `main.css` (`:root` e `.dark`)
- **Layout**: Sobrescreva `layouts/default.vue` em uma layer de maior prioridade

## Prioridade

Esta é a layer com **menor prioridade** (0). Todas as outras layers podem sobrescrever seus arquivos.

```
0-base < 1-desktop < 2-home < 3-auth
```
