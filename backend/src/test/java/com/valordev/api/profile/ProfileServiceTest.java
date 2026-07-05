package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.auth.UserRepository;
import com.valordev.api.profile.dto.UserProfileDto;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserRepository userRepository;

    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(null, null);
        ReflectionTestUtils.setField(profileService, "userProfileRepository", userProfileRepository);
        ReflectionTestUtils.setField(profileService, "userRepository", userRepository);
    }

    @Test
    void shouldReturnProfileDto_whenProfileExists() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .desiredIncome(new BigDecimal("10000"))
                .hoursPerWeek(40)
                .experienceLevel("pleno")
                .taxRegime("mei")
                .mainStack("fullstack")
                .workload("normal")
                .monthlyCosts(new BigDecimal("2000"))
                .financialReserve(new BigDecimal("10000"))
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(profile));

        // Act
        UserProfileDto result = profileService.getProfile(userId);

        // Assert
        assertNotNull(result);
        assertEquals(new BigDecimal("10000"), result.desiredIncome());
        assertEquals(40, result.hoursPerWeek());
        assertEquals("pleno", result.experienceLevel());
        assertEquals("mei", result.taxRegime());
        assertEquals("fullstack", result.mainStack());
        assertEquals("normal", result.workload());
        assertEquals(new BigDecimal("2000"), result.monthlyCosts());
        assertEquals(new BigDecimal("10000"), result.financialReserve());
        verify(userProfileRepository, times(1)).findById(userId);
    }

    @Test
    void shouldThrowEntityNotFoundException_whenProfileDoesNotExist() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> profileService.getProfile(userId));
        verify(userProfileRepository, times(1)).findById(userId);
    }

    @Test
    void shouldUpdateProfile_whenProfileAlreadyExists() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserProfile existingProfile = UserProfile.builder()
                .userId(userId)
                .desiredIncome(new BigDecimal("5000"))
                .hoursPerWeek(20)
                .experienceLevel("junior")
                .taxRegime("clt")
                .mainStack("frontend")
                .workload("light")
                .monthlyCosts(new BigDecimal("1000"))
                .financialReserve(new BigDecimal("5000"))
                .build();

        UserProfileDto updateDto = new UserProfileDto(
                new BigDecimal("12000"),
                40,
                "senior",
                "simples",
                "backend",
                "heavy",
                new BigDecimal("3000"),
                new BigDecimal("15000")
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(existingProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserProfileDto result = profileService.updateProfile(userId, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals(new BigDecimal("12000"), result.desiredIncome());
        assertEquals(40, result.hoursPerWeek());
        assertEquals("senior", result.experienceLevel());
        assertEquals("simples", result.taxRegime());
        assertEquals("backend", result.mainStack());
        assertEquals("heavy", result.workload());
        assertEquals(new BigDecimal("3000"), result.monthlyCosts());
        assertEquals(new BigDecimal("15000"), result.financialReserve());

        verify(userProfileRepository, times(1)).findById(userId);
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
        verifyNoInteractions(userRepository);
    }

    @Test
    void shouldCreateAndSaveProfile_whenProfileDoesNotExistAndUserExists() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("dev@valordev.com").build();
        UserProfileDto newProfileDto = new UserProfileDto(
                new BigDecimal("15000"),
                30,
                "senior",
                "mei",
                "fullstack",
                "normal",
                new BigDecimal("1500"),
                new BigDecimal("12000")
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserProfileDto result = profileService.updateProfile(userId, newProfileDto);

        // Assert
        assertNotNull(result);
        assertEquals(new BigDecimal("15000"), result.desiredIncome());
        assertEquals(30, result.hoursPerWeek());
        assertEquals("senior", result.experienceLevel());
        assertEquals("mei", result.taxRegime());
        assertEquals("fullstack", result.mainStack());
        assertEquals("normal", result.workload());
        assertEquals(new BigDecimal("1500"), result.monthlyCosts());
        assertEquals(new BigDecimal("12000"), result.financialReserve());

        verify(userProfileRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).findById(userId);
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionOnUpdate_whenProfileAndUserDoNotExist() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserProfileDto updateDto = new UserProfileDto(
                new BigDecimal("10000"),
                40,
                "pleno",
                "mei",
                "fullstack",
                "normal",
                new BigDecimal("2000"),
                new BigDecimal("10000")
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> profileService.updateProfile(userId, updateDto));

        verify(userProfileRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).findById(userId);
        verify(userProfileRepository, never()).save(any(UserProfile.class));
    }
}
