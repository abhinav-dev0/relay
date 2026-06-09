package com.abhinav.relay.service;

import com.abhinav.relay.dto.request.ProjectDto;
import com.abhinav.relay.dto.response.ProjectsDto;
import com.abhinav.relay.model.Project;
import com.abhinav.relay.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectsDto> getAll(Long tenantId) {
        List<Project> projects  = projectRepository.findByTenantId(tenantId);
        List<ProjectsDto> projectsDtos = new ArrayList<>();
        if( projects == null || projects.isEmpty() ) {
            return projectsDtos;
        }
        projects.stream().forEach(project -> {
            ProjectsDto projectsDto = new ProjectsDto();
            projectsDto.setId(project.getId());
            projectsDto.setName(project.getName());
            projectsDto.setDescription(project.getDescription());
            projectsDtos.add(projectsDto);
        });
        return projectsDtos;
    }

    public void create(String name, String description,  Long tenantId ) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setTenantId(tenantId);
        project.setActive(true);
        project.setSlug(name.substring(0,3).toUpperCase());
        project.setCreatedAt(Instant.now());
        projectRepository.save(project);
    }
}