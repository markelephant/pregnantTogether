package com.momcommunity.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.momcommunity.entity.ChatSession;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ChatSessionMapper extends BaseMapper<ChatSession> {

    @Select("SELECT cs.*, u.nickname, u.avatar_url FROM chat_session cs " +
            "LEFT JOIN user u ON cs.target_user_id = u.id " +
            "WHERE cs.user_id = #{userId} AND cs.deleted = 0 " +
            "ORDER BY cs.update_time DESC")
    List<ChatSession> selectByUserId(Long userId);

    @Select("SELECT * FROM chat_session WHERE user_id = #{userId} AND target_user_id = #{targetUserId} AND deleted = 0")
    ChatSession selectByUserAndTarget(@Param("userId") Long userId, @Param("targetUserId") Long targetUserId);
}
