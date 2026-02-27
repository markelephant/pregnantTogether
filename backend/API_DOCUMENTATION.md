# 孕妈社区小程序 API 接口文档

## 基础信息
- 基础URL: `http://localhost:8080/api`
- 认证方式: JWT Token (Bearer Token)
- 请求格式: JSON
- 响应格式: JSON

## 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 接口列表

### 1. 认证接口

#### 1.1 登录/注册
- **URL**: `/auth/login`
- **Method**: POST
- **Auth**: 不需要
- **Request**:
```json
{
  "openId": "string",
  "nickname": "string",
  "avatarUrl": "string",
  "gender": 0
}
```
- **Response**:
```json
{
  "token": "string",
  "userId": 1,
  "nickname": "string",
  "avatarUrl": "string"
}
```

---

### 2. 用户接口

#### 2.1 获取用户信息
- **URL**: `/user/info`
- **Method**: GET
- **Auth**: 需要
- **Response**:
```json
{
  "id": 1,
  "openId": "string",
  "nickname": "string",
  "avatarUrl": "string",
  "gender": 0,
  "phone": "string",
  "dueDate": "string",
  "pregnancyWeek": 20,
  "bio": "string",
  "status": 1,
  "createTime": "2024-01-01 00:00:00",
  "updateTime": "2024-01-01 00:00:00"
}
```

#### 2.2 更新用户信息
- **URL**: `/user/info`
- **Method**: PUT
- **Auth**: 需要
- **Request**:
```json
{
  "nickname": "string",
  "avatarUrl": "string",
  "phone": "string",
  "dueDate": "string",
  "pregnancyWeek": 20,
  "bio": "string"
}
```

---

### 3. 打卡接口

#### 3.1 获取打卡日期列表
- **URL**: `/checkin/{userId}/calendar`
- **Method**: GET
- **Auth**: 需要
- **Params**:
  - `year`: 年份 (如: 2024)
  - `month`: 月份 (如: 1)
- **Response**:
```json
["2024-01-01", "2024-01-02", "2024-01-05"]
```

#### 3.2 获取某天的打卡记录
- **URL**: `/checkin/{userId}/daily`
- **Method**: GET
- **Auth**: 需要
- **Params**:
  - `date`: 日期 (格式: YYYY-MM-DD)
- **Response**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "type": 1,
    "recordDate": "2024-01-01",
    "weight": 60.5,
    "fetalMovementCount": null,
    "systolicPressure": null,
    "diastolicPressure": null,
    "bloodSugar": null,
    "mood": null,
    "fetalHeartRate": null,
    "remark": "string",
    "createTime": "2024-01-01 10:00:00"
  }
]
```

#### 3.3 添加打卡记录
- **URL**: `/checkin`
- **Method**: POST
- **Auth**: 需要
- **Request**:
```json
{
  "type": 1,
  "recordDate": "2024-01-01",
  "weight": 60.5,
  "fetalMovementCount": 10,
  "systolicPressure": 120,
  "diastolicPressure": 80,
  "bloodSugar": 5.5,
  "mood": 4,
  "fetalHeartRate": 140,
  "remark": "string"
}
```
**打卡类型说明**:
- 1: 体重 (kg)
- 2: 胎动 (次)
- 3: 血压 (mmHg, 格式: 收缩压/舒张压)
- 4: 血糖 (mmol/L)
- 5: 心情 (1-5)
- 6: 胎心 (次/分)

---

### 4. 帖子接口

#### 4.1 获取帖子列表
- **URL**: `/post/list`
- **Method**: GET
- **Auth**: 不需要
- **Params**:
  - `pageNum`: 页码 (默认: 1)
  - `pageSize`: 每页数量 (默认: 10)
- **Response**:
```json
{
  "records": [
    {
      "id": 1,
      "userId": 1,
      "title": "string",
      "content": "string",
      "images": "url1,url2,url3",
      "tags": "tag1,tag2",
      "viewCount": 100,
      "likeCount": 50,
      "commentCount": 20,
      "status": 0,
      "createTime": "2024-01-01 00:00:00",
      "user": {
        "nickname": "string",
        "avatarUrl": "string"
      }
    }
  ],
  "total": 100,
  "size": 10,
  "current": 1,
  "pages": 10
}
```

#### 4.2 获取帖子详情
- **URL**: `/post/{id}`
- **Method**: GET
- **Auth**: 不需要
- **Response**:
```json
{
  "id": 1,
  "userId": 1,
  "title": "string",
  "content": "string",
  "images": "url1,url2,url3",
  "tags": "tag1,tag2",
  "viewCount": 100,
  "likeCount": 50,
  "commentCount": 20,
  "status": 0,
  "createTime": "2024-01-01 00:00:00",
  "user": {
    "nickname": "string",
    "avatarUrl": "string"
  }
}
```

#### 4.3 发布帖子
- **URL**: `/post`
- **Method**: POST
- **Auth**: 需要
- **Request**:
```json
{
  "title": "string",
  "content": "string",
  "images": "url1,url2,url3",
  "tags": "tag1,tag2"
}
```

#### 4.4 点赞帖子
- **URL**: `/post/{id}/like`
- **Method**: POST
- **Auth**: 需要

---

### 5. 评论接口

#### 5.1 获取帖子评论
- **URL**: `/comment/post/{postId}`
- **Method**: GET
- **Auth**: 不需要
- **Response**:
```json
[
  {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "parentId": null,
    "content": "string",
    "likeCount": 10,
    "createTime": "2024-01-01 00:00:00",
    "user": {
      "nickname": "string",
      "avatarUrl": "string"
    }
  }
]
```

#### 5.2 发表评论
- **URL**: `/comment`
- **Method**: POST
- **Auth**: 需要
- **Request**:
```json
{
  "postId": 1,
  "content": "string",
  "parentId": null
}
```

---

### 6. 消息接口

#### 6.1 获取聊天会话列表
- **URL**: `/message/sessions`
- **Method**: GET
- **Auth**: 需要
- **Response**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "targetUserId": 2,
    "lastMessage": "string",
    "unreadCount": 5,
    "createTime": "2024-01-01 00:00:00",
    "updateTime": "2024-01-01 00:00:00",
    "targetUser": {
      "nickname": "string",
      "avatarUrl": "string"
    }
  }
]
```

#### 6.2 获取消息历史
- **URL**: `/message/history/{targetUserId}`
- **Method**: GET
- **Auth**: 需要
- **Response**:
```json
[
  {
    "id": 1,
    "fromUserId": 1,
    "toUserId": 2,
    "content": "string",
    "msgType": 1,
    "isRead": 1,
    "createTime": "2024-01-01 00:00:00"
  }
]
```

#### 6.3 发送消息
- **URL**: `/message/send`
- **Method**: POST
- **Auth**: 需要
- **Request**:
```json
{
  "toUserId": 2,
  "content": "string"
}
```

#### 6.4 获取未读消息数
- **URL**: `/message/unread/count`
- **Method**: GET
- **Auth**: 需要
- **Response**:
```json
5
```

---

### 7. WebSocket 接口

#### 7.1 连接 WebSocket
- **URL**: `ws://localhost:8080/ws/chat/{token}`
- **Protocol**: WebSocket
- **Auth**: Token 通过 URL 传递

#### 7.2 发送消息格式
```json
{
  "toUserId": 2,
  "content": "string"
}
```

#### 7.3 接收消息格式
```json
{
  "type": "message",
  "fromUserId": 1,
  "content": "string",
  "createTime": "2024-01-01 00:00:00"
}
```

---

### 8. 文件上传接口

#### 8.1 上传图片
- **URL**: `/upload/image`
- **Method**: POST
- **Auth**: 需要
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `file`: 图片文件
- **Response**:
```json
"https://example.com/images/xxx.jpg"
```
