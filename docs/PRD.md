# PRD - Product Requirements Document
## Plataforma MedBlast

**Versão:** 2.0
**Data:** 24 de Janeiro de 2026
**Produto:** Sistema de Record Linkage e Gestão de Dados Médicos
**Empresa:** D2DNA

---

## 1. Visão do Produto

### 1.1 Declaração de Visão

> **Ser a plataforma definitiva de unificação de registros médicos no Brasil, eliminando duplicatas e garantindo que cada paciente tenha um histórico único, completo e confiável.**

### 1.2 O Problema

No sistema de saúde brasileiro, um mesmo paciente pode ter dezenas de cadastros diferentes espalhados por hospitais, clínicas, laboratórios e unidades básicas de saúde. Isso causa:

| Problema | Impacto |
|----------|---------|
| **Pacientes duplicados** | Mesmo paciente com 5, 10 ou mais cadastros em sistemas diferentes |
| **Dados inconsistentes** | Nome escrito de formas diferentes, datas erradas, documentos desatualizados |
| **Busca ineficiente** | Sem CPF exato, encontrar o paciente certo pode levar minutos |
| **Histórico fragmentado** | Médico não consegue ver exames anteriores de outra unidade |
| **Desperdício de recursos** | Exames repetidos, tratamentos duplicados, custos desnecessários |
| **Risco à vida** | Alergias não registradas, medicamentos incompatíveis prescritos |

### 1.3 A Solução

O **MedBlast** utiliza tecnologia proprietária de DNA (Digital Numeric Algorithm) para:

1. **Identificar** o mesmo paciente mesmo com dados incompletos ou inconsistentes
2. **Unificar** registros de múltiplas fontes em um cadastro único
3. **Qualificar** dados através de revisão humana assistida por IA
4. **Disponibilizar** histórico consolidado para profissionais autorizados

### 1.4 Proposta de Valor

| Para | Que | O MedBlast | Diferente de | Nossa solução |
|------|-----|------------|--------------|---------------|
| Secretarias de Saúde | precisam unificar milhões de cadastros | é uma plataforma de record linkage | sistemas manuais de deduplicação | usa algoritmo DNA com 95%+ de precisão em segundos |
| Hospitais | precisam encontrar pacientes rapidamente | oferece busca híbrida inteligente | busca apenas por CPF/nome exato | encontra pacientes mesmo com dados parciais |
| Operadoras | precisam garantir qualidade cadastral | provê workflow de revisão | planilhas e conferência manual | automatiza 80% das decisões com supervisão humana |

---

## 2. Personas

### 2.1 Maria - Operadora de Cadastro

**Perfil**
- 28 anos, técnica em enfermagem
- Trabalha no setor de admissão de hospital público
- Cadastra em média 80 pacientes por dia
- Usa computador básico, internet instável

**Contexto**
- Recebe pacientes na recepção, muitos sem documentos
- Precisa encontrar ou criar cadastro rapidamente
- Lida com nomes escritos errado, datas aproximadas
- Pressão para atender rápido (fila de espera)

**Dores**
- "Paciente não lembra o CPF e eu não acho ele no sistema"
- "Criei cadastro novo e depois descobri que já existia"
- "O sistema trava quando tento buscar por nome parcial"
- "Não sei se esse 'João Silva' é o mesmo de ontem"

**Objetivos**
- Encontrar paciente em menos de 30 segundos
- Nunca criar duplicata por engano
- Sistema fácil que não exija treinamento longo

**Métricas de Sucesso**
- Tempo médio de busca < 15 segundos
- Taxa de duplicatas criadas < 1%
- Satisfação com a ferramenta > 4/5

---

### 2.2 Carlos - Analista de Qualidade de Dados

**Perfil**
- 35 anos, formado em Sistemas de Informação
- Trabalha no setor de TI de uma Secretaria Municipal de Saúde
- Responsável por garantir qualidade do cadastro único
- Conhecimento técnico avançado

**Contexto**
- Recebe relatórios diários de possíveis duplicatas
- Precisa decidir: é o mesmo paciente ou não?
- Analisa documentos, histórico, padrões
- Meta de processar 500 revisões por dia

**Dores**
- "Passo horas comparando registros manualmente"
- "Não tenho certeza se posso unificar esses cadastros"
- "Quando erro um merge, é muito difícil desfazer"
- "Não tenho visibilidade do meu progresso"

**Objetivos**
- Tomar decisões corretas com informação clara
- Processar mais revisões em menos tempo
- Ter confiança nas suas decisões
- Rastrear seu trabalho e produtividade

**Métricas de Sucesso**
- Revisões processadas por hora > 30
- Taxa de acerto > 98%
- Tempo médio por decisão < 2 minutos

---

### 2.3 Dra. Fernanda - Coordenadora de Regulação

**Perfil**
- 45 anos, médica sanitarista
- Coordena a regulação de uma regional de saúde
- Gerencia equipe de 15 pessoas
- Reporta indicadores para a Secretaria Estadual

**Contexto**
- Precisa de visão gerencial da qualidade dos dados
- Toma decisões baseadas em relatórios
- Apresenta resultados em reuniões
- Cobra produtividade da equipe

**Dores**
- "Não sei quantas duplicatas ainda temos no sistema"
- "Não consigo medir a produtividade da minha equipe"
- "Os relatórios que tenho são desatualizados"
- "Não sei priorizar: o que resolver primeiro?"

**Objetivos**
- Dashboard atualizado em tempo real
- Relatórios automáticos para apresentações
- Visibilidade da produtividade individual
- Indicadores de qualidade do cadastro

**Métricas de Sucesso**
- Redução de duplicatas > 50% em 6 meses
- Todos os relatórios gerados automaticamente
- Tempo gasto em gestão operacional reduzido em 60%

---

### 2.4 Dr. Roberto - Médico Plantonista

**Perfil**
- 38 anos, clínico geral
- Trabalha em pronto-socorro de hospital conveniado
- Atende 40+ pacientes por plantão de 12 horas
- Acessa sistema pelo computador da enfermaria

**Contexto**
- Paciente chega inconsciente, sem documentos
- Precisa saber alergias, medicamentos em uso
- Não tem tempo para navegar em múltiplos sistemas
- Trabalha em plantões noturnos (modo escuro essencial)

**Dores**
- "Paciente não sabe o nome do remédio que toma"
- "Não consigo acessar exames feitos em outro hospital"
- "O histórico está fragmentado em vários cadastros"
- "Sistema lento atrasa meu atendimento"

**Objetivos**
- Encontrar paciente mesmo sem CPF
- Ver histórico unificado de qualquer unidade
- Informações críticas (alergias) em destaque
- Sistema rápido e disponível 24/7

**Métricas de Sucesso**
- Tempo para encontrar paciente < 10 segundos
- Histórico unificado disponível em 95% dos casos
- Uptime do sistema > 99.9%

---

## 3. Jornadas do Usuário

### 3.1 Jornada: Buscar Paciente (Maria - Operadora)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GATILHO: Paciente chega na recepção para atendimento                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. IDENTIFICAÇÃO INICIAL                                               │
│     Maria pergunta: "Qual seu nome completo e data de nascimento?"      │
│     Paciente: "José da Silva, nasci em março de 1975... não lembro o dia"│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. BUSCA NO SISTEMA                                                    │
│     Maria digita: "jose silva" + "1975"                                 │
│     Sistema busca usando algoritmo fonético + tolerância de data        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ 0 RESULTADOS│ │ 1 RESULTADO │ │ N RESULTADOS│
            │             │ │             │ │             │
            │ Criar novo  │ │ Confirmar   │ │ Selecionar  │
            │ cadastro    │ │ identidade  │ │ correto     │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. CONFIRMAÇÃO                                                         │
│     Maria confirma dados com paciente                                   │
│     "É o senhor que mora na Rua das Flores, 123?"                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. ATUALIZAÇÃO (se necessário)                                         │
│     Maria atualiza telefone, endereço, CNS                              │
│     Sistema registra histórico de alterações                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RESULTADO: Paciente identificado em < 30 segundos                      │
│             Sem duplicata criada                                        │
│             Dados atualizados                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Jornada: Revisar Match (Carlos - Analista)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GATILHO: Sistema detectou possível duplicata (score 75-95%)            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. FILA DE TRABALHO                                                    │
│     Carlos acessa sua fila: 47 revisões pendentes                       │
│     Ordenadas por: score (maior primeiro) + antiguidade                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ANÁLISE DO MATCH                                                    │
│     ┌──────────────────────┬──────────────────────┐                     │
│     │   REGISTRO A          │   REGISTRO B         │                    │
│     ├──────────────────────┼──────────────────────┤                     │
│     │ JOSE DA SILVA         │ JOSÉ DA SILVA        │ ✓ Similar          │
│     │ CPF: 123.456.789-00   │ CPF: (vazio)         │ ⚠ Incompleto       │
│     │ Nasc: 15/03/1975      │ Nasc: 00/03/1975     │ ⚠ Dia diferente    │
│     │ Mãe: MARIA SILVA      │ Mãe: MARIA DA SILVA  │ ✓ Similar          │
│     │ CNS: 1234567890       │ CNS: 9876543210      │ ⚠ Diferente        │
│     └──────────────────────┴──────────────────────┘                     │
│     Score: 87% | Motivo: Nome + Mãe + Mês nascimento                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. INVESTIGAÇÃO ADICIONAL                                              │
│     Carlos clica em "Ver histórico" de cada registro                    │
│     - Registro A: 15 atendimentos no Hospital X (2018-2024)             │
│     - Registro B: 3 atendimentos no UBS Y (2022-2023)                   │
│     Mesmo bairro, mesma faixa etária, padrão compatível                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌─────────────┐                 ┌─────────────┐
            │   APROVAR   │                 │  REJEITAR   │
            │   (Merge)   │                 │(Não é mesmo)│
            └─────────────┘                 └─────────────┘
                    │                               │
                    ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. DECISÃO: APROVAR                                                    │
│     Carlos seleciona registro "sobrevivente" (A - mais completo)        │
│     Escolhe quais campos do B incorporar (CNS adicional)                │
│     Adiciona comentário: "Mesmo paciente, CNS secundário adicionado"    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RESULTADO: Cadastros unificados                                        │
│             Histórico preservado de ambos                               │
│             Decisão auditável com justificativa                         │
│             Tempo: 1 minuto 45 segundos                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Jornada: Monitorar Qualidade (Dra. Fernanda - Gestora)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  GATILHO: Segunda-feira, 8h - Reunião semanal de indicadores            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  1. ACESSO AO DASHBOARD                                                 │
│     Fernanda abre o MedBlast no navegador                               │
│     Dashboard carrega com dados em tempo real                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. VISÃO GERAL                                                         │
│     ┌────────────────┬────────────────┬────────────────┐                │
│     │ TOTAL PACIENTES│ DUPLICATAS     │ REVISÕES       │                │
│     │ 2.847.293      │ DETECTADAS     │ PENDENTES      │                │
│     │ +1.2% semana   │ 12.847 (0.45%) │ 847            │                │
│     │                │ -15% mês       │ SLA: 92% OK    │                │
│     └────────────────┴────────────────┴────────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. PRODUTIVIDADE DA EQUIPE                                             │
│     ┌──────────────┬───────────┬───────────┬───────────┐                │
│     │ Analista     │ Revisões  │ Acurácia  │ Tempo/Rev │                │
│     ├──────────────┼───────────┼───────────┼───────────┤                │
│     │ Carlos       │ 487       │ 99.2%     │ 1m 32s    │                │
│     │ Ana          │ 412       │ 98.7%     │ 1m 45s    │                │
│     │ Pedro        │ 298       │ 97.1%     │ 2m 10s    │ ⚠ Atenção     │
│     └──────────────┴───────────┴───────────┴───────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. EXPORTAR RELATÓRIO                                                  │
│     Fernanda clica "Exportar PDF"                                       │
│     Relatório formatado para apresentação gerado em 3 segundos          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  RESULTADO: Reunião com dados atualizados                               │
│             Identificou analista que precisa de suporte                 │
│             Relatório pronto para Secretaria Estadual                   │
│             Tempo total: 5 minutos                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Casos de Uso Detalhados

### UC-01: Busca Inteligente de Paciente

**Ator Principal:** Operador de Cadastro, Profissional de Saúde

**Pré-condições:**
- Usuário autenticado no sistema
- Pelo menos um critério de busca disponível

**Fluxo Principal:**
1. Usuário acessa tela de busca
2. Usuário informa critérios disponíveis (nome, CPF, CNS, data nascimento, nome da mãe)
3. Sistema executa busca híbrida:
   - **Determinística**: CPF ou CNS exato (se informado)
   - **Probabilística**: Algoritmo DNA com scoring
4. Sistema retorna lista de candidatos com score de confiança
5. Usuário seleciona o paciente correto
6. Sistema exibe ficha completa do paciente

**Fluxos Alternativos:**

*4a. Nenhum resultado encontrado:*
1. Sistema sugere verificar grafia ou relaxar critérios
2. Usuário pode criar novo cadastro
3. Sistema verifica novamente para evitar duplicata

*4b. Múltiplos candidatos com score similar:*
1. Sistema exibe comparativo lado a lado
2. Usuário analisa diferenças
3. Usuário confirma seleção

**Regras de Negócio:**
- Score > 95%: Match automático (exibir direto)
- Score 75-95%: Apresentar como "provável match"
- Score 50-75%: Apresentar como "possível match"
- Score < 50%: Não exibir (ou exibir com alerta)

**Pós-condições:**
- Paciente identificado ou novo cadastro criado
- Log de busca registrado para auditoria

---

### UC-02: Revisar e Aprovar Match

**Ator Principal:** Analista de Qualidade

**Pré-condições:**
- Match pendente de revisão na fila
- Usuário com permissão de revisor

**Fluxo Principal:**
1. Analista acessa fila de revisões
2. Sistema apresenta próximo match (ordenado por prioridade)
3. Analista visualiza comparação lado a lado:
   - Dados demográficos
   - Score e motivo do match
   - Histórico de cada registro
4. Analista investiga dados adicionais se necessário
5. Analista decide: Aprovar, Rejeitar ou Pular
6. Se Aprovar:
   - Seleciona registro "sobrevivente"
   - Define quais campos incorporar do outro
   - Adiciona justificativa
7. Sistema executa merge e registra auditoria
8. Sistema apresenta próximo match

**Fluxos Alternativos:**

*5a. Analista seleciona "Pular":*
1. Sistema move para o final da fila
2. Registra que foi pulado e por quem

*5b. Analista seleciona "Rejeitar":*
1. Sistema solicita justificativa obrigatória
2. Registros são marcados como "não duplicatas"
3. Par não será sugerido novamente

**Regras de Negócio:**
- Merge é irreversível sem intervenção de admin
- Histórico de ambos registros é preservado
- CNS múltiplos são consolidados (paciente pode ter mais de um)
- Registro sobrevivente herda todos os vínculos

**Pós-condições:**
- Registros unificados ou marcados como distintos
- Decisão auditável com timestamp e justificativa
- Métricas do analista atualizadas

---

### UC-03: Cadastrar Novo Paciente

**Ator Principal:** Operador de Cadastro

**Pré-condições:**
- Busca prévia não encontrou o paciente
- Usuário com permissão de cadastro

**Fluxo Principal:**
1. Usuário clica "Novo Paciente"
2. Sistema exibe formulário com campos:
   - **Obrigatórios**: Nome completo
   - **Recomendados**: CPF, Data nascimento, Nome da mãe, Sexo
   - **Opcionais**: CNS, Telefone, Endereço, Email
3. Usuário preenche dados disponíveis
4. Sistema valida em tempo real:
   - CPF: Algoritmo de validação + verificação de duplicidade
   - CNS: Algoritmo + verificação se já existe
   - Data: Formato e plausibilidade
5. Ao salvar, sistema executa verificação final de duplicidade
6. Sistema cria registro e exibe ficha

**Fluxos Alternativos:**

*5a. Possível duplicata detectada:*
1. Sistema alerta: "Encontramos registros similares"
2. Exibe candidatos com score
3. Usuário confirma: "É este" ou "Criar mesmo assim"
4. Se criar, sistema marca para revisão posterior

**Regras de Negócio:**
- CPF deve ser único no sistema
- CNS pode existir em múltiplos registros (será unificado depois)
- Nome mínimo de 3 caracteres
- Data de nascimento não pode ser futura

**Pós-condições:**
- Novo paciente cadastrado
- Se houver suspeita de duplicata, match criado para revisão

---

### UC-04: Processamento em Lote (Batch)

**Ator Principal:** Analista de Qualidade, Administrador

**Pré-condições:**
- Arquivo CSV/Excel com dados de pacientes
- Usuário com permissão de importação

**Fluxo Principal:**
1. Usuário acessa "Importar Dados"
2. Usuário faz upload do arquivo (drag & drop ou seleção)
3. Sistema valida formato e exibe preview (primeiras 10 linhas)
4. Sistema detecta colunas automaticamente
5. Usuário ajusta mapeamento se necessário:
   - Coluna "NOME_PACIENTE" → Campo "nome"
   - Coluna "DT_NASC" → Campo "data_nascimento"
6. Usuário confirma e inicia processamento
7. Sistema processa em background:
   - Validação de cada registro
   - Busca de duplicatas
   - Criação ou atualização
8. Sistema exibe progresso em tempo real
9. Ao final, exibe relatório:
   - Criados: 1.234
   - Atualizados: 567
   - Duplicatas detectadas: 89 (enviadas para revisão)
   - Erros: 12 (com detalhamento)

**Regras de Negócio:**
- Limite de 100.000 registros por arquivo
- Formatos aceitos: CSV, XLSX, XLS
- Encoding: UTF-8 (detectado automaticamente)
- Timeout: 30 minutos máximo por lote

**Pós-condições:**
- Registros importados ou atualizados
- Duplicatas na fila de revisão
- Relatório de importação disponível

---

### UC-05: Gerar Relatório de Qualidade

**Ator Principal:** Gestor, Coordenador

**Pré-condições:**
- Usuário com permissão de relatórios
- Dados disponíveis no período selecionado

**Fluxo Principal:**
1. Usuário acessa "Relatórios"
2. Usuário seleciona tipo de relatório:
   - Qualidade do Cadastro
   - Produtividade da Equipe
   - Evolução de Duplicatas
   - Métricas de Sistema
3. Usuário define filtros (período, unidade, analista)
4. Sistema gera relatório em tempo real
5. Usuário visualiza gráficos e tabelas
6. Usuário exporta (PDF, Excel) se desejado

**Pós-condições:**
- Relatório gerado e exibido
- Se exportado, arquivo disponível para download

---

## 5. Requisitos Funcionais

### 5.1 Busca e Identificação

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-01 | Sistema deve buscar por nome usando algoritmo fonético (Soundex/Metaphone) | Must |
| RF-02 | Sistema deve buscar por CPF com validação de dígitos | Must |
| RF-03 | Sistema deve buscar por CNS (um paciente pode ter múltiplos) | Must |
| RF-04 | Sistema deve permitir busca por data de nascimento com tolerância de ±1 ano | Should |
| RF-05 | Sistema deve permitir busca combinada (nome + data + mãe) | Must |
| RF-06 | Sistema deve retornar resultados em menos de 2 segundos | Must |
| RF-07 | Sistema deve exibir score de confiança para cada resultado | Must |
| RF-08 | Sistema deve destacar campos que "casaram" na busca | Should |

### 5.2 Gestão de Pacientes

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-10 | Sistema deve permitir cadastro com apenas nome obrigatório | Must |
| RF-11 | Sistema deve validar CPF em tempo real | Must |
| RF-12 | Sistema deve validar CNS em tempo real | Must |
| RF-13 | Sistema deve alertar sobre possível duplicata antes de criar | Must |
| RF-14 | Sistema deve manter histórico de todas alterações | Must |
| RF-15 | Sistema deve permitir soft delete (nunca excluir de verdade) | Must |
| RF-16 | Sistema deve suportar múltiplos CNS por paciente | Must |
| RF-17 | Sistema deve normalizar nomes (uppercase, sem acentos para busca) | Should |

### 5.3 Sistema de Revisão

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-20 | Sistema deve criar match automaticamente quando score > 75% | Must |
| RF-21 | Sistema deve exibir comparação lado a lado de registros | Must |
| RF-22 | Sistema deve permitir aprovar, rejeitar ou pular revisão | Must |
| RF-23 | Sistema deve exigir justificativa para rejeição | Must |
| RF-24 | Sistema deve permitir escolher registro "sobrevivente" no merge | Must |
| RF-25 | Sistema deve preservar histórico de ambos registros após merge | Must |
| RF-26 | Sistema deve ordenar fila por score e antiguidade | Should |
| RF-27 | Sistema deve permitir filtrar fila por score, data, origem | Should |

### 5.4 Processamento em Lote

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-30 | Sistema deve aceitar upload de CSV e Excel | Must |
| RF-31 | Sistema deve detectar colunas automaticamente | Should |
| RF-32 | Sistema deve permitir mapeamento manual de colunas | Must |
| RF-33 | Sistema deve validar dados antes de processar | Must |
| RF-34 | Sistema deve exibir progresso em tempo real | Must |
| RF-35 | Sistema deve gerar relatório de importação | Must |
| RF-36 | Sistema deve permitir cancelar processamento em andamento | Should |

### 5.5 Dashboard e Relatórios

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-40 | Sistema deve exibir métricas em tempo real | Must |
| RF-41 | Sistema deve exibir gráfico de evolução de duplicatas | Should |
| RF-42 | Sistema deve exibir produtividade por analista | Must |
| RF-43 | Sistema deve permitir filtrar por período | Must |
| RF-44 | Sistema deve exportar relatórios em PDF | Should |
| RF-45 | Sistema deve exportar dados em Excel/CSV | Must |

---

## 6. Requisitos Não-Funcionais

### 6.1 Performance

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-01 | Tempo de resposta de busca | < 2 segundos (P95) |
| RNF-02 | Tempo de carregamento de página | < 3 segundos |
| RNF-03 | Throughput de processamento batch | > 1.000 registros/minuto |
| RNF-04 | Capacidade de armazenamento | > 50 milhões de registros |

### 6.2 Disponibilidade

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-10 | Uptime do sistema | > 99.9% |
| RNF-11 | Tempo máximo de indisponibilidade programada | 4 horas/mês |
| RNF-12 | Recovery Time Objective (RTO) | < 1 hora |
| RNF-13 | Recovery Point Objective (RPO) | < 15 minutos |

### 6.3 Segurança

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-20 | Autenticação | JWT com refresh token |
| RNF-21 | Autorização | RBAC com permissões granulares |
| RNF-22 | Criptografia em trânsito | TLS 1.3 |
| RNF-23 | Criptografia em repouso | AES-256 para dados sensíveis |
| RNF-24 | Auditoria | Log de todas ações com usuário e timestamp |
| RNF-25 | LGPD | Compliance total |

### 6.4 Usabilidade

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-30 | Tempo de treinamento para operador | < 2 horas |
| RNF-31 | Suporte a dark mode | Obrigatório |
| RNF-32 | Responsividade | Desktop e tablet |
| RNF-33 | Acessibilidade | WCAG 2.1 AA |

### 6.5 Escalabilidade

| ID | Requisito | Meta |
|----|-----------|------|
| RNF-40 | Usuários simultâneos | > 500 |
| RNF-41 | Crescimento de dados | 20% ao ano |
| RNF-42 | Horizontal scaling | Suportado |

---

## 7. Métricas de Sucesso

### 7.1 Métricas de Negócio

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Taxa de match automático | > 95% | Matches com score > 95% / Total de buscas |
| Redução de duplicatas | > 50% em 6 meses | Comparativo antes/depois |
| Tempo médio de identificação | < 15 segundos | Tempo entre busca e seleção |
| Taxa de falsos positivos | < 1% | Matches aprovados incorretamente |
| Taxa de falsos negativos | < 5% | Duplicatas não detectadas |

### 7.2 Métricas de Produto

| Métrica | Meta | Como Medir |
|---------|------|------------|
| DAU (Daily Active Users) | > 80% dos cadastrados | Usuários únicos/dia |
| Sessão média | > 30 minutos | Tempo logado |
| Feature adoption | > 70% | Usuários que usam cada feature |
| NPS (Net Promoter Score) | > 40 | Pesquisa trimestral |
| Tickets de suporte/usuário | < 0.5/mês | Tickets abertos |

### 7.3 Métricas Técnicas

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Response time P95 | < 200ms | APM monitoring |
| Error rate | < 0.1% | Logs de erro / Total requests |
| Cache hit rate | > 80% | Cache hits / Total requests |
| Uptime | > 99.9% | Monitoramento |

---

## 8. Fora de Escopo (v1.0)

Para manter o foco, os seguintes itens **NÃO** fazem parte desta versão:

| Item | Motivo | Versão Futura |
|------|--------|---------------|
| Aplicativo mobile nativo | Foco em web responsivo | v2.0 |
| Integração HL7/FHIR | Complexidade, poucos parceiros | v2.0 |
| Machine Learning para auto-merge | Requer volume de dados para treinar | v2.0 |
| Multi-tenancy completo | Foco em single-tenant primeiro | v2.0 |
| Biometria (facial, digital) | Custo de hardware | v3.0 |
| Integração DataSUS automática | Depende de API externa | v2.0 |
| Chatbot de atendimento | Não é core do produto | Não planejado |

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| **Record Linkage** | Processo de identificar registros que se referem à mesma entidade em diferentes fontes de dados |
| **Match** | Par de registros identificados como potencialmente referentes ao mesmo paciente |
| **Score** | Pontuação de 0-100% indicando a probabilidade de dois registros serem o mesmo paciente |
| **Merge** | Processo de unificar dois ou mais registros em um único |
| **Registro Sobrevivente** | O registro que permanece após um merge, incorporando dados dos outros |
| **DNA (Digital Numeric Algorithm)** | Algoritmo proprietário D2DNA para matching de registros |
| **CPF** | Cadastro de Pessoa Física - documento único de 11 dígitos |
| **CNS** | Cartão Nacional de Saúde - 15 dígitos, paciente pode ter múltiplos |
| **Busca Determinística** | Busca por identificador único exato (CPF, CNS) |
| **Busca Probabilística** | Busca por similaridade usando algoritmos fonéticos e fuzzy |
| **Soft Delete** | Marcar registro como excluído sem remover fisicamente do banco |
| **LGPD** | Lei Geral de Proteção de Dados - lei brasileira de privacidade |

---

## 10. Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 29/08/2025 | Equipe D2DNA | Documento inicial |
| 2.0 | 24/01/2026 | Equipe D2DNA | Reestruturação completa: personas, jornadas, casos de uso detalhados |

---

**Aprovações:**

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| Product Owner | | | |
| Tech Lead | | | |
| Stakeholder | | | |
