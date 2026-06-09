package com.abhinav.relay.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;


@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    String password;

    String email;

    @Column(name = "is_active")
    boolean isActive;

    @Column(name = "created_at")
    Instant createdAt;
}
