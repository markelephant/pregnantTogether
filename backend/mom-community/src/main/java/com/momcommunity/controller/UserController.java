package com.momcommunity.controller;

import com.momcommunity.entity.User;
import com.momcommunity.service.UserService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/info")
    public Result<User> getUserInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return userService.getUserInfo(userId);
    }

    @PutMapping("/info")
    public Result<User> updateUserInfo(@RequestBody User userInfo, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return userService.updateUserInfo(userId, userInfo);
    }
}
