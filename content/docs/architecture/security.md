---
title: Segurança
description: Configurações de segurança do Tucuxi-Blast, incluindo CSP, rate limiter, CSRF e proteções contra XSS.
order: 4
---

# Segurança

O Tucuxi-Blast usa o módulo [`nuxt-security`](https://nuxt-security.vercel.app) para headers de segurança e proteções em nível de servidor, complementado pelo [`nuxt-csurf`](https://github.com/Morgbn/nuxt-csurf) para proteção CSRF.

## Resumo das Proteções

| Feature              | Configuração                | Descrição                                                        |
| -------------------- | --------------------------- | ---------------------------------------------------------------- |
| **CSP**              | Ativo em producao           | Controla origens permitidas para scripts, estilos, imagens, etc. |
| **Rate Limiter**     | 150 requests / 5 min        | Previne abuso de endpoints                                       |
| **CSRF**             | `nuxt-csurf`                | Protege POST/PUT/PATCH/DELETE com token                          |
| **XSS Validator**    | Ativo                       | Sanitiza input contra XSS                                        |
| **Request Size**     | 2 MB (body) / 8 MB (upload) | Limita tamanho de requisições                                    |
| **COEP**             | `require-corp` em producao  | Cross-Origin Embedder Policy                                     |
| **Cookies httpOnly** | Todos os tokens             | Tokens JWT inacessiveis por Javascript no browser                |

## Content Security Policy (CSP)

O CSP é **desabilitado em desenvolvimento** e **ativo em produção**:

```typescript
// nuxt.config.ts
contentSecurityPolicy: process.env.NODE_ENV === 'development'
  ? false
  : {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'https://d2dna.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
```

**Por que desabilitado em dev?** O Vite usa HMR via WebSocket para hot reload. Quando o app é acessado por IP de rede (ex: celular na mesma Wi-Fi), o CSP bloqueia o WebSocket e a página carrega sem estilos.

::docs-warning{title="unsafe-eval no CSP"}
A diretiva `script-src` inclui `'unsafe-eval'` que é necessária para o funcionamento do Vue em produção. Idealmente, essa diretiva deve ser removida quando possível. Monitore atualizações do Nuxt e Vue que possam eliminar essa necessidade.
::

### Diretivas CSP

| Diretiva          | Valor                                  | Quando ajustar                                   |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| `default-src`     | `'self'`                               | Raramente — fallback para outras diretivas     |
| `script-src`      | `'self' 'unsafe-inline' 'unsafe-eval'` | Remover `unsafe-eval` se possivel                |
| `style-src`       | `'self' 'unsafe-inline'`               | `unsafe-inline` necessário para Nuxt/Vue         |
| `img-src`         | `'self' data: https:`                  | Restringir se imagens vem de dominios conhecidos |
| `font-src`        | `'self'`                               | Adicionar CDNs de fontes se usadas               |
| `connect-src`     | `'self'`                               | Adicionar dominios de APIs externas              |
| `frame-ancestors` | `'none'`                               | Previne embedding via iframe (clickjacking)      |
| `base-uri`        | `'self'`                               | Previne ataques de base tag injection            |
| `form-action`     | `'self'`                               | Restringir destino de formulários                |

### Adicionar Domínio Externo

Para permitir requisições ou recursos de um domínio externo, adicione-o a diretiva correspondente:

```typescript
// nuxt.config.ts — dentro de security.headers.contentSecurityPolicy
'connect-src': ["'self'", 'https://api.meuservico.com'],
'img-src': ["'self'", 'data:', 'https://cdn.meuservico.com'],
```

## Rate Limiter

Limita o número de requisições por cliente para prevenir abuso:

```typescript
rateLimiter: {
  tokensPerInterval: 150,  // 150 requisições
  interval: 300000          // a cada 5 minutos (300.000ms)
}
```

::docs-info
Rotas do Nuxt Content (`/__nuxt_content/**` e `/api/_content/**`) têm o rate limiter desabilitado para não interferir na navegação da documentação.
::

## CSRF (Cross-Site Request Forgery)

O módulo `nuxt-csurf` protege automaticamente métodos que alteram dados:

- **Métodos protegidos**: POST, PUT, PATCH, DELETE
- **Métodos livres**: GET, HEAD, OPTIONS
- **Funcionamento**: Um token CSRF é gerado no server e incluído automaticamente nas requisições pelo composable `useCsrf()`

## XSS Validator

O validador de XSS está ativo e sanitiza automaticamente inputs recebidos pelo servidor, removendo tags e atributos potencialmente perigosos.

```typescript
xssValidator: {
} // Configuração padrão ativa
```

## Request Size Limiter

Limita o tamanho de requisições para prevenir ataques de payload excessivo:

```typescript
requestSizeLimiter: {
  maxRequestSizeInBytes: 2000000,      // 2 MB para body
  maxUploadFileRequestInBytes: 8000000  // 8 MB para upload
}
```

## Cross-Origin Embedder Policy (COEP)

```typescript
crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development'
  ? 'unsafe-none' // Permissivo em dev
  : 'require-corp' // Restritivo em producao
```

Em produção, `require-corp` exige que todos os recursos cross-origin tenham headers CORP/CORS adequados.

## Boas Práticas

1. **Tokens em cookies httpOnly**: Nunca armazene tokens em `localStorage` ou `sessionStorage`
2. **Validação com Zod no server**: Sempre valide entrada do usuário com `schema.safeParse(body)`
3. **BFF como proxy**: O client nunca faz requisições diretas a API externa
4. **Princípio do menor privilégio**: Só adicione domínios ao CSP quando estritamente necessário

## Referências

- [nuxt-security — Documentação](https://nuxt-security.vercel.app)
- [nuxt-security — FAQ](https://nuxt-security.vercel.app/advanced/faq)
- [nuxt-security — CSP](https://nuxt-security.vercel.app/headers/csp)
- [nuxt-csurf — GitHub](https://github.com/Morgbn/nuxt-csurf)
