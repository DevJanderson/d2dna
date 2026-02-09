---
title: Busca Inteligente
description: Sistema de busca híbrida com algoritmo fonético, tolerância a erros e integração com o motor Tucuxi-BLAST.
order: 3
---

# Busca Inteligente

O Tucuxi oferece um sistema de busca híbrida que combina buscas determinísticas (por identificadores únicos) e probabilísticas (por similaridade), permitindo encontrar pacientes mesmo com dados parciais ou incorretos.

## Busca Fonética para Nomes Brasileiros

A busca fonética é otimizada para o português brasileiro, tratando particularidades como:

- Variações de acentuação (Jose vs. JOSE vs. Jose)
- Abreviações comuns (Maria da Silva vs. MARIA D. SILVA)
- Preposições opcionais (da, de, do, dos, das)
- Sons equivalentes em português (S/Z, N/M, G/Q, I/E)

O motor utiliza algoritmos fonéticos adaptados que codificam nomes em representações sonoras, permitindo encontrar matches mesmo quando a grafia difere.

### Parâmetros da busca fonética

| Parâmetro         | Descrição                                             | Padrão |
| ----------------- | ----------------------------------------------------- | ------ |
| `nome`            | Nome para busca fonética (aceita erros de digitação)  | -      |
| `nome_mae`        | Nome da mãe para busca fonética                       | -      |
| `data_nascimento` | Data de nascimento para filtrar resultados            | -      |
| `sexo`            | Sexo para filtrar resultados (M ou F)                 | -      |
| `min_similarity`  | Similaridade mínima para considerar match (0.0 a 1.0) | 0.7    |

## Tolerância a Erros Tipográficos

A abordagem DNA-encoded do Tucuxi-BLAST trata erros tipográficos como "mutações" de DNA. Análise de dados reais do SUS revelou os erros mais frequentes:

**Trocas de digitos mais comuns:**

- 1 e 0 (0.68% dos erros)
- 5 e 6 (0.60%)
- 6 e 7 (0.53%)

**Substituições de letras:** refletem a fonética do português e a proximidade de teclas no teclado. Letras foneticamente similares diferem por apenas um nucleotídeo na codificação DNA, permitindo que o BLAST as detecte como variações naturais.

## Tipos de Busca

### Busca por CPF

Busca determinística por CPF com validação de dígitos verificadores. Aceita o CPF com ou sem formatação (123.456.789-00 ou 12345678900).

### Busca por Nome

Busca probabilística utilizando algoritmo fonético. Tolera erros de digitação, variações de grafia e abreviações.

### Busca por Data de Nascimento

Pode ser combinada com outros campos. Suporta tolerância configurável para lidar com datas imprecisas ou dígitos trocados.

### Busca por CNS

Busca determinística pelo Cartão Nacional de Saúde (15 dígitos). Um paciente pode ter múltiplos CNS.

### Smart Search (Busca Composta)

A busca inteligente combina todos os campos disponíveis e seleciona automaticamente a melhor estratégia:

```typescript
interface SmartSearchRequest {
  cpf?: string // Maior peso no scoring
  cns?: string // Cartão Nacional de Saúde
  nome?: string // Nome completo
  data_nascimento?: string // Formato YYYY-MM-DD
  nome_mae?: string // Ajuda resolver homônimos
  sexo?: string // M ou F
  endereco?: object // Dados de endereço
  telefone?: string // Telefone de contato
  email?: string // E-mail de contato
}
```

O sistema avalia os campos fornecidos e decide entre:

- **Busca determinística** quando há identificador único (CPF, CNS)
- **Busca probabilística** quando há apenas dados demográficos
- **Busca composta** combinando múltiplas estratégias para maior precisão

## Integração com Tucuxi-BLAST

Quando a busca determinística não encontra resultados ou retorna matches ambíguos, o motor Tucuxi-BLAST entra em ação:

1. Codifica os campos de busca em sequências de DNA
2. Alinha contra a base de dados usando BLASTn
3. Classifica os resultados com Random Forest ou Regressão Logística
4. Retorna candidatos ordenados por score de confiança

### Regras de Score

| Score  | Classificação    | Ação                           |
| ------ | ---------------- | ------------------------------ |
| > 95%  | Match automático | Exibir diretamente             |
| 75-95% | Provável match   | Apresentar como sugestão       |
| 50-75% | Possível match   | Apresentar com alerta          |
| < 50%  | Improvável       | Não exibir ou exibir com aviso |
