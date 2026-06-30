package com.valordev.api.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class DashboardSummaryDto {
    private BigDecimal monthlyGoal;
    private Pipeline pipeline;

    @Data
    @Builder
    public static class Pipeline {
        private BigDecimal totalValue;
        private Breakdown breakdown;
    }

    @Data
    @Builder
    public static class Breakdown {
        private Category fechada;
        private Category alta;
        private Category media;
        private Category baixa;
        private Category perdida;
    }

    @Data
    @Builder
    public static class Category {
        private int count;
        private BigDecimal value;
        private List<ProposalItemDto> items;
    }

    @Data
    @Builder
    public static class ProposalItemDto {
        private UUID id;
        private String name;
        private BigDecimal value;
        private String status;
        private String probability;
    }
}
