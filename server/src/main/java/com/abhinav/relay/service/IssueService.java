package com.abhinav.relay.service;

import com.abhinav.relay.dto.response.IssueDto;
import com.abhinav.relay.model.Issue;
import com.abhinav.relay.repository.IssueRepository;
import com.abhinav.relay.security.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public List<Issue> getAll(Long projectId, Long tenantId) {
        return  issueRepository.findByProjectIdAndTenantId(projectId, tenantId);
    }

    public void create(IssueDto dto) {
        Issue issue = new Issue();
        issue.setDescription(dto.getDescription());
        issue.setProjectId(dto.getProjectId());
        issue.setTenantId(TenantContext.getTenantId());
        issue.setTitle(dto.getTitle());
        issue.setPriority(dto.getPriority());
        issue.setStatus(dto.getStatus());
        issue.setAssignee(dto.getAssignee());
        issue.setCreatedDate(Instant.now());
        Issue newIssue = issueRepository.save(issue);
        newIssue.setSlug(newIssue.getProjectId().toString() + "-" + newIssue.getId().toString());
        issueRepository.save(newIssue);
    }

    public Issue update(Long id, IssueDto dto) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        if (!issue.getTenantId().equals(TenantContext.getTenantId())) {
            throw new RuntimeException("Unauthorized");
        }
        if (dto.getTitle() != null) issue.setTitle(dto.getTitle());
        if (dto.getDescription() != null) issue.setDescription(dto.getDescription());
        if (dto.getPriority() != null) issue.setPriority(dto.getPriority());
        if (dto.getStatus() != null) issue.setStatus(dto.getStatus());
        if (dto.getAssignee() != null) issue.setAssignee(dto.getAssignee());
        return issueRepository.save(issue);
    }

}
