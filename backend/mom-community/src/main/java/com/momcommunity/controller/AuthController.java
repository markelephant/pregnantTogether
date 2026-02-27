package com.momcommunity.controller;

import com.momcommunity.service.UserService;
import com.momcommunity.service.WxAuthService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private WxAuthService wxAuthService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, Object> params) {
        String code = (String) params.get("code");
        String nickname = (String) params.get("nickname");
        String avatarUrl = (String) params.get("avatarUrl");
        Integer gender = (Integer) params.get("gender");
        
        // 方式1: 使用 code 换取 openid（推荐，需要配置微信 appid 和 secret）
        // String openId = wxAuthService.getOpenId(code);
        
        // 方式2: 前端直接传 openid（测试用，不安全）
        String openId = (String) params.get("openId");
        
        if (openId == null || openId.isEmpty()) {
            return Result.error("登录失败，无法获取用户标识");
        }
        
        return userService.loginOrRegister(openId, nickname, avatarUrl, gender);
    }
}
