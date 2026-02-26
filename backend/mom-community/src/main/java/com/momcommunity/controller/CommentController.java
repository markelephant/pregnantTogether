package com.momcommunity.controller;

import com.momcommunity.entity.Comment;
import com.momcommunity.service.CommentService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public Result<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    public Result<Comment> addComment(@RequestBody Comment comment, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        comment.setUserId(userId);
        return commentService.addComment(comment);
    }
}
