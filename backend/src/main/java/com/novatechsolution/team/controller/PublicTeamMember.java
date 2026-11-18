package com.novatechsolution.team.controller;

import com.novatechsolution.team.domain.TeamMember;
import java.util.UUID;

public record PublicTeamMember(UUID id,String slug,String fullName,String positionFr,String positionEn,
                               String biographyFr,String biographyEn,String photoUrl,String linkedInUrl,
                               String facebookUrl,String category,int displayOrder) {
    public static PublicTeamMember from(TeamMember member) {
        return new PublicTeamMember(member.getId(),member.getSlug(),member.getFullName(),member.getPositionFr(),
                member.getPositionEn(),member.getBiographyFr(),member.getBiographyEn(),member.getPhotoUrl(),
                member.getLinkedInUrl(),member.getFacebookUrl(),member.getCategory(),member.getDisplayOrder());
    }
}
