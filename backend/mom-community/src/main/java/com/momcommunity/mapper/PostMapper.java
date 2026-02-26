package com.momcommunity.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.momcommunity.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    @Select("SELECT p.*, u.nickname, u.avatar_url FROM post p " +
            "LEFT JOIN user u ON p.user_id = u.id " +
            "WHERE p.deleted = 0 AND p.status = 0 " +
            "ORDER BY p.create_time DESC")
    Page<Post> selectPostPage(Page<Post> page);

    @Select("SELECT p.*, u.nickname, u.avatar_url FROM post p " +
            "LEFT JOIN user u ON p.user_id = u.id " +
            "WHERE p.id = #{id} AND p.deleted = 0")
    Post selectPostById(Long id);

    @Update("UPDATE post SET view_count = view_count + 1 WHERE id = #{id}")
    void incrementViewCount(Long id);

    @Update("UPDATE post SET like_count = like_count + 1 WHERE id = #{id}")
    void incrementLikeCount(Long id);

    @Update("UPDATE post SET comment_count = comment_count + 1 WHERE id = #{id}")
    void incrementCommentCount(Long id);
}
