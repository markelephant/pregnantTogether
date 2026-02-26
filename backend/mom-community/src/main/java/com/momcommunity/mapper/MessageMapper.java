package com.momcommunity.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.momcommunity.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {

    @Select("SELECT * FROM message WHERE (from_user_id = #{userId} AND to_user_id = #{targetUserId}) " +
            "OR (from_user_id = #{targetUserId} AND to_user_id = #{userId}) " +
            "AND deleted = 0 ORDER BY create_time ASC")
    List<Message> selectMessagesBetweenUsers(@Param("userId") Long userId, @Param("targetUserId") Long targetUserId);

    @Select("SELECT * FROM message WHERE to_user_id = #{userId} AND is_read = 0 AND deleted = 0")
    List<Message> selectUnreadMessages(Long userId);

    @Update("UPDATE message SET is_read = 1 WHERE to_user_id = #{userId} AND from_user_id = #{fromUserId} AND is_read = 0")
    void markAsRead(@Param("userId") Long userId, @Param("fromUserId") Long fromUserId);
}
