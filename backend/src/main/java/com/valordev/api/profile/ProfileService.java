package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.auth.UserRepository;
import com.valordev.api.profile.dto.UserProfileDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    // ─── GET ─────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));

        return mapToDto(profile);
    }

    // ─── SAVE / UPDATE ────────────────────────────────────────────────────────────

    @Transactional
    public UserProfileDto saveProfile(UUID userId, UserProfileDto dto) {

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

        // Calcula o valor/hora após preencher todos os campos
        profile.setWorkload(calculateHourlyRate(profile));

        UserProfile saved = userProfileRepository.save(profile);
        return mapToDto(saved);
    }

    // ─── CÁLCULO DO VALOR/HORA ────────────────────────────────────────────────────

    private String calculateHourlyRate(UserProfile profile) {

        // 1. Necessidade financeira total
        BigDecimal totalNeed = profile.getDesiredIncome()
                .add(profile.getMonthlyCosts())
                .add(profile.getFinancialReserve());

        // 2. Fator do regime tributário
        BigDecimal taxMultiplier = switch (profile.getTaxRegime()) {
            case MEI              -> new BigDecimal("1.04");
            case SIMPLES_NACIONAL -> new BigDecimal("1.08");
            case CPF  -> new BigDecimal("1.08");
        };

        // 3. Semanas por mês baseado no workload (String)
        int weeksPerMonth = switch (profile.getWorkload()) {
            case "INTEGRAL"     -> 4;
            case "MEIO_PERIODO" -> 4;
            case "FREELANCE"    -> 3;
            default             -> 4;
        };

        // 4. Total de horas disponíveis no mês
        BigDecimal monthlyHours = BigDecimal.valueOf(
                (long) profile.getHoursPerWeek() * weeksPerMonth
        );

        // 5. Valor/hora base antes do fator de experiência
        BigDecimal baseRate = totalNeed
                .multiply(taxMultiplier)
                .divide(monthlyHours, 2, RoundingMode.HALF_UP);

        // 6. Fator do nível de experiência
        BigDecimal experienceMultiplier = switch (profile.getExperienceLevel()) {
            case JUNIOR -> new BigDecimal("1.00");
            case PLENO  -> new BigDecimal("1.20");
            case SENIOR -> new BigDecimal("1.50");
        };

        return String.valueOf(baseRate
                .multiply(experienceMultiplier)
                .setScale(2, RoundingMode.HALF_UP));
    }

    // ─── MAPEAMENTO ───────────────────────────────────────────────────────────────

    private UserProfileDto mapToDto(UserProfile profile) {
        return new UserProfileDto(
                profile.getDesiredIncome(),
                profile.getHoursPerWeek(),
                profile.getExperienceLevel(),
                profile.getTaxRegime(),
                profile.getMainStack(),
                profile.getWorkload(),
                profile.getMonthlyCosts(),
                profile.getFinancialReserve()
        );
    }
}