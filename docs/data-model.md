# Modelo de Dados — ValorDev

## Visão Geral

A aplicação persiste dados em múltiplas camadas:
- **Dados sensíveis (autenticação)**: SecureStore (mobile) / localStorage (web)
- **Dados do usuário**: AsyncStorage / localStorage
- **Estado efêmero (wizard)**: Zustand em memória

Todos os dados persistidos incluem versionamento para facilitar migrações futuras.

---

## Estruturas de Dados

### 1. Sessão de Autenticação
**Chave**: `@pricing-pro/auth-session`  
**Persistência**: SecureStore (mobile) / localStorage (web)  
**Versão**: v1

```typescript
interface AuthSession {
  user: {
    name: string;
    email: string;
    passwordHash: string; // bcryptjs (10 rounds)
  } | null;
  skipped: boolean;
}
```

---

### 2. Histórico de Precificações
**Chave**: `valordev_history_v2`  
**Persistência**: AsyncStorage / localStorage  
**Versão**: v1

```typescript
interface HistoryPayload {
  version: 1;
  items: HistoryItem[];
}

interface HistoryItem {
  id: string;                    // nanoid(9)
  name: string;                  // Nome do projeto
  value: number;                 // Valor em centavos
  date: string;                  // Referência (pode estar vazio)
  status: "draft" | "sent" | "won" | "lost";
  createdAt: string;             // ISO 8601
  probability?: Probability;     // "alta" | "media" | "baixa" | "fechada" | "perdida"
}
```

---

### 3. Perfil do Usuário (Wizard)
**Chave**: `@pricing-pro/wizard-profile`  
**Persistência**: AsyncStorage / localStorage  
**Versão**: v1 (em memória, sem versioning)

```typescript
interface ProfileData {
  desiredIncome: string;        // "R$ 5.000,00"
  hoursPerWeek: string;         // "40"
  experienceLevel: string;      // "junior" | "pleno" | "senior"
  taxRegime: string;            // "mei" | "simples" | "lucroPresumido" | "lucroReal"
  mainStack: string;            // "frontend" | "mobile" | "fullstack" | "devops"
  workload: string;             // "normal" | "high" | "overloaded"
  monthlyCosts: string;         // "R$ 1.000,00" — custos de trabalho
  financialReserve: string;     // "R$ 3.000,00" — reserva pessoal
}
```

---

### 4. Dados do Projeto (Wizard)
**Chave**: `@pricing-pro/wizard-project`  
**Persistência**: AsyncStorage / localStorage

```typescript
interface ProjectData {
  projectType: string;          // "landing" | "website" | "webapp" | "mobile" | "api"
  complexity: string;           // "low" | "medium" | "high"
  deadline: string;             // "4 semanas"
  scopeDocumented: boolean;
  maintenance: boolean;
  meetingsFrequency: string;    // "semanal" | "bi-semanal" | "diaria"
  externalDependencies: string; // "Integração com API X"
  reuseComponents: boolean;
  toolsUsed: string;
  estimatedHours: string;       // "80"
}
```

---

### 5. Dados do Cliente (Wizard)
**Chave**: `@pricing-pro/wizard-client`  
**Persistência**: AsyncStorage / localStorage

```typescript
interface ClientData {
  clientType: string;           // "individual" | "business" | "startup" | "agency" | "enterprise"
  digitalExperience: string;    // "none" | "beginner" | "experienced" | "advanced"
  recurringClient: string;      // "yes" | "no"
  businessImpact: string;       // "low" | "medium" | "high" | "strategic"
  location: string;             // "local" | "regional" | "nacional" | "internacional"
}
```

---

### 6. Ajustes Financeiros (Wizard)
**Chave**: `@pricing-pro/wizard-adjustments`  
**Persistência**: AsyncStorage / localStorage

```typescript
interface AdjustmentsData {
  paymentMethod: string;        // "pix" | "boleto" | "creditCard" | "international"
  paymentTerm: string;          // "sevenDays" | "thirtyDays" | "sixtyDays"
  downPayment: string;          // "none" | "tenPercent" | "fiftyPercent"
  formalContract: string;       // "yes" | "no"
}
```

---

### 7. Configurações (Settings)
**Chave**: `@pricing-pro/settings`  
**Persistência**: AsyncStorage / localStorage

```typescript
interface SettingsData {
  language: "pt" | "en";
  darkMode: boolean;            // Opcional, pode usar preferência do SO
}
```

---

## Padrão de Versionamento

Quando a estrutura muda:

1. **Incrementar** `STORAGE_VERSION` em `constants/storage.ts`
2. **Criar arquivo** de migração em `migrations/migrate_v{X}_to_v{Y}.ts`
3. **Executar** no hydrate do store específico
4. **Documentar** neste arquivo

Exemplo futura (v2):
```typescript
if (payload.version === 1) {
  // Migrar de v1 para v2
  payload.items = payload.items.map(item => ({
    ...item,
    // novoCampo: item.antigoCampo ? transformar() : null,
  }));
  payload.version = 2;
}
```

---

## Limpeza de Dados

- **Logout**: Remove `@pricing-pro/auth-session`
- **Reset do Wizard**: Limpa perfil, projeto, cliente, ajustes
- **Limpeza de histórico**: Apenas por ação do usuário (RF14)

---

## Migração Futura (Fase 2)

Quando passar para backend:
1. Sincronizar histórico com API
2. Armazenar risco (`RiskReport`) junto com itens
3. Implementar backup/restore
4. Adicionar transações otimistas
