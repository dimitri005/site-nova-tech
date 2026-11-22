package com.novatechsolution.enrollment.repository;

import com.novatechsolution.enrollment.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    List<Enrollment> findAllBySessionIdOrderByCreatedAtDesc(UUID sessionId);
}
