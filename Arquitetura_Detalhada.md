# Arquitetura Detalhada — ValorDev

Este documento descreve o funcionamento detalhado da arquitetura do **ValorDev**, detalhando como os clientes (Web e Mobile) interagem com o Back-end (Java/Spring Boot) e como as responsabilidades do sistema estão divididas.

---

## 1. Visão Geral da Arquitetura

O ValorDev utiliza uma arquitetura **Cliente-Servidor (Client-Server)** baseada em API REST. O sistema é composto por três partes fundamentais:

1. **Back-end (Servidor):** Construído em Java com Spring Boot. Atua como o núcleo (core) do sistema, mantendo a única fonte da verdade (Single Source of Truth) para os dados, as regras de negócio de precificação e o gerenciamento de contas.
2. **Banco de Dados:** PostgreSQL relacional que persiste os usuários, propostas, clientes e cálculos.
3. **Front-end (Cliente Web e Mobile):** Um único código-fonte (Monorepo) construído com React Native e Expo (Expo Router), capaz de gerar tanto o site Web quanto os aplicativos nativos (iOS e Android).

---

## 2. O Back-end (Java + Spring Boot)

O Back-end do ValorDev é uma API RESTful stateless.

### 2.1. Responsabilidades
- **Autenticação e Segurança:** Gerencia o cadastro e o login dos usuários. Protege as rotas via **JWT (JSON Web Token)** criptografado. Todas as senhas são armazenadas com hash BCrypt seguro.
- **Regras de Negócio de Precificação:** Todo o motor de cálculo ("Pricing Engine") vive no servidor. O back-end recebe os *inputs* (dados brutos do projeto e do cliente fornecidos no Front) e calcula o Valor-Hora, o Preço Recomendado e o Risco de forma padronizada.
- **Persistência de Dados:** O servidor salva todo o histórico no PostgreSQL.
- **Validação de Dados:** Assegura a integridade dos dados usando `@Valid` para evitar que propostas inconsistentes sejam geradas ou persistidas.

### 2.2. Tecnologias
- **Java 21 LTS** e **Spring Boot 3.3+**.
- **Spring Security** para segurança de acesso.
- **Spring Data JPA / Hibernate** para mapeamento objeto-relacional (ORM).
- **Flyway** para versionamento seguro das migrações de banco (SQL schemas).

---

## 3. O Front-end (Web e Mobile com Expo)

O Front-end do ValorDev não possui lógicas "pesadas" de negócio. Ele é estritamente uma interface de usuário (UI) focada em entregar uma excelente experiência (UX).

### 3.1. Expo e o "Code Once, Run Everywhere"
O framework **Expo** com **React Native Web** permite que exatamente o mesmo código gere três plataformas:
1. **App Mobile iOS:** Compilado nativamente usando os componentes de UI do ecossistema Apple.
2. **App Mobile Android:** Compilado nativamente para os devices Google.
3. **Web App:** Compilado como um SPA (Single Page Application) moderno rodando no navegador do desktop ou celular.

A mágica do **Expo Router** mapeia a pasta `/app` diretamente para rotas URLs no navegador (ex: `/auth/login` ou `/wizard/client`), e as trata como "telas" de navegação por stack/abas nos dispositivos móveis.

### 3.2. Responsabilidades do Cliente
- **Apresentação e Interatividade:** Interfaces responsivas criadas com o design system **NativeWind** (baseado em Tailwind CSS), com suporte a dark/light modes automáticos.
- **Formulários e Validação Simples:** Uso de **React Hook Form** + **Zod** para validação inicial de formatos no próprio lado do cliente antes de disparar as requisições (poupa chamadas de rede redundantes).
- **State Management Local:** **Zustand** atua mantendo dados não-persistentes durante a sessão do usuário (como os dados de "Rascunho" do Wizard enquanto o usuário avança de passos).
- **Comunicação com a API:** Camada de API customizada (usando o nativo `fetch` API) que anexa automaticamente o token JWT nas requisições seguras.

---

## 4. O Fluxo de Funcionamento na Prática

### Exemplo do fluxo: "Criar Nova Proposta (Wizard)"

O exemplo a seguir ilustra a integração contínua do cliente e do servidor.

1. **Front-end coleta dados:** O usuário entra no Web/Mobile e navega pelo fluxo do Wizard (Telas de Cliente, Projeto e Ajustes). O Zustand armazena isso temporariamente na memória RAM do app.
2. **Front-end faz Requisição HTTP:** Na última tela, ao clicar em "Gerar Proposta", o Front empacota esses dados brutos em um payload JSON.
3. **Comunicação pela Rede:** O Front envia um `POST /proposals` enviando o JWT no cabeçalho HTTP (`Authorization: Bearer <token>`).
4. **Back-end Valida a Sessão:** O `JwtAuthenticationFilter` no Spring Boot recebe a request, decodifica o token e identifica o Usuário A.
5. **Back-end Roda o Motor de Cálculo:**
   - Carrega o "Perfil Financeiro" do Usuário A do banco de dados (ex: Custos Mensais, Horas/Semana).
   - Envia tudo para o `RiskEngine` (avalia o risco das definições do projeto) e em seguida para o `PricingEngine`.
   - Gera a proposta com os preços `minimo`, `recomendado` e a margem de `confiança`.
6. **Back-end Persiste os Dados:** Salva a Proposta final no PostgreSQL.
7. **Back-end Responde:** Devolve o JSON com a Proposta Criada + quebra de valores (Breakdown).
8. **Front-end Mostra o Resultado:** O App (Web ou Mobile) extrai a resposta JSON, substitui a página de carregamento pela Tela de Resultados e renderiza visualmente a quebra do cálculo de preços de forma bonita e intuitiva.

---

## 5. Resumo da Topologia

```text
[ CLIENTE WEB / BROWSER ] \
                           \     [ INTERNET / REDE LOCAL ]      [ SERVIDOR BACK-END ]
                            +---> HTTP REST / JSON / JWT ---->   - Spring Boot
[ CLIENTE MOBILE (APP)  ]  /                                     - Controllers REST
                           \                                     - Lógica de Precificação
```

O Front-end concentra as transições de telas e a beleza das interações, enquanto o Back-end atua como o cérebro inviolável das operações comerciais e matemáticas do aplicativo.
