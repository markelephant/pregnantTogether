package com.momcommunity.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("comment")
public class Comment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long postId;
    
    private Long userId;
    
    private Long parentId;
    
    private String content;
    
    private Integer likeCount;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
    
    @TableField(exist = false)
    private User user;
    
    @TableField(exist = false)
    private User replyUser;
}
