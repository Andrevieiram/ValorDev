package main.java.com.valordev.api.profile;

import com.valordev.api.auth.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.valordev.api.common.enums.ExperienceLevel;
import com.valordev.api.common.enums.TaxRegime;
import com.valordev.api.common.enums.TechStack;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    private UUID userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "desired_income", nullable = false, precision = 10, scale = 2)
    private BigDecimal desiredIncome;

    @Column(name = "hours_per_week", nullable = false)
    private Integer hoursPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", nullable = false, length = 20)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "tax_regime", nullable = false, length = 30)
    private TaxRegime taxRegime;

    @Enumerated(EnumType.STRING)
    @Column(name = "main_stack", nullable = false, length = 20)
    private TechStack mainStack;

    @Column(nullable = false, length = 20)
    private String workload;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal hourlyRate = BigDecimal.ZERO;

    @Column(name = "monthly_costs", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal monthlyCosts = BigDecimal.ZERO;

    @Column(name = "financial_reserve", nullable = false)
    @Builder.Default
    private BigDecimal financialReserve = BigDecimal.ZERO;

}
