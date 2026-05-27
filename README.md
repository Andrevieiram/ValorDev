# ValorDev 🚀

O **ValorDev** é a ferramenta definitiva de precificação e análise de risco para freelancers. Ele ajuda desenvolvedores e designers independentes a calcularem seu custo operacional, descobrirem seu valor/hora ideal e realizarem orçamentos de projetos de forma justa, segura e lucrativa.

---

## ⚡ Quick Start: Como rodar sem erros (Branch Develop)

Se você acabou de clonar este repositório na branch `develop`, siga exatamente os passos abaixo para rodar o app no seu celular (Expo Go) de primeira e sem erros de cache ou de rede:

1. **Instale as dependências:**
   \`\`\`bash
   npm install
   \`\`\`
   *(Certifique-se de usar Node 18+)*

2. **Inicie o servidor limpando o cache e em modo Tunnel:**
   \`\`\`bash
   npx expo start --clear --tunnel
   \`\`\`
   * **Por que `--clear`?** Garante que o Metro Bundler não use um cache quebrado (comum ao trocar de branch).
   * **Por que `--tunnel`?** Garante que o seu celular (Expo Go) consiga acessar o app de qualquer rede Wi-Fi ou 4G, burlando os bloqueios comuns do Firewall do Windows na porta 8081 que causam o erro *"The Internet connection appears to be offline"*.

3. **Abra o app no seu celular:**
   * Abra o aplicativo **Expo Go** no seu celular (iOS/Android).
   * Escaneie o **QR Code** gerado no terminal.
   * Pronto! O App vai abrir automaticamente.

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

## 🧪 Estrutura de Pastas

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
