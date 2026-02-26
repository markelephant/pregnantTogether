package com.momcommunity.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.momcommunity.entity.ChatSession;
import com.momcommunity.entity.Message;
import com.momcommunity.entity.User;
import com.momcommunity.mapper.ChatSessionMapper;
import com.momcommunity.mapper.MessageMapper;
import com.momcommunity.mapper.UserMapper;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService extends ServiceImpl<MessageMapper, Message> {

    @Autowired
    private ChatSessionMapper chatSessionMapper;
    
    @Autowired
    private UserMapper userMapper;

    public Result<List<Message>> getMessages(Long userId, Long targetUserId) {
        List<Message> messages = baseMapper.selectMessagesBetweenUsers(userId, targetUserId);
        baseMapper.markAsRead(userId, targetUserId);
        return Result.success(messages);
    }

    public Result<Message> sendMessage(Message message) {
        message.setMsgType(1);
        message.setIsRead(0);
        baseMapper.insert(message);
        
        updateChatSession(message.getFromUserId(), message.getToUserId(), message.getContent());
        updateChatSession(message.getToUserId(), message.getFromUserId(), message.getContent());
        
        return Result.success(message);
    }

    private void updateChatSession(Long userId, Long targetUserId, String lastMessage) {
        ChatSession session = chatSessionMapper.selectByUserAndTarget(userId, targetUserId);
        if (session == null) {
            session = new ChatSession();
            session.setUserId(userId);
            session.setTargetUserId(targetUserId);
            session.setLastMessage(lastMessage);
            session.setUnreadCount(0);
            chatSessionMapper.insert(session);
        } else {
            session.setLastMessage(lastMessage);
            chatSessionMapper.updateById(session);
        }
    }

    public Result<List<ChatSession>> getChatSessions(Long userId) {
        List<ChatSession> sessions = chatSessionMapper.selectByUserId(userId);
        sessions.forEach(session -> {
            User user = userMapper.selectById(session.getTargetUserId());
            if (user != null) {
                session.setTargetUser(user);
            }
        });
        return Result.success(sessions);
    }

    public Result<Integer> getUnreadCount(Long userId) {
        List<Message> unreadMessages = baseMapper.selectUnreadMessages(userId);
        return Result.success(unreadMessages.size());
    }
}
