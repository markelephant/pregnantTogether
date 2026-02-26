package com.momcommunity.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.momcommunity.entity.Comment;
import com.momcommunity.mapper.CommentMapper;
import com.momcommunity.mapper.PostMapper;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService extends ServiceImpl<CommentMapper, Comment> {

    @Autowired
    private PostMapper postMapper;

    public Result<List<Comment>> getCommentsByPostId(Long postId) {
        List<Comment> comments = baseMapper.selectByPostId(postId);
        return Result.success(comments);
    }

    public Result<Comment> addComment(Comment comment) {
        comment.setLikeCount(0);
        baseMapper.insert(comment);
        postMapper.incrementCommentCount(comment.getPostId());
        return Result.success(comment);
    }
}
