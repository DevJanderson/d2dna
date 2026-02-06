# Design: Melhorias da Home Page

**Data**: 2026-02-05
**Branch**: feature/home
**Status**: Aprovado

## Resumo

Melhorar a home page em 4 frentes: visual/design, conteúdo, funcionalidades e performance.

## Mudanças

### 1. Hero — Terminal Interativo

Substituir o SVG animado por um terminal fake que simula o Tucuxi funcionando.

**Coluna esquerda** — Headline + CTA:
- Headline técnico: "500M+ registros vinculados. Zero duplicatas." (ou similar)
- Subtítulo: "Algoritmos determinísticos e probabilísticos para unificar dados de saúde"
- Botão CTA: [ Acessar Sistema ]

**Coluna direita** — Terminal interativo:
- Fundo escuro, borda estilo terminal (`─── tucuxi v2.0 ───`)
- Efeito typewriter com linhas de comando simuladas
- 3-4 cenários em loop: busca CPF, busca fonética, detecção duplicata
- Cursor piscando ao final de cada ciclo
- Respeita `prefers-reduced-motion` (mostra resultado estático)
- Implementação: CSS + setTimeout no Vue (sem dependências externas)

### 2. Seção "Como Funciona" (NOVO componente)

Pipeline visual de Record Linkage em 4 etapas:

1. **Ingestão** — "Dados de múltiplas fontes (SUS, hospitais, laboratórios)"
2. **Normalização** — "Padronização de nomes, datas e documentos"
3. **Linkage** — "Vinculação determinística + probabilística com score"
4. **Unificação** — "Registro único, confiável e rastreável"

- Layout: 4 colunas (desktop), lista vertical (mobile)
- Conectores animados entre cards (linha tracejada + seta)
- Animação ao entrar na viewport (Intersection Observer)

### 3. Stats — Animação de Contagem

- Manter os 4 números atuais
- Adicionar count-up animation (0 → valor final em ~1.5s)
- Ativação via Intersection Observer
- Implementação: requestAnimationFrame (sem dependências)

### 4. Performance

- Lazy loading: prefixo `Lazy` do Nuxt para seções abaixo do fold
- Imagens parceiros: `<NuxtImg>` com `loading="lazy"` e WebP/AVIF
- Animações: só ativam via Intersection Observer

### 5. Ordem das Seções

```
1. HomeHero (terminal interativo + headline técnico)
2. HomeHowItWorks (pipeline 4 etapas) ← NOVO
3. HomeStats (com count-up animado) ← MELHORADO
4. HomePartners (lazy + NuxtImg)
5. HomeFooter (equipe + copyright)
```

## Componentes Afetados

| Componente | Ação |
|-----------|------|
| HomeHero.vue | Reescrever (terminal interativo) |
| HomeHowItWorks.vue | Criar (pipeline 4 etapas) |
| HomeStats.vue | Melhorar (count-up animation) |
| HomePartners.vue | Melhorar (lazy + NuxtImg) |
| index.vue | Atualizar (nova ordem, lazy loading) |

## Copy Aprovada (Brainstorming 2026-02-05)

Toda a copy foi revisada para ser generalista (não focada em medicina) e comunicar:
- **Problema**: bases de dados com milhares de duplicatas
- **Diferencial**: técnica genômica/DNA (Digital Numeric Algorithm)
- **Público-alvo**: decisores técnicos (CTO/TI) e de negócios (Diretores/Gerentes)

### Hero
- **Headline**: "Você não sabe quantos registros estão duplicados. Nós sabemos — e resolvemos em segundos."
- **Subtítulo**: "Tecnologia DNA transforma dados em sequências genômicas para identificar e unificar registros com 95%+ de precisão. Já processamos mais de 500 milhões."
- **CTA**: "Como Funciona ↓" (scroll) + "Entrar" (navbar, outline)

### Feature Cards
1. "Busca em segundos" — dados parciais, erros de digitação
2. "Algoritmo DNA" — bioinformática aplicada a dados
3. "Múltiplos setores" — saúde, educação, epidemiologia, seguros

### Terminal (3 cenários em loop)
1. `tucuxi link --id` — unificação por ID
2. `tucuxi search "Joao da Cilva"` — busca fonética + DNA
3. `tucuxi scan --base completa` — detecção em lote

### Como Funciona (4 etapas)
1. Ingestão — bases de qualquer formato/origem
2. Conversão DNA — registro vira sequência genômica
3. Linkage — 95%+ de precisão
4. Registro Único — consolidado e rastreável

### Stats
- 500M+ registros processados
- 15+ anos de pesquisa
- 4 setores atendidos
- <1% taxa de falsos positivos

### Parceiros
- **Título**: "Quem Confia na D2DNA"
- **Subtítulo**: "De hospitais de referência a universidades de ponta — nossa tecnologia opera onde erro não é opção."

### Equipe
- **Título**: "Quem Está por Trás"
- **Subtítulo**: "Cientistas, médicos e engenheiros. A mesma equipe que criou o algoritmo, mantém a plataforma."

## Componentes Não Utilizados (manter para uso futuro)

- HomeHeader.vue
- HomeDescription.vue
- HomeStatus.vue
- HomeSeparator.vue
