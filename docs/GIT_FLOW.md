# Git Flow - MedBlast

Estratégia de branches baseada no Git Flow com ambiente de staging para homologação.

## Branches Principais

| Branch | Ambiente | Propósito | Proteção |
|--------|----------|-----------|----------|
| `main` | Produção | Código em produção | Protegida, requer PR |
| `staging` | Homologação | Testes e validação | Protegida, requer PR |
| `develop` | Desenvolvimento | Integração de features | Protegida, requer PR |

## Branches de Suporte

| Tipo | Padrão | Origem | Destino | Uso |
|------|--------|--------|---------|-----|
| Feature | `feature/<nome>` | develop | develop | Nova funcionalidade |
| Release | `release/<versão>` | staging | main + develop | Preparação de release |
| Hotfix | `hotfix/<nome>` | main | main + staging + develop | Correção urgente |

## Fluxo de Ambientes

```
feature/* → develop → staging → main
               ↓         ↓        ↓
             (dev)   (homolog)  (prod)
```

## Fluxo de Trabalho

### 1. Nova Feature

```bash
# Criar branch a partir de develop
git checkout develop
git pull origin develop
git checkout -b feature/busca-paciente

# Desenvolver...
git add .
git commit -m "feat: implementa busca por nome fonético"

# Enviar para review
git push -u origin feature/busca-paciente
# Abrir PR para develop
```

### 2. Promover para Staging (Homologação)

```bash
# Após features testadas em develop
git checkout staging
git pull origin staging
git merge develop --no-ff
git push origin staging

# Ou via PR: develop → staging
```

### 3. Release (Produção)

```bash
# Criar branch de release a partir de staging
git checkout staging
git checkout -b release/1.0.0

# Ajustes finais, bump de versão...
git commit -m "chore: bump versão para 1.0.0"

# Merge em main (via PR)
git checkout main
git merge release/1.0.0 --no-ff
git tag -a v1.0.0 -m "Versão 1.0.0"
git push origin main --tags

# Merge de volta em staging e develop
git checkout staging
git merge release/1.0.0 --no-ff

git checkout develop
git merge release/1.0.0 --no-ff

# Limpar
git branch -d release/1.0.0
```

### 4. Hotfix (Correção Urgente)

```bash
# Criar branch a partir de main
git checkout main
git checkout -b hotfix/corrige-login

# Corrigir...
git commit -m "fix: corrige validação de CPF no login"

# Merge em main (via PR)
git checkout main
git merge hotfix/corrige-login --no-ff
git tag -a v1.0.1 -m "Hotfix 1.0.1"

# Propagar para staging e develop
git checkout staging
git merge hotfix/corrige-login --no-ff

git checkout develop
git merge hotfix/corrige-login --no-ff

# Limpar
git branch -d hotfix/corrige-login
```

## Convenção de Nomes

### Features
```
feature/busca-paciente
feature/revisao-match
feature/dashboard-metricas
feature/importacao-csv
```

### Releases
```
release/1.0.0
release/1.1.0
release/2.0.0
```

### Hotfixes
```
hotfix/corrige-login
hotfix/fix-duplicata-cpf
hotfix/seguranca-csrf
```

## Commits (Conventional Commits)

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação (não afeta código)
refactor: refatoração
perf: melhoria de performance
test: testes
chore: manutenção
ci: CI/CD
build: build/dependências
```

### Exemplos

```bash
feat: adiciona busca fonética de pacientes
feat(busca): implementa tolerância de data ±1 ano
fix: corrige validação de CPF com dígitos repetidos
fix(revisao): resolve merge incorreto de CNS
docs: atualiza README com instruções de deploy
refactor(api): extrai lógica de matching para service
test: adiciona testes para validação de CNS
chore: atualiza dependências do projeto
```

## Diagrama

```
main ─────●───────────────────────●─────────────●─────▶ (produção)
          │                       ↑             ↑
          │                  merge release  merge hotfix
          │                       │             │
staging ──●───────────●───────────●─────────────●─────▶ (homologação)
          │           ↑           │             ↑
          │      merge develop    │        merge hotfix
          │           │           │             │
develop ──●───●───●───●───────────●─────────────●─────▶ (desenvolvimento)
              │   ↑                             ↑
         feature  │                        merge hotfix
              │   │
              ▼   │
feature/* ────●───●
```

## Regras

1. **Nunca commitar direto em `main`, `staging` ou `develop`**
2. **Sempre usar PR para merge**
3. **Features partem de `develop` e voltam para `develop`**
4. **Promoção para staging: `develop` → `staging` (via PR)**
5. **Releases partem de `staging` e vão para `main` + `staging` + `develop`**
6. **Hotfixes partem de `main` e vão para `main` + `staging` + `develop`**
7. **Tags apenas em `main`**
8. **Deletar branches de feature/release/hotfix após merge**

## Proteção de Branches (GitHub)

Configurar no repositório:

### main
- Require pull request reviews (2+)
- Require status checks to pass
- Require branches to be up to date
- Include administrators
- Restrict who can push (apenas via PR)

### staging
- Require pull request reviews (1+)
- Require status checks to pass
- Require branches to be up to date

### develop
- Require pull request reviews (1+)
- Require status checks to pass

## Ambientes e Deploy

| Branch | Ambiente | URL | Deploy |
|--------|----------|-----|--------|
| develop | Desenvolvimento | dev.medblast.com.br | Automático |
| staging | Homologação | staging.medblast.com.br | Automático |
| main | Produção | app.medblast.com.br | Manual/Aprovação |
