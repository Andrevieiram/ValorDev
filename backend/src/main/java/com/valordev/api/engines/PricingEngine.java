package com.valordev.api.engines;

import com.valordev.api.profile.UserProfile;
import com.valordev.api.proposals.dto.CreateProposalRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class PricingEngine {

    public PricingResult calculate(UserProfile profile, CreateProposalRequest input, RiskEngine.RiskResult riskResult) {
        // 1. Calcula o valor hora base
        BigDecimal taxRate = PricingConstants.TAX_RATES.getOrDefault(profile.getTaxRegime().toLowerCase(), BigDecimal.ZERO);
        
        // Custo total = DesiredIncome + MonthlyCosts + FinancialReserve
        BigDecimal totalDesired = profile.getDesiredIncome()
                .add(profile.getMonthlyCosts())
                .add(profile.getFinancialReserve());

        // Ajuste com impostos: totalDesired / (1 - taxRate)
        BigDecimal grossIncome = totalDesired.divide(BigDecimal.ONE.subtract(taxRate), 2, RoundingMode.HALF_UP);

        // Horas no mês: hoursPerWeek * 4.33
        BigDecimal hoursPerMonth = BigDecimal.valueOf(profile.getHoursPerWeek()).multiply(PricingConstants.WEEKS_PER_MONTH);
        
        BigDecimal baseHourlyRate = grossIncome.divide(hoursPerMonth, 2, RoundingMode.HALF_UP);

        // Aplica os multiplicadores do perfil
        BigDecimal stackMult = PricingConstants.STACK_MULTIPLIERS.getOrDefault(profile.getMainStack().toLowerCase(), BigDecimal.ONE);
        BigDecimal workloadMult = PricingConstants.WORKLOAD_MULTIPLIERS.getOrDefault(profile.getWorkload().toLowerCase(), BigDecimal.ONE);
        
        BigDecimal finalHourlyRate = baseHourlyRate.multiply(stackMult).multiply(workloadMult);

        // 2. Calcula o valor base do projeto (Horas x Valor Hora)
        BigDecimal baseProjectValue = finalHourlyRate.multiply(BigDecimal.valueOf(input.getEstimatedHours()));

        // 3. Aplica os modificadores do Projeto
        BigDecimal projectMultiplier = BigDecimal.ONE;
        
        // Prazo muito curto (< 2 semanas)
        if (isUrgentDeadline(input.getDeadline())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.PROJECT_MULTIPLIERS.get("urgency"));
        }
        
        if (!input.getScopeDocumented()) {
            projectMultiplier = projectMultiplier.add(PricingConstants.PROJECT_MULTIPLIERS.get("undocumentedScope"));
        }
        
        if ("diaria".equalsIgnoreCase(input.getMeetingsFrequency())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.PROJECT_MULTIPLIERS.get("dailyMeetings"));
        }
        
        if (input.getMaintenance()) {
            projectMultiplier = projectMultiplier.add(PricingConstants.PROJECT_MULTIPLIERS.get("maintenance"));
        }
        
        if (input.getReuseComponents()) {
            projectMultiplier = projectMultiplier.add(PricingConstants.PROJECT_MULTIPLIERS.get("componentReuse"));
        }

        // Modificadores de Cliente
        if ("none".equalsIgnoreCase(input.getDigitalExperience()) || "leigo".equalsIgnoreCase(input.getDigitalExperience())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.CLIENT_MULTIPLIERS.get("noDigitalExperience"));
        }
        
        if ("yes".equalsIgnoreCase(input.getRecurringClient())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.CLIENT_MULTIPLIERS.get("recurringClientDiscount"));
        }
        
        if ("high".equalsIgnoreCase(input.getBusinessImpact()) || "strategic".equalsIgnoreCase(input.getBusinessImpact())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.CLIENT_MULTIPLIERS.get("highBusinessImpact"));
        }

        // Modificadores Financeiros
        if ("creditCard".equalsIgnoreCase(input.getPaymentMethod())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.FINANCIAL_MULTIPLIERS.get("creditCardFee"));
        }
        
        if ("international".equalsIgnoreCase(input.getPaymentMethod())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.FINANCIAL_MULTIPLIERS.get("internationalFee"));
        }
        
        if ("international".equalsIgnoreCase(input.getLocation())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.FINANCIAL_MULTIPLIERS.get("internationalFee"));
        }
        
        if ("fortyFiveDays".equalsIgnoreCase(input.getPaymentTerm()) || "sixtyDays".equalsIgnoreCase(input.getPaymentTerm())) {
            projectMultiplier = projectMultiplier.add(PricingConstants.FINANCIAL_MULTIPLIERS.get("longPaymentTerm"));
        }

        // 4. Valor Calculado
        BigDecimal calculatedValue = baseProjectValue.multiply(projectMultiplier).setScale(2, RoundingMode.HALF_UP);
        
        // Garante piso mínimo
        if (calculatedValue.compareTo(PricingConstants.MIN_PROJECT_PRICE) < 0) {
            calculatedValue = PricingConstants.MIN_PROJECT_PRICE;
        }

        // 5. Calcula as faixas (Min, Rec, Prem)
        BigDecimal minValue = calculatedValue.multiply(PricingConstants.PRICE_RANGE.get("minimum")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal premValue = calculatedValue.multiply(PricingConstants.PRICE_RANGE.get("premium")).setScale(2, RoundingMode.HALF_UP);

        // 6. Confiança
        int confidence = PricingConstants.CONFIDENCE_CONFIG.get("baseScore");
        confidence -= (int) (riskResult.score() * PricingConstants.CONFIDENCE_RISK_FACTOR);
        if (input.getFormalContract()) {
            confidence += PricingConstants.CONFIDENCE_CONFIG.get("formalContractBonus");
        } else {
            confidence += PricingConstants.CONFIDENCE_CONFIG.get("noContractPenalty");
        }
        confidence = Math.max(PricingConstants.CONFIDENCE_CONFIG.get("min"), Math.min(confidence, PricingConstants.CONFIDENCE_CONFIG.get("max")));

        // 7. Monta o Breakdown
        List<BreakdownItemDto> breakdown = new ArrayList<>();
        breakdown.add(new BreakdownItemDto("Desenvolvimento (Horas x Taxa)", baseProjectValue));
        
        BigDecimal adjustmentValue = calculatedValue.subtract(baseProjectValue);
        if (adjustmentValue.compareTo(BigDecimal.ZERO) != 0) {
            breakdown.add(new BreakdownItemDto("Ajustes (Risco, Prazo, Complexidade)", adjustmentValue));
        }

        return new PricingResult(minValue, calculatedValue, premValue, (short) confidence, breakdown);
    }

    /**
     * Verifica se o prazo é urgente (< 2 semanas)
     */
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

    public record PricingResult(
            BigDecimal minimumPrice,
            BigDecimal recommendedPrice,
            BigDecimal premiumPrice,
            short confidence,
            List<BreakdownItemDto> breakdown
    ) {}

    public record BreakdownItemDto(String label, BigDecimal value) {}
}
