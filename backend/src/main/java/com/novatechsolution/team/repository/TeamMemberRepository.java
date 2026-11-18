package com.novatechsolution.team.repository;

import com.novatechsolution.team.domain.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    List<TeamMember> findAllByPublishedTrueOrderByDisplayOrderAsc();
    List<TeamMember> findAllByOrderByDisplayOrderAsc();
    Optional<TeamMember> findBySlugAndPublishedTrue(String slug);
}
