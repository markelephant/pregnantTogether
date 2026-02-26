package com.momcommunity.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.momcommunity.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {

    @Select("SELECT c.*, u.nickname, u.avatar_url, ru.nickname as reply_nickname " +
            "FROM comment c " +
            "LEFT JOIN user u ON c.user_id = u.id " +
            "LEFT JOIN user ru ON c.parent_id = ru.id " +
            "WHERE c.post_id = #{postId} AND c.deleted = 0 " +
            "ORDER BY c.create_time DESC")
    List<Comment> selectByPostId(@Param("postId") Long postId);
}
