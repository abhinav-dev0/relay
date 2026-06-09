package com.abhinav.relay.service;

import com.abhinav.relay.dto.response.CommentDto;
import com.abhinav.relay.model.Comment;
import com.abhinav.relay.model.User;
import com.abhinav.relay.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public List<CommentDto> getCommentsByIssueId(Long issueId) {
        List<Comment> comments = commentRepository.findByIssueId(issueId);
        return comments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CommentDto createComment(Long issueId, CommentDto request) throws Exception {
        User user = authenticationService.getCurrentUser();
        
        Comment comment = new Comment();
        comment.setIssueId(issueId);
        comment.setUserId(user.getId());
        comment.setText(request.getText());
        comment.setCreatedAt(Instant.now());
        
        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    public void deleteComment(Long commentId) throws Exception {
        User user = authenticationService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new Exception("Comment not found"));
            
        if (!comment.getUserId().equals(user.getId())) {
            throw new Exception("Unauthorized to delete this comment");
        }
        
        commentRepository.deleteById(commentId);
    }

    private CommentDto mapToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setIssueId(comment.getIssueId());
        dto.setUserId(comment.getUserId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
