import type {
    AdjustmentsData,
    ClientData,
    PricingAlert,
    PricingBreakdownItem,
    PricingResult,
    ProfileData,
    ProjectData,
    RiskReport,
} from "@/types";
import {
    HOURLY_RATE_CONFIG,
    STACK_MULTIPLIERS,
    WORKLOAD_MULTIPLIERS,
    PROJECT_MULTIPLIERS,
    CLIENT_MULTIPLIERS,
    FINANCIAL_MULTIPLIERS,
    PRICE_RANGE,
    CONFIDENCE_CONFIG,
} from "@/constants/pricing";
import { clamp, parseNumber, parseDeadlineWeeks } from "./utils";

export function calculatePricingResult(
    profile: ProfileData,
    project: ProjectData,
    client: ClientData,
    adjustments: AdjustmentsData,
    risk: RiskReport,
): PricingResult {
    // 1. Calcular Valor-Hora Base (RF-006)
    // Valor/Hora = (Rendimento + Despesas de Trabalho + Gastos Pessoais) / Horas Produtivas Mensais
    const desiredIncome = parseNumber(profile.desiredIncome);
    const monthlyCosts = parseNumber(profile.monthlyCosts) || 0;
    const financialReserve = parseNumber(profile.financialReserve) || 0;
    const hoursPerWeek = parseNumber(profile.hoursPerWeek) || 40;
    const monthlyHours = hoursPerWeek * HOURLY_RATE_CONFIG.WEEKS_PER_MONTH;

    const totalMonthlyNeeds = desiredIncome + monthlyCosts + financialReserve;
    const baseHourlyRate = totalMonthlyNeeds / monthlyHours;

    // Ajuste Especialidade/Stack
    const stackAdjustment =
      (STACK_MULTIPLIERS[profile.mainStack as keyof typeof STACK_MULTIPLIERS] ??
       STACK_MULTIPLIERS.default);

    // Ajuste de Carga de Trabalho
    const workloadAdjustment =
      (WORKLOAD_MULTIPLIERS[profile.workload as keyof typeof WORKLOAD_MULTIPLIERS] ??
       WORKLOAD_MULTIPLIERS.normal);

    // Valor-hora com ajustes de especialidade e carga
    const adjustedHourlyRate = baseHourlyRate * stackAdjustment * workloadAdjustment;

    // 2. Preço de Base do Projeto (RF-003)
    const estimatedHours = parseNumber(project.estimatedHours) || 80;
    const projectBasePrice = Math.max(
      HOURLY_RATE_CONFIG.MIN_PROJECT_PRICE,
      Math.round(adjustedHourlyRate * estimatedHours),
    );

    // 3. Multiplicadores de Projeto (RF-003)
    let projectMult = 0;
    const weeks = parseDeadlineWeeks(project.deadline || "");
    if (weeks !== null && weeks < 2) {
        projectMult += PROJECT_MULTIPLIERS.urgency;
    }
    if (!project.scopeDocumented) {
        projectMult += PROJECT_MULTIPLIERS.undocumentedScope;
    }
    if (project.meetingsFrequency === "diaria") {
        projectMult += PROJECT_MULTIPLIERS.dailyMeetings;
    }
    if (project.maintenance) {
        projectMult += PROJECT_MULTIPLIERS.maintenance;
    }
    if (project.reuseComponents) {
        projectMult += PROJECT_MULTIPLIERS.componentReuse;
    }

    // 4. Multiplicadores do Cliente (RF-004)
    let clientMult = 0;
    if (client.digitalExperience === "none") {
        clientMult += CLIENT_MULTIPLIERS.noDigitalExperience;
    }
    if (client.recurringClient === "yes") {
        clientMult += CLIENT_MULTIPLIERS.recurringClientDiscount;
    }
    if (client.businessImpact === "high" || client.businessImpact === "strategic") {
        clientMult += CLIENT_MULTIPLIERS.highBusinessImpact;
    }

    // 5. Ajustes Financeiros (RF-006)
    let financialMult = 0;
    if (adjustments.paymentMethod === "creditCard") {
        financialMult += FINANCIAL_MULTIPLIERS.creditCardFee;
    } else if (adjustments.paymentMethod === "international") {
        financialMult += FINANCIAL_MULTIPLIERS.internationalFee;
    }

    if (adjustments.paymentTerm === "fortyFiveDays" || adjustments.paymentTerm === "sixtyDays") {
        financialMult += FINANCIAL_MULTIPLIERS.longPaymentTerm;
    }

    // Soma final de ajustes
    const totalAdjustment = projectMult + clientMult + financialMult;

    // Valor Recomendado, Mínimo e Premium
    const recommended = Math.round(projectBasePrice * (1 + totalAdjustment));
    const minimum = Math.round(recommended * PRICE_RANGE.minimum);
    const premium = Math.round(recommended * PRICE_RANGE.premium);

    // Confiança (RF-007)
    const confidenceBonus =
      adjustments.formalContract === "yes"
        ? CONFIDENCE_CONFIG.formalContractBonus
        : CONFIDENCE_CONFIG.noContractPenalty;
    const confidence = clamp(
      Math.round(
        CONFIDENCE_CONFIG.baseScore +
          (100 - risk.score) * CONFIDENCE_CONFIG.riskFactor +
          confidenceBonus,
      ),
      CONFIDENCE_CONFIG.min,
      CONFIDENCE_CONFIG.max,
    );

    // Breakdown Items
    const breakdown: PricingBreakdownItem[] = [
        {
            label: "Valor Base Técnico",
            value: projectBasePrice,
            description: `Baseado em ${estimatedHours}h estimadas no valor-hora de R$ ${Math.round(adjustedHourlyRate)}/h (incluso stack, impostos e carga).`,
        },
        {
            label: "Ajustes do Escopo & Cronograma",
            value: Math.round(projectBasePrice * projectMult),
            description: "Modificadores de urgência, documentação, reuniões diárias e manutenção pós-projeto.",
        },
        {
            label: "Fatores de Perfil de Cliente",
            value: Math.round(projectBasePrice * clientMult),
            description: "Adequação ao nível digital do cliente, desconto por fidelidade e geração de receita.",
        },
        {
            label: "Ajustes Financeiros e Taxas",
            value: Math.round(projectBasePrice * financialMult),
            description: "Custos de processamento (cartão, internacional) e prazos longos de faturamento.",
        },
    ];

    // Alertas (RF-007)
    const alerts: PricingAlert[] = [];

    if (risk.score >= 70) {
        alerts.push({
            type: "warning",
            message: "Perfil de Risco Alto: Certifique-se de cobrar sinal na assinatura do contrato.",
        });
    }

    if (adjustments.formalContract === "no") {
        alerts.push({
            type: "warning",
            message: "Atenção: A falta de um contrato formal coloca o recebimento do projeto sob alto risco.",
        });
    }

    if (weeks !== null && weeks < 2) {
        alerts.push({
            type: "warning",
            message: "Prazo Crítico: Projetos em menos de 2 semanas sofrem alta probabilidade de atrasos.",
        });
    }

    if (client.recurringClient === "yes") {
        alerts.push({
            type: "info",
            message: "Cliente Recorrente: Aplicação de desconto de 10% de fidelidade ativa.",
        });
    }

    return {
        minimum,
        recommended,
        premium,
        confidence,
        riskLevel: risk.level,
        breakdown,
        alerts,
    };
}
