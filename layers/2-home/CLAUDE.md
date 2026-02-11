# Layer 2-home - CLAUDE.md

Página inicial da aplicação. Design MX (Machine Experience) com ASCII art, estatísticas, social proof, segurança e equipe.

## Estrutura

```
layers/2-home/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── HomeNavbar.vue          # Logo ASCII + botão auth (sticky, z-30)
│   │   ├── HomeHero.vue            # Headline + terminal interativo
│   │   ├── HomeSocialProof.vue     # Marquee infinito de logos (LogoLoop)
│   │   ├── HomeStats.vue           # Estatísticas com count-up animation
│   │   ├── HomeFeatures.vue        # 6 feature cards (grid 2x3 com ícones)
│   │   ├── HomeHowItWorks.vue      # Pipeline 4 etapas
│   │   ├── HomeSecurity.vue        # Enterprise-ready (segurança + LGPD)
│   │   ├── HomeTeam.vue            # Grid da equipe D2DNA
│   │   ├── HomeTeamMember.vue      # Card individual (blob + foto)
│   │   ├── HomeCTA.vue             # Call-to-action antes do footer
│   │   ├── HomeFooter.vue          # Footer completo (colunas + redes + copyright)
│   │   └── LogoLoop.vue            # Componente de marquee infinito (vue-bits)
│   └── pages/
│       └── index.vue               # Página inicial (componentizada)
```

## Ordem das seções

```
Navbar → Hero → SocialProof → Stats → Features → HowItWorks → Security → Team → CTA → Footer
```

## Dependências

- **0-base**: CSS global, componentes shadcn-vue (Button), efeito scanlines
- **3-auth**: `useAuthStore` (usado em `HomeNavbar.vue` e `index.vue`)
- **lucide-vue-next**: Ícones (Search, Dna, Building2, Plug, Target, Layers, Shield, Scale, Linkedin, Github)

## Design MX (Machine Experience)

### Elementos visuais

- **ASCII Art Tucuxi**: Logo em blocos Unicode (estilo █████▄)
- **Terminal interativo**: Typewriter com cenários de uso
- **Cursor piscando**: Classe `.terminal-cursor` no terminal
- **Scanlines**: Overlay CRT sutil (herdado do CSS global)
- **Fonte mono**: Space Mono para estética terminal
- **LogoLoop**: Marquee infinito de logos parceiros (vue-bits)

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
