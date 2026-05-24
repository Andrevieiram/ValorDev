# ValorDev 🚀

O **ValorDev** é a ferramenta definitiva de precificação e análise de risco para freelancers. Ele ajuda desenvolvedores e designers independentes a calcularem seu custo operacional, descobrirem seu valor/hora ideal e realizarem orçamentos de projetos de forma justa, segura e lucrativa.

---

## 📱 Funcionalidades Principais

* **Perfil Financeiro Completo**: Permite configurar rendimento desejado, despesas de trabalho, gastos pessoais, dias de férias e carga horária para calcular automaticamente seu **valor/hora ideal**.
* **Assistente de Precificação (Wizard)**: Passos interativos para precificar projetos:
  * **Cliente**: Cadastro básico e contexto.
  * **Escopo e Horas**: Levantamento detalhado das horas de desenvolvimento.
  * **Análise de Risco**: Cálculo automático de riscos (complexidade, nível de definição do escopo, estabilidade do cliente).
  * **Variáveis de Ajuste**: Margem de lucro, impostos adicionais e gordura para imprevistos.
* **Resultado Consolidado**: Tela final rica com breakdown de custos, preço sugerido para o cliente e insights de risco.
* **Histórico de Estimativas**: Histórico local de cálculos antigos para consulta rápida.
* **Design Premium Dark/Light**: Interface moderna com suporte a modo escuro inteligente, efeitos de glassmorphism e animações fluidas.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas do ecossistema moderno do **React Native**:

* **Expo (SDK 51+)**: Framework e plataforma para desenvolvimento ágil de aplicativos universais (iOS, Android e Web).
* **Expo Router (v3+)**: Navegação baseada em arquivos (File-based Routing) intuitiva e performática.
* **TypeScript**: Tipagem estática para robustez do código.
* **NativeWind (v4)**: Utilização do Tailwind CSS v4 para estilização rápida, responsiva e consistente em múltiplos ambientes (web e mobile).
* **Zustand**: Gerenciamento de estado global leve e otimizado com persistência local de dados.
* **React Hook Form + Zod**: Gerenciamento e validação de formulários complexos de maneira segura.
* **Lucide React Native**: Conjunto de ícones vetoriais modernos.

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* Node.js (versão 18 ou superior recomendada)
* npm ou yarn

### 1. Clonar e Instalar Dependências
Navegue até a pasta do projeto e instale as dependências:
```bash
npm install
```

### 2. Iniciar o Servidor Expo
Inicie o Metro Bundler:
```bash
# Inicia limpando o cache para evitar conflitos de rotas
npx expo start --clear
```

No terminal, você verá o menu do Expo com opções para abrir o projeto:
* Pressione **`w`** para abrir no navegador (Web).
* Pressione **`a`** para abrir no emulador Android (requer Android Studio/Virtual Device rodando).
* Pressione **`i`** para abrir no simulador iOS (requer macOS e Xcode rodando).

### 3. Testar no Celular Físico (Expo Go)
Para testar o aplicativo diretamente no seu celular:
1. Baixe o aplicativo **Expo Go** na App Store (iOS) ou Google Play Store (Android).
2. Certifique-se de que o seu celular e o seu computador estão conectados **na mesma rede Wi-Fi**.
3. Escaneie o QR Code que aparece no terminal (ou na página do Expo Developer Tools) usando a câmera do seu celular (iOS) ou o próprio app Expo Go (Android).

---

## 🧪 Estrutura de Pastas e Arquitetura

O **ValorDev** trabalha em uma arquitetura Cliente-Servidor (Client-Server) rigorosa. Toda a lógica de negócio e as regras matemáticas de precificação residem no **Back-end Java**. O aplicativo local (Web e Mobile) atua apenas como uma interface visual responsiva e interativa consumindo a API via endpoints REST autenticados por JWT.

Para um mergulho profundo no funcionamento integrado do sistema entre Web, Mobile e Banco de Dados, consulte nosso documento especializado:
👉 **[Arquitetura Detalhada do ValorDev](./Arquitetura_Detalhada.md)**

### Topologia do Front-end (React Native / Expo)
```
├── app/                  # Rotas da navegação baseada em arquivos (Expo Router)
│   ├── (tabs)/           # Abas principais (Home, Histórico, Perfil)
│   ├── auth/             # Fluxo de login e registro
│   ├── wizard/           # Wizard de precificação de projetos
│   └── setup-profile.tsx # Configuração do perfil financeiro autônomo
├── assets/               # Imagens, fontes e recursos gráficos
├── components/           # Componentes de UI genéricos (Button, Input, Card, etc.)
├── constants/            # Constantes de rotas, layouts e passos
├── features/             # Lógica específica por feature (Home, Wizard, Pricing)
├── hooks/                # Custom React Hooks genéricos
├── store/                # Estados globais (Zustand) com persistência
├── theme/                # Definição da paleta de cores e contexto do tema
└── types/                # Tipagens TypeScript globais
```
