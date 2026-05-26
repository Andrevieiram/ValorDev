package com.valordev.api.proposals.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateProposalRequest {
    
    @NotBlank
    private String name;

    // Project Input
    @NotBlank
    private String projectType;
    @NotBlank
    private String complexity;
    @NotBlank
    private String deadline;
    @NotNull
    private Boolean scopeDocumented;
    @NotNull
    private Boolean maintenance;
    @NotBlank
    private String meetingsFrequency;
    private String externalDependencies;
    @NotNull
    private Boolean reuseComponents;
    @NotNull
    private Integer estimatedHours;

    // Client Input
    @NotBlank
    private String clientName;
    @NotBlank
    private String clientType;
    @NotBlank
    private String digitalExperience;
    @NotBlank
    private String recurringClient;
    @NotBlank
    private String location;
    @NotBlank
    private String businessImpact;

    // Adjustments Input
    @NotBlank
    private String billingMethod;
    @NotBlank
    private String paymentMethod;
    @NotBlank
    private String paymentTerm;
    @NotBlank
    private String downPayment;
    @NotNull
    private Boolean formalContract;
}
