package com.momcommunity.controller;

import com.momcommunity.service.UserService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, Object> params) {
        String openId = (String) params.get("openId");
        String nickname = (String) params.get("nickname");
        String avatarUrl = (String) params.get("avatarUrl");
        Integer gender = (Integer) params.get("gender");
        
        if (openId == null || openId.isEmpty()) {
            return Result.error("openId不能为空");
        }
        
        return userService.loginOrRegister(openId, nickname, avatarUrl, gender);
    }
}
