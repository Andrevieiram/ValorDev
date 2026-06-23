package main.java.com.valordev.api.profile.dto;

import com.valordev.api.common.enums.ExperienceLevel;
import com.valordev.api.common.enums.TaxRegime;
import com.valordev.api.common.enums.TechStack;
import java.math.BigDecimal;

public record UserProfileResponse(
        BigDecimal desiredIncome,
        Integer hoursPerWeek,
        ExperienceLevel experienceLevel,
        TaxRegime taxRegime,
        TechStack mainStack,
        String workload,
        BigDecimal monthlyCosts,
        BigDecimal financialReserve,
        BigDecimal hourlyRate
) {}