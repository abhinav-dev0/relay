package com.abhinav.relay.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "issues")
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "tenant_id")
    private Long tenantId;

    private String title;

    private String slug;

    private String description;

    private String priority;

    private String status;

    private String comments;

    private Long assignee;

    @Column(name = "created_date")
    private Instant createdDate;

}
