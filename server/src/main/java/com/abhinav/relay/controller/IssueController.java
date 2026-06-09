package com.abhinav.relay.controller;

import com.abhinav.relay.dto.ApiResponse;
import com.abhinav.relay.dto.response.IssueDto;
import com.abhinav.relay.security.TenantContext;
import com.abhinav.relay.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/issue")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    public ApiResponse createIssue(@Valid @RequestBody IssueDto request) {
        ApiResponse response = new ApiResponse();
        try {
            issueService.create(request);
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Issue created");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @GetMapping
    public ApiResponse getAll(@RequestParam Long projectId) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(issueService.getAll(projectId, TenantContext.getTenantId()));
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Issues found");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @PutMapping("/{id}")
    public ApiResponse updateIssue(@PathVariable Long id, @RequestBody IssueDto request) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(issueService.update(id, request));
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Issue updated");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }
}
