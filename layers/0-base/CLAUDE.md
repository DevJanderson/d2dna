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
│   │   ├── common/             # Componentes compartilhados
│   │   └── home/               # Componentes da página inicial
│   │       ├── HomeHeader.vue      # Título, ASCII logos (D2DNA + Tucuxi)
│   │       ├── HomeSeparator.vue   # Separador visual ~~~~
│   │       ├── HomeDescription.vue # Descrição do sistema
│   │       ├── HomeStatus.vue      # Status auth + botões
│   │       ├── HomeStats.vue       # Estatísticas com ASCII
│   │       ├── HomePartners.vue    # Grid de logos parceiros
│   │       ├── HomeTeam.vue        # Grid da equipe D2DNA
│   │       ├── HomeTeamMember.vue  # Card individual (blob + foto)
│   │       └── HomeFooter.vue      # Copyright + equipe
│   ├── layouts/
│   │   └── default.vue         # Layout padrão
│   ├── pages/
│   │   └── index.vue           # Página inicial (componentizada)
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
| `components/home/` | Componentes da página inicial (design MX) |
| `layouts/default.vue` | Layout padrão da aplicação |
| `utils/` | Funções utilitárias (cn, formatters) |
| `shared/types/` | Tipos TypeScript compartilhados |

## Design MX (Machine Experience)

A página inicial segue o estilo **MX (Machine Experience)** - design para humanos e máquinas:

### Elementos visuais
- **ASCII Art**: Logo Tucuxi, logo D2DNA, bordas `┌───┐`
- **Cursor piscando**: Classe `.cursor-blink` após status
- **Scanlines**: Overlay CRT sutil (classe `.scanlines`)
- **Fonte mono**: Space Mono para estética terminal

### Espaçamento (8pt Grid)
- Entre seções: 48-64px (Tailwind 12-16)
- Dentro de seções: 32px (Tailwind 8)
- Entre elementos: 24px (Tailwind 6)

### Cores por profissão (equipe)
| Cargo | Cor |
|-------|-----|
| CEO & Dev | green |
| CSO | blue |
| Consultor | amber |
| Bioinformata | fuchsia |
| Data Engineer | indigo |
| Frontend & DevOps | orange |

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
0-base < 1-example < 2-desktop
```
