# ValorDev - Backend (Fase 2)

Este é o back-end do sistema ValorDev desenvolvido em Java 21 com Spring Boot 3.3. Ele fornece os endpoints REST, autenticação com JWT e a orquestração do motor de cálculo de precificação para o front-end React Native.

## 🛠 Pré-requisitos

1. **Java 21** instalado.
2. **Maven 3.8+** instalado.
3. **PostgreSQL 16** instalado e rodando localmente (porta `5432`).

## 🗄️ Setup do Banco de Dados

1. Acesse o seu PostgreSQL via `psql` ou pgAdmin.
2. Crie o banco de dados `valordev`:

   ```sql
   CREATE DATABASE valordev;
   ```

   _(As credenciais padrão esperadas pelo Spring Boot são `postgres` / `postgres`. Se a sua senha for diferente, ajuste no arquivo `src/main/resources/application.yml` em `spring.datasource.password`)_

3. O **Flyway** rodará automaticamente no startup da aplicação e criará as 5 tabelas (users, user_profiles, clients, proposals, proposal_breakdown_items).

## 🚀 Como Rodar

Via terminal, na pasta `backend/`, execute:

```bash
mvn spring-boot:run
```

A API estará disponível na porta **8080**: `http://localhost:8080`.

## 📚 Documentação (Swagger UI)

Acesse a documentação viva e interativa dos endpoints pelo navegador:
👉 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

## 🧪 Testes E2E Manuais (Roteiro)

Siga este roteiro para testar o fluxo completo localmente usando o Front-end e o Swagger:

1. **Cadastro:**
   - No app, vá na aba Perfil -> Cadastrar (ou `POST /auth/register`).
   - Insira Nome, Email e Senha validos.
2. **Login:**
   - Faça login com as credenciais criadas (ou `POST /auth/login`).
   - O App receberá e armazenará o JWT.
3. **Perfil (Setup):**
   - Preencha os campos obrigatórios (Carga de trabalho, Regime de impostos, Pretensão salarial, Custos fixos).
   - Ao salvar, a API `PUT /users/me/profile` é chamada.
4. **Wizard (Proposta):**
   - Na tela Home do App, inicie um "Novo Cálculo".
   - Responda às 4 etapas: Projeto, Cliente, Opções de Pagamento.
   - Na 5ª etapa (Resumo), clique em **"Gerar estimativa comercial"**.
   - Isso envia o payload para `POST /proposals`. O backend calcula o risco e preço, e salva.
5. **Histórico:**
   - Acesse a aba Histórico (`GET /proposals`).
   - O cálculo recém gerado deve aparecer na lista.
6. **Dashboard:**
   - Acesse a aba Início/Dashboard (`GET /dashboard/summary`).
   - O gráfico ou termômetro de meta financeira (com base na sua pretensão configurada) e o funil de status/probabilidade refletirão sua nova proposta gerada.
