# Layer 2-home - CLAUDE.md

Página inicial da aplicação. Design MX (Machine Experience) com ASCII art, estatísticas, parceiros e equipe.

## Estrutura

```
layers/2-home/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── HomeHeader.vue        # Título, ASCII logos (D2DNA + Tucuxi)
│   │   ├── HomeSeparator.vue     # Separador visual ~~~~
│   │   ├── HomeDescription.vue   # Descrição do sistema
│   │   ├── HomeStatus.vue        # Status auth + botões (usa useAuthStore)
│   │   ├── HomeStats.vue         # Estatísticas com ASCII
│   │   ├── HomePartners.vue      # Grid de logos parceiros
│   │   ├── HomeTeam.vue          # Grid da equipe D2DNA
│   │   ├── HomeTeamMember.vue    # Card individual (blob + foto)
│   │   └── HomeFooter.vue        # Copyright + equipe
│   └── pages/
│       └── index.vue             # Página inicial (componentizada)
```

## Dependências

- **0-base**: CSS global, componentes shadcn-vue (Button), efeito scanlines
- **3-auth**: `useAuthStore` (usado em `HomeStatus.vue` e `index.vue`)

## Design MX (Machine Experience)

### Elementos visuais
- **ASCII Art D2DNA**: Logo em blocos Unicode (estilo █████▄)
- **ASCII Art Tucuxi**: Golfinho em caracteres ASCII
- **Cursor piscando**: Classe `.cursor-blink` após status
- **Scanlines**: Overlay CRT sutil (herdado do CSS global)
- **Fonte mono**: Space Mono para estética terminal

### Cores por profissão (equipe)
| Cargo | Cor |
|-------|-----|
| CEO & Dev | green |
| CSO | blue |
| Consultor | amber |
| Bioinformata | fuchsia |
| Data Engineer | indigo |
| Frontend & DevOps | orange |

## Prioridade

```
0-base < 1-desktop < 2-home < 3-auth
```
