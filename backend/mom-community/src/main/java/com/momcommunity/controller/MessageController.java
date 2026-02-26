package com.momcommunity.controller;

import com.momcommunity.entity.ChatSession;
import com.momcommunity.entity.Message;
import com.momcommunity.service.MessageService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/history/{targetUserId}")
    public Result<List<Message>> getMessages(
            @PathVariable Long targetUserId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return messageService.getMessages(userId, targetUserId);
    }

    @PostMapping("/send")
    public Result<Message> sendMessage(@RequestBody Message message, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        message.setFromUserId(userId);
        return messageService.sendMessage(message);
    }

    @GetMapping("/sessions")
    public Result<List<ChatSession>> getChatSessions(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return messageService.getChatSessions(userId);
    }

    @GetMapping("/unread/count")
    public Result<Integer> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return messageService.getUnreadCount(userId);
    }
}
