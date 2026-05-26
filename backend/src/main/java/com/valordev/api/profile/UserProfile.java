package com.valordev.api.profile;

import com.valordev.api.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "desired_income", nullable = false)
    private BigDecimal desiredIncome;

    @Column(name = "hours_per_week", nullable = false)
    private Integer hoursPerWeek;

    @Column(name = "experience_level", nullable = false, length = 20)
    private String experienceLevel;

    @Column(name = "tax_regime", nullable = false, length = 20)
    private String taxRegime;

    @Column(name = "main_stack", nullable = false, length = 20)
    private String mainStack;

    @Column(nullable = false, length = 20)
    private String workload;

    @Column(name = "monthly_costs", nullable = false)
    @Builder.Default
    private BigDecimal monthlyCosts = BigDecimal.ZERO;

    @Column(name = "financial_reserve", nullable = false)
    @Builder.Default
    private BigDecimal financialReserve = BigDecimal.ZERO;

}
