# Casos de Uso - ValorDev 🚀

Este documento descreve os Casos de Uso (Use Cases) do sistema **ValorDev**, mapeando as interações dos usuários (freelancers) com a plataforma, detalhando o funcionamento de cada etapa e propondo novas funcionalidades para expandir a solução.

---

## 🗺️ Diagrama Geral de Casos de Uso (Atual)

O diagrama abaixo ilustra os atores e a visão geral de todos os casos de uso atualmente implementados ou planejados para a base do sistema:

```mermaid
flowchart LR
  subgraph ValorDev ["ValorDev - Sistema de Precificação"]
    UC_Cadastro("(Cadastrar Conta)")
    UC_Login("(Realizar Login)")
    UC_Perfil("(Configurar Perfil Financeiro)")
    UC_CalcHora("(Calcular Valor/Hora Ideal)")
    UC_Wizard("(Calcular Proposta - Wizard)")
    UC_W1("(Preencher Dados do Cliente)")
    UC_W2("(Estimar Escopo e Horas)")
    UC_W3("(Realizar Análise de Risco)")
    UC_W4("(Aplicar Variáveis de Ajuste)")
    UC_Historico("(Visualizar Histórico)")
  end

  f[Freelancer]
  s[Sistema - Motor de Cálculo]

  f --> UC_Cadastro
  f --> UC_Login
  f --> UC_Perfil
  f --> UC_Wizard
  f --> UC_Historico

  UC_Perfil -.->|include| UC_CalcHora
  UC_Wizard -.->|include| UC_W1
  UC_Wizard -.->|include| UC_W2
  UC_Wizard -.->|include| UC_W3
  UC_Wizard -.->|include| UC_W4

  UC_CalcHora --> s
  UC_W3 --> s
```

---

## 📝 Detalhamento e Fluxos dos Casos de Uso Atuais

Abaixo, detalhamos o funcionamento de cada caso de uso atual acompanhado de seu respectivo diagrama de sequência para ilustrar o fluxo de informações:

### 1. Cadastrar Conta (Cadastro)
* **Ator Principal**: Freelancer.
* **Descrição**: Permite que um novo desenvolvedor/designer crie uma conta no aplicativo utilizando e-mail e senha.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Cadastro)
  participant Store as Zustand Store
  
  Freelancer->>App: Preenche E-mail, Senha e Confirmação
  App->>App: Valida campos (Zod)
  alt Erro de validação
    App-->>Freelancer: Exibe alertas de validação
  else Sucesso
    App->>Store: Envia credenciais para registro
    Store->>Store: Salva dados do usuário local/nuvem
    Store-->>App: Confirmação de registro
    App-->>Freelancer: Redireciona para Configuração de Perfil
  end
```

---

### 2. Realizar Login
* **Ator Principal**: Freelancer.
* **Descrição**: Autenticação de usuários já cadastrados para acessar suas informações e propostas.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Login)
  participant Store as Zustand Store
  
  Freelancer->>App: Insere E-mail e Senha
  App->>Store: Solicita autenticação
  Store->>Store: Valida credenciais e carrega dados
  alt Credenciais inválidas
    Store-->>App: Retorna erro
    App-->>Freelancer: Exibe erro de autenticação
  else Login com sucesso
    Store-->>App: Sessão iniciada
    App-->>Freelancer: Redireciona para Dashboard/Home
  end
```

---

### 3. Configurar Perfil Financeiro
* **Ator Principal**: Freelancer.
* **Atores Coadjuvantes**: Sistema.
* **Descrição**: Definição de despesas, metas de rendimento e horas produtivas para obter a taxa horária ideal.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Setup Perfil)
  participant Calc as Motor de Cálculo
  participant Store as Zustand Store
  
  Freelancer->>App: Insere despesas, ganho desejado e horas
  App->>Calc: Envia dados para cálculo do valor/hora
  Calc->>Calc: Divide custos mensais pelas horas produtivas
  Calc-->>App: Retorna Valor/Hora Ideal
  App->>Store: Salva perfil e valor/hora calculado
  Store-->>App: Confirmação de gravação
  App-->>Freelancer: Exibe valor/hora ideal calculado
```

---

### 4. Calcular Proposta (Wizard)
* **Ator Principal**: Freelancer.
* **Atores Coadjuvantes**: Sistema.
* **Descrição**: Guia passo a passo para calcular o preço ideal de um projeto de software/design.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Wizard)
  participant Calc as Motor de Cálculo
  participant Store as Zustand (HistoryStore)
  
  Freelancer->>App: Etapa 1: Dados do Cliente
  Freelancer->>App: Etapa 2: Escopo e Horas estimadas
  Freelancer->>App: Etapa 3: Responde análise de risco
  Freelancer->>App: Etapa 4: Define impostos, lucro e gordura
  App->>Calc: Envia dados coletados + Valor/Hora
  Calc->>Calc: Calcula preço base + margem de risco + impostos
  Calc-->>App: Retorna Breakdown do Preço
  App->>Store: Salva proposta no Histórico
  App-->>Freelancer: Etapa 5: Exibe proposta final formatada
```

---

### 5. Histórico de Estimativas
* **Ator Principal**: Freelancer.
* **Descrição**: Listagem de todas as propostas salvas no dispositivo para posterior consulta.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Histórico)
  participant Store as Zustand (HistoryStore)
  
  Freelancer->>App: Acessa aba Histórico
  App->>Store: Solicita lista de propostas
  Store-->>App: Retorna array de propostas salvas
  App-->>Freelancer: Exibe lista cronológica na tela
```

---

## 💡 Sugestões de Novos Casos de Uso (Em Parte Separada)

Abaixo estão descritos e mapeados individualmente os novos casos de uso sugeridos para o ecossistema do **ValorDev**:

### 🗺️ Diagrama Geral de Casos de Uso Expandido

Este diagrama ilustra a integração dos novos casos de uso recomendados:

```mermaid
flowchart LR
  subgraph ValorDevExpandido ["ValorDev - Ecossistema Expandido"]
    %% Casos de Uso Atuais
    UC_Perfil("(Configurar Perfil Financeiro)")
    UC_Wizard("(Calcular Proposta - Wizard)")
    UC_Historico("(Visualizar Histórico)")
    
    %% Novos Casos de Uso Sugeridos
    UC_Export("(Exportar Proposta - PDF/Link)")
    UC_Tracker("(Registrar Horas Reais - Tracker)")
    UC_Desvio("(Analisar Desvio de Horas)")
    UC_Dash("(Visualizar Dashboard Financeiro)")
    UC_Contrato("(Gerar Contrato de Serviço)")
    UC_Sene("(Simular Cenários 'E se?')")
  end

  f[Freelancer]
  s[Sistema]

  f --> UC_Perfil
  f --> UC_Wizard
  f --> UC_Historico
  f --> UC_Tracker
  f --> UC_Dash
  f --> UC_Sene

  %% Relações e Extensões
  UC_Wizard -.->|extend| UC_Export
  UC_Wizard -.->|extend| UC_Contrato
  UC_Tracker -.->|include| UC_Desvio
  UC_Desvio --> s
  UC_Dash --> s
```

---

### Detalhamento dos Novos Fluxos

### 6. Exportar Proposta Comercial (PDF ou Link)
* **Descrição**: Permite exportar a proposta comercial detalhada em PDF ou gerar um link público seguro para compartilhamento direto com o cliente final.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Resultado)
  participant Exp as Servidor/Gerador PDF
  actor Cliente as Cliente Final
  
  Freelancer->>App: Solicita exportação (PDF ou Link)
  App->>Exp: Envia dados consolidados da proposta
  Exp->>Exp: Renderiza template comercial (PDF ou HTML)
  alt Geração de PDF
    Exp-->>App: Retorna arquivo PDF
    App-->>Freelancer: Abre menu de compartilhamento do celular
  else Geração de Link
    Exp-->>App: Retorna URL gerada
    App-->>Freelancer: Copia link para a área de transferência
  end
  Freelancer->>Cliente: Envia proposta comercial
```

---

### 7. Registro de Horas Reais vs. Estimadas (Time Tracker)
* **Descrição**: Timer integrado que permite ao freelancer medir as horas efetivamente gastas em tarefas e compará-las com a estimativa do Wizard (análise de desvio).
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Tracker)
  participant Store as Zustand (ProjectStore)
  
  Freelancer->>App: Inicia cronômetro na tarefa X
  loop Enquanto trabalha
    App->>App: Atualiza tempo decorrido em tempo real
  end
  Freelancer->>App: Pausa/Finaliza cronômetro
  App->>Store: Salva horas reais gastas na tarefa
  Store-->>App: Atualiza progresso do projeto
  App-->>Freelancer: Exibe tempo total e comparação com estimativa
```

---

### 8. Dashboard de Saúde Financeira
* **Descrição**: Gráficos consolidados do faturamento de projetos ativos, faturamento planejado e taxa de conversão de propostas.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Dashboard)
  participant Store as Zustand (HistoryStore / ProfileStore)
  
  Freelancer->>App: Abre aba Dashboard
  App->>Store: Obtém dados de perfil e propostas fechadas
  Store-->>App: Retorna dados
  App->>App: Agrupa faturamento por mês e calcula taxa de conversão
  App-->>Freelancer: Exibe gráficos (Faturamento real vs. Projetado, taxa de conversão)
```

---

### 9. Gerador Automatizado de Contratos
* **Descrição**: Preenche automaticamente um contrato jurídico básico de prestação de serviços com os valores, datas de entrega e escopo gerados no Wizard.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Resumo)
  participant Gen as Gerador de Contrato
  
  Freelancer->>App: Solicita geração de contrato
  App->>Gen: Envia dados (Cliente, escopo, valores e prazos)
  Gen->>Gen: Preenche modelo jurídico com as variáveis
  Gen-->>App: Retorna documento do contrato (.docx / .pdf)
  App-->>Freelancer: Disponibiliza download/compartilhamento do contrato
```

---

### 10. Simulador Financeiro de Cenários ("E se?")
* **Descrição**: Interface interativa que calcula em tempo real o impacto que despesas novas ou alterações nas férias/horas de trabalho exercem sobre o valor/hora mínimo viável.
* **Fluxo de Sistema**:

```mermaid
sequenceDiagram
  actor Freelancer
  participant App as App (Simulador)
  participant Calc as Motor de Cálculo
  
  Freelancer->>App: Altera variáveis rápidas (ex: menos dias úteis ou novas ferramentas)
  App->>Calc: Envia novas variáveis simuladas
  Calc->>Calc: Recalcula valor/hora ideal sob o novo cenário
  Calc-->>App: Retorna novos resultados
  App-->>Freelancer: Atualiza gráficos de comparação dinamicamente
```
