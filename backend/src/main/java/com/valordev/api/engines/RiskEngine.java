package com.valordev.api.engines;

import com.valordev.api.proposals.dto.CreateProposalRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RiskEngine {

    public RiskResult calculateRisk(CreateProposalRequest input) {
        int riskScore = 0;
        List<String> riskFactors = new ArrayList<>();

        // Escopo não documentado = Alto risco
        if (!input.getScopeDocumented()) {
            riskScore += 30;
            riskFactors.add("Escopo não documentado");
        }

        // Prazo muito curto
        if ("< 1 mês".equals(input.getDeadline()) || "< 2 semanas".equals(input.getDeadline())) {
            riskScore += 25;
            riskFactors.add("Prazo muito curto");
        }

        // Complexidade Alta
        if ("Alta".equals(input.getComplexity())) {
            riskScore += 20;
            riskFactors.add("Alta complexidade técnica");
        }

        // Dependências externas
        if (input.getExternalDependencies() != null && !input.getExternalDependencies().isEmpty() && !"Nenhuma".equals(input.getExternalDependencies())) {
            riskScore += 15;
            riskFactors.add("Dependências externas (" + input.getExternalDependencies() + ")");
        }

        // Risco Financeiro: Sem contrato
        if (!input.getFormalContract()) {
            riskScore += 25;
            riskFactors.add("Ausência de contrato formal");
        }

        // Risco de Pagamento
        if ("100% no final".equals(input.getDownPayment())) {
            riskScore += 20;
            riskFactors.add("Pagamento apenas no final");
        }

        // Cliente inexperiente
        if ("Nenhuma".equals(input.getDigitalExperience()) || "Baixa".equals(input.getDigitalExperience())) {
            riskScore += 15;
            riskFactors.add("Cliente com pouca/nenhuma experiência digital");
        }

        // Limita o score máximo a 100
        riskScore = Math.min(riskScore, 100);

        String level = calculateRiskLevel(riskScore);

        return new RiskResult((short) riskScore, level, riskFactors);
    }

    private String calculateRiskLevel(int score) {
        if (score <= 25) return "Baixo";
        if (score <= 50) return "Médio";
        if (score <= 75) return "Alto";
        return "Crítico";
    }

    public record RiskResult(short score, String level, List<String> factors) {}
}
