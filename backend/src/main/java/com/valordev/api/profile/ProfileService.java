package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.auth.UserRepository;
import com.valordev.api.profile.dto.UserProfileRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.valordev.api.profile.dto.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    // ─── GET ─────────────────────────────────────────────────────────────────────

    public UserProfileResponse getProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));
        return mapToResponse(profile);
    }


    // ─── SAVE / UPDATE ────────────────────────────────────────────────────────────


    public UserProfileResponse saveProfile(UUID userId, UserProfileRequest dto) {

        // Garante que o User existe antes de criar o perfil
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Busca perfil existente ou cria um novo vinculado ao usuário
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> UserProfile.builder()
                        .user(user)
                        .build());

        // Atualiza os campos com os dados validados do DTO
        profile.setDesiredIncome(dto.desiredIncome());
        profile.setHoursPerWeek(dto.hoursPerWeek());
        profile.setExperienceLevel(dto.experienceLevel());
        profile.setTaxRegime(dto.taxRegime());
        profile.setMainStack(dto.mainStack());
        profile.setWorkload(dto.workload());
        profile.setMonthlyCosts(dto.monthlyCosts());
        profile.setFinancialReserve(dto.financialReserve());

        profile.setHourlyRate(calculateHourlyRate(profile));

        UserProfile saved = userProfileRepository.save(profile);
        return mapToResponse(saved);
    }

    // ─── DELETE ─────────────────────────────────────────────
    public void deleteProfile(UUID userId) {
        if (!userProfileRepository.existsById(userId)) {
            throw new EntityNotFoundException("Perfil não encontrado");
        }
        userProfileRepository.deleteById(userId);
    }

    // ─── CÁLCULO DO VALOR/HORA ────────────────────────────────────────────────────

    private BigDecimal calculateHourlyRate(UserProfile profile) {

        BigDecimal totalNeed = profile.getDesiredIncome()
                .add(profile.getMonthlyCosts())
                .add(profile.getFinancialReserve());

        BigDecimal taxMultiplier = switch (profile.getTaxRegime()) {
            case MEI              -> new BigDecimal("1.04");
            case SIMPLES_NACIONAL -> new BigDecimal("1.08");
            case CPF              -> new BigDecimal("1.08");
        };

        int weeksPerMonth = switch (profile.getWorkload()) {
            case "INTEGRAL"     -> 4;
            case "MEIO_PERIODO" -> 4;
            case "FREELANCE"    -> 3;
            default             -> 4;
        };

        BigDecimal monthlyHours = BigDecimal.valueOf(
                (long) profile.getHoursPerWeek() * weeksPerMonth
        );

        BigDecimal baseRate = totalNeed
                .multiply(taxMultiplier)
                .divide(monthlyHours, 2, RoundingMode.HALF_UP);

        BigDecimal experienceMultiplier = switch (profile.getExperienceLevel()) {
            case JUNIOR -> new BigDecimal("1.00");
            case PLENO  -> new BigDecimal("1.20");
            case SENIOR -> new BigDecimal("1.50");
        };

        // ✅ Retorna BigDecimal direto, sem String.valueOf()
        return baseRate
                .multiply(experienceMultiplier)
                .setScale(2, RoundingMode.HALF_UP);
    }

    // ─── MAPEAMENTO ───────────────────────────────────────────────────────────────

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getDesiredIncome(),
                profile.getHoursPerWeek(),
                profile.getExperienceLevel(),
                profile.getTaxRegime(),
                profile.getMainStack(),
                profile.getWorkload(),
                profile.getMonthlyCosts(),
                profile.getFinancialReserve(),
                profile.getHourlyRate()
        );
    }

    // ─── BUSCA PERFIL ───────────────────────────────────────────────────────────────

    public boolean profileExists(UUID userId) {
        return userProfileRepository.existsById(userId);
    }
}