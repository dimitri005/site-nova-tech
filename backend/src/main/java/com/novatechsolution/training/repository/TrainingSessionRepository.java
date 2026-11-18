package com.novatechsolution.training.repository;

import com.novatechsolution.training.domain.TrainingSession;
import com.novatechsolution.training.domain.TrainingSessionStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {
    List<TrainingSession> findAllByCourseIdAndStatusInOrderByStartsAtAsc(UUID courseId, List<TrainingSessionStatus> statuses);
    List<TrainingSession> findAllByCourseIdOrderByStartsAtAsc(UUID courseId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from TrainingSession s where s.id = :id")
    Optional<TrainingSession> findByIdForUpdate(@Param("id") UUID id);
}
