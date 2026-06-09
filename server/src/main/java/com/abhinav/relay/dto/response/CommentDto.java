package com.abhinav.relay.dto.response;

import lombok.Data;

import java.time.Instant;

@Data
public class CommentDto {
    private Long id;
    private Long issueId;
    private Long userId;
    private String text;
    private Instant createdAt;
}
