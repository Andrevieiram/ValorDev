package com.valordev.api.profile.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UserProfileDto(
        @NotNull(message = "Renda desejada é obrigatória")
        @Min(value = 0, message = "Renda desejada não pode ser negativa")
        BigDecimal desiredIncome,

        @NotNull(message = "Horas por semana é obrigatório")
        @Min(value = 1, message = "Horas por semana deve ser no mínimo 1")
        Integer hoursPerWeek,

        @NotBlank(message = "Nível de experiência é obrigatório")
        String experienceLevel,

        @NotBlank(message = "Regime tributário é obrigatório")
        String taxRegime,

        @NotBlank(message = "Stack principal é obrigatória")
        String mainStack,

        @NotBlank(message = "Carga de trabalho é obrigatória")
        String workload,

        @NotNull(message = "Custos mensais são obrigatórios")
        @Min(value = 0, message = "Custos mensais não podem ser negativos")
        BigDecimal monthlyCosts,

        @NotNull(message = "Reserva financeira é obrigatória")
        @Min(value = 0, message = "Reserva financeira não pode ser negativa")
        BigDecimal financialReserve
) {
}
