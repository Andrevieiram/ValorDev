# ValorDev - Sistema de Precificação para Devs Freelancers

Um sistema de calculadora de precificação projetado para ajudar desenvolvedores freelancers a definirem valores de projetos de forma justa, transparente e justificável, considerando o contexto do projeto, metas financeiras, análise de riscos e valor percebido.

## 🚀 Estrutura do Projeto

Este repositório foi construído utilizando uma arquitetura monorepo:
*   `calculator-api/` - API REST em Spring Boot (Backend)
*   `frontend/` - Aplicativo móvel em React Native (Frontend)

---

## 🗺️ Fluxo do Usuário (User Flow)

O sistema foi desenhado em **8 etapas sequenciais** para garantir que o desenvolvedor freelancer consiga calcular o preço justo de um projeto de forma rápida, transparente e baseada em dados reais de mercado.

```mermaid
graph TD
    A[1. Acesso] --> B[2. Perfil Financeiro]
    B --> C[3. Contexto do Projeto]
    C --> D[4. Perfil do Cliente]
    D --> E[5. Análise de Risco]
    E --> F[6. Ajustes Financeiros]
    F --> G[7. Resultado Final]
    G --> H[8. Geração da Proposta]
```

