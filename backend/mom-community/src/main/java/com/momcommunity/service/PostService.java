package com.momcommunity.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.momcommunity.entity.Post;
import com.momcommunity.entity.User;
import com.momcommunity.mapper.PostMapper;
import com.momcommunity.mapper.UserMapper;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService extends ServiceImpl<PostMapper, Post> {

    @Autowired
    private UserMapper userMapper;

    public Result<Page<Post>> getPostList(Integer pageNum, Integer pageSize) {
        Page<Post> page = new Page<>(pageNum, pageSize);
        Page<Post> result = baseMapper.selectPostPage(page);
        
        result.getRecords().forEach(post -> {
            User user = new User();
            user.setNickname(post.getUser() != null ? post.getUser().getNickname() : "匿名用户");
            user.setAvatarUrl(post.getUser() != null ? post.getUser().getAvatarUrl() : "");
            post.setUser(user);
        });
        
        return Result.success(result);
    }

    public Result<Post> getPostDetail(Long id) {
        baseMapper.incrementViewCount(id);
        Post post = baseMapper.selectPostById(id);
        if (post == null) {
            return Result.error("帖子不存在");
        }
        return Result.success(post);
    }

    public Result<Post> createPost(Post post) {
        post.setViewCount(0);
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setStatus(0);
        baseMapper.insert(post);
        return Result.success(post);
    }

    public Result<Void> likePost(Long id) {
        baseMapper.incrementLikeCount(id);
        return Result.success();
    }
}
