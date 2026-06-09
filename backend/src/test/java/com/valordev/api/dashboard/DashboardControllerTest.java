package com.valordev.api.dashboard;

import com.valordev.api.auth.User;
import com.valordev.api.dashboard.dto.DashboardSummaryDto;
import com.valordev.api.proposals.ProposalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private ProposalService proposalService;

    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        dashboardController = new DashboardController(proposalService);
    }

    @Test
    void shouldReturnSummary_whenUserIsAuthenticated() {
        // Arrange
        User user = User.builder().id(UUID.randomUUID()).build();
        DashboardSummaryDto expectedSummary = DashboardSummaryDto.builder().build();
        
        when(proposalService.getDashboardSummary(user)).thenReturn(expectedSummary);

        // Act
        ResponseEntity<DashboardSummaryDto> response = dashboardController.getSummary(user);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSummary, response.getBody());
        verify(proposalService, times(1)).getDashboardSummary(user);
    }
}
