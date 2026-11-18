package com.novatechsolution.team.service;

import com.novatechsolution.shared.domain.Slugger;
import com.novatechsolution.team.domain.TeamMember;
import com.novatechsolution.team.dto.TeamMemberRequest;
import com.novatechsolution.team.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class TeamMemberService {
    private final TeamMemberRepository members;
    @Transactional(readOnly = true) public List<TeamMember> publicList() { return members.findAllByPublishedTrueOrderByDisplayOrderAsc(); }
    @Transactional(readOnly = true) public List<TeamMember> adminList() { return members.findAllByOrderByDisplayOrderAsc(); }
    @Transactional
    public TeamMember create(TeamMemberRequest request) { TeamMember member = new TeamMember(); apply(member, request); return members.save(member); }
    @Transactional
    public TeamMember update(UUID id, TeamMemberRequest request) {
        TeamMember member = members.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membre introuvable."));
        apply(member, request); member.setUpdatedAt(Instant.now()); return member;
    }
    @Transactional
    public void delete(UUID id) {
        if (!members.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Membre introuvable.");
        members.deleteById(id);
    }
    private void apply(TeamMember member, TeamMemberRequest request) {
        member.setSlug(Slugger.from(request.slug())); member.setFullName(request.fullName().trim());
        member.setPositionFr(request.positionFr().trim()); member.setPositionEn(request.positionEn().trim());
        member.setBiographyFr(request.biographyFr().trim()); member.setBiographyEn(request.biographyEn().trim());
        member.setPhotoUrl(request.photoUrl()); member.setEmail(request.email()); member.setLinkedInUrl(request.linkedInUrl());
        member.setFacebookUrl(request.facebookUrl()); member.setCategory(request.category() == null ? "STAFF" : request.category());
        member.setDisplayOrder(request.displayOrder()); member.setPublished(request.published());
    }
}
