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

const parseNumber = (value: string) => {
    const normalized = value
        .trim()
        .replace(/[R$,.\s]/g, "")
        .replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseDeadlineMonths = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(m[eê]s|mes|month|months)/i);
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
    const desiredIncome = Math.max(0, parseNumber(profile.desiredIncome));
    const monthlyCosts = Math.max(0, parseNumber(profile.monthlyCosts));
    const financialReserve = Math.max(0, parseNumber(profile.financialReserve));
    const durationMonths = Math.max(
        2,
        Math.min(parseDeadlineMonths(project.deadline ?? "") ?? 3, 6),
    );

    const baseMonthly = desiredIncome + monthlyCosts + financialReserve / 6;
    const basePrice = Math.max(4500, Math.round(baseMonthly * durationMonths * 0.82));

    const complexityAdjustment =
        project.complexity === "high" ? 0.18 : project.complexity === "medium" ? 0.09 : 0;

    const impactAdjustment =
        client.businessImpact === "high" || client.businessImpact === "strategic"
            ? 0.1
            : client.businessImpact === "medium"
              ? 0.05
              : 0;

    const riskAdjustment = (risk.score / 100) * 0.22;
    const urgencyAdjustment = project.isUrgent === "yes" ? 0.08 : 0;
    const paymentTermAdjustment =
        adjustments.paymentTerm === "fortyFiveDays" || adjustments.paymentTerm === "sixtyDays"
            ? 0.04
            : adjustments.paymentTerm === "thirtyDays"
              ? 0.02
              : -0.01;
    const downPaymentAdjustment =
        adjustments.downPayment === "none"
            ? 0.06
            : adjustments.downPayment === "tenPercent"
              ? 0.03
              : 0;
    const installmentAdjustment =
        adjustments.installmentOption === "fourPlus"
            ? 0.05
            : adjustments.installmentOption === "three"
              ? 0.03
              : 0;
    const contractAdjustment = adjustments.formalContract === "no" ? 0.05 : -0.03;
    const recurringAdjustment = client.recurringClient === "yes" ? -0.03 : 0;

    const totalAdjustment =
        complexityAdjustment +
        impactAdjustment +
        riskAdjustment +
        urgencyAdjustment +
        paymentTermAdjustment +
        downPaymentAdjustment +
        installmentAdjustment +
        contractAdjustment +
        recurringAdjustment;

    const recommended = Math.round(basePrice * (1 + totalAdjustment));
    const minimum = Math.round(basePrice * 0.88);
    const premium = Math.round(recommended * 1.15);

    const confidence = clamp(
        Math.round(70 + (100 - risk.score) * 0.2 + (adjustments.formalContract === "yes" ? 6 : -5)),
    );

    const priceDelta = recommended - basePrice;
    const breakdown: PricingBreakdownItem[] = [
        {
            label: "Valor base estimado",
            value: basePrice,
            description: "Fundamentado na renda desejada, custos e prazo do projeto.",
        },
        {
            label: "Ajuste por risco e prazo",
            value: Math.round(
                basePrice * (complexityAdjustment + riskAdjustment + urgencyAdjustment),
            ),
            description: "Fatores que refletem risco, complexidade e escopo do cronograma.",
        },
        {
            label: "Ajustes de proposta",
            value: Math.round(
                basePrice *
                    (impactAdjustment +
                        paymentTermAdjustment +
                        downPaymentAdjustment +
                        installmentAdjustment +
                        contractAdjustment +
                        recurringAdjustment),
            ),
            description:
                "Recomendações adicionais para tornar a proposta mais confiável e competitiva.",
        },
        {
            label: "Margem premium",
            value: Math.round(premium - recommended),
            description: "Espaço de negociação saudável para uma proposta de alto valor.",
        },
    ];

    const alerts: PricingAlert[] = [];

    if (risk.score >= 75) {
        alerts.push({
            type: "warning",
            message: "Alto risco identificado — fortaleça o escopo e o contrato antes de avançar.",
        });
    }

    if (adjustments.formalContract === "no") {
        alerts.push({
            type: "warning",
            message: "Sem contrato formal. Reforce os termos para proteger o projeto.",
        });
    }

    if (client.recurringClient === "yes") {
        alerts.push({
            type: "info",
            message: "Cliente recorrente melhora previsibilidade e autoridade da proposta.",
        });
    }

    if (priceDelta <= 0) {
        alerts.push({
            type: "info",
            message:
                "A proposta está alinhada com o valor base calculado; a oferta é conservadora.",
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
