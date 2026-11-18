package com.novatechsolution.audit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="activity_logs") @Getter @Setter @NoArgsConstructor
public class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="actor_email",nullable=false,length=254) private String actorEmail;
    @Column(nullable=false,length=10) private String method;
    @Column(nullable=false,length=500) private String path;
    @Column(name="response_status",nullable=false) private int responseStatus;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt=Instant.now();
}
