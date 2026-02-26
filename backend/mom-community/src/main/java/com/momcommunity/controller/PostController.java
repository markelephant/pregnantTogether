package com.momcommunity.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.momcommunity.entity.Post;
import com.momcommunity.service.PostService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/list")
    public Result<Page<Post>> getPostList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return postService.getPostList(pageNum, pageSize);
    }

    @GetMapping("/{id}")
    public Result<Post> getPostDetail(@PathVariable Long id) {
        return postService.getPostDetail(id);
    }

    @PostMapping
    public Result<Post> createPost(@RequestBody Post post, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        post.setUserId(userId);
        return postService.createPost(post);
    }

    @PostMapping("/{id}/like")
    public Result<Void> likePost(@PathVariable Long id) {
        return postService.likePost(id);
    }
}
