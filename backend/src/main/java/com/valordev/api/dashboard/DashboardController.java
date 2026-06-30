package com.valordev.api.dashboard;

import com.valordev.api.auth.User;
import com.valordev.api.dashboard.dto.DashboardSummaryDto;
import com.valordev.api.proposals.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Dashboard", description = "Resumo financeiro e funil de vendas")
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProposalService proposalService;

    @Operation(summary = "Obter resumo", description = "Agrega os dados das propostas em métricas financeiras para o dashboard")
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(proposalService.getDashboardSummary(user));
    }
}
