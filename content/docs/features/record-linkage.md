---
title: Record Linkage
description: Como o Tucuxi-BLAST utiliza codificação DNA, alinhamento BLAST e Machine Learning para vincular registros médicos com alta acurácia.
order: 1
---

# Record Linkage

O **record linkage** (vinculação de registros) é o processo de identificar registros que se referem à mesma entidade em diferentes fontes de dados. No contexto de saúde, isso significa encontrar o mesmo paciente em bases distintas, mesmo quando os dados contêm erros, variações ou campos incompletos.

## Por que é necessário?

Sistemas de saúde como o SUS mantêm milhões de registros de pacientes espalhados por hospitais, clínicas, laboratórios e unidades básicas. Um mesmo paciente pode ter dezenas de cadastros diferentes, com:

- Nomes escritos de formas diferentes (Maria da Silva vs. MARIA D. SILVA)
- Erros tipográficos nos campos
- Datas de nascimento com dígitos trocados
- Documentos ausentes ou desatualizados

A unificação desses registros é essencial para garantir histórico completo, evitar exames repetidos e prevenir riscos como alergias não registradas.

## Abordagem Tucuxi-BLAST

O Tucuxi-BLAST resolve o problema de record linkage reaproveitando ferramentas de bioinformática. O pipeline funciona em três etapas:

### 1. Codificação DNA

Os campos de identificação pessoal são convertidos em sequências de nucleotídeos (A, T, C, G):

| Campo                  | Exemplo        |
| ---------------------- | -------------- |
| **Nome**               | JOSE DA SILVA  |
| **Data de nascimento** | 15/03/1975     |
| **Sexo**               | M              |
| **Nome da mãe**        | MARIA DA SILVA |

A conversão utiliza uma **roda de códons** que muda dinamicamente a cada execução. Isso garante que os dados pessoais nunca sejam armazenados em texto legível, funcionando como uma camada de criptografia on-the-fly.

Letras foneticamente similares em português (N/M, S/Z, G/Q, I/E) diferem por apenas um nucleotídeo na representação, permitindo que o algoritmo trate erros tipográficos como "mutações" naturais de DNA.

### 2. Alinhamento via BLAST

Após a codificação, o algoritmo **BLASTn** (Basic Local Alignment Search Tool) realiza o alinhamento de sequências entre os bancos de dados. Os bit-scores e E-values são normalizados como porcentagens dos hits ótimos, evitando viés contra nomes curtos.

### 3. Classificação por Machine Learning

Dois modelos classificam os resultados do alinhamento:

- **Random Forest** (75 estimadores, criterio de entropia)
- **Regressão Logística**

Utilizando 6 métricas do BLAST: bit-score normalizado, mismatches, gap openings, query coverage e posições de início do alinhamento.

## Roda de Codons e Privacidade

A roda de códons é o mecanismo central de conversão de caracteres para nucleotídeos. Ela muda dinamicamente a cada execução, o que significa que:

- Os dados pessoais **nunca são armazenados em texto plano**
- A mesma entrada gera sequências diferentes em execuções distintas
- Não é possível reverter a sequência de DNA para o texto original sem a roda usada na codificação

Esse design foi inspirado no princípio de **degenerescência do código genético**, onde múltiplos codons podem codificar o mesmo aminoácido.

## Performance

Os benchmarks publicados demonstram a superioridade do Tucuxi-BLAST:

| Métrica                          | Tucuxi-BLAST          | Estado da Arte (CIDACS-RL) |
| -------------------------------- | --------------------- | -------------------------- |
| Tempo (200k registros vs 300M)   | **23 horas**          | 5 dias e 7 horas           |
| Velocidade relativa              | **5.69x mais rápido** | 1x                         |
| Uso de RAM                       | **0.4 GB**            | 3 GB                       |
| Acurácia (Random Forest)         | **98.68%**            | -                          |
| Acurácia (Regressão Logística)   | **97.76%**            | -                          |
| F-score e AUC (bancos reais SUS) | **> 98%**             | -                          |

O Tucuxi-BLAST foi validado com bancos reais do SUS (SINAN e SIM) contendo dados de tuberculose, HIV/AIDS e meningite, além de banco simulado com **300 milhões de registros** gerado pelo Tucuxi-Curumim.

::docs-tip
A abordagem Tucuxi-BLAST foi publicada no PeerJ em 2022. Para detalhes completos sobre a metodologia e resultados, consulte o paper original: [DOI: 10.7717/peerj.13507](https://doi.org/10.7717/peerj.13507).
::
