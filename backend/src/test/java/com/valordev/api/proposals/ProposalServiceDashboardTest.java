package com.valordev.api.proposals;

import com.valordev.api.auth.User;
import com.valordev.api.dashboard.dto.DashboardSummaryDto;
import com.valordev.api.engines.PricingEngine;
import com.valordev.api.engines.RiskEngine;
import com.valordev.api.profile.UserProfile;
import com.valordev.api.profile.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProposalServiceDashboardTest {

    @Mock
    private ProposalRepository proposalRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private RiskEngine riskEngine;

    @Mock
    private PricingEngine pricingEngine;

    private ProposalService proposalService;

    @BeforeEach
    void setUp() {
        proposalService = new ProposalService(proposalRepository, userProfileRepository, clientRepository, riskEngine, pricingEngine);
    }

    @Test
    void shouldReturnDashboardSummary_whenProposalsAndProfileExist() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();

        Proposal pFechada = Proposal.builder()
                .id(UUID.randomUUID())
                .name("Projeto Fechado")
                .status("won")
                .recommendedPrice(new BigDecimal("10000"))
                .probability("alta")
                .createdAt(LocalDateTime.now())
                .build();

        Proposal pAlta = Proposal.builder()
                .id(UUID.randomUUID())
                .name("Projeto Alta")
                .status("draft")
                .recommendedPrice(new BigDecimal("5000"))
                .probability("alta")
                .createdAt(LocalDateTime.now())
                .build();

        Proposal pMedia = Proposal.builder()
                .id(UUID.randomUUID())
                .name("Projeto Media")
                .status("sent")
                .recommendedPrice(new BigDecimal("3000"))
                .probability("media")
                .createdAt(LocalDateTime.now())
                .build();

        Proposal pBaixa = Proposal.builder()
                .id(UUID.randomUUID())
                .name("Projeto Baixa")
                .status("sent")
                .recommendedPrice(new BigDecimal("2000"))
                .probability("baixa")
                .createdAt(LocalDateTime.now())
                .build();

        Proposal pPerdida = Proposal.builder()
                .id(UUID.randomUUID())
                .name("Projeto Perdido")
                .status("lost")
                .recommendedPrice(new BigDecimal("1000"))
                .probability("baixa")
                .createdAt(LocalDateTime.now())
                .build();

        when(proposalRepository.findAllByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Arrays.asList(pFechada, pAlta, pMedia, pBaixa, pPerdida));

        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .desiredIncome(new BigDecimal("40000"))
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(profile));

        // Act
        DashboardSummaryDto result = proposalService.getDashboardSummary(user);

        // Assert
        assertNotNull(result);
        assertEquals(new BigDecimal("40000"), result.getMonthlyGoal());
        assertEquals(new BigDecimal("20000"), result.getPipeline().getTotalValue());

        assertEquals(1, result.getPipeline().getBreakdown().getFechada().getCount());
        assertEquals(new BigDecimal("10000"), result.getPipeline().getBreakdown().getFechada().getValue());
        assertEquals(1, result.getPipeline().getBreakdown().getFechada().getItems().size());
        assertEquals(pFechada.getId(), result.getPipeline().getBreakdown().getFechada().getItems().get(0).getId());

        assertEquals(1, result.getPipeline().getBreakdown().getAlta().getCount());
        assertEquals(new BigDecimal("5000"), result.getPipeline().getBreakdown().getAlta().getValue());
        
        assertEquals(1, result.getPipeline().getBreakdown().getMedia().getCount());
        assertEquals(new BigDecimal("3000"), result.getPipeline().getBreakdown().getMedia().getValue());

        assertEquals(1, result.getPipeline().getBreakdown().getBaixa().getCount());
        assertEquals(new BigDecimal("2000"), result.getPipeline().getBreakdown().getBaixa().getValue());

        assertEquals(1, result.getPipeline().getBreakdown().getPerdida().getCount());
        assertEquals(new BigDecimal("1000"), result.getPipeline().getBreakdown().getPerdida().getValue());

        verify(proposalRepository, times(1)).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(userProfileRepository, times(1)).findById(userId);
    }
    
    @Test
    void shouldReturnEmptySummary_whenNoProposalsOrProfileExist() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();

        when(proposalRepository.findAllByUserIdOrderByCreatedAtDesc(userId))
                .thenReturn(Arrays.asList());

        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        DashboardSummaryDto result = proposalService.getDashboardSummary(user);

        // Assert
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result.getMonthlyGoal());
        assertEquals(BigDecimal.ZERO, result.getPipeline().getTotalValue());
        
        assertEquals(0, result.getPipeline().getBreakdown().getFechada().getCount());
        assertEquals(BigDecimal.ZERO, result.getPipeline().getBreakdown().getFechada().getValue());

        verify(proposalRepository, times(1)).findAllByUserIdOrderByCreatedAtDesc(userId);
        verify(userProfileRepository, times(1)).findById(userId);
    }
}
