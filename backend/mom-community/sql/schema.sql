-- 孕妈社区数据库表结构

-- 创建数据库
CREATE DATABASE IF NOT EXISTS mom_community DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mom_community;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `open_id` VARCHAR(100) NOT NULL COMMENT '微信openid',
    `union_id` VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
    `nickname` VARCHAR(100) DEFAULT NULL COMMENT '昵称',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `gender` TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `due_date` VARCHAR(20) DEFAULT NULL COMMENT '预产期',
    `pregnancy_week` INT DEFAULT NULL COMMENT '当前孕周',
    `bio` VARCHAR(500) DEFAULT NULL COMMENT '个人简介',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_open_id` (`open_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 打卡记录表
CREATE TABLE IF NOT EXISTS `checkin_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `type` TINYINT NOT NULL COMMENT '打卡类型 1-体重 2-胎动 3-血压 4-血糖 5-心情 6-胎心',
    `record_date` VARCHAR(10) NOT NULL COMMENT '记录日期 YYYY-MM-DD',
    `weight` DECIMAL(5,2) DEFAULT NULL COMMENT '体重 kg',
    `fetal_movement_count` INT DEFAULT NULL COMMENT '胎动次数',
    `systolic_pressure` INT DEFAULT NULL COMMENT '收缩压',
    `diastolic_pressure` INT DEFAULT NULL COMMENT '舒张压',
    `blood_sugar` DECIMAL(4,2) DEFAULT NULL COMMENT '血糖 mmol/L',
    `mood` TINYINT DEFAULT NULL COMMENT '心情 1-5',
    `fetal_heart_rate` INT DEFAULT NULL COMMENT '胎心率 次/分',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_user_id_date` (`user_id`, `record_date`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='打卡记录表';

-- 帖子表
CREATE TABLE IF NOT EXISTS `post` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `title` VARCHAR(200) DEFAULT NULL COMMENT '标题',
    `content` TEXT NOT NULL COMMENT '内容',
    `images` TEXT DEFAULT NULL COMMENT '图片URL列表，JSON数组',
    `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签，逗号分隔',
    `view_count` INT DEFAULT 0 COMMENT '浏览数',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT DEFAULT 0 COMMENT '评论数',
    `status` TINYINT DEFAULT 0 COMMENT '状态 0-正常 1-置顶 2-精华',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `post_id` BIGINT NOT NULL COMMENT '帖子ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID，回复功能',
    `content` TEXT NOT NULL COMMENT '内容',
    `like_count` INT DEFAULT 0 COMMENT '点赞数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 消息表
CREATE TABLE IF NOT EXISTS `message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `from_user_id` BIGINT NOT NULL COMMENT '发送者ID',
    `to_user_id` BIGINT NOT NULL COMMENT '接收者ID',
    `content` TEXT NOT NULL COMMENT '内容',
    `msg_type` TINYINT DEFAULT 1 COMMENT '消息类型 1-文本 2-图片',
    `is_read` TINYINT DEFAULT 0 COMMENT '是否已读 0-未读 1-已读',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_from_user_id` (`from_user_id`),
    KEY `idx_to_user_id` (`to_user_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 聊天会话表
CREATE TABLE IF NOT EXISTS `chat_session` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `target_user_id` BIGINT NOT NULL COMMENT '对方用户ID',
    `last_message` VARCHAR(500) DEFAULT NULL COMMENT '最后一条消息',
    `unread_count` INT DEFAULT 0 COMMENT '未读消息数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_target` (`user_id`, `target_user_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话表';
