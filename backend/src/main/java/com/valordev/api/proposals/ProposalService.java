package com.valordev.api.proposals;

import com.valordev.api.auth.User;
import com.valordev.api.engines.PricingEngine;
import com.valordev.api.engines.RiskEngine;
import com.valordev.api.profile.UserProfile;
import com.valordev.api.profile.UserProfileRepository;
import com.valordev.api.proposals.dto.CalculatePricingRequest;
import com.valordev.api.proposals.dto.CalculatePricingResponse;
import com.valordev.api.proposals.dto.CreateProposalRequest;
import com.valordev.api.proposals.dto.ProposalResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final UserProfileRepository userProfileRepository;
    private final ClientRepository clientRepository;
    private final RiskEngine riskEngine;
    private final PricingEngine pricingEngine;

    public ProposalResponse createProposal(User user, CreateProposalRequest request) {
        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("O perfil do usuário não foi configurado. Preencha o perfil primeiro."));

        RiskEngine.RiskResult riskResult = riskEngine.calculateRisk(request);
        PricingEngine.PricingResult pricingResult = pricingEngine.calculate(profile, request, riskResult);

        // Opcional: Salvar o cliente. Por simplicidade, salvamos e referenciamos
        Client client = Client.builder()
                .user(user)
                .name(request.getClientName())
                .clientType(request.getClientType())
                .digitalExperience(request.getDigitalExperience())
                .recurringClient(request.getRecurringClient())
                .location(request.getLocation())
                .businessImpact(request.getBusinessImpact())
                .build();
        client = clientRepository.save(client);

        Proposal proposal = Proposal.builder()
                .user(user)
                .client(client)
                .name(request.getName())
                .projectType(request.getProjectType())
                .complexity(request.getComplexity())
                .deadline(request.getDeadline())
                .scopeDocumented(request.getScopeDocumented())
                .maintenance(request.getMaintenance())
                .meetingsFrequency(request.getMeetingsFrequency())
                .externalDependencies(request.getExternalDependencies())
                .reuseComponents(request.getReuseComponents())
                .estimatedHours(request.getEstimatedHours())
                .toolsUsed(request.getToolsUsed())
                .billingMethod(request.getBillingMethod())
                .paymentMethod(request.getPaymentMethod())
                .installmentOption(request.getInstallmentOption())
                .paymentTerm(request.getPaymentTerm())
                .downPayment(request.getDownPayment())
                .recurringBilling(request.getRecurringBilling())
                .formalContract(request.getFormalContract())
                .minimumPrice(pricingResult.minimumPrice())
                .recommendedPrice(pricingResult.recommendedPrice())
                .premiumPrice(pricingResult.premiumPrice())
                .confidence(pricingResult.confidence())
                .riskScore(riskResult.score())
                .riskLevel(riskResult.level())
                .build();

        // Adiciona itens de breakdown
        short order = 1;
        for (PricingEngine.BreakdownItemDto b : pricingResult.breakdown()) {
            proposal.addBreakdownItem(ProposalBreakdownItem.builder()
                    .label(b.label())
                    .value(b.value())
                    .sortOrder(order++)
                    .build());
        }

        Proposal saved = proposalRepository.save(proposal);

        return mapToResponse(saved);
    }

    public List<ProposalResponse> listMyProposals(User user) {
        return proposalRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProposalResponse getById(UUID id, User user) {
        Proposal p = proposalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Proposta não encontrada"));

        if (!p.getUser().getId().equals(user.getId())) {
            throw new EntityNotFoundException("Proposta não encontrada");
        }

        return mapToResponse(p);
    }

    public void delete(UUID id, User user) {
        Proposal p = proposalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Proposta não encontrada"));

        if (!p.getUser().getId().equals(user.getId())) {
            throw new EntityNotFoundException("Proposta não encontrada");
        }
        
        proposalRepository.delete(p);
    }

    private ProposalResponse mapToResponse(Proposal p) {
        List<ProposalResponse.BreakdownItemDto> items = p.getBreakdownItems().stream()
                .map(bi -> ProposalResponse.BreakdownItemDto.builder()
                        .id(bi.getId())
                        .sortOrder(bi.getSortOrder())
                        .label(bi.getLabel())
                        .value(bi.getValue())
                        .description(bi.getDescription())
                        .build())
                .toList();

        return ProposalResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .projectType(p.getProjectType())
                .complexity(p.getComplexity())
                .deadline(p.getDeadline())
                .scopeDocumented(p.isScopeDocumented())
                .maintenance(p.isMaintenance())
                .meetingsFrequency(p.getMeetingsFrequency())
                .externalDependencies(p.getExternalDependencies())
                .reuseComponents(p.isReuseComponents())
                .estimatedHours(p.getEstimatedHours())
                .toolsUsed(p.getToolsUsed())
                .billingMethod(p.getBillingMethod())
                .paymentMethod(p.getPaymentMethod())
                .installmentOption(p.getInstallmentOption())
                .paymentTerm(p.getPaymentTerm())
                .downPayment(p.getDownPayment())
                .recurringBilling(p.getRecurringBilling())
                .formalContract(p.isFormalContract())
                .minimumPrice(p.getMinimumPrice())
                .recommendedPrice(p.getRecommendedPrice())
                .premiumPrice(p.getPremiumPrice())
                .confidence(p.getConfidence())
                .riskScore(p.getRiskScore())
                .riskLevel(p.getRiskLevel())
                .probability(p.getProbability())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .breakdownItems(items)
                .build();
    }

    public com.valordev.api.dashboard.dto.DashboardSummaryDto getDashboardSummary(User user) {
        List<Proposal> proposals = proposalRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        java.math.BigDecimal totalValue = java.math.BigDecimal.ZERO;
        int countFechada = 0; java.math.BigDecimal valFechada = java.math.BigDecimal.ZERO;
        int countAlta = 0; java.math.BigDecimal valAlta = java.math.BigDecimal.ZERO;
        int countMedia = 0; java.math.BigDecimal valMedia = java.math.BigDecimal.ZERO;
        int countBaixa = 0; java.math.BigDecimal valBaixa = java.math.BigDecimal.ZERO;
        int countPerdida = 0; java.math.BigDecimal valPerdida = java.math.BigDecimal.ZERO;

        for (Proposal p : proposals) {
            java.math.BigDecimal recPrice = p.getRecommendedPrice();
            if ("won".equalsIgnoreCase(p.getStatus())) {
                countFechada++;
                valFechada = valFechada.add(recPrice);
                totalValue = totalValue.add(recPrice);
            } else if ("lost".equalsIgnoreCase(p.getStatus())) {
                countPerdida++;
                valPerdida = valPerdida.add(recPrice);
            } else {
                // Draft or Sent
                totalValue = totalValue.add(recPrice);
                if ("alta".equalsIgnoreCase(p.getProbability())) {
                    countAlta++;
                    valAlta = valAlta.add(recPrice);
                } else if ("baixa".equalsIgnoreCase(p.getProbability())) {
                    countBaixa++;
                    valBaixa = valBaixa.add(recPrice);
                } else {
                    countMedia++;
                    valMedia = valMedia.add(recPrice);
                }
            }
        }

        UserProfile profile = userProfileRepository.findById(user.getId()).orElse(null);
        java.math.BigDecimal monthlyGoal = profile != null ? profile.getDesiredIncome() : java.math.BigDecimal.ZERO;

        return com.valordev.api.dashboard.dto.DashboardSummaryDto.builder()
                .monthlyGoal(monthlyGoal)
                .pipeline(com.valordev.api.dashboard.dto.DashboardSummaryDto.Pipeline.builder()
                        .totalValue(totalValue)
                        .breakdown(com.valordev.api.dashboard.dto.DashboardSummaryDto.Breakdown.builder()
                                .fechada(com.valordev.api.dashboard.dto.DashboardSummaryDto.Category.builder().count(countFechada).value(valFechada).build())
                                .alta(com.valordev.api.dashboard.dto.DashboardSummaryDto.Category.builder().count(countAlta).value(valAlta).build())
                                .media(com.valordev.api.dashboard.dto.DashboardSummaryDto.Category.builder().count(countMedia).value(valMedia).build())
                                .baixa(com.valordev.api.dashboard.dto.DashboardSummaryDto.Category.builder().count(countBaixa).value(valBaixa).build())
                                .perdida(com.valordev.api.dashboard.dto.DashboardSummaryDto.Category.builder().count(countPerdida).value(valPerdida).build())
                                .build())
                        .build())
                .build();
    }

    /**
     * Calcula o preço da proposta sem salvar no banco de dados.
     * Útil para simulações e pré-visualizações.
     */
    public CalculatePricingResponse calculatePricing(User user, CalculatePricingRequest request) {
        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("O perfil do usuário não foi configurado. Preencha o perfil primeiro."));

        // Cria um CreateProposalRequest a partir do CalculatePricingRequest apenas para cálculo
        CreateProposalRequest proposalRequest = new CreateProposalRequest();
        proposalRequest.setProjectType(request.getProjectType());
        proposalRequest.setComplexity(request.getComplexity());
        proposalRequest.setDeadline(request.getDeadline());
        proposalRequest.setScopeDocumented(request.getScopeDocumented());
        proposalRequest.setMaintenance(request.getMaintenance());
        proposalRequest.setMeetingsFrequency(request.getMeetingsFrequency());
        proposalRequest.setExternalDependencies(request.getExternalDependencies());
        proposalRequest.setReuseComponents(request.getReuseComponents());
        proposalRequest.setEstimatedHours(request.getEstimatedHours());
        proposalRequest.setClientType(request.getClientType());
        proposalRequest.setDigitalExperience(request.getDigitalExperience());
        proposalRequest.setRecurringClient(request.getRecurringClient());
        proposalRequest.setLocation(request.getLocation());
        proposalRequest.setBusinessImpact(request.getBusinessImpact());
        proposalRequest.setBillingMethod(request.getBillingMethod());
        proposalRequest.setPaymentMethod(request.getPaymentMethod());
        proposalRequest.setPaymentTerm(request.getPaymentTerm());
        proposalRequest.setDownPayment(request.getDownPayment());
        proposalRequest.setFormalContract(request.getFormalContract());

        RiskEngine.RiskResult riskResult = riskEngine.calculateRisk(proposalRequest);
        PricingEngine.PricingResult pricingResult = pricingEngine.calculate(profile, proposalRequest, riskResult);

        List<CalculatePricingResponse.BreakdownItemDto> breakdownItems = pricingResult.breakdown().stream()
                .map(b -> CalculatePricingResponse.BreakdownItemDto.builder()
                        .label(b.label())
                        .value(b.value())
                        .build())
                .toList();

        return CalculatePricingResponse.builder()
                .minimumPrice(pricingResult.minimumPrice())
                .recommendedPrice(pricingResult.recommendedPrice())
                .premiumPrice(pricingResult.premiumPrice())
                .confidence(pricingResult.confidence())
                .riskScore(riskResult.score())
                .riskLevel(riskResult.level())
                .breakdown(breakdownItems)
                .riskFactors(riskResult.factors())
                .build();
    }
}
