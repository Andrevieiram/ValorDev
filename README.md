# ValorDev - Guia da Branch `develop_test`

Bem-vindo à branch `develop_test` do **ValorDev**. Esta branch foi criada especificamente para validar e testar a integração completa entre o backend (Spring Boot) e o frontend (React Native/Expo) em ambiente local. Ela já conta com configurações de ambiente resolvidas e um banco de dados robusto com dados fictícios para testes de UI/UX.

## 🚀 O que há de novo nesta branch?

- **Ambiente e Banco de Dados Corrigidos:** O banco de dados PostgreSQL foi reconfigurado e os problemas de conflitos de migração do Flyway foram resolvidos recriando o schema `public`.
- **Dados Massivos (Mock de UI):** O banco de dados foi extensivamente populado para a conta `kevinkennedy.dev@gmail.com`. Foram inseridos:
  - Um **Perfil Financeiro** de usuário completo (horas, gastos, renda desejada).
  - **3 Clientes** fictícios de diferentes portes.
  - **Mais de 10 Propostas** em diferentes estágios do funil (draft, sent, won, lost).
  - Múltiplos **Itens de Escopo (Breakdown Items)** para popular as listagens internas das propostas.
- **Correções de Serialização (Enums):** Foram realizados os devidos ajustes direto na base de dados para garantir que os valores textuais combinem de forma exata com os Enums do Java (ex: `SENIOR`, `SIMPLES_NACIONAL`, `BACKEND`), sanando um erro 500 silencioso que impedia a renderização do Dashboard.

---

## 🛠️ Como rodar o projeto localmente

### 1. Banco de Dados (PostgreSQL)

Certifique-se de que o seu PostgreSQL está rodando na porta padrão (5432).
O projeto utiliza as variáveis de ambiente `DB_USER` (padrão: `postgres`) e `DB_PASS` para conectar ao banco. Configure-as de acordo com a sua instalação local.

> **Dica:** Se tiver problemas de bloqueio de conexão local, edite seu arquivo `pg_hba.conf` alterando os métodos IPv4 e IPv6 locais para `trust` durante os testes.

### 2. Backend (Spring Boot)

O backend foi ajustado para subir perfeitamente ignorando problemas prévios de testes de integração na pipeline.

1. Abra um terminal na pasta onde fica o backend (ex: `novo_valorDev/backend`).
2. Suba o servidor com Maven, injetando sua senha local e pulando os testes para uma execução ágil (exemplo em PowerShell):
   ```bash
   $env:DB_PASS='sua_senha_aqui'; $env:DB_USER='postgres'; mvn clean spring-boot:run "-Dmaven.test.skip=true"
   ```
   O servidor estará ativo na porta `http://localhost:8084`.

### 3. Frontend (React Native / Expo)

Para abrir o aplicativo e ver o Dashboard:

1. Abra o terminal na raiz do frontend (ex: `novo_valorDev`).
2. Instale as dependências (caso ainda não tenha feito):
   ```bash
   npm install
   ```
3. Inicie o Metro Bundler limpando o cache e abrindo um túnel seguro (isso evita problemas de bloqueio de firewall pelo Windows no Expo Go):
   ```bash
   npx expo start --clear --tunnel
   ```
4. Escaneie o QR code com o Expo Go no seu celular.

---

## 🧪 Usuário de Testes

O projeto utiliza o **Flyway** para rodar migrações no banco de dados. Ao iniciar o backend pela primeira vez, o script `V3__insert_mock_data.sql` será executado automaticamente para popular a base de dados com o usuário de testes e todos os dados fictícios (clientes, propostas e itens de escopo).

Para visualizar o Dashboard populado em todo o seu potencial, entre no App com a seguinte conta (criada automaticamente):

- **E-mail:** `kevinkennedy.dev@gmail.com`
- **Senha:** `password123`
