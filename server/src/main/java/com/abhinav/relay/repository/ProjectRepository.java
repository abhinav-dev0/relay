package com.abhinav.relay.repository;

import com.abhinav.relay.model.Project;
import com.abhinav.relay.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project,Long> {

    Optional<Project> findById(Long id);
    List<Project> findByTenantId(Long tenantId);
}
