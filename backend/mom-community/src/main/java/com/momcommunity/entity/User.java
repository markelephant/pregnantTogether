package com.momcommunity.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String openId;
    
    private String unionId;
    
    private String nickname;
    
    private String avatarUrl;
    
    private Integer gender;
    
    private String phone;
    
    private String dueDate;
    
    private Integer pregnancyWeek;
    
    private String bio;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
