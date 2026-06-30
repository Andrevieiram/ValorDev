package com.valordev.api.profile.dto;

import jakarta.validation.constraints.*;
import com.valordev.api.common.enums.ExperienceLevel;
import com.valordev.api.common.enums.TaxRegime;
import com.valordev.api.common.enums.TechStack;
import java.math.BigDecimal;


public record UserProfileRequest(
        @NotNull(message = "Renda desejada é obrigatória")
        @DecimalMin(value = "0.00", message = "Renda desejada não pode ser negativa")
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
        @DecimalMin(value = "0.00", message = "Custos mensais não podem ser negativos")
        BigDecimal monthlyCosts,

        @NotNull(message = "Reserva financeira é obrigatória")
        @DecimalMin(value = "0.00", message = "Reserva financeira não pode ser negativa")
        BigDecimal financialReserve
) {}