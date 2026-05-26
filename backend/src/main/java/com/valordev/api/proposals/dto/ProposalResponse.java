package com.valordev.api.proposals.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProposalResponse {
    private UUID id;
    private String name;
    
    private String projectType;
    private String complexity;
    private String deadline;
    private Boolean scopeDocumented;
    private Boolean maintenance;
    private String meetingsFrequency;
    private String externalDependencies;
    private Boolean reuseComponents;
    private Integer estimatedHours;

    private String billingMethod;
    private String paymentMethod;
    private String paymentTerm;
    private String downPayment;
    private Boolean formalContract;

    private BigDecimal minimumPrice;
    private BigDecimal recommendedPrice;
    private BigDecimal premiumPrice;
    private short confidence;
    private short riskScore;
    private String riskLevel;
    private String probability;
    private String status;
    private LocalDateTime createdAt;
    
    private List<BreakdownItemDto> breakdownItems;

    @Data
    @Builder
    public static class BreakdownItemDto {
        private UUID id;
        private short sortOrder;
        private String label;
        private BigDecimal value;
        private String description;
    }
}
