package com.valordev.api.proposals;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "proposal_breakdown_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalBreakdownItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @Column(name = "sort_order", nullable = false)
    private short sortOrder;

    @Column(nullable = false, length = 120)
    private String label;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(columnDefinition = "TEXT")
    private String description;
}
