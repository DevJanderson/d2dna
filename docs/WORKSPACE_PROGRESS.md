# Progresso do Workspace Desktop

**Data:** 29 de Janeiro de 2026
**Status:** Em desenvolvimento

---

## Contexto

Estamos construindo o workspace principal do Tucuxi-Blast usando o sistema de janelas desktop (layer 3-desktop) para atender principalmente a **persona Carlos (Analista de Qualidade)** que precisa revisar matches de pacientes duplicados.

---

## O que foi implementado

### 1. Sistema de Janelas Desktop (layer 3-desktop)

```
layers/3-desktop/
├── app/
│   ├── components/
│   │   ├── AppWindow.vue            # Janela com drag, resize, snap
│   │   ├── AppWindowTitleBar.vue    # Barra de título com controles
│   │   ├── AppWindowContent.vue     # Renderiza markdown
│   │   ├── AppWindowResizeHandles.vue
│   │   ├── AppWindowSnapPreview.vue
│   │   ├── Desktop.vue              # Container de janelas
│   │   └── AppDock.vue              # Sidebar estilo macOS
│   ├── composables/
│   │   ├── useWindowManager.ts      # Gerencia múltiplas janelas
│   │   ├── useWindowDrag.ts         # Lógica de arrastar
│   │   ├── useWindowResize.ts       # Lógica de redimensionar
│   │   ├── useWindowSnap.ts         # Snap nas bordas (metade tela)
│   │   └── useContentFiles.ts       # Lista arquivos markdown
│   ├── layouts/
│   │   └── desktop.vue              # Layout com dock
│   └── types/
│       └── window.ts                # Tipos TypeScript
```

**Funcionalidades:**
- Arrastar janelas com limites do container
- Redimensionar por 8 direções (N, S, E, W, NE, NW, SE, SW)
- Snap esquerda/direita (metade da tela) com preview visual
- Minimizar, maximizar, fechar
- Z-index automático (janela focada fica na frente)
- Animações de entrada/saída

### 2. Página /app (Workspace do Analista)

```
layers/0-core/app/pages/app/index.vue
```

**Funcionalidades demo:**
- Fila de revisão com 4 matches mockados
- Comparador lado a lado de registros
- Score colorido (verde ≥90%, amarelo ≥80%, laranja <80%)
- Botões Aprovar/Rejeitar funcionais (removem da lista)
- Dock com navegação para funcionalidades do sistema

### 3. Integração com @nuxt/content

- Suporte a Markdown dentro de janelas via `AppWindowContent`
- Página `/docs` para documentação
- Plugin `@tailwindcss/typography` para estilos prose

---

## Rotas disponíveis

| Rota | Descrição | Layout |
|------|-----------|--------|
| `/` | Landing page | default |
| `/app` | Workspace do analista | desktop |
| `/docs` | Documentação | default |
| `/example` | Feature de exemplo | default |

---

## Arquivos removidos

Os seguintes arquivos foram removidos pois não eram essenciais:

- `layers/3-desktop/app/components/WallpaperSelector.vue`
- `layers/3-desktop/app/composables/useWallpaper.ts`

Eram para seleção de wallpaper do desktop. Podem ser restaurados do git se necessário:
```bash
git checkout HEAD~1 -- layers/3-desktop/app/components/WallpaperSelector.vue
git checkout HEAD~1 -- layers/3-desktop/app/composables/useWallpaper.ts
```

---

## Próximos passos

### Prioridade Alta

1. **Criar layer 6-review**
   - Separar componentes de revisão em layer própria
   - `ReviewQueue.vue` - Fila de matches pendentes
   - `MatchViewer.vue` - Comparador lado a lado
   - `PatientCard.vue` - Card de dados do paciente

2. **Conectar com API**
   - Endpoints para buscar matches pendentes
   - Endpoints para aprovar/rejeitar matches
   - Integração com algoritmo DNA

3. **Autenticação**
   - Layer 4-auth com login/logout
   - Middleware para proteger `/app`
   - Permissões por role (operador, analista, gestor)

### Prioridade Média

4. **Busca de Pacientes**
   - Componente de busca inteligente
   - Integração com busca fonética
   - Exibição de resultados com score

5. **Dashboard Gerencial**
   - Métricas em tempo real
   - Gráficos de evolução
   - Produtividade por analista

### Prioridade Baixa

6. **Processamento em Lote**
   - Upload de CSV/Excel
   - Preview e mapeamento de colunas
   - Progresso em tempo real

7. **Melhorias de UX**
   - Atalhos de teclado
   - Persistência de layout (posição das janelas)
   - Temas/wallpapers

---

## Estrutura de layers sugerida

```
layers/
├── 0-core/          # Fundação (✓)
├── 1-base/          # UI base (✓)
├── 2-example/       # Referência (✓)
├── 3-desktop/       # Sistema de janelas (✓)
├── 4-auth/          # Autenticação (pendente)
├── 5-patient/       # Busca e cadastro (pendente)
├── 6-review/        # Revisão de matches (pendente)
├── 7-batch/         # Processamento em lote (pendente)
└── 8-dashboard/     # Dashboard e relatórios (pendente)
```

---

## Comandos úteis

```bash
# Desenvolvimento
npm run dev              # http://localhost:3000

# Verificar tipos
npm run typecheck

# Testar rotas
curl http://localhost:3000/app
curl http://localhost:3000/docs
```

---

## Commits recentes

```bash
git log --oneline -5
```

- `feat: adiciona página /app como workspace do analista`
- `feat: adiciona @nuxt/content, componentes shadcn e layer desktop`
- `refactor: move página inicial para 0-core e renomeia para Tucuxi-Blast`

---

## Referências

- [PRD completo](./PRD.md) - Requisitos do produto
- [Layer 3-desktop CLAUDE.md](../layers/3-desktop/CLAUDE.md) - Documentação do sistema de janelas
- [Nuxt Layers](./NUXT_LAYERS.md) - Arquitetura de layers
