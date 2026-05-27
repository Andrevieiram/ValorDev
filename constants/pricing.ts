/**
 * Constantes de precificação
 * Valores utilizados nas fórmulas de cálculo de preço
 */

// Fórmula Valor-Hora (RF-006)
export const HOURLY_RATE_CONFIG = {
  WEEKS_PER_MONTH: 4.33, // Semanas em um mês (240 horas / 40h por semana)
  MIN_PROJECT_PRICE: 3000, // Preço mínimo em R$
} as const;

// Multiplicadores de Stack (RF-002)
export const STACK_MULTIPLIERS = {
  default: 1.0,
  frontend: 1.2,
  mobile: 1.25,
  fullstack: 1.3,
  devops: 1.4,
} as const;

// Multiplicadores de Carga de Trabalho (RF-002)
export const WORKLOAD_MULTIPLIERS = {
  normal: 1.0,
  high: 1.15,
  overloaded: 1.3,
} as const;

// Multiplicadores de Projeto (RF-003)
export const PROJECT_MULTIPLIERS = {
  urgency: 0.3, // Prazo < 2 semanas
  undocumentedScope: 0.25, // Escopo não documentado
  dailyMeetings: 0.2, // Reuniões diárias
  maintenance: 0.1, // Manutenção pós-projeto
  componentReuse: -0.15, // Reaproveitamento de componentes
} as const;

// Multiplicadores de Cliente (RF-004)
export const CLIENT_MULTIPLIERS = {
  noDigitalExperience: 0.2, // Cliente sem experiência digital
  recurringClientDiscount: -0.1, // Desconto de recorrência
  highBusinessImpact: 0.25, // Alto impacto financeiro
} as const;

// Multiplicadores Financeiros (RF-005)
export const FINANCIAL_MULTIPLIERS = {
  creditCardFee: -0.04, // Taxa de cartão de crédito
  internationalFee: -0.1, // Taxa de remessa internacional
  longPaymentTerm: 0.05, // Prazo longo de faturamento (30-60 dias)
} as const;

// Faixas de Preço (RF-011)
export const PRICE_RANGE = {
  minimum: 0.88, // 88% do recomendado
  premium: 1.15, // 115% do recomendado
} as const;

// Limites de Confiança (RF-007)
export const CONFIDENCE_CONFIG = {
  baseScore: 75,
  riskFactor: 0.2, // Cada ponto de risco reduz 0.2 pontos de confiança
  formalContractBonus: 5,
  noContractPenalty: -10,
  min: 0,
  max: 100,
} as const;

// Taxa de Impostos por Regime (RF-011)
export const TAX_RATES = {
  mei: 0.02,
  simples: 0.05,
  lucroPresumido: 0.08,
  lucroReal: 0.13,
} as const;
