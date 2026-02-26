package com.momcommunity.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("checkin_record")
public class CheckinRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private Integer type;
    
    private String recordDate;
    
    private Double weight;
    
    private Integer fetalMovementCount;
    
    private Integer systolicPressure;
    
    private Integer diastolicPressure;
    
    private Double bloodSugar;
    
    private Integer mood;
    
    private Integer fetalHeartRate;
    
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
