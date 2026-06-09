package com.abhinav.relay.repository;

import com.abhinav.relay.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue,Long> {

    Optional<Issue> findById(Long id);

    List<Issue> findByProjectIdAndTenantId(Long projectId, Long tenantId);
}
