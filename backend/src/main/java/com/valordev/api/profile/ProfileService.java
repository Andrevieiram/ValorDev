package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.auth.UserRepository;
import com.valordev.api.profile.dto.UserProfileDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileDto getProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));

        return mapToDto(profile);
    }

    public UserProfileDto updateProfile(UUID userId, UserProfileDto dto) {
        UserProfile profile = userProfileRepository.findById(userId).orElse(null);

        if (profile == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            
            profile = UserProfile.builder()
                    .user(user)
                    .build();
        }

        profile.setDesiredIncome(dto.desiredIncome());
        profile.setHoursPerWeek(dto.hoursPerWeek());
        profile.setExperienceLevel(dto.experienceLevel());
        profile.setTaxRegime(dto.taxRegime());
        profile.setMainStack(dto.mainStack());
        profile.setWorkload(dto.workload());
        profile.setMonthlyCosts(dto.monthlyCosts());
        profile.setFinancialReserve(dto.financialReserve());

        UserProfile saved = userProfileRepository.save(profile);
        return mapToDto(saved);
    }

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
