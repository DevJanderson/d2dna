---
title: Tucuxi-BLAST
description: Pesquisa acadêmica que originou o Tucuxi — Record Linkage com abordagem DNA-encoded usando ferramentas de bioinformática.
order: 1
---

# Tucuxi-BLAST

O Tucuxi-BLAST é o resultado da pesquisa de doutorado de **José Deney Alves de Araújo**, desenvolvida na Faculdade de Ciências Farmacêuticas da Universidade de São Paulo (USP/FCF) com orientação do **Prof. Helder Takashi Imoto Nakaya**, no Laboratório de Bioinformática do Instituto de Matemática e Estatística (IME/USP).

## Publicação

| Recurso           | Link                                                                |
| ----------------- | ------------------------------------------------------------------- |
| **Paper (PeerJ)** | [10.7717/peerj.13507](https://doi.org/10.7717/peerj.13507)          |
| **PubMed**        | [PMID: 35769143](https://pubmed.ncbi.nlm.nih.gov/35769143/)         |
| **PMC**           | [PMC9234519](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9234519/) |
| **GitHub**        | [tucuxi-blast](https://github.com/jodalen/tucuxi-blast)             |

## O Problema

Os sistemas de saúde pública do Brasil — em especial os bancos de dados do SUS (Sistema Único de Saúde) — sofrem com um problema crônico: **as bases de dados não se comunicam entre si**. Registros de um mesmo paciente existem fragmentados em múltiplos sistemas, com dados inconsistentes, nomes escritos de formas diferentes, datas de nascimento divergentes e identificadores que não coincidem.

Essa fragmentação impede a vinculação confiável de registros (_Record Linkage_), dificultando desde o acompanhamento individual de pacientes até a geração de estatísticas epidemiológicas precisas.

## A Solução

A pesquisa propõe uma abordagem inovadora: **reaproveitar ferramentas consolidadas de bioinformática** para resolver o problema de Record Linkage. Especificamente, o método codifica dados demográficos de pacientes usando uma abordagem baseada em DNA (_DNA-encoded approach_), permitindo o uso do algoritmo **BLAST** (Basic Local Alignment Search Tool) — amplamente utilizado para comparação de sequências genéticas — na comparação de registros de saúde.

## O Nome

O nome **Tucuxi** é uma homenagem ao boto-cinza (_Sotalia fluviatilis_), também conhecido como tucuxi. Esse golfinho de água doce, nativo da bacia amazônica brasileira, simboliza a identidade nacional do projeto e sua conexão com a biodiversidade do país.

## Ecossistema Tucuxi

A pesquisa gerou um ecossistema de ferramentas complementares:

| Ferramenta         | Descrição                                                     |
| ------------------ | ------------------------------------------------------------- |
| **Tucuxi-BLAST**   | Motor principal de Record Linkage com codificação DNA e BLAST |
| **Tucuxi-BW**      | Versão otimizada usando Burrows-Wheeler Aligner               |
| **Tucuxi-Tail**    | Módulo de pós-processamento e análise de resultados           |
| **Tucuxi-Curumim** | Interface para revisão humana assistida de vinculações        |

## Resultados

Os benchmarks publicados demonstram ganhos significativos em relação aos métodos tradicionais de Record Linkage:

| Métrica        | Resultado                                     |
| -------------- | --------------------------------------------- |
| **Velocidade** | 5.69x mais rápido que abordagens tradicionais |
| **Acurácia**   | Superior a 98% na vinculação de registros     |
| **Uso de RAM** | 0.4 GB vs 3 GB dos métodos convencionais      |

A combinação de alta velocidade, baixo consumo de memória e acurácia elevada torna o Tucuxi-BLAST viável para uso em larga escala em sistemas de saúde pública, mesmo em infraestruturas com recursos computacionais limitados.

## Do Acadêmico ao Produto

O **Tucuxi-Webapp** é a evolução dessa pesquisa em um produto web completo, mantendo os algoritmos originais e adicionando uma interface moderna para gerenciamento de vinculações, revisão humana assistida (curadoria) e integração com sistemas de saúde via API.
