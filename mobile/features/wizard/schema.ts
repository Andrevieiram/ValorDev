import { z } from "zod";

export const EXPERIENCE_LEVEL_OPTIONS = [
    { value: "junior", label: "Júnior" },
    { value: "pleno", label: "Pleno" },
    { value: "senior", label: "Sênior" },
] as const;

const EXPERIENCE_LEVEL_VALUES = ["junior", "pleno", "senior"] as const;

export const WIZARD_PROFILE_SCHEMA = z.object({
    desiredIncome: z
        .string()
        .nonempty("Renda mensal desejada é obrigatória")
        .regex(/^\d+(?:[.,]\d{1,2})?$/, "Informe um valor numérico válido"),
    hoursPerWeek: z
        .string()
        .nonempty("Horas semanais disponíveis são obrigatórias")
        .regex(/^\d+$/, "Informe um valor inteiro"),
    monthlyCosts: z
        .string()
        .nonempty("Custos mensais são obrigatórios")
        .regex(/^\d+(?:[.,]\d{1,2})?$/, "Informe um valor numérico válido"),
    financialReserve: z
        .string()
        .nonempty("Reserva financeira é obrigatória")
        .regex(/^\d+(?:[.,]\d{1,2})?$/, "Informe um valor numérico válido"),
    experienceLevel: z.enum(EXPERIENCE_LEVEL_VALUES),
});

export type WizardProfileFormValues = z.infer<typeof WIZARD_PROFILE_SCHEMA>;

export const CLIENT_TYPE_OPTIONS = [
    { value: "individual", label: "Pessoa física" },
    { value: "business", label: "Empresa" },
    { value: "startup", label: "Startup" },
    { value: "agency", label: "Agência" },
    { value: "enterprise", label: "Corporativo" },
] as const;

export const DIGITAL_EXPERIENCE_OPTIONS = [
    { value: "none", label: "Iniciante" },
    { value: "beginner", label: "Consciente" },
    { value: "experienced", label: "Experiente" },
    { value: "advanced", label: "Madura" },
] as const;

export const RECURRING_CLIENT_OPTIONS = [
    { value: "yes", label: "Sim" },
    { value: "no", label: "Não" },
] as const;

export const LOCATION_OPTIONS = [
    { value: "local", label: "Local" },
    { value: "regional", label: "Regional" },
    { value: "national", label: "Nacional" },
    { value: "international", label: "Internacional" },
] as const;

export const BUSINESS_IMPACT_OPTIONS = [
    { value: "low", label: "Baixo" },
    { value: "medium", label: "Médio" },
    { value: "high", label: "Alto" },
    { value: "strategic", label: "Estratégico" },
] as const;

export const WIZARD_CLIENT_SCHEMA = z.object({
    clientType: z.enum(["individual", "business", "startup", "agency", "enterprise"]),
    digitalExperience: z.enum(["none", "beginner", "experienced", "advanced"]),
    recurringClient: z.enum(["yes", "no"]),
    location: z.enum(["local", "regional", "national", "international"]),
    businessImpact: z.enum(["low", "medium", "high", "strategic"]),
});

export type WizardClientFormValues = z.infer<typeof WIZARD_CLIENT_SCHEMA>;

export const BILLING_METHOD_OPTIONS = [
    { value: "fixed", label: "Projeto fechado" },
    { value: "hourly", label: "Por hora" },
    { value: "subscription", label: "Assinatura" },
    { value: "milestone", label: "Por marcos" },
] as const;

export const INSTALLMENT_OPTIONS = [
    { value: "oneTime", label: "À vista" },
    { value: "two", label: "2x" },
    { value: "three", label: "3x" },
    { value: "fourPlus", label: "4x ou mais" },
] as const;

export const PAYMENT_TERM_OPTIONS = [
    { value: "sevenDays", label: "7 dias" },
    { value: "fifteenDays", label: "15 dias" },
    { value: "thirtyDays", label: "30 dias" },
    { value: "fortyFiveDays", label: "45 dias" },
    { value: "sixtyDays", label: "60 dias" },
] as const;

export const DOWN_PAYMENT_OPTIONS = [
    { value: "none", label: "Sem entrada" },
    { value: "tenPercent", label: "10%" },
    { value: "twentyPercent", label: "20%" },
    { value: "thirtyPercent", label: "30%" },
    { value: "fiftyPercent", label: "50%" },
] as const;

export const RECURRING_BILLING_OPTIONS = [
    { value: "yes", label: "Sim" },
    { value: "no", label: "Não" },
] as const;

export const FORMAL_CONTRACT_OPTIONS = [
    { value: "yes", label: "Sim" },
    { value: "no", label: "Não" },
] as const;

export const WIZARD_ADJUSTMENTS_SCHEMA = z.object({
    billingMethod: z.enum(["fixed", "hourly", "subscription", "milestone"]),
    installmentOption: z.enum(["oneTime", "two", "three", "fourPlus"]),
    paymentTerm: z.enum(["sevenDays", "fifteenDays", "thirtyDays", "fortyFiveDays", "sixtyDays"]),
    downPayment: z.enum(["none", "tenPercent", "twentyPercent", "thirtyPercent", "fiftyPercent"]),
    recurringBilling: z.enum(["yes", "no"]),
    formalContract: z.enum(["yes", "no"]),
});

export type WizardAdjustmentsFormValues = z.infer<typeof WIZARD_ADJUSTMENTS_SCHEMA>;

export const PROJECT_TYPE_OPTIONS = [
    { value: "landing", label: "Landing" },
    { value: "website", label: "Website" },
    { value: "webapp", label: "Web App" },
    { value: "mobile", label: "Mobile App" },
    { value: "api", label: "API" },
] as const;

export const COMPLEXITY_OPTIONS = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
] as const;

export const WIZARD_PROJECT_SCHEMA = z.object({
    projectType: z.enum(["landing", "website", "webapp", "mobile", "api"]),
    complexity: z.enum(["low", "medium", "high"]),
    deadline: z.string().nonempty("Informe um prazo estimado"),
    scopeDocumented: z.boolean(),
    maintenance: z.boolean(),
    meetingsFrequency: z.string().nonempty("Informe a frequência de reuniões"),
    externalDependencies: z.string().optional(),
    reuseComponents: z.boolean(),
    toolsUsed: z.string().optional(),
});

export type WizardProjectFormValues = z.infer<typeof WIZARD_PROJECT_SCHEMA>;
