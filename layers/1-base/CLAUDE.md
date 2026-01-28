# Layer 1-base - CLAUDE.md

Layer de UI e utilitários compartilhados. Contém componentes shadcn-vue, layout default, utils e tipos globais.

## Estrutura

```
layers/1-base/
├── nuxt.config.ts              # Configuração da layer
├── app/
│   ├── components/
│   │   ├── ui/                 # shadcn-vue (auto-import)
│   │   │   ├── button/
│   │   │   └── card/
│   │   └── common/             # Componentes compartilhados
│   │       └── AppLoading.vue
│   ├── composables/            # Composables globais
│   ├── layouts/
│   │   └── default.vue         # Layout padrão
│   └── utils/
│       └── utils.ts            # Utilitários (cn, etc.)
└── shared/
    └── types/                  # Tipos compartilhados (app + server)
        ├── api.ts
        └── index.ts
```

## Responsabilidades

| Item | Descrição |
|------|-----------|
| `components/ui/` | Componentes shadcn-vue (primitivos de UI) |
| `components/common/` | Componentes globais reutilizáveis |
| `layouts/default.vue` | Layout padrão da aplicação |
| `utils/` | Funções utilitárias (cn, formatters, etc.) |
| `shared/types/` | Tipos TypeScript compartilhados entre app e server |

## Adicionar Componentes shadcn-vue

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
```

Os componentes são instalados automaticamente em `app/components/ui/`.

## Documentação Detalhada

Para instruções específicas sobre cada área:

| Documento | Conteúdo |
|-----------|----------|
| [app/components/CLAUDE.md](app/components/CLAUDE.md) | Componentes, shadcn-vue, testes |
| [app/composables/CLAUDE.md](app/composables/CLAUDE.md) | Padrões de composables |

## Prioridade

```
0-core < 1-base < 2-example < 4-landing
```

Esta layer tem prioridade 1 e pode ser sobrescrita por layers de maior número.
