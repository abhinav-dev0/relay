package com.abhinav.relay.controller;

import com.abhinav.relay.dto.ApiResponse;
import com.abhinav.relay.dto.response.CommentDto;
import com.abhinav.relay.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/issue/{issueId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ApiResponse getComments(@PathVariable Long issueId) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(commentService.getCommentsByIssueId(issueId));
            response.setSuccess(true);
            response.setMessage("Comments fetched successfully");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @PostMapping
    public ApiResponse createComment(@PathVariable Long issueId, @RequestBody CommentDto request) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(commentService.createComment(issueId, request));
            response.setSuccess(true);
            response.setMessage("Comment created successfully");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse deleteComment(@PathVariable Long issueId, @PathVariable Long commentId) {
        ApiResponse response = new ApiResponse();
        try {
            commentService.deleteComment(commentId);
            response.setSuccess(true);
            response.setMessage("Comment deleted successfully");
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }
        return response;
    }
}
