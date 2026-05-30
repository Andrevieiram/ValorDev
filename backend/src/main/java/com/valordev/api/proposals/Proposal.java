package com.valordev.api.proposals;

import com.valordev.api.auth.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "proposals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(nullable = false, length = 180)
    private String name;

    // Inputs (Project)
    @Column(name = "project_type", nullable = false, length = 20)
    private String projectType;

    @Column(nullable = false, length = 20)
    private String complexity;

    @Column(nullable = false, length = 60)
    private String deadline;

    @Column(name = "scope_documented", nullable = false)
    private boolean scopeDocumented;

    @Column(nullable = false)
    private boolean maintenance;

    @Column(name = "meetings_frequency", nullable = false, length = 20)
    private String meetingsFrequency;

    @Column(name = "external_dependencies", columnDefinition = "TEXT")
    private String externalDependencies;

    @Column(name = "reuse_components", nullable = false)
    private boolean reuseComponents;

    @Column(name = "estimated_hours", nullable = false)
    private int estimatedHours;

    @Column(name = "tools_used", columnDefinition = "TEXT")
    private String toolsUsed;

    // Inputs (Adjustments/Financial)
    @Column(name = "billing_method", nullable = false, length = 20)
    private String billingMethod;

    @Column(name = "payment_method", nullable = false, length = 20)
    private String paymentMethod;

    @Column(name = "installment_option", nullable = false, length = 20)
    private String installmentOption;

    @Column(name = "payment_term", nullable = false, length = 20)
    private String paymentTerm;

    @Column(name = "down_payment", nullable = false, length = 20)
    private String downPayment;

    @Column(name = "recurring_billing", nullable = false, length = 20)
    private String recurringBilling;

    @Column(name = "formal_contract", nullable = false)
    private boolean formalContract;

    // Results Calculated
    @Column(name = "minimum_price", nullable = false)
    private BigDecimal minimumPrice;

    @Column(name = "recommended_price", nullable = false)
    private BigDecimal recommendedPrice;

    @Column(name = "premium_price", nullable = false)
    private BigDecimal premiumPrice;

    @Column(nullable = false)
    private short confidence;

    @Column(name = "risk_score", nullable = false)
    private short riskScore;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String probability = "media";

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "draft";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProposalBreakdownItem> breakdownItems = new ArrayList<>();

    public void addBreakdownItem(ProposalBreakdownItem item) {
        breakdownItems.add(item);
        item.setProposal(this);
    }
}
