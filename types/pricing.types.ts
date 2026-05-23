export type ExperienceLevel = "junior" | "pleno" | "senior";
export type ProjectType = "landing" | "website" | "webapp" | "mobile" | "api";
export type ComplexityLevel = "low" | "medium" | "high";
export type ClientType = "individual" | "business" | "startup" | "agency" | "enterprise";
export type DigitalExperience = "none" | "beginner" | "experienced" | "advanced";
export type RecurringClient = "yes" | "no";
export type ClientLocation = "local" | "regional" | "national" | "international";
export type BusinessImpact = "low" | "medium" | "high" | "strategic";
export type ScopeClarity = "high" | "medium" | "low";
export type RiskLevel = "low" | "medium" | "high";
export type PaymentMethod = "pix" | "boleto" | "creditCard" | "international";
export type BillingMethod = "fixed" | "hourly" | "subscription" | "milestone";
export type InstallmentOption = "oneTime" | "two" | "three" | "fourPlus";
export type PaymentTerm =
    | "sevenDays"
    | "fifteenDays"
    | "thirtyDays"
    | "fortyFiveDays"
    | "sixtyDays";
export type DownPayment =
    | "none"
    | "tenPercent"
    | "twentyPercent"
    | "thirtyPercent"
    | "fiftyPercent";
export type RecurringBilling = "yes" | "no";
export type FormalContract = "yes" | "no";

export interface ProfileData {
    desiredIncome: string;
    hoursPerWeek: string;
    experienceLevel: ExperienceLevel | "";
    taxRegime: string;
    mainStack: string;
    workload: string;
    monthlyCosts: string;
    financialReserve: string;
}

export interface ProjectData {
    projectType: ProjectType | "";
    complexity: ComplexityLevel | "";
    deadline: string;
    scopeDocumented: boolean;
    maintenance: boolean;
    meetingsFrequency: string;
    externalDependencies: string;
    reuseComponents: boolean;
    toolsUsed: string;
    estimatedHours: string;
}

export interface ClientData {
    clientType: ClientType | "";
    digitalExperience: DigitalExperience | "";
    recurringClient: RecurringClient | "";
    location: ClientLocation | "";
    businessImpact: BusinessImpact | "";
}

export interface AdjustmentsData {
    billingMethod: BillingMethod | "";
    paymentMethod: PaymentMethod | "";
    installmentOption: InstallmentOption | "";
    paymentTerm: PaymentTerm | "";
    downPayment: DownPayment | "";
    recurringBilling: RecurringBilling | "";
    formalContract: FormalContract | "";
}

export interface RiskReport {
    score: number;
    level: RiskLevel;
    summary: string;
    riskFactors: string[];
    positiveFactors: string[];
}

export interface WizardFormData {
    profile: ProfileData;
    project: ProjectData;
    client: ClientData;
    adjustments: AdjustmentsData;
}

export interface PricingResult {
    minimum: number;
    recommended: number;
    premium: number;
    confidence: number;
    riskLevel: RiskLevel;
    breakdown: PricingBreakdownItem[];
    alerts: PricingAlert[];
}

export interface PricingBreakdownItem {
    label: string;
    value: number;
    description: string;
}

export interface PricingAlert {
    type: "warning" | "info";
    message: string;
}

export type Probability = 'alta' | 'media' | 'baixa' | 'fechada' | 'perdida';

export interface HistoryItem {
    id: string;
    name: string;
    value: number;
    date: string;
    status: "draft" | "sent";
    createdAt: string;
    probability?: Probability;
}
