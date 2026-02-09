---
title: Busca Inteligente
description: Sistema de busca hibrida com algoritmo fonetico, tolerancia a erros e integracao com o motor Tucuxi-BLAST.
order: 3
---

# Busca Inteligente

O Tucuxi oferece um sistema de busca hibrida que combina buscas deterministicas (por identificadores unicos) e probabilisticas (por similaridade), permitindo encontrar pacientes mesmo com dados parciais ou incorretos.

## Busca Fonetica para Nomes Brasileiros

A busca fonetica e otimizada para o portugues brasileiro, tratando particularidades como:

- Variacoes de acentuacao (Jose vs. JOSE vs. Jose)
- Abreviacoes comuns (Maria da Silva vs. MARIA D. SILVA)
- Preposicoes opcionais (da, de, do, dos, das)
- Sons equivalentes em portugues (S/Z, N/M, G/Q, I/E)

O motor utiliza algoritmos foneticos adaptados que codificam nomes em representacoes sonoras, permitindo encontrar matches mesmo quando a grafia difere.

### Parametros da busca fonetica

| Parametro         | Descricao                                             | Padrao |
| ----------------- | ----------------------------------------------------- | ------ |
| `nome`            | Nome para busca fonetica (aceita erros de digitacao)  | -      |
| `nome_mae`        | Nome da mae para busca fonetica                       | -      |
| `data_nascimento` | Data de nascimento para filtrar resultados            | -      |
| `sexo`            | Sexo para filtrar resultados (M ou F)                 | -      |
| `min_similarity`  | Similaridade minima para considerar match (0.0 a 1.0) | 0.7    |

## Tolerancia a Erros Tipograficos

A abordagem DNA-encoded do Tucuxi-BLAST trata erros tipograficos como "mutacoes" de DNA. Analise de dados reais do SUS revelou os erros mais frequentes:

**Trocas de digitos mais comuns:**

- 1 e 0 (0.68% dos erros)
- 5 e 6 (0.60%)
- 6 e 7 (0.53%)

**Substituicoes de letras:** refletem a fonetica do portugues e a proximidade de teclas no teclado. Letras foneticamente similares diferem por apenas um nucleotideo na codificacao DNA, permitindo que o BLAST as detecte como variacoes naturais.

## Tipos de Busca

### Busca por CPF

Busca deterministica por CPF com validacao de digitos verificadores. Aceita o CPF com ou sem formatacao (123.456.789-00 ou 12345678900).

### Busca por Nome

Busca probabilistica utilizando algoritmo fonetico. Tolera erros de digitacao, variacoes de grafia e abreviacoes.

### Busca por Data de Nascimento

Pode ser combinada com outros campos. Suporta tolerancia configravel para lidar com datas imprecisas ou digitos trocados.

### Busca por CNS

Busca deterministica pelo Cartao Nacional de Saude (15 digitos). Um paciente pode ter multiplos CNS.

### Smart Search (Busca Composta)

A busca inteligente combina todos os campos disponiveis e seleciona automaticamente a melhor estrategia:

```typescript
interface SmartSearchRequest {
  cpf?: string // Maior peso no scoring
  cns?: string // Cartao Nacional de Saude
  nome?: string // Nome completo
  data_nascimento?: string // Formato YYYY-MM-DD
  nome_mae?: string // Ajuda resolver homonimos
  sexo?: string // M ou F
  endereco?: object // Dados de endereco
  telefone?: string // Telefone de contato
  email?: string // E-mail de contato
}
```

O sistema avalia os campos fornecidos e decide entre:

- **Busca deterministica** quando ha identificador unico (CPF, CNS)
- **Busca probabilistica** quando ha apenas dados demograficos
- **Busca composta** combinando multiplas estrategias para maior precisao

## Integracao com Tucuxi-BLAST

Quando a busca deterministica nao encontra resultados ou retorna matches ambiguos, o motor Tucuxi-BLAST entra em acao:

1. Codifica os campos de busca em sequencias de DNA
2. Alinha contra a base de dados usando BLASTn
3. Classifica os resultados com Random Forest ou Regressao Logistica
4. Retorna candidatos ordenados por score de confianca

### Regras de Score

| Score  | Classificacao    | Acao                           |
| ------ | ---------------- | ------------------------------ |
| > 95%  | Match automatico | Exibir diretamente             |
| 75-95% | Provavel match   | Apresentar como sugestao       |
| 50-75% | Possivel match   | Apresentar com alerta          |
| < 50%  | Improvavel       | Nao exibir ou exibir com aviso |
