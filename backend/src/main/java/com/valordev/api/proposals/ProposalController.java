package com.valordev.api.proposals;

import com.valordev.api.auth.User;
import com.valordev.api.proposals.dto.CreateProposalRequest;
import com.valordev.api.proposals.dto.ProposalResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Propostas", description = "Criação e gerenciamento de orçamentos e propostas comerciais")
@RestController
@RequestMapping("/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    @Operation(summary = "Criar nova proposta", description = "Recebe os dados do Wizard, calcula o preço e risco e salva a proposta")
    @PostMapping
    public ResponseEntity<ProposalResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateProposalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(proposalService.createProposal(user, request));
    }

    @Operation(summary = "Listar propostas", description = "Lista todas as propostas salvas do usuário logado")
    @GetMapping
    public ResponseEntity<List<ProposalResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(proposalService.listMyProposals(user));
    }

    @Operation(summary = "Obter proposta por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProposalResponse> getById(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(proposalService.getById(id, user));
    }

    @Operation(summary = "Excluir proposta permanentemente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        proposalService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
