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

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const parseNumber = (value: string | number) => {
    if (typeof value === "number") return value;
    const normalized = value
        .trim()
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseDeadlineWeeks = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(semana|semanas|week|weeks)/i);
    if (!match) return null;
    return Number(match[1]);
};

export function calculatePricingResult(
    profile: ProfileData,
    project: ProjectData,
    client: ClientData,
    adjustments: AdjustmentsData,
    risk: RiskReport,
): PricingResult {
    // 1. Calcular Valor-Hora Base (RF-002)
    const desiredIncome = parseNumber(profile.desiredIncome);
    const hoursPerWeek = parseNumber(profile.hoursPerWeek) || 40;
    const rawHourlyRate = desiredIncome / (hoursPerWeek * 4.33);

    // Ajuste Tributário
    let taxAdjustment = 0;
    if (profile.taxRegime === "mei") taxAdjustment = 0.02;
    else if (profile.taxRegime === "simples") taxAdjustment = 0.05;
    else if (profile.taxRegime === "lucroPresumido") taxAdjustment = 0.08;
    else if (profile.taxRegime === "lucroReal") taxAdjustment = 0.13;

    // Ajuste Especialidade/Stack
    let stackAdjustment = 0;
    if (profile.mainStack === "frontend") stackAdjustment = 0.20;
    else if (profile.mainStack === "mobile") stackAdjustment = 0.25;
    else if (profile.mainStack === "fullstack") stackAdjustment = 0.30;
    else if (profile.mainStack === "devops") stackAdjustment = 0.40;

    // Ajuste de Carga de Trabalho
    let workloadAdjustment = 0;
    if (profile.workload === "high") workloadAdjustment = 0.15;
    else if (profile.workload === "overloaded") workloadAdjustment = 0.30;

    // Valor-hora final
    const finalHourlyRate = rawHourlyRate * (1 + taxAdjustment + stackAdjustment + workloadAdjustment);

    // 2. Preço de Base do Projeto (RF-003)
    const estimatedHours = parseNumber(project.estimatedHours) || 80;
    const projectBasePrice = Math.max(3000, Math.round(finalHourlyRate * estimatedHours));

    // 3. Multiplicadores de Projeto (RF-003)
    let projectMult = 0;
    const weeks = parseDeadlineWeeks(project.deadline || "");
    if (weeks !== null && weeks < 2) {
        projectMult += 0.30; // Urgência
    }
    if (!project.scopeDocumented) {
        projectMult += 0.25; // Escopo não documentado
    }
    if (project.meetingsFrequency === "diaria") {
        projectMult += 0.20; // Reuniões frequentes
    }
    if (project.maintenance) {
        projectMult += 0.10; // Manutenção pós-projeto
    }
    if (project.reuseComponents) {
        projectMult -= 0.15; // Reaproveitamento
    }

    // 4. Multiplicadores do Cliente (RF-004)
    let clientMult = 0;
    if (client.digitalExperience === "none") {
        clientMult += 0.20; // Cliente leigo
    }
    if (client.recurringClient === "yes") {
        clientMult -= 0.10; // Desconto de recorrência
    }
    if (client.businessImpact === "high" || client.businessImpact === "strategic") {
        clientMult += 0.25; // Alto impacto financeiro
    }

    // 5. Ajustes Financeiros (RF-006)
    let financialMult = 0;
    if (adjustments.paymentMethod === "creditCard") {
        financialMult -= 0.04; // Taxa do cartão de crédito
    } else if (adjustments.paymentMethod === "international") {
        financialMult -= 0.10; // Taxa de remessa internacional
    }

    if (adjustments.paymentTerm === "fortyFiveDays" || adjustments.paymentTerm === "sixtyDays") {
        financialMult += 0.05; // Prazo longo (30-60 dias)
    }

    // Soma final de ajustes
    const totalAdjustment = projectMult + clientMult + financialMult;
    
    // Valor Recomendado, Mínimo e Premium
    const recommended = Math.round(projectBasePrice * (1 + totalAdjustment));
    const minimum = Math.round(recommended * 0.88);
    const premium = Math.round(recommended * 1.15);

    // Confiança (RF-007)
    const confidence = clamp(
        Math.round(75 + (100 - risk.score) * 0.2 + (adjustments.formalContract === "yes" ? 5 : -10))
    );

    // Breakdown Items
    const breakdown: PricingBreakdownItem[] = [
        {
            label: "Valor Base Técnico",
            value: projectBasePrice,
            description: `Baseado em ${estimatedHours}h estimadas no valor-hora de R$ ${Math.round(finalHourlyRate)}/h (incluso stack, impostos e carga).`,
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
