# 孕妈社区后端启动指南

## 环境要求

- Java 8 或更高版本
- Maven 3.6+
- MySQL 5.7+ 或 8.0
- Redis (可选，用于缓存和会话)

## 快速启动

### 1. 数据库准备

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE mom_community DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
exit

# 执行初始化脚本
mysql -u root -p mom_community < sql/schema.sql
```

### 2. 修改配置

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mom_community?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username      # 修改为你的数据库用户名
    password: your_password      # 修改为你的数据库密码
```

### 3. 启动应用

```bash
# 进入项目目录
cd mom-community

# 使用 Maven 启动
mvn spring-boot:run

# 或者先打包再运行
mvn clean package -DskipTests
java -jar target/mom-community-1.0.0.jar
```

### 4. 验证启动

打开浏览器访问：
- 应用首页：http://localhost:8080
- API 测试：http://localhost:8080/api/post/list

## 接口文档

完整的 API 文档请查看：[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 测试接口

推荐使用以下工具测试接口：

### 1. VS Code + REST Client
安装 REST Client 插件，打开 `test-api.http` 文件即可测试。

### 2. Postman
导入以下 curl 命令测试：

```bash
# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "openId": "test_openid_123",
    "nickname": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg",
    "gender": 2
  }'

# 获取帖子列表
curl http://localhost:8080/api/post/list?pageNum=1&pageSize=10
```

### 3. 前端小程序
在微信开发者工具中导入小程序项目，修改 `utils/request.js` 中的 `BASE_URL` 为 `http://localhost:8080/api`。

## 常见问题

### 1. 端口被占用
修改 `application.yml` 中的端口：
```yaml
server:
  port: 8081  # 修改为其他端口
```

### 2. 数据库连接失败
- 检查 MySQL 服务是否启动
- 检查用户名密码是否正确
- 检查数据库 `mom_community` 是否已创建

### 3. 跨域问题
后端已配置 CORS，允许所有跨域请求。如有问题，检查 `CorsConfig.java` 配置。

### 4. 文件上传失败
- 检查上传目录是否有写入权限
- 检查磁盘空间是否充足
- 默认上传路径：`/tmp/uploads`

## 生产环境部署

### 1. 打包
```bash
mvn clean package -DskipTests
```

### 2. 部署
将 `target/mom-community-1.0.0.jar` 上传到服务器，运行：
```bash
nohup java -jar mom-community-1.0.0.jar > app.log 2>&1 &
```

### 3. 配置 Nginx（推荐）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /uploads {
        alias /tmp/uploads;
    }
}
```

## 技术支持

如有问题，请检查：
1. 应用日志：`logs/` 目录或控制台输出
2. 数据库连接配置
3. 防火墙设置（确保端口开放）
