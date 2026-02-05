# MedBlast

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxtdotjs&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**Sistema de Record Linkage e Gestão de Dados Médicos**

> Plataforma de unificação de registros médicos, eliminando duplicatas e garantindo que cada paciente tenha um histórico único, completo e confiável.

## O Problema

No sistema de saúde brasileiro, um mesmo paciente pode ter dezenas de cadastros diferentes espalhados por hospitais, clínicas e unidades de saúde:

| Problema | Impacto |
|----------|---------|
| Pacientes duplicados | Mesmo paciente com múltiplos cadastros em sistemas diferentes |
| Dados inconsistentes | Nomes escritos de formas diferentes, datas erradas |
| Busca ineficiente | Sem CPF exato, encontrar o paciente pode levar minutos |
| Histórico fragmentado | Médico não consegue ver exames de outras unidades |
| Risco à vida | Alergias não registradas, medicamentos incompatíveis |

## A Solução

O **MedBlast** utiliza tecnologia proprietária DNA (Digital Numeric Algorithm) para:

- **Identificar** o mesmo paciente mesmo com dados incompletos ou inconsistentes
- **Unificar** registros de múltiplas fontes em um cadastro único
- **Qualificar** dados através de revisão humana assistida
- **Disponibilizar** histórico consolidado para profissionais autorizados

## Funcionalidades Principais

- **Busca Inteligente** - Encontra pacientes mesmo com dados parciais (algoritmo fonético + fuzzy)
- **Sistema de Revisão** - Workflow para analistas aprovarem/rejeitarem matches
- **Processamento em Lote** - Importação de CSV/Excel com detecção automática de duplicatas
- **Dashboard Gerencial** - Métricas em tempo real, produtividade e relatórios
- **Auditoria Completa** - Log de todas ações com timestamp e justificativas

## Stack Técnica

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Nuxt 4, Vue 3.5, TypeScript |
| UI | Tailwind CSS 4, shadcn-vue |
| State | Pinia |
| Validação | Zod, VeeValidate |
| Segurança | nuxt-security, nuxt-csurf, JWT |
| Qualidade | ESLint, Prettier, Husky, Commitlint |
| Testes | Vitest, Playwright |

## Início Rápido

```bash
git clone <repo-url> medblast
cd medblast
npm install
npm run setup    # Configura git hooks (Husky)
npm run dev      # http://localhost:3000
```

## Comandos

```bash
# Desenvolvimento
npm run dev          # Servidor dev (http://localhost:3000)
npm run build        # Build produção
npm run preview      # Preview build

# Qualidade de código
npm run lint         # Verificar ESLint
npm run lint:fix     # Corrigir ESLint
npm run format       # Formatar com Prettier
npm run typecheck    # Verificar tipos TypeScript
npm run quality      # Rodar todas as verificações
npm run quality:fix  # Corrigir lint + formatar

# Testes
npm run test         # Testes unitários (watch)
npm run test:run     # Testes unitários (uma vez)
npm run test:e2e     # Testes E2E (Playwright)
```

## Qualidade de Código

O projeto utiliza ferramentas de qualidade pré-configuradas:
- **ESLint** - Linting (módulo oficial @nuxt/eslint)
- **Prettier** - Formatação
- **Husky** - Git hooks
- **Commitlint** - Padronização de commits

### Configurar Git Hooks

```bash
npm run setup    # Configura Husky automaticamente
```

### Commits Padronizados (Conventional Commits)

```bash
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
chore: tarefas de manutenção
```


## Testes

Configuração completa para testes:
- **Vitest** - Testes unitários e de integração
- **Playwright** - Testes E2E (end-to-end)
- **Testing Library** - Testes de componentes

### Comandos de Teste

```bash
# Testes unitários (Vitest)
npm run test           # Watch mode
npm run test:run       # Executa uma vez
npm run test:coverage  # Com cobertura
npm run test:ui        # Interface visual

# Testes E2E (Playwright)
npm run test:e2e           # Executa testes E2E
npm run test:e2e:ui        # Interface visual do Playwright
npm run test:e2e:headed    # Executa com browser visível
npm run test:e2e:install   # Instala browsers do Playwright
```

### Estrutura de Testes

```
tests/
├── setup.ts           # Setup global (mocks do Nuxt)
├── unit/              # Testes unitários
├── integration/       # Testes de integração
└── e2e/               # Testes E2E (Playwright)
    └── example.spec.ts
```

### Primeiro uso do Playwright

```bash
npm run test:e2e:install   # Instala browsers necessários
npm run test:e2e           # Executa testes
```

> Veja mais em [tests/CLAUDE.md](tests/CLAUDE.md)

## Estrutura

**Arquitetura layers-only** - não existe pasta `app/` na raiz. Tudo fica em layers.

```
medblast/
├── layers/                         # TUDO fica aqui
│   ├── 0-base/                     # Fundação + UI: app.vue, CSS, shadcn-vue, utils
│   │   ├── app/components/ui/      # Componentes shadcn-vue
│   │   └── app/utils/              # Funções utilitárias
│   ├── 1-desktop/                  # Sistema de janelas estilo desktop
│   ├── 2-home/                     # Página inicial (design MX)
│   └── 3-auth/                     # Autenticação (BFF, cookies httpOnly)
│
├── tests/                          # Testes (unit, integration, e2e)
└── docs/                           # Documentação (PRD, specs)
```

### Ordem de Prioridade (Layers)

```
3-auth > 2-home > 1-desktop > 0-base
```

Número maior = maior prioridade = sobrescreve layers anteriores.

### Criando Nova Feature

Crie uma nova layer seguindo a estrutura:

```
layers/N-feature/
├── nuxt.config.ts
├── app/
│   ├── components/       # FeatureCard.vue, FeatureList.vue
│   ├── composables/      # useFeatureApi.ts, useFeatureStore.ts
│   └── pages/feature/    # Rotas da feature
└── server/api/feature/   # Endpoints REST
```

> Layers em `~/layers` são auto-registradas. Use `~/layers/...` para caminhos em configs.

## Adicionando Componentes shadcn-vue

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
```

Componentes são instalados em `layers/0-base/app/components/ui/` e auto-importados.

## Validação com Zod

```typescript
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// No componente
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema)
})
```

## Dark Mode

```vue
<script setup>
const colorMode = useColorMode()
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
```

## Variáveis de Ambiente

```bash
cp .env.example .env
```

```env
API_BASE_URL=/api
JWT_SECRET=sua-chave-secreta
```

## Documentação

- [PRD - Product Requirements Document](docs/PRD.md)
- [Git Flow - Estratégia de Branches](docs/GIT_FLOW.md)
- [Instruções para Claude Code](CLAUDE.md)

## Licença

Proprietário - D2DNA © 2026
