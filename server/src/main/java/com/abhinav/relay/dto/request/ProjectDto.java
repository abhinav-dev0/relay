package com.abhinav.relay.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectDto {
    @NotBlank(message = "Project name cannot be blank")
    private String name;

    private String description;
}
