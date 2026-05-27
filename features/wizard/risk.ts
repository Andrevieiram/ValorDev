import type { AdjustmentsData, ClientData, ProjectData, RiskReport } from "@/types";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const parseDeadlineWeeks = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(semana|semanas|week|weeks)/i);
    if (!match) return null;
    return Number(match[1]);
};

export function calculateRisk(
    project: ProjectData,
    client: ClientData,
    adjustments: AdjustmentsData,
): RiskReport {
    let score = 50;
    const factors: Array<{ name: string; score: number }> = [];

    // 1. Complexidade do Projeto
    let complexityScore = 0;
    if (project.complexity === "high") {
        complexityScore = 15;
    } else if (project.complexity === "medium") {
        complexityScore = 5;
    }
    score += complexityScore;
    factors.push({ name: "Complexidade do Projeto", score: complexityScore });

    // 2. Escopo
    const scopeScore = !project.scopeDocumented ? 20 : 0;
    score += scopeScore;
    factors.push({ name: "Escopo Documentado", score: scopeScore });

    // 3. Prazo (Urgência)
    let deadlineScore = 0;
    const weeks = parseDeadlineWeeks(project.deadline || "");
    if (weeks !== null) {
        if (weeks < 2) {
            deadlineScore = 25;
        } else if (weeks <= 4) {
            deadlineScore = 10;
        }
    } else {
        const lowerDeadline = (project.deadline || "").toLowerCase();
        if (lowerDeadline.includes("urgente") || lowerDeadline.includes("correndo")) {
            deadlineScore = 20;
        }
    }
    score += deadlineScore;
    factors.push({ name: "Prazo/Urgência", score: deadlineScore });

    // 4. Reuniões
    let meetingsScore = 0;
    if (project.meetingsFrequency === "diaria") {
        meetingsScore = 8;
    } else if (project.meetingsFrequency === "mensal") {
        meetingsScore = 10;
    }
    score += meetingsScore;
    factors.push({ name: "Frequência de Reuniões", score: meetingsScore });

    // 5. Dependências Externas
    const depsScore = project.externalDependencies && project.externalDependencies.trim().length > 0 ? 15 : 0;
    score += depsScore;
    factors.push({ name: "Dependências Externas", score: depsScore });

    // 6. Reaproveitamento de componentes
    const reuseScore = project.reuseComponents ? -5 : 0;
    score += reuseScore;
    factors.push({ name: "Reuso de Componentes", score: reuseScore });

    // 7. Maturidade Digital do Cliente
    let clientExpScore = 0;
    if (client.digitalExperience === "none") {
        clientExpScore = 20;
    } else if (client.digitalExperience === "advanced") {
        clientExpScore = -5;
    }
    score += clientExpScore;
    factors.push({ name: "Maturidade Digital do Cliente", score: clientExpScore });

    // 8. Cliente Recorrente
    let recurringScore = 0;
    if (client.recurringClient === "yes") {
        recurringScore = -10;
    } else {
        recurringScore = 5;
    }
    score += recurringScore;
    factors.push({ name: "Cliente Recorrente", score: recurringScore });

    // 9. Contrato Formal
    const contractScore = adjustments.formalContract === "no" ? 25 : 0;
    score += contractScore;
    factors.push({ name: "Contrato Formal", score: contractScore });

    // 10. Pagamento de Sinal
    const downPaymentScore = adjustments.downPayment === "none" ? 15 : 0;
    score += downPaymentScore;
    factors.push({ name: "Pagamento de Sinal", score: downPaymentScore });

    const finalScore = clamp(score);
    const level = finalScore >= 70 ? "high" : finalScore >= 40 ? "medium" : "low";

    const recommendation =
        level === "high"
            ? "Alto risco estrutural. É fortemente recomendado exigir contrato e cobrar sinal."
            : level === "medium"
              ? "Risco moderado. O projeto possui alguns desafios viáveis, mas atente-se às reuniões."
              : "Baixo risco. Escopo, cliente e condições contratuais estão excelentes.";

    return {
        score: finalScore,
        level,
        factors,
        recommendation,
    };
}
