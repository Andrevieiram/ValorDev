import type { AdjustmentsData, ClientData, ProfileData, ProjectData, RiskReport } from "@/types";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const parseDeadlineMonths = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(m[eê]s|mes|month|months)/i);
    if (!match) return null;
    return Number(match[1]);
};

const isShortDeadline = (deadline: string) => {
    const normalized = deadline.toLowerCase();
    return /\b(semana|semanas|dia|dias|week|days)\b/.test(normalized);
};

const isWeeklyMeeting = (meetings: string) => {
    const normalized = meetings.toLowerCase();
    return /\b(semanal|quinzenal|mensal|weekly|biweekly|monthly)\b/.test(normalized);
};

export function calculateWizardRisk(
    profile: ProfileData,
    project: ProjectData,
    client: ClientData,
    adjustments: AdjustmentsData,
): RiskReport {
    let score = 50;
    const riskFactors: string[] = [];
    const positiveFactors: string[] = [];

    const deadline = project.deadline?.trim() ?? "";
    const normalizedDeadline = deadline.toLowerCase();

    if (project.complexity === "high") {
        score += 10;
        riskFactors.push("Complexidade alta do projeto");
    } else if (project.complexity === "medium") {
        score += 5;
        riskFactors.push("Complexidade moderada");
    } else if (project.complexity === "low") {
        positiveFactors.push("Complexidade baixa");
    }

    if (!project.scopeDocumented) {
        score += 15;
        riskFactors.push("Escopo não está documentado");
    } else {
        positiveFactors.push("Escopo documentado");
    }

    if (deadline) {
        if (isShortDeadline(deadline)) {
            score += 15;
            riskFactors.push("Prazo muito curto");
        } else {
            const months = parseDeadlineMonths(deadline);
            if (months !== null) {
                if (months <= 2) {
                    score += 10;
                    riskFactors.push("Prazo apertado");
                } else if (months > 6) {
                    positiveFactors.push("Prazo mais confortável");
                } else {
                    positiveFactors.push("Prazo razoável");
                }
            } else {
                positiveFactors.push("Prazo informado");
            }
        }
    } else {
        score += 10;
        riskFactors.push("Prazo não informado");
    }

    if (isWeeklyMeeting(project.meetings || "")) {
        positiveFactors.push("Reuniões periódicas para alinhamento");
    } else if (project.meetings) {
        score += 10;
        riskFactors.push("Frequência de reuniões inconsistente");
    }

    if (project.maintenance === "yes") {
        score += 5;
        riskFactors.push("Manutenção pós-entrega prevista");
    } else {
        positiveFactors.push("Sem manutenção recorrente definida");
    }

    if (profile.experienceLevel === "junior") {
        score += 10;
        riskFactors.push("Experiência profissional iniciante");
    } else if (profile.experienceLevel === "pleno") {
        score += 5;
        riskFactors.push("Experiência intermediária");
    } else if (profile.experienceLevel === "senior") {
        positiveFactors.push("Experiência sênior no perfil financeiro");
    }

    if (client.digitalExperience === "none") {
        score += 10;
        riskFactors.push("Cliente sem experiência digital");
    } else if (client.digitalExperience === "beginner") {
        score += 5;
        riskFactors.push("Cliente iniciante em digital");
    } else {
        positiveFactors.push("Cliente com maturidade digital");
    }

    if (client.recurringClient === "no") {
        score += 5;
        riskFactors.push("Cliente não recorrente");
    } else {
        positiveFactors.push("Cliente recorrente");
    }

    if (client.location === "international") {
        score += 5;
        riskFactors.push("Localização internacional");
    } else {
        positiveFactors.push("Localização dentro do país");
    }

    if (client.businessImpact === "low") {
        score += 10;
        riskFactors.push("Impacto baixo no negócio");
    } else if (client.businessImpact === "medium") {
        score += 5;
        riskFactors.push("Impacto comercial moderado");
    } else if (client.businessImpact === "high" || client.businessImpact === "strategic") {
        positiveFactors.push("Projeto com alto impacto para o negócio");
    }

    if (adjustments.billingMethod !== "fixed") {
        score += 5;
        riskFactors.push("Modelo de cobrança mais complexo");
    } else {
        positiveFactors.push("Cobrança fixa mais previsível");
    }

    if (adjustments.installmentOption === "fourPlus") {
        score += 5;
        riskFactors.push("Parcelamento longo");
    } else if (adjustments.installmentOption === "three") {
        score += 3;
        riskFactors.push("Parcelamento moderado");
    } else {
        positiveFactors.push("Parcelamento enxuto");
    }

    if (adjustments.paymentTerm === "fortyFiveDays" || adjustments.paymentTerm === "sixtyDays") {
        score += 10;
        riskFactors.push("Prazo de pagamento extenso");
    } else if (adjustments.paymentTerm === "thirtyDays") {
        score += 5;
        riskFactors.push("Prazo de pagamento padrão");
    } else {
        positiveFactors.push("Prazo de pagamento curto");
    }

    if (adjustments.downPayment === "none") {
        score += 10;
        riskFactors.push("Sem entrada inicial");
    } else if (adjustments.downPayment === "tenPercent") {
        score += 5;
        riskFactors.push("Entrada inicial reduzida");
    } else {
        positiveFactors.push("Entrada inicial garantida");
    }

    if (adjustments.recurringBilling === "yes") {
        positiveFactors.push("Cobrança recorrente prevista");
    } else {
        score += 5;
        riskFactors.push("Cobrança única sem recorrência");
    }

    if (adjustments.formalContract === "no") {
        score += 10;
        riskFactors.push("Ausência de contrato formal");
    } else {
        positiveFactors.push("Contrato formal definido");
    }

    const finalScore = clamp(score);
    const level = finalScore >= 70 ? "high" : finalScore >= 40 ? "medium" : "low";

    const summary =
        level === "high"
            ? "Existem sinais claros de atenção. Ajustes e alinhamentos serão importantes."
            : level === "medium"
              ? "O projeto tem pontos positivos e alguns fatores de risco a considerar."
              : "O perfil está bem estruturado, com poucos fatores críticos.";

    return {
        score: finalScore,
        level,
        summary,
        riskFactors,
        positiveFactors,
    };
}
