package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.profile.dto.UserProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Perfil", description = "Gerenciamento do perfil do desenvolvedor (custos, carga horária, etc.)")
@RestController
@RequestMapping("/users/me/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Obter perfil", description = "Retorna os dados do perfil do usuário logado")
    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user.getId()));
    }

    @Operation(summary = "Atualizar perfil", description = "Atualiza configurações de custo, pretensão e horas")
    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileDto request) {
        return ResponseEntity.ok(profileService.updateProfile(user.getId(), request));
    }
}
