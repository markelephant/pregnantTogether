package com.momcommunity.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("message")
public class Message {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long fromUserId;
    
    private Long toUserId;
    
    private String content;
    
    private Integer msgType;
    
    private Integer isRead;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
    
    @TableField(exist = false)
    private User fromUser;
    
    @TableField(exist = false)
    private User toUser;
}
