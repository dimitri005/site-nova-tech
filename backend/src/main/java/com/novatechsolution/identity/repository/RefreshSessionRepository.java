package com.novatechsolution.identity.repository;

import com.novatechsolution.identity.domain.RefreshSession;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface RefreshSessionRepository extends JpaRepository<RefreshSession, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select session from RefreshSession session where session.tokenHash = :tokenHash and session.revokedAt is null")
    Optional<RefreshSession> findActiveForUpdate(@Param("tokenHash") String tokenHash);
    List<RefreshSession> findAllByAdminUserIdAndRevokedAtIsNull(UUID adminUserId);
}
