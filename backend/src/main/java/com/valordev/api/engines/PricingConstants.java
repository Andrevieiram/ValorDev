package com.valordev.api.engines;

import java.math.BigDecimal;
import java.util.Map;

public class PricingConstants {

    public static final BigDecimal WEEKS_PER_MONTH = BigDecimal.valueOf(4.33);
    public static final BigDecimal MIN_PROJECT_PRICE = BigDecimal.valueOf(3000);

    public static final Map<String, BigDecimal> STACK_MULTIPLIERS = Map.of(
            "default", BigDecimal.valueOf(1.0),
            "frontend", BigDecimal.valueOf(1.2),
            "mobile", BigDecimal.valueOf(1.25),
            "fullstack", BigDecimal.valueOf(1.3),
            "devops", BigDecimal.valueOf(1.4)
    );

    public static final Map<String, BigDecimal> WORKLOAD_MULTIPLIERS = Map.of(
            "normal", BigDecimal.valueOf(1.0),
            "high", BigDecimal.valueOf(1.15),
            "overloaded", BigDecimal.valueOf(1.3)
    );

    public static final Map<String, BigDecimal> PROJECT_MULTIPLIERS = Map.of(
            "urgency", BigDecimal.valueOf(0.3), // Prazo < 2 semanas
            "undocumentedScope", BigDecimal.valueOf(0.25), // Escopo não documentado
            "dailyMeetings", BigDecimal.valueOf(0.2), // Reuniões diárias
            "maintenance", BigDecimal.valueOf(0.1), // Manutenção pós-projeto
            "componentReuse", BigDecimal.valueOf(-0.15) // Reaproveitamento de componentes
    );

    public static final Map<String, BigDecimal> CLIENT_MULTIPLIERS = Map.of(
            "noDigitalExperience", BigDecimal.valueOf(0.2),
            "recurringClientDiscount", BigDecimal.valueOf(-0.1),
            "highBusinessImpact", BigDecimal.valueOf(0.25)
    );

    public static final Map<String, BigDecimal> FINANCIAL_MULTIPLIERS = Map.of(
            "creditCardFee", BigDecimal.valueOf(-0.04),
            "internationalFee", BigDecimal.valueOf(-0.1),
            "longPaymentTerm", BigDecimal.valueOf(0.05)
    );

    public static final Map<String, BigDecimal> PRICE_RANGE = Map.of(
            "minimum", BigDecimal.valueOf(0.88),
            "premium", BigDecimal.valueOf(1.15)
    );

    public static final Map<String, Integer> CONFIDENCE_CONFIG = Map.of(
            "baseScore", 75,
            "formalContractBonus", 5,
            "noContractPenalty", -10,
            "min", 0,
            "max", 100
    );

    public static final double CONFIDENCE_RISK_FACTOR = 0.2;

    public static final Map<String, BigDecimal> TAX_RATES = Map.of(
            "mei", BigDecimal.valueOf(0.02),
            "simples", BigDecimal.valueOf(0.05),
            "lucroPresumido", BigDecimal.valueOf(0.08),
            "lucroReal", BigDecimal.valueOf(0.13)
    );
}
