package com.valordev.api.profile.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.valordev.api.profile.dto.enums.*;

import java.math.BigDecimal;

public record UserProfileDto(
        @NotNull(message = "Renda desejada é obrigatória")
        @DecimalMin(value = 0, message = "Renda desejada não pode ser negativa")
        BigDecimal desiredIncome,

        @NotNull(message = "Horas por semana é obrigatório")
        @Min(value = 1, message = "Horas por semana deve ser no mínimo 1")
        @Max(value = 80, message = "Horas por semana deve ser no máximo 80")
        Integer hoursPerWeek,

        @NotNull(message = "Nível de experiência é obrigatório")
        ExperienceLevel experienceLevel,

        @NotNull(message = "Regime tributário é obrigatório")
        TaxRegime taxRegime,

        @NotNull(message = "Stack principal é obrigatória")
        TechStack mainStack,

        @NotBlank(message = "Carga de trabalho é obrigatória")
        String workload,

        @NotNull(message = "Custos mensais são obrigatórios")
        @Min(value = 0, message = "Custos mensais não podem ser negativos")
        BigDecimal monthlyCosts,

        @NotNull(message = "Reserva financeira é obrigatória")
        @DecimalMin(value = 0, message = "Renda desejada não pode ser negativa")
        BigDecimal financialReserve
) {
}
