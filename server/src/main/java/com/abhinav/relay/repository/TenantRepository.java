package com.abhinav.relay.repository;

import com.abhinav.relay.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant,Long> {

    Optional<Tenant> findById(Long id);

    Optional<Tenant> findByDomain(String name);
}
