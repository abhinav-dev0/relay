package com.abhinav.relay.dto.response;

import lombok.Data;

@Data
public class IssueDto {

    private Long projectId;

    private String title;

    private String description;

    private String priority;

    private String status;

    private Long assignee;
}
