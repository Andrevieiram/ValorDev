package main.java.com.valordev.api.engines;

import com.valordev.api.proposals.dto.CreateProposalRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class RiskEngine {

    public RiskResult calculateRisk(CreateProposalRequest input) {
        int score = 50;
        List<RiskFactor> factors = new ArrayList<>();

        // 0. Tipo de Produto
        int projectTypeScore = 0;
        if ("mobile".equalsIgnoreCase(input.getProjectType())) {
            projectTypeScore = 8; // Mobile tem mais complexidade em testes/distribuição
        } else if ("api".equalsIgnoreCase(input.getProjectType())) {
            projectTypeScore = 5; // API tem risco moderado de integrações
        }
        score += projectTypeScore;
        factors.add(new RiskFactor("Tipo de Produto", projectTypeScore));

        // 1. Complexidade do Projeto
        int complexityScore = 0;
        if ("high".equalsIgnoreCase(input.getComplexity())) {
            complexityScore = 15;
        } else if ("medium".equalsIgnoreCase(input.getComplexity())) {
            complexityScore = 5;
        }
        score += complexityScore;
        factors.add(new RiskFactor("Complexidade do Projeto", complexityScore));

        // 2. Escopo
        int scopeScore = !input.getScopeDocumented() ? 20 : 0;
        score += scopeScore;
        factors.add(new RiskFactor("Escopo Documentado", scopeScore));

        // 3. Prazo (Urgência)
        int deadlineScore = 0;
        Integer weeks = parseDeadlineWeeks(input.getDeadline());
        if (weeks != null) {
            if (weeks < 2) {
                deadlineScore = 25;
            } else if (weeks <= 4) {
                deadlineScore = 10;
            }
        } else {
            String lowerDeadline = (input.getDeadline() != null ? input.getDeadline() : "").toLowerCase();
            if (lowerDeadline.contains("urgente") || lowerDeadline.contains("correndo")) {
                deadlineScore = 20;
            }
        }
        score += deadlineScore;
        factors.add(new RiskFactor("Prazo/Urgência", deadlineScore));

        // 4. Reuniões
        int meetingsScore = 0;
        String freq = input.getMeetingsFrequency() != null ? input.getMeetingsFrequency() : "";
        if ("diaria".equalsIgnoreCase(freq)) {
            meetingsScore = 8;
        } else if ("mensal".equalsIgnoreCase(freq)) {
            meetingsScore = 10;
        }
        score += meetingsScore;
        factors.add(new RiskFactor("Frequência de Reuniões", meetingsScore));

        // 5. Dependências Externas
        int depsScore = 0;
        String deps = input.getExternalDependencies() != null ? input.getExternalDependencies() : "";
        switch(deps.toLowerCase()) {
            case "none":
                depsScore = 0;
                break;
            case "standard":
                depsScore = 8;
                break;
            case "critical":
                depsScore = 15;
                break;
            case "legacy":
                depsScore = 20;
                break;
            case "ai":
                depsScore = 25;
                break;
            default:
                depsScore = 0;
        }
        score += depsScore;
        factors.add(new RiskFactor("Dependências Externas", depsScore));

        // 5b. Ferramentas e Bibliotecas
        int toolsScore = 0;
        String tools = input.getToolsUsed() != null ? input.getToolsUsed() : "";
        switch(tools.toLowerCase()) {
            case "standard":
                toolsScore = 0;
                break;
            case "specialized":
                toolsScore = 5;
                break;
            case "emerging":
                toolsScore = 10;
                break;
            case "custom":
                toolsScore = 15;
                break;
            default:
                toolsScore = 0;
        }
        score += toolsScore;
        factors.add(new RiskFactor("Ferramentas e Bibliotecas", toolsScore));

        // 6. Reaproveitamento de componentes
        int reuseScore = (input.getReuseComponents() != null && input.getReuseComponents()) ? -5 : 0;
        score += reuseScore;
        factors.add(new RiskFactor("Reuso de Componentes", reuseScore));

        // 7. Maturidade Digital do Cliente
        int clientExpScore = 0;
        String digitalExp = input.getDigitalExperience() != null ? input.getDigitalExperience() : "";
        if ("none".equalsIgnoreCase(digitalExp)) {
            clientExpScore = 20;
        } else if ("advanced".equalsIgnoreCase(digitalExp)) {
            clientExpScore = -5;
        }
        score += clientExpScore;
        factors.add(new RiskFactor("Maturidade Digital do Cliente", clientExpScore));

        // 8. Cliente Recorrente
        int recurringScore = 0;
        String recurring = input.getRecurringClient() != null ? input.getRecurringClient() : "";
        if ("yes".equalsIgnoreCase(recurring)) {
            recurringScore = -10;
        } else {
            recurringScore = 5;
        }
        score += recurringScore;
        factors.add(new RiskFactor("Cliente Recorrente", recurringScore));

        // 9. Contrato Formal
        int contractScore = (input.getFormalContract() == null || !input.getFormalContract()) ? 25 : 0;
        score += contractScore;
        factors.add(new RiskFactor("Contrato Formal", contractScore));

        // 10. Pagamento de Sinal
        int downPaymentScore = ("none".equalsIgnoreCase(input.getDownPayment())) ? 15 : 0;
        score += downPaymentScore;
        factors.add(new RiskFactor("Pagamento de Sinal", downPaymentScore));

        // 11. Faturamento Recorrente
        int recurringBillingScore = 0;
        if ("yes".equalsIgnoreCase(input.getRecurringBilling())) {
            recurringBillingScore = -5; // Reduz risco por ter receita contínua
        }
        score += recurringBillingScore;
        factors.add(new RiskFactor("Faturamento Recorrente", recurringBillingScore));

        // Clamp score between 0 and 100
        int finalScore = Math.min(100, Math.max(0, score));
        String level = calculateRiskLevel(finalScore);

        String recommendation = switch (level) {
            case "high", "critical" -> 
                "Alto risco estrutural. É fortemente recomendado exigir contrato e cobrar sinal.";
            case "medium" -> 
                "Risco moderado. O projeto possui alguns desafios viáveis, mas atente-se às reuniões.";
            default -> 
                "Baixo risco. Escopo, cliente e condições contratuais estão excelentes.";
        };

        return new RiskResult((short) finalScore, level, factors, recommendation);
    }

    private Integer parseDeadlineWeeks(String deadline) {
        if (deadline == null || deadline.isEmpty()) {
            return null;
        }
        
        Pattern pattern = Pattern.compile("(\\d+)\\s*(semana|semanas|week|weeks)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(deadline);
        
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        
        return null;
    }

    private String calculateRiskLevel(int score) {
        if (score >= 70) return "high";
        if (score >= 40) return "medium";
        return "low";
    }

    public static class RiskFactor {
        public String name;
        public int score;

        public RiskFactor(String name, int score) {
            this.name = name;
            this.score = score;
        }

        public String getName() {
            return name;
        }

        public int getScore() {
            return score;
        }
    }

    public record RiskResult(short score, String level, List<RiskFactor> factors, String recommendation) {}
}
