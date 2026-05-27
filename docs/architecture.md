# Arquitetura — ValorDev

## Stack Tecnológico

- **Framework**: React Native + Expo
- **Roteamento**: Expo Router
- **Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **Estilos**: NativeWind (Tailwind CSS)
- **UI Components**: Custom + Lucide React Native
- **Persistência**: AsyncStorage (dados) + expo-secure-store (autenticação)
- **Segurança**: bcryptjs (hashing de senhas)
- **ID Generation**: nanoid

---

## Estrutura de Diretórios

```
novo_valorDev/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tabs group (authenticated)
│   │   ├── _layout.tsx           # Tab navigation
│   │   ├── index.tsx             # Wizard entry
│   │   ├── dashboard.tsx         # Dashboard
│   │   ├── history.tsx           # History list
│   │   ├── profile.tsx           # User profile
│   ├── auth/                     # Auth flow
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Auth selector
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── wizard/                   # Pricing wizard
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Step 1: Project
│   │   ├── client.tsx            # Step 2: Client
│   │   ├── adjustments.tsx       # Step 3: Adjustments
│   │   ├── risk.tsx              # Step 4: Risk
│   │   └── review.tsx            # Step 5: Review
│   ├── setup-profile.tsx         # Financial profile setup
│   ├── settings.tsx              # App settings
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                       # Low-level UI atoms
│   ├── layout/                   # Layout wrappers
│   └── __tests__/                # Component tests
├── features/                     # Business logic
│   ├── pricing/                  # Pricing calculations
│   │   ├── index.ts              # calculatePricingResult()
│   │   ├── utils.ts              # Parsing utilities
│   │   ├── index.test.ts         # Unit tests
│   ├── wizard/                   # Wizard state & logic
│   │   ├── index.ts              # Type exports
│   │   ├── risk.ts               # calculateRisk()
│   │   ├── schema.ts             # Zod schemas
│   │   ├── risk.test.ts          # Risk tests
│   └── home/                     # Home screen logic
├── store/                        # Zustand stores
│   ├── auth.store.ts             # Auth state + rate-limit
│   ├── wizard.store.ts           # Wizard form data
│   ├── history.store.ts          # Pricing history
│   ├── settings.store.ts         # App settings
│   ├── persistence.ts            # Storage abstraction
│   └── index.ts                  # Exports
├── utils/                        # Utilities
│   ├── password.ts               # Hash/compare functions
│   ├── index.ts                  # formatCurrency, etc.
├── constants/                    # App-wide constants
│   ├── pricing.ts                # Pricing multipliers
│   ├── storage.ts                # Storage keys
│   ├── wizard.ts                 # Wizard steps
│   ├── routes.ts
│   ├── home.ts
│   ├── layout.ts
│   └── index.ts                  # Centralized exports
├── theme/                        # Design tokens
│   ├── colors.ts                 # Color palette
│   └── index.ts                  # Theme hook
├── types/                        # TypeScript definitions
│   ├── pricing.types.ts
│   ├── navigation.types.ts
│   └── index.ts                  # Centralized exports
├── docs/                         # Documentation
│   ├── architecture.md           # This file
│   ├── data-model.md             # Schema definitions
│   └── API.md                    # Future: Backend API
├── jest.config.js                # Jest configuration
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── app.json                      # Expo configuration
```

---

## Fluxos Principais

### 1. Autenticação (RF01-02)
```
auth/index → auth/login | auth/register
  ↓
(Armazena hash de senha em SecureStore)
  ↓
setup-profile (RF13: perfil financeiro)
  ↓
/(tabs) (app autenticado)
```

### 2. Wizard de Precificação (RF03-11)
```
wizard/index (projeto)
  ↓ (Zod + React Hook Form)
wizard/client (cliente)
  ↓
wizard/adjustments (ajustes)
  ↓
wizard/risk (cálculo de risco)
  ↓
wizard/review (resultado + history.store.addItem())
  ↓
dashboard (exibir histórico)
```

### 3. Dashboard (RF12)
```
history.store.items
  ↓
(Pipeline por probabilidade)
  ↓
Dashboard com métricas e drill-down
  ↓ (RF15: click item → detalhes)
Modal com histórico filtrado
```

---

## Camadas

### Presentation
- **Screens** (`app/`): Expo Router pages, navegação, layout
- **Components** (`components/`): UI atoms e compostos
- **Theme**: Design tokens (cores, tipografia)

### State Management
- **Zustand Stores** (`store/`):
  - `auth.store`: user, login/logout, rate-limit
  - `wizard.store`: form data durante wizard
  - `history.store`: pricing history
  - `settings.store`: user preferences
- **Persistence**: AsyncStorage / SecureStore adapter

### Business Logic
- **Features** (`features/`):
  - `pricing/`: Cálculos de preço (RF-002 a RF-007)
  - `wizard/`: Risk scoring (10 fatores, RF-008)
  - `home/`: Dashboard aggregation

### Types & Constants
- **Types**: TypeScript interfaces centralizadas
- **Constants**: Multiplicadores, chaves de storage, etc.
- **Utils**: parseNumber, formatCurrency, hashing

---

## Fluxo de Dados

```
Screen Component
  ↓
useForm (React Hook Form)
  ↓
Zod Schema Validation
  ↓
Zustand Store (setState)
  ↓
AsyncStorage / SecureStore (persistence)
  ↓
Feature Logic (pricing, risk calculations)
  ↓
Derived State (useMemo, selectors)
  ↓
Rerender Component
```

---

## Segurança

- **Autenticação**: Senhas hashadas com bcryptjs (10 rounds)
- **Sessão**: SecureStore (mobile) / localStorage (web)
- **Rate-limit**: 5 tentativas, lockout 15 minutos
- **Validação**: Zod schemas em cliente
- **Dados Sensíveis**: Separados de histórico (nunca salvam senhas)

---

## Performance Otimizações

- **Memoization**: useMemo no dashboard e histórico
- **FlatList**: Renderização eficiente do histórico
- **Code Splitting**: Expo Router lazy routes
- **Lazy Loading**: Async imports de screen components

---

## Migração Futura (Fase 2)

1. **Backend**: Node.js + Spring Boot + PostgreSQL
2. **API**: RESTful endpoints (login, projetos, histórico)
3. **Sincronização**: Dados locais + cloud sync
4. **Offline-first**: Operações otimistas + reconciliação
5. **RiskReport**: Persistir junto com HistoryItem
