package com.valordev.api.proposals.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CalculatePricingResponse {
    private BigDecimal minimumPrice;
    private BigDecimal recommendedPrice;
    private BigDecimal premiumPrice;
    private short confidence;
    private short riskScore;
    private String riskLevel;
    
    private List<BreakdownItemDto> breakdown;
    private List<String> riskFactors;

    @Data
    @Builder
    public static class BreakdownItemDto {
        private String label;
        private BigDecimal value;
    }
}
