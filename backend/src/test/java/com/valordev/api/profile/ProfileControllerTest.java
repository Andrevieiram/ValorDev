package com.valordev.api.profile;

import com.valordev.api.auth.User;
import com.valordev.api.profile.dto.UserProfileDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private ProfileService profileService;

    private ProfileController profileController;

    @BeforeEach
    void setUp() {
        profileController = new ProfileController(null);
        ReflectionTestUtils.setField(profileController, "profileService", profileService);
    }

    @Test
    void shouldReturnProfile_whenAuthenticatedUserRequestsIt() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        UserProfileDto expectedDto = new UserProfileDto(
                new BigDecimal("10000"),
                40,
                "pleno",
                "mei",
                "fullstack",
                "normal",
                new BigDecimal("2000"),
                new BigDecimal("10000")
        );

        when(profileService.getProfile(userId)).thenReturn(expectedDto);

        // Act
        ResponseEntity<UserProfileDto> response = profileController.getProfile(user);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedDto, response.getBody());
        verify(profileService, times(1)).getProfile(userId);
    }

    @Test
    void shouldUpdateProfile_whenAuthenticatedUserSubmitsValidDto() {
        // Arrange
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        UserProfileDto requestDto = new UserProfileDto(
                new BigDecimal("12000"),
                35,
                "senior",
                "simples",
                "backend",
                "heavy",
                new BigDecimal("3000"),
                new BigDecimal("15000")
        );

        when(profileService.updateProfile(userId, requestDto)).thenReturn(requestDto);

        // Act
        ResponseEntity<UserProfileDto> response = profileController.updateProfile(user, requestDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(requestDto, response.getBody());
        verify(profileService, times(1)).updateProfile(userId, requestDto);
    }
}
