package com.valordev.api.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    // Busca pelo ID
    @Override
    Optional<UserProfile> findById(UUID uuid);

    // Verifica existência para evitar duplicar
    boolean existsByUserId(UUID userId);
}
