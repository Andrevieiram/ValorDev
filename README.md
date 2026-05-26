# ValorDev 🚀

> **Ferramenta de precificação e análise de risco para freelancers de tecnologia.**  
> Ajuda desenvolvedores e designers independentes a calcularem seu valor/hora ideal e gerarem propostas comerciais profissionais — com motor de cálculo 100% no servidor.

---

## 📑 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Arquitetura](#-arquitetura)
3. [Stack Tecnológica](#-stack-tecnológica)
4. [Estrutura do Repositório](#-estrutura-do-repositório)
5. [Pré-requisitos](#-pré-requisitos)
6. [Como Rodar — Back-end](#-como-rodar--back-end)
7. [Como Rodar — Front-end (Mobile/Web)](#-como-rodar--front-end-mobileweb)
8. [Variáveis de Ambiente](#-variáveis-de-ambiente)
9. [Banco de Dados](#-banco-de-dados)
10. [Endpoints da API](#-endpoints-da-api)
11. [Fluxo Completo da Aplicação](#-fluxo-completo-da-aplicação)
12. [Convenção de Branches](#-convenção-de-branches)

---

## 📖 Sobre o Projeto

O **ValorDev** é um sistema Cliente-Servidor em duas partes:

| Parte | Descrição |
|---|---|
| **Front-end** | App React Native (iOS, Android e Web) via Expo |
| **Back-end** | API REST Java 21 + Spring Boot 3.3 + PostgreSQL 16 |

O **front-end não calcula nada**. Ele coleta os dados do usuário pelo Wizard e envia para o back-end, que roda o motor de precificação e risco, persiste o resultado no banco e devolve a proposta completa. Isso garante consistência total nos valores independente do dispositivo usado.

### Funcionalidades Principais

- 🔐 **Autenticação Real** — Cadastro e login com BCrypt + JWT (token de 24h)
- 👤 **Perfil Financeiro** — Configure pretensão salarial, custos fixos, regime tributário e stack
- 🧙 **Wizard de Proposta (4 etapas)** — Cliente → Projeto → Ajustes → Revisão
- 💰 **Motor de Precificação (servidor)** — Calcula preço mínimo, recomendado e premium com base no perfil + projeto + cliente
- ⚠️ **Motor de Risco (servidor)** — Avalia score de risco do projeto com múltiplos fatores
- 📋 **Histórico de Propostas** — Lista, visualiza e exclui propostas salvas
- 📊 **Dashboard** — Funil de probabilidade e progresso de meta financeira
- 🌙 **Dark / Light Mode** — Troca automática baseada no tema do sistema

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────┐        ┌──────────────────────────────────────┐
│         CLIENTE (Front-end)     │        │          SERVIDOR (Back-end)          │
│                                 │        │                                      │
│  React Native + Expo Router     │        │  Spring Boot 3.3   (porta 8080)      │
│  ┌──────────────────────────┐   │ HTTP   │  ┌──────────────────────────────┐    │
│  │  Zustand (estado local)  │◄──┼──REST──┼►│  Controllers → Services       │    │
│  │  React Hook Form + Zod   │   │  JWT   │  │  PricingEngine + RiskEngine   │    │
│  │  Camada api/ (fetch)     │   │        │  │  Spring Data JPA / Hibernate  │    │
│  └──────────────────────────┘   │        │  └──────────────┬───────────────┘    │
│                                 │        │                 │                    │
│  Plataformas geradas:           │        │  ┌──────────────▼───────────────┐    │
│  • iOS App (nativo)             │        │  │    PostgreSQL 16 (porta 5432) │    │
│  • Android App (nativo)         │        │  │    5 tabelas via Flyway       │    │
│  • Web App (SPA no browser)     │        │  └──────────────────────────────┘    │
└─────────────────────────────────┘        └──────────────────────────────────────┘
```

> Para mais detalhes sobre a topologia, veja [Arquitetura_Detalhada.md](./Arquitetura_Detalhada.md).

---

## 🛠️ Stack Tecnológica

### Back-end (`/backend`)

| Tecnologia | Versão | Função |
|---|---|---|
| Java | 21 LTS | Linguagem principal |
| Spring Boot | 3.3 | Framework web |
| Spring Security | 3.3 | Autenticação e autorização |
| Spring Data JPA | 3.3 | ORM (Hibernate) |
| PostgreSQL | 16 | Banco de dados relacional |
| Flyway | embutido | Migrações de schema |
| jjwt | 0.12.5 | Geração e validação de JWT |
| springdoc-openapi | 2.5.0 | Swagger UI automático |
| Lombok | — | Redução de boilerplate |
| JUnit 5 + H2 | — | Testes automatizados |
| Maven | 3.8+ | Build e gerenciamento de dependências |

### Front-end (`/` raiz do projeto)

| Tecnologia | Versão | Função |
|---|---|---|
| React Native | via Expo SDK 51 | Framework base UI |
| Expo | SDK 51+ | Plataforma universal (iOS, Android, Web) |
| Expo Router | v3+ | Roteamento baseado em arquivos |
| TypeScript | 5+ | Tipagem estática |
| NativeWind | v4 | Tailwind CSS para React Native |
| Zustand | — | State management global |
| React Hook Form | — | Gerenciamento de formulários |
| Zod | — | Validação de schema |
| Lucide React Native | — | Ícones vetoriais |

---

## 📁 Estrutura do Repositório

```
novo_valorDev/
│
├── backend/                          # Back-end Java Spring Boot
│   ├── pom.xml                       # Dependências Maven
│   ├── README.md                     # Instruções específicas do backend
│   └── src/
│       ├── main/
│       │   ├── java/com/valordev/api/
│       │   │   ├── auth/             # Autenticação: User, JWT, AuthService, AuthController
│       │   │   ├── common/
│       │   │   │   ├── config/       # SecurityConfig, JwtAuthFilter, ApplicationConfig
│       │   │   │   └── exception/    # GlobalExceptionHandler (@RestControllerAdvice)
│       │   │   ├── engines/          # PricingEngine, RiskEngine, PricingConstants
│       │   │   ├── profile/          # UserProfile, ProfileService, ProfileController
│       │   │   ├── proposals/        # Proposal, Client, BreakdownItem, ProposalService
│       │   │   ├── dashboard/        # DashboardController, DashboardSummaryDto
│       │   │   └── ValorDevApplication.java
│       │   └── resources/
│       │       ├── application.yml   # Config do banco, JWT, Flyway, Swagger
│       │       └── db/migration/
│       │           └── V1__init.sql  # Schema PostgreSQL (5 tabelas)
│       └── test/
│           └── java/com/valordev/api/auth/
│               └── AuthServiceTest.java
│
├── app/                              # Rotas do Expo Router (telas)
│   ├── (tabs)/                       # Tab bar: Home, Histórico, Perfil
│   │   ├── index.tsx                 # Tela Home / Dashboard
│   │   ├── history.tsx               # Histórico de propostas
│   │   └── profile.tsx               # Tela de Perfil do usuário
│   ├── auth/                         # Fluxo de autenticação
│   │   ├── login.tsx                 # Tela de Login
│   │   └── register.tsx              # Tela de Cadastro
│   ├── wizard/                       # Wizard de criação de proposta
│   │   ├── _layout.tsx               # Layout stack do wizard
│   │   ├── index.tsx                 # Intro / splash do wizard
│   │   ├── client.tsx                # Etapa 1 — Dados do cliente
│   │   ├── project.tsx               # Etapa 2 — Dados do projeto
│   │   ├── adjustments.tsx           # Etapa 3 — Ajustes financeiros
│   │   └── review.tsx                # Etapa 4 — Revisão e envio
│   ├── result.tsx                    # Tela de resultado da proposta
│   └── setup-profile.tsx             # Configuração do perfil financeiro
│
├── api/                              # Camada de comunicação com o back-end
│   ├── client.ts                     # Fetch wrapper com baseURL + JWT header
│   ├── auth.api.ts                   # login(), register()
│   ├── profile.api.ts                # getProfile(), updateProfile()
│   ├── proposals.api.ts              # createProposal(), listProposals(), etc.
│   └── types.ts                      # DTOs espelhando as respostas do back
│
├── components/                       # Componentes reutilizáveis de UI
│   ├── layout/                       # ScreenContainer, AuthContainer, etc.
│   └── ui/                           # Button, Card, Input, Badge, Modal, etc.
│
├── store/                            # Stores Zustand
│   ├── auth.store.ts                 # Sessão do usuário e token JWT
│   ├── wizard.store.ts               # Estado temporário do wizard
│   ├── history.store.ts              # Cache do histórico de propostas
│   └── settings.store.ts             # Preferências do app (tema, idioma)
│
├── constants/                        # Constantes da aplicação
│   ├── routes.ts                     # Definição de todas as rotas
│   ├── wizard.ts                     # Etapas do wizard
│   └── layout.ts                     # Dimensões do tab bar, etc.
│
├── features/                         # Lógica de domínio por feature
│   ├── home/                         # Componentes e hooks da tela Home
│   └── wizard/                       # Schemas Zod e telas do wizard
│
├── hooks/                            # Custom hooks globais
│   └── useWizardNavigation.ts        # Navegação entre etapas do wizard
│
├── types/                            # Tipagens TypeScript compartilhadas
│   ├── pricing.types.ts              # Tipos do domínio de precificação
│   └── navigation.types.ts           # Tipos de rotas
│
├── theme/                            # Design system e tokens de cor
├── utils/                            # Funções utilitárias (formatCurrency, etc.)
├── locales/                          # Arquivos de internacionalização (pt, en)
├── Arquitetura_Detalhada.md          # Documento de arquitetura do sistema
└── README.md                         # Este arquivo
```

---

## ✅ Pré-requisitos

Antes de rodar o projeto, garanta que tem instalado:

| Ferramenta | Versão Mínima | Verificar com |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Java JDK | 21 | `java -version` |
| Maven | 3.8+ | `mvn -v` |
| PostgreSQL | 16 | `psql --version` |

---

## ☕ Como Rodar — Back-end

### 1. Configurar o Banco de Dados

Acesse o PostgreSQL e crie o banco:

```sql
CREATE DATABASE valordev;
```

> As credenciais padrão são `postgres` / `postgres`. Se a sua senha for diferente, edite `backend/src/main/resources/application.yml`.

### 2. Rodar o Spring Boot

```bash
cd backend
mvn spring-boot:run
```

A API sobe na porta **8080**. O **Flyway** cria automaticamente as 5 tabelas no primeiro start.

### 3. Verificar se está funcionando

```bash
# Health check
curl http://localhost:8080/actuator/health
# Resposta esperada: {"status":"UP"}
```

### 4. Acessar o Swagger UI

Abra no navegador: **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

Todos os endpoints estão documentados e podem ser testados de lá.

---

## 📱 Como Rodar — Front-end (Mobile/Web)

### 1. Instalar Dependências

```bash
# Na raiz do projeto (não dentro de /backend)
npm install
```

### 2. Configurar a URL da API

Crie um arquivo `.env.local` na raiz:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

> **No celular físico:** troque `localhost` pelo IP da sua máquina na rede local (ex: `http://192.168.1.10:8080`), porque o celular não enxerga o `localhost` do computador.

### 3. Iniciar o Expo

```bash
npx expo start --clear
```

No terminal interativo do Expo, pressione:

| Tecla | Ação |
|---|---|
| `w` | Abre no navegador (Web) |
| `a` | Abre no emulador Android |
| `i` | Abre no simulador iOS (macOS) |

### 4. Testar no Celular Físico

1. Instale o app **Expo Go** no celular (iOS ou Android).
2. Garanta que celular e computador estão na **mesma rede Wi-Fi**.
3. Escaneie o QR Code exibido no terminal com a câmera (iOS) ou pelo Expo Go (Android).

---

## 🔑 Variáveis de Ambiente

### Back-end (`application.yml` ou variáveis de sistema)

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_USER` | `postgres` | Usuário do PostgreSQL |
| `DB_PASS` | `postgres` | Senha do PostgreSQL |
| `JWT_SECRET` | `super-secret-key-...` | Chave HMAC-SHA256 para assinar o JWT (**troque em produção!**) |

### Front-end (`.env.local`)

| Variável | Padrão | Descrição |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | `http://localhost:8080` | URL base da API do back-end |

---

## 🗄️ Banco de Dados

O schema é gerenciado pelo **Flyway** e criado automaticamente. As 5 tabelas são:

```
users                    → Contas de usuário (email único, senha BCrypt)
  └── user_profiles      → Perfil financeiro 1:1 com users
  └── clients            → Clientes vinculados a cada user
  └── proposals          → Propostas com inputs + resultado calculado
        └── proposal_breakdown_items → Itens do breakdown de preço por proposta
```

### Relacionamentos

```
users ──1:1──► user_profiles
users ──1:N──► clients
users ──1:N──► proposals
clients ──1:N──► proposals (opcional)
proposals ──1:N──► proposal_breakdown_items
```

---

## 🌐 Endpoints da API

> Autenticação via `Authorization: Bearer <token>` em todos os endpoints protegidos.

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Cadastrar novo usuário |
| `POST` | `/auth/login` | ❌ | Login — retorna o JWT |
| `GET` | `/users/me/profile` | ✅ | Buscar perfil financeiro |
| `PUT` | `/users/me/profile` | ✅ | Salvar/atualizar perfil financeiro |
| `POST` | `/proposals` | ✅ | Criar proposta (roda os engines e salva) |
| `GET` | `/proposals` | ✅ | Listar todas as propostas do usuário |
| `GET` | `/proposals/{id}` | ✅ | Buscar uma proposta específica |
| `DELETE` | `/proposals/{id}` | ✅ | Excluir uma proposta |
| `GET` | `/dashboard/summary` | ✅ | Resumo agregado para o dashboard |
| `GET` | `/actuator/health` | ❌ | Health check da aplicação |
| `GET` | `/swagger-ui.html` | ❌ | Documentação interativa (Swagger) |

---

## 🔄 Fluxo Completo da Aplicação

```
[Usuário abre o app]
       │
       ▼
[Login / Cadastro] ──► POST /auth/register ou /auth/login
       │                         ↓
       │               Token JWT retornado e salvo no app
       ▼
[Setup do Perfil] ──► PUT /users/me/profile
  (pretensão, custos,         ↓
   regime tributário)    Perfil salvo no banco
       │
       ▼
[Wizard — 4 etapas]
  1. Dados do Cliente (nome, tipo, experiência digital...)
  2. Dados do Projeto (complexidade, prazo, horas, escopo...)
  3. Ajustes Financeiros (forma de pagamento, entrada, contrato...)
  4. Revisão — usuário confirma
       │
       ▼
[Clique em "Gerar Estimativa"] ──► POST /proposals
                                          ↓
                              Back-end carrega perfil do user
                                          ↓
                              RiskEngine avalia score de risco
                                          ↓
                              PricingEngine calcula preço:
                                • Mínimo (0.88x)
                                • Recomendado (1.0x)
                                • Premium (1.15x)
                                          ↓
                              Proposta salva no PostgreSQL
                                          ↓
                              JSON com resultado retornado
       │
       ▼
[Tela de Resultado]
  Exibe breakdown do preço, score de risco e alertas
       │
       ├──► [Histórico] ──► GET /proposals
       │
       └──► [Dashboard] ──► GET /dashboard/summary
```

---

## 🌿 Convenção de Branches

| Branch | Uso |
|---|---|
| `main` | Código estável, aprovado pelo time |
| `develop` | Integração — PRs são abertos aqui para revisão |
| `feat/nome-da-feature` | Desenvolvimento de novas funcionalidades |
| `fix/nome-do-bug` | Correção de bugs |

> **Regra:** nenhum commit vai direto para `main`. Todo código passa por `develop` primeiro.
