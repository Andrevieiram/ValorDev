# AI Rules — Pricing Pro Mobile

> **Fonte oficial de comportamento** para assistentes de IA (Cursor, Codex, etc.) ao gerar, revisar ou refatorar código neste repositório mobile.

**Escopo:** pasta `mobile/` — app React Native com Expo.  
**Projeto web** na raiz do monorepo é **somente referência visual/UX**, nunca fonte de código a portar.

---

## 1. Objetivo do projeto

O **Pricing Pro** é um aplicativo **mobile-first** para precificação de projetos de software, voltado a freelancers e pequenos times.

| Princípio | Descrição |
|-----------|-----------|
| **Mobile-first** | Toda interface nasce para toque, gestos e telas pequenas — não é adaptação de web. |
| **Expo** | Build, desenvolvimento e distribuição via Expo SDK atual. |
| **Escalável** | Crescimento por features/domínios sem reescrever a base. |
| **Multiplataforma** | Android e iOS com UX nativa consistente. |
| **Clean architecture** | Separação clara entre UI, estado, domínio e infraestrutura futura. |

---

## 2. Stack oficial (obrigatória)

Use **apenas** estas tecnologias no app mobile, salvo aprovação explícita do time:

| Camada | Tecnologia |
|--------|------------|
| Runtime | **Expo** (SDK alinhado ao `package.json`) |
| Linguagem | **TypeScript** (strict) |
| Navegação | **Expo Router** (file-based) — **não** configurar React Navigation manualmente |
| Estilos | **NativeWind** v4 + tokens em `theme/` |
| Estado global | **Zustand** |
| Formulários | **React Hook Form** + **Zod** (`@hookform/resolvers`) |
| Animações | **React Native Reanimated** |
| Ícones | **lucide-react-native** + `react-native-svg` |

### Proibido por padrão

Radix, shadcn, MUI, Tailwind web puro, Vite, `react-dom`, `react-router` web, bibliotecas baseadas em DOM/HTML, polyfills de browser APIs, wrappers híbridos web/mobile.

---

## 3. Regras obrigatórias

### 3.1 Mobile e plataforma

- [ ] **Mobile-first sempre** — layout, tipografia e interação pensados para polegar e scroll vertical.
- [ ] **Safe areas** — usar `ScreenContainer` ou `useSafeAreaInsets`; nunca ignorar notch/home indicator.
- [ ] **Touch targets** — mínimo ~44×44 pt em ações tocáveis (`Pressable`, `Button`, links).
- [ ] **Scroll natural** — conteúdo longo em `ScrollView`/`FlatList`; evitar altura fixa que corte conteúdo.
- [ ] **Feedback tátil visual** — `active:opacity`, estados pressed; não depender de `:hover`.

### 3.2 Proibição de porte web

- [ ] **Não reutilizar JSX web** do projeto na raiz.
- [ ] **Não copiar HTML** (`div`, `span`, `button`, `input`, `form`, etc.).
- [ ] **Não adaptar DOM para mobile** (ex.: `document`, `window`, CSS puro web).
- [ ] **Não criar wrappers** que traduzam componentes web para RN.
- [ ] **Não criar compatibilidade híbrida** web/mobile no mesmo componente de produto.
- [ ] **Não portar Tailwind web** literalmente (ex.: `hover:`, `grid` complexo, pseudo-elementos não suportados).

### 3.3 Arquitetura e qualidade

- [ ] **Não quebrar** a estrutura de pastas documentada em `MOBILE_ARCHITECTURE.md`.
- [ ] **Não criar overengineering** — preferir solução simples que resolve o caso atual.
- [ ] **Não criar abstrações prematuras** — generalizar só após segundo uso real.
- [ ] **Não criar componentes genéricos desnecessários** — feature-specific fica em `features/`.
- [ ] **Não duplicar lógica** — extrair para `utils/`, `store/` ou `features/*/hooks`.
- [ ] **Não criar estilos fora do padrão** — NativeWind + `theme/`; evitar `StyleSheet` solto salvo exceção justificada (ex.: gradiente, animação).
- [ ] **Sempre usar tema centralizado** (`theme/colors.ts`, `tailwind.config.js` extend).
- [ ] **Sempre usar componentes base** (`components/ui/*`) antes de inventar novos primitivos.
- [ ] **Priorizar UX mobile real** — performance percebida, legibilidade, hierarquia clara.

---

## 4. Convenções de componentes

### 4.1 Onde colocar código

| Tipo | Local |
|------|--------|
| Primitivos reutilizáveis (Button, Input, Card…) | `components/ui/` |
| Layout compartilhado (ScreenContainer, AnimatedSection) | `components/layout/` |
| UI específica de uma feature (HomeHeader, etc.) | `features/<nome>/components/` |
| Lógica de tela / navegação da feature | `features/<nome>/hooks/` |
| Rota fina (composição) | `app/` |

### 4.2 Princípios

1. **Responsabilidade única** — um componente, um papel claro na UI.
2. **Componentes pequenos** — preferir composição a arquivos de 300+ linhas.
3. **Reutilização consciente** — só promover para `components/ui` após uso transversal real.
4. **Separação UI / domínio** — cálculos, validação e regras de negócio **não** ficam em JSX de tela.
5. **Evitar lógica complexa em `app/*.tsx`** — rotas orquestram; features implementam.

### 4.3 Componentes base existentes

Antes de criar novo primitivo, verificar: `Button`, `Input`, `Card`, `Badge`, `Progress`.

Extensões ao base (ex.: `leftIcon` no Button) são permitidas se beneficiarem múltiplas telas.

---

## 5. Convenções de estado

| Cenário | Abordagem |
|---------|-----------|
| Wizard multi-step | `useWizardStore` (`store/wizard.store.ts`) |
| Histórico / listas compartilhadas | `useHistoryStore` ou store de domínio dedicada |
| Estado de formulário de uma etapa | React Hook Form local + sync com Zustand ao avançar |
| UI efêmera (modal aberto, accordion) | `useState` local na feature |
| Persistência | `store/persistence.ts` + `STORAGE_KEYS` — nunca `localStorage` |

### Regras

- **Zustand** para estado **global** que cruza telas ou sobrevive a navegação.
- **Evitar** stores genéricas tipo “appStore” com tudo dentro.
- **Evitar prop drilling** — preferir store ou context estreito da feature.
- **Não** duplicar no Zustand o que o React Hook Form já gerencia na etapa atual.

---

## 6. Convenções de telas (`app/`)

1. **Rotas finas** — importar de `features/`, passar poucos props.
2. **Constantes de rota** — usar `ROUTES` de `constants/routes.ts`, nunca strings mágicas.
3. **Safe area + tab bar** — `ScreenContainer` com `withTabBar` nas abas principais.
4. **Header** — preferir `Stack.Screen` options no `_layout.tsx` do grupo.
5. **Acessibilidade** — `accessibilityRole`, `accessibilityLabel` em CTAs e cards pressáveis.
6. **Performance** — listas longas com `FlatList`; `keyExtractor` estável; evitar inline objects pesados em listas.

### Referência visual

O design Figma / telas web servem para **layout, copy e fluxo** — a implementação é **sempre** RN nativo.

---

## 7. Convenções de performance

- Seletores Zustand granulares: `useStore((s) => s.campo)` — não subscrever o store inteiro sem necessidade.
- `useCallback` / `useMemo` apenas quando há ganho mensurável (listas, filhos memoizados).
- Animações via **Reanimated** na UI thread quando possível.
- Imagens: tamanhos adequados, `expo-image` quando integrar assets remotos.
- **Evitar** HOCs e factories de componentes desnecessários.

---

## 8. Convenções de estilo (NativeWind)

- Usar `className` em componentes RN compatíveis com NativeWind.
- Utilitários via `cn()` (`utils/cn.ts`) para merge condicional.
- Cores e espaçamentos alinhados a `theme/` e `tailwind.config.js`.
- Gradientes: `expo-linear-gradient` (não simular com div web).
- Ícones: `lucide-react-native` com cores de `theme/colors.ts` quando necessário.

---

## 9. Convenções futuras (backend, offline, escala)

| Área | Diretriz |
|------|----------|
| **API** | Camada `services/api/` (futura); stores chamam serviços, não `fetch` em componentes |
| **Auth** | Store dedicada + rotas protegidas no Expo Router |
| **Persistência** | `PersistenceAdapter` em `store/persistence.ts`; trocar implementação sem mudar stores |
| **Offline** | Fila de sync + cache local via mesma abstração de persistência |
| **i18n** | Textos em `constants/*` ou arquivos de locale — não hardcodar em 10 lugares |
| **Testes** | Testar domínio (`calculatePricing`, validadores) isolado da UI |

---

## 10. Checklist antes de entregar código (IA)

- [ ] Código apenas em `mobile/`, seguindo pastas oficiais.
- [ ] Sem imports do projeto web.
- [ ] Rotas usam `ROUTES` e Expo Router.
- [ ] UI usa componentes base + NativeWind + tema.
- [ ] Lógica de negócio fora de `app/*.tsx`.
- [ ] TypeScript sem `any` desnecessário.
- [ ] `npm run typecheck` passa.
- [ ] Nenhuma biblioteca web incompatível adicionada sem justificativa.

---

## 11. Documentos relacionados

| Documento | Uso |
|-----------|-----|
| **`MOBILE_ARCHITECTURE.md`** | Estrutura, fluxos, estratégias técnicas |
| **`README.md`** | Setup e comandos do projeto |
| **Projeto web (raiz)** | Referência visual apenas — **não copiar código** |

---

*Última atualização: documento vivo — revisar quando a arquitetura evoluir (nova store, nova camada de API, etc.).*
