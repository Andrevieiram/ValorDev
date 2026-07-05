package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.profile.dto.UserProfileRequest;
import com.valordev.api.profile.dto.UserProfileResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.UUID;

@Tag(name = "Perfil", description = "Gerenciamento do perfil do desenvolvedor (custos, carga horária, etc.)")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "Obter perfil", description = "Retorna os dados do perfil do usuário logado")
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user.getId()));
    }

    @Operation(summary = "Criar perfil", description = "Cria o perfil do usuário logado pela primeira vez")
    @PostMapping("/create")
    public ResponseEntity<UserProfileResponse> createProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {

        // ✅ Perfil já existe → 208
        if (profileService.profileExists(user.getId())) {
            return ResponseEntity
                    .status(208)
                    .body(profileService.saveProfile(user.getId(), request));
        }

        // ✅ Perfil novo → 200
        return ResponseEntity.ok(profileService.saveProfile(user.getId(), request));
    }


    @Operation(summary = "Atualizar perfil", description = "Atualiza configurações de custo, pretensão e horas")
    @PutMapping("/update")
    public ResponseEntity<UserProfileResponse> saveProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(profileService.saveProfile(user.getId(), request));
    }

    @Operation(summary = "Deletar perfil", description = "Remove o perfil do usuário logado")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProfile(
            @AuthenticationPrincipal User user) {
        profileService.deleteProfile(user.getId());
        return ResponseEntity.noContent().build();
    }
}
