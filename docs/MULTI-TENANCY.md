# Proposta: Multi-tenancy — Tucuxi API

**Data:** 2025-02-10
**Status:** Rascunho para discussao com time API D2DNA
**Contexto:** A API atual e single-tenant. Este documento propoe a arquitetura para suportar multiplas organizacoes.

---

## 1. Problema

A API Tucuxi foi desenhada para uma unica organizacao. Nao existe isolamento de dados entre empresas ou instituicoes. Evidencias:

| Aspecto | Situacao atual |
| --- | --- |
| Usuario | `instituicao` e string livre, sem FK |
| Cliente (paciente) | Sem campo `organizacao_id` — todos sao globais |
| Review (curadoria) | Sem isolamento — qualquer revisor acessa tudo |
| Auth (JWT) | Nao carrega contexto de organizacao |
| Permissoes | `admin` e booleano global (super-admin) |
| Signup | Usa `master_key` global — nao ha convite por org |

**Consequencia:** Nao e possivel atender multiplas empresas ou instituicoes academicas com isolamento de dados.

---

## 2. Tipos de organizacao

O sistema precisa suportar diferentes perfis de uso:

### 2.1 Empresas de saude

Hospitais, clinicas, operadoras, secretarias de saude. Operam com dados reais de pacientes em producao.

- Precisam de isolamento total (LGPD)
- Volumes altos de registros
- Multiplos usuarios por empresa
- Acesso a linkage, review e relatorios

### 2.2 Instituicoes academicas

Universidades (USP, UNICAMP, UFMG) e escolas tecnicas (ETEC, IFSP). Usam o sistema para pesquisa e ensino.

- Podem trabalhar com dados anonimizados ou sinteticos
- Professores e alunos como usuarios
- Acesso a funcionalidades de linkage e analise
- Possivelmente com limites de uso (cota academica)

### 2.3 Pesquisadores individuais

Academicos independentes, pos-graduandos, consultores. Precisam de acesso individual sem vinculo institucional.

- Conta pessoal (1 usuario = 1 organizacao)
- Limites menores de uso
- Pode evoluir para conta institucional

---

## 3. Modelo de dados proposto

### 3.1 Nova entidade: Organizacao

```
Organizacao
├── id: uuid (PK)
├── nome: string                    # "USP", "Hospital Albert Einstein"
├── slug: string (unique)           # "usp", "einstein"
├── tipo: enum                      # empresa | academica | individual
├── documento: string | null        # CNPJ (empresa), sem (academica/individual)
├── dominio_email: string | null    # "@usp.br" — para auto-associacao
├── plano: enum                     # free | academico | profissional | enterprise
├── ativo: boolean
├── criado_em: datetime
└── configuracoes: jsonb            # Limites, features habilitadas
```

### 3.2 Relacao Usuario ↔ Organizacao

```
UsuarioOrganizacao (N:N)
├── usuario_id: FK → Usuario
├── organizacao_id: FK → Organizacao
├── papel: enum                     # admin | membro | leitor | convidado
├── ativo: boolean
└── criado_em: datetime
```

**Por que N:N?** Um professor da USP pode tambem prestar consultoria para um hospital. Um pesquisador pode ter conta individual e pertencer a uma instituicao.

### 3.3 Mudancas em entidades existentes

#### Usuario

```diff
  Usuario
    id, nome, email, senha, telefone, estado, cidade, funcao
-   instituicao: string | null       # texto livre
-   admin: boolean                   # super-admin global
+   # campo "instituicao" removido (substituido por UsuarioOrganizacao)
+   # campo "admin" vira "papel" na tabela UsuarioOrganizacao
+   super_admin: boolean             # apenas para admins da D2DNA
```

#### Cliente (paciente)

```diff
  Cliente
    id, uuid_cliente, nome, data_nascimento, sexo, nome_mae, cpf, cns, ...
+   organizacao_id: FK → Organizacao  # proprietaria do registro
+   visibilidade: enum                # privado | compartilhado
```

#### Review

```diff
  Review
    id, uuid_cliente, id_revisor, data_revisao, acao, status, ...
+   organizacao_id: FK → Organizacao  # contexto da revisao
```

---

## 4. Isolamento de dados

### 4.1 Estrategia: Row-Level Security (RLS)

Cada query filtra automaticamente por `organizacao_id` do usuario autenticado. O usuario nunca ve dados de outra organizacao.

```python
# Exemplo conceitual (FastAPI + SQLAlchemy)
def get_clientes(db, usuario_atual):
    org_id = usuario_atual.organizacao_ativa_id
    return db.query(Cliente).filter(Cliente.organizacao_id == org_id).all()
```

### 4.2 Contexto no JWT

```json
{
  "sub": "usuario_id",
  "org": "organizacao_id",
  "papel": "admin",
  "tipo_org": "academica"
}
```

O token carrega a organizacao ativa. Se o usuario pertence a multiplas orgs, pode trocar o contexto (switch org).

### 4.3 Header opcional

```
X-Organization-Id: uuid
```

Para usuarios com multiplas organizacoes, permite trocar contexto sem novo login. O backend valida que o usuario pertence a org do header.

---

## 5. Permissoes por papel

### 5.1 Papeis dentro da organizacao

| Papel | Clientes | Reviews | Linkage | Usuarios | Config org |
| --- | --- | --- | --- | --- | --- |
| **admin** | CRUD | CRUD | Executar | Convidar/remover | Editar |
| **membro** | CRUD | CRUD | Executar | — | — |
| **leitor** | Read | Read | — | — | — |
| **convidado** | Read (limitado) | — | — | — | — |

### 5.2 Papeis globais (D2DNA)

| Papel | Descricao |
| --- | --- |
| **super_admin** | Acesso a todas as orgs, gerencia plataforma |
| **suporte** | Read-only em todas as orgs, para troubleshooting |

---

## 6. Onboarding por tipo

### 6.1 Empresa

1. Admin cria conta e organizacao (tipo: empresa)
2. Insere CNPJ para validacao
3. Convida usuarios por email
4. Configura integracao (import de dados)

### 6.2 Instituicao academica

1. Professor/coordenador cria conta e organizacao (tipo: academica)
2. Configura dominio de email (ex: `@usp.br`)
3. Alunos fazem signup e sao auto-associados pela dominio
4. Opcao de aprovar/rejeitar novos membros

### 6.3 Pesquisador individual

1. Signup cria usuario + organizacao individual automaticamente
2. Conta pessoal com limites do plano free/academico
3. Pode ser convidado para outras orgs depois

### 6.4 Substituir `master_key`

O campo `master_key` no signup atual e um workaround para controle de acesso. Com multi-tenancy:

- **Empresas:** Convite por email (link com token temporario)
- **Academicas:** Auto-associacao por dominio de email + aprovacao
- **Individuais:** Signup aberto (com verificacao de email)
- **master_key:** Mantida apenas para criacao de super_admins D2DNA

---

## 7. Planos e limites

| Recurso | Free | Academico | Profissional | Enterprise |
| --- | --- | --- | --- | --- |
| Usuarios | 1 | 50 | 100 | Ilimitado |
| Clientes | 1.000 | 50.000 | 500.000 | Ilimitado |
| Linkage/mes | 100 | 10.000 | 100.000 | Ilimitado |
| Reviews | Sim | Sim | Sim | Sim |
| Suporte | Comunidade | Email | Prioritario | Dedicado |
| Dados sinteticos | — | Conjunto de teste incluso | — | — |

> Numeros sao ilustrativos. Ajustar conforme modelo de negocio.

---

## 8. Impacto na API (endpoints)

### 8.1 Novos endpoints

```
# Organizacoes
POST   /api/v1/organizacoes/                    # Criar org
GET    /api/v1/organizacoes/                    # Listar orgs do usuario
GET    /api/v1/organizacoes/{org_id}            # Detalhes
PUT    /api/v1/organizacoes/{org_id}            # Editar
DELETE /api/v1/organizacoes/{org_id}            # Desativar

# Membros
GET    /api/v1/organizacoes/{org_id}/membros    # Listar membros
POST   /api/v1/organizacoes/{org_id}/convites   # Enviar convite
PUT    /api/v1/organizacoes/{org_id}/membros/{uid}  # Mudar papel
DELETE /api/v1/organizacoes/{org_id}/membros/{uid}  # Remover

# Contexto
POST   /api/v1/usuarios/switch-org              # Trocar org ativa
GET    /api/v1/usuarios/organizacoes            # Listar orgs do usuario
```

### 8.2 Endpoints modificados

Todos os endpoints que operam sobre dados (clientes, reviews, linkage) passam a filtrar por `organizacao_id` do contexto:

```
GET /api/v1/clientes/           # Retorna apenas clientes da org ativa
GET /api/v1/review/             # Retorna apenas reviews da org ativa
POST /api/v1/linkage/tucuxi     # Opera apenas nos dados da org ativa
```

### 8.3 Login — resposta enriquecida

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "usuario": {
    "id": 1,
    "nome": "Dr. Silva",
    "email": "silva@usp.br",
    "organizacoes": [
      {
        "id": "uuid-1",
        "nome": "USP - Faculdade de Saude Publica",
        "tipo": "academica",
        "papel": "admin"
      },
      {
        "id": "uuid-2",
        "nome": "Hospital Municipal de SP",
        "tipo": "empresa",
        "papel": "membro"
      }
    ],
    "organizacao_ativa": "uuid-1"
  }
}
```

---

## 9. Migracao

### Fase 1 — Preparacao (sem breaking changes)

1. Criar tabela `Organizacao`
2. Criar tabela `UsuarioOrganizacao`
3. Criar organizacao padrao ("D2DNA") e associar todos os usuarios existentes
4. Adicionar `organizacao_id` nullable em `Cliente` e `Review`
5. Preencher `organizacao_id` com org padrao em todos os registros existentes

### Fase 2 — Ativacao

1. Tornar `organizacao_id` NOT NULL
2. Adicionar filtro automatico por org em todas as queries
3. Incluir `org` no JWT
4. Atualizar endpoints de auth para retornar organizacoes

### Fase 3 — Planos e limites

1. Implementar sistema de cotas
2. Dashboard de uso por org
3. Upgrade de plano

---

## 10. Riscos e consideracoes

| Risco | Mitigacao |
| --- | --- |
| Performance com filtro por org | Indice em `organizacao_id` em todas as tabelas |
| Dados orfaos na migracao | Script de migracao valida 100% dos registros |
| Complexidade no linkage cross-org | Linkage opera apenas dentro da org (v1). Cross-org e feature futura |
| LGPD — isolamento insuficiente | RLS no banco + validacao no application layer |
| Quebra de compatibilidade | Fase 1 nao quebra nada. Fase 2 requer coordenacao com consumidores da API |

---

## Resumo

| Metrica | Valor |
| --- | --- |
| Novos endpoints | ~10 |
| Endpoints modificados | Todos que operam sobre dados (~50) |
| Novas tabelas | 2 (Organizacao, UsuarioOrganizacao) |
| Colunas adicionadas | ~3 (organizacao_id em Cliente, Review; super_admin em Usuario) |
| Colunas removidas | ~2 (instituicao, admin no Usuario) |
| Fases de migracao | 3 |
