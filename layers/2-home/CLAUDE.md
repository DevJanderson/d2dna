# Layer 2-home - CLAUDE.md

Página inicial da aplicação. Design MX (Machine Experience) com ASCII art, estatísticas, parceiros e equipe.

## Estrutura

```
layers/2-home/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── HomeNavbar.vue          # Logo ASCII + botão auth
│   │   ├── HomeHero.vue            # Headline + terminal interativo
│   │   ├── HomeFeatures.vue        # 3 feature cards (grid com divisórias)
│   │   ├── HomeHowItWorks.vue      # Pipeline 4 etapas
│   │   ├── HomeStats.vue           # Estatísticas com count-up animation
│   │   ├── HomePartners.vue        # Grid de logos parceiros
│   │   ├── HomeTeam.vue            # Grid da equipe D2DNA
│   │   ├── HomeTeamMember.vue      # Card individual (blob + foto)
│   │   └── HomeFooter.vue          # Copyright
│   └── pages/
│       └── index.vue               # Página inicial (componentizada)
```

## Dependências

- **0-base**: CSS global, componentes shadcn-vue (Button), efeito scanlines
- **3-auth**: `useAuthStore` (usado em `HomeNavbar.vue` e `index.vue`)

## Design MX (Machine Experience)

### Elementos visuais

- **ASCII Art Tucuxi**: Logo em blocos Unicode (estilo █████▄)
- **Terminal interativo**: Typewriter com cenários de uso
- **Cursor piscando**: Classe `.terminal-cursor` no terminal
- **Scanlines**: Overlay CRT sutil (herdado do CSS global)
- **Fonte mono**: Space Mono para estética terminal

### Cores por profissão (equipe)

| Cargo             | Cor     |
| ----------------- | ------- |
| CEO & Dev         | green   |
| CSO               | blue    |
| Consultor         | amber   |
| Bioinformata      | fuchsia |
| Data Engineer     | indigo  |
| Frontend & DevOps | orange  |

## Prioridade

```
0-base < 2-home < 3-auth < 4-reviews < 5-docs
```
