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
        if (isUrgentDeadline(input.getDeadline())) {
            riskScore += 25;
            riskFactors.add("Prazo muito curto (< 2 semanas)");
        }

        // Complexidade Alta
        if ("high".equalsIgnoreCase(input.getComplexity())) {
            riskScore += 20;
            riskFactors.add("Alta complexidade técnica");
        }

        // Dependências externas
        if (input.getExternalDependencies() != null && !input.getExternalDependencies().isEmpty()) {
            riskScore += 15;
            riskFactors.add("Dependências externas (" + input.getExternalDependencies() + ")");
        }

        // Risco Financeiro: Sem contrato
        if (!input.getFormalContract()) {
            riskScore += 25;
            riskFactors.add("Ausência de contrato formal");
        }

        // Risco de Pagamento: 100% no final (down_payment = "none")
        if ("none".equalsIgnoreCase(input.getDownPayment())) {
            riskScore += 20;
            riskFactors.add("Pagamento apenas no final (sem entrada)");
        }

        // Cliente inexperiente
        if ("none".equalsIgnoreCase(input.getDigitalExperience()) || "beginner".equalsIgnoreCase(input.getDigitalExperience())) {
            riskScore += 15;
            riskFactors.add("Cliente com pouca/nenhuma experiência digital");
        }

        // Limita o score máximo a 100
        riskScore = Math.min(riskScore, 100);

        String level = calculateRiskLevel(riskScore);

        return new RiskResult((short) riskScore, level, riskFactors);
    }

    private boolean isUrgentDeadline(String deadline) {
        if (deadline == null || deadline.isEmpty()) {
            return false;
        }
        
        try {
            // Tenta extrair número da string (ex: "3 semanas" -> 3)
            String[] parts = deadline.toLowerCase().split("\\s+");
            if (parts.length > 0) {
                int weeks = Integer.parseInt(parts[0]);
                return weeks < 2;
            }
        } catch (NumberFormatException e) {
            // Se não conseguir fazer parse, retorna false
        }
        
        return false;
    }

    private String calculateRiskLevel(int score) {
        if (score <= 25) return "low";
        if (score <= 50) return "medium";
        if (score <= 75) return "high";
        return "critical";
    }

    public record RiskResult(short score, String level, List<String> factors) {}
}
