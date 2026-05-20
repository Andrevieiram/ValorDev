import type { AdjustmentsData, ClientData, ProfileData, ProjectData, RiskReport } from "@/types";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const parseDeadlineWeeks = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(semana|semanas|week|weeks)/i);
    if (!match) return null;
    return Number(match[1]);
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

    // 1. Complexidade do Projeto
    if (project.complexity === "high") {
        score += 15;
        riskFactors.push("Alta complexidade técnica");
    } else if (project.complexity === "medium") {
        score += 5;
        riskFactors.push("Complexidade média");
    } else {
        positiveFactors.push("Baixa complexidade do projeto");
    }

    // 2. Escopo
    if (!project.scopeDocumented) {
        score += 20;
        riskFactors.push("Escopo do projeto não documentado");
    } else {
        positiveFactors.push("Escopo formalmente documentado");
    }

    // 3. Prazo (Urgência)
    const weeks = parseDeadlineWeeks(project.deadline || "");
    if (weeks !== null) {
        if (weeks < 2) {
            score += 25;
            riskFactors.push("Prazo extremamente crítico (menos de 2 semanas)");
        } else if (weeks <= 4) {
            score += 10;
            riskFactors.push("Prazo curto (até 4 semanas)");
        } else {
            positiveFactors.push("Prazo confortável para entrega");
        }
    } else {
        // Fallback para prazos genéricos curtos
        const lowerDeadline = (project.deadline || "").toLowerCase();
        if (lowerDeadline.includes("urgente") || lowerDeadline.includes("correndo")) {
            score += 20;
            riskFactors.push("Caráter de urgência relatado");
        } else {
            positiveFactors.push("Cronograma padrão informado");
        }
    }

    // 4. Reuniões
    if (project.meetingsFrequency === "diaria") {
        score += 8;
        riskFactors.push("Reuniões diárias (alto overhead de comunicação)");
    } else if (project.meetingsFrequency === "semanal" || project.meetingsFrequency === "quinzenal") {
        positiveFactors.push("Frequência de reuniões ideal para alinhamento");
    } else if (project.meetingsFrequency === "mensal") {
        score += 10;
        riskFactors.push("Pouca frequência de reuniões (risco de desvios)");
    }

    // 5. Dependências Externas
    if (project.externalDependencies && project.externalDependencies.trim().length > 0) {
        score += 15;
        riskFactors.push(`Dependências de terceiros: ${project.externalDependencies}`);
    } else {
        positiveFactors.push("Livre de dependências de terceiros");
    }

    // 6. Reaproveitamento de componentes
    if (project.reuseComponents) {
        score -= 5;
        positiveFactors.push("Reaproveitamento de componentes (reduz prazo/risco)");
    }

    // 7. Perfil Profissional
    if (profile.experienceLevel === "junior") {
        score += 15;
        riskFactors.push("Profissional nível júnior no comando");
    } else if (profile.experienceLevel === "senior") {
        score -= 10;
        positiveFactors.push("Profissional sênior de alta bagagem");
    }

    // 8. Maturidade Digital do Cliente
    if (client.digitalExperience === "none") {
        score += 20;
        riskFactors.push("Cliente leigo / sem maturidade digital");
    } else if (client.digitalExperience === "advanced") {
        score -= 5;
        positiveFactors.push("Cliente altamente maduro digitalmente");
    }

    // 9. Cliente Recorrente
    if (client.recurringClient === "yes") {
        score -= 10;
        positiveFactors.push("Cliente parceiro e recorrente");
    } else {
        score += 5;
        riskFactors.push("Cliente novo (sem histórico de parceria)");
    }

    // 10. Contrato Formal e Financeiro
    if (adjustments.formalContract === "no") {
        score += 25;
        riskFactors.push("Sem contrato formal firmado");
    } else {
        positiveFactors.push("Contrato de prestação de serviço assegurado");
    }

    if (adjustments.downPayment === "none") {
        score += 15;
        riskFactors.push("Ausência de pagamento de sinal / entrada");
    } else {
        positiveFactors.push("Garantia de sinal / entrada na assinatura");
    }

    if (adjustments.paymentMethod === "international") {
        score += 8;
        riskFactors.push("Recebimento internacional (risco cambial/taxas)");
    }

    const finalScore = clamp(score);
    const level = finalScore >= 70 ? "high" : finalScore >= 40 ? "medium" : "low";

    const summary =
        level === "high"
            ? "Alto risco estrutural. É fortemente recomendado exigir contrato e cobrar sinal."
            : level === "medium"
              ? "Risco moderado. O projeto possui alguns desafios viáveis, mas atente-se às reuniões."
              : "Baixo risco. Escopo, cliente e condições contratuais estão excelentes.";

    return {
        score: finalScore,
        level,
        summary,
        riskFactors,
        positiveFactors,
    };
}
