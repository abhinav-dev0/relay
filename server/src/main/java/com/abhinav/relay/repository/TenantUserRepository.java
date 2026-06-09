package com.abhinav.relay.repository;

import com.abhinav.relay.model.TenantUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TenantUserRepository extends JpaRepository<TenantUser,Long> {
    public Optional<TenantUser> findByUserId(Long userId);
    List<TenantUser> findByTenantId(Long tenantId);
}
