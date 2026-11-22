package com.novatechsolution.training.repository;

import com.novatechsolution.training.domain.TrainingCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingCourseRepository extends JpaRepository<TrainingCourse, UUID> {
    List<TrainingCourse> findAllByPublishedTrueOrderByTitleFrAsc();
    List<TrainingCourse> findAllByOrderByTitleFrAsc();
    Optional<TrainingCourse> findBySlugAndPublishedTrue(String slug);
}
