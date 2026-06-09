package com.abhinav.relay.controller;

import com.abhinav.relay.dto.ApiResponse;
import com.abhinav.relay.dto.request.ProjectDto;
import com.abhinav.relay.security.TenantContext;
import com.abhinav.relay.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ApiResponse createProject(@Valid @RequestBody ProjectDto request) {
        ApiResponse response = new ApiResponse();
        try {
            projectService.create(request.getName(), request.getDescription(), TenantContext.getTenantId());
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Project created");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @GetMapping
    public ApiResponse getProject() {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(projectService.getAll(TenantContext.getTenantId()));
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Success");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }
}