package com.abhinav.relay.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table( name = "tenant_users")
@Data
public class TenantUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( name = "tenant_id")
    private Long tenantId;

    @Column(name = "user_id")
    private Long userId;

    String role;
}
