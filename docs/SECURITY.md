# Segurança (nuxt-security)

O projeto usa o módulo [`nuxt-security`](https://nuxt-security.vercel.app) com headers de segurança configurados por padrão.

## CSP em Desenvolvimento vs Produção

O **Content Security Policy (CSP)** é **desabilitado em desenvolvimento** e **ativo em produção**:

```typescript
// nuxt.config.ts
contentSecurityPolicy: process.env.NODE_ENV === 'development'
  ? false // HMR do Vite requer WebSocket sem restrições
  : {
      /* diretivas de produção */
    }
```

**Por quê?** Em dev, o Vite carrega CSS via HMR/WebSocket. Quando acessado por IP de rede (ex: celular na mesma Wi-Fi), o CSP bloqueia o WebSocket e a página carrega sem estilos.

## Diretivas CSP em Produção

| Diretiva          | Valor                                  | Quando ajustar                                        |
| ----------------- | -------------------------------------- | ----------------------------------------------------- |
| `default-src`     | `'self'`                               | Raramente — fallback para outras diretivas            |
| `script-src`      | `'self' 'unsafe-inline' 'unsafe-eval'` | Remover `unsafe-eval` se possível                     |
| `style-src`       | `'self' 'unsafe-inline'`               | `unsafe-inline` é necessário para Nuxt/Vue            |
| `img-src`         | `'self' data: https:`                  | Restringir se imagens vêm de domínios conhecidos      |
| `font-src`        | `'self'`                               | Adicionar CDNs de fontes se usadas (ex: Google Fonts) |
| `connect-src`     | `'self'`                               | Adicionar domínios de APIs externas                   |
| `frame-ancestors` | `'none'`                               | Previne embedding via iframe (clickjacking)           |
| `base-uri`        | `'self'`                               | Previne ataques de base tag injection                 |
| `form-action`     | `'self'`                               | Restringir destino de formulários                     |

## Exemplo: Adicionar Domínio Externo

```typescript
// nuxt.config.ts — dentro de security.headers.contentSecurityPolicy
'connect-src': ["'self'", 'https://api.meuservico.com'],
'img-src': ["'self'", 'data:', 'https://cdn.meuservico.com'],
```

## Resumo das Features de Segurança

| Feature           | Configuração                | Descrição                                                        |
| ----------------- | --------------------------- | ---------------------------------------------------------------- |
| **CSP**           | Ativo em produção           | Controla origens permitidas para scripts, estilos, imagens, etc. |
| **Rate Limiter**  | 150 requests / 5 min        | Previne abuso de endpoints                                       |
| **CSRF**          | `nuxt-csurf`                | Protege POST/PUT/PATCH/DELETE com token                          |
| **XSS Validator** | Ativo                       | Sanitiza input contra XSS                                        |
| **Request Size**  | 2 MB (body) / 8 MB (upload) | Limita tamanho de requisições                                    |
| **COEP**          | `require-corp` em produção  | Cross-Origin Embedder Policy                                     |

## Referências

- [nuxt-security — Docs](https://nuxt-security.vercel.app)
- [nuxt-security — FAQ](https://nuxt-security.vercel.app/advanced/faq)
- [nuxt-security — CSP](https://nuxt-security.vercel.app/headers/csp)
