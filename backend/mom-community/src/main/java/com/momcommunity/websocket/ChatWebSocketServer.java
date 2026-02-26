package com.momcommunity.websocket;

import com.alibaba.fastjson2.JSON;
import com.momcommunity.entity.Message;
import com.momcommunity.service.MessageService;
import com.momcommunity.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@ServerEndpoint("/ws/chat/{token}")
public class ChatWebSocketServer {

    private static JwtUtil jwtUtil;
    private static MessageService messageService;

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        ChatWebSocketServer.jwtUtil = jwtUtil;
    }

    @Autowired
    public void setMessageService(MessageService messageService) {
        ChatWebSocketServer.messageService = messageService;
    }

    private static final Map<Long, Session> onlineSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) {
        Long userId = jwtUtil.verifyToken(token);
        if (userId == null) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid token"));
            } catch (IOException e) {
                log.error("关闭session失败", e);
            }
            return;
        }
        
        onlineSessions.put(userId, session);
        log.info("用户 {} 连接成功，当前在线人数: {}", userId, onlineSessions.size());
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("token") String token) {
        Long userId = jwtUtil.verifyToken(token);
        if (userId == null) {
            return;
        }
        
        try {
            Map<String, Object> msgData = JSON.parseObject(message, Map.class);
            Long toUserId = Long.valueOf(msgData.get("toUserId").toString());
            String content = (String) msgData.get("content");
            
            Message chatMessage = new Message();
            chatMessage.setFromUserId(userId);
            chatMessage.setToUserId(toUserId);
            chatMessage.setContent(content);
            
            messageService.sendMessage(chatMessage);
            
            Map<String, Object> response = new ConcurrentHashMap<>();
            response.put("type", "message");
            response.put("fromUserId", userId);
            response.put("content", content);
            response.put("createTime", java.time.LocalDateTime.now().toString());
            
            Session targetSession = onlineSessions.get(toUserId);
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.getBasicRemote().sendText(JSON.toJSONString(response));
            }
            
            session.getBasicRemote().sendText(JSON.toJSONString(response));
            
        } catch (Exception e) {
            log.error("处理消息失败", e);
        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("token") String token) {
        Long userId = jwtUtil.verifyToken(token);
        if (userId != null) {
            onlineSessions.remove(userId);
            log.info("用户 {} 断开连接，当前在线人数: {}", userId, onlineSessions.size());
        }
    }

    @OnError
    public void onError(Session session, Throwable error, @PathParam("token") String token) {
        Long userId = jwtUtil.verifyToken(token);
        log.error("用户 {} 发生错误: {}", userId, error.getMessage());
    }

    public static void sendMessageToUser(Long userId, String message) {
        Session session = onlineSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                log.error("发送消息失败", e);
            }
        }
    }
}
