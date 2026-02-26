package com.momcommunity.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.momcommunity.entity.User;
import com.momcommunity.mapper.UserMapper;
import com.momcommunity.utils.JwtUtil;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService extends ServiceImpl<UserMapper, User> {

    @Autowired
    private JwtUtil jwtUtil;

    public Result<Map<String, Object>> loginOrRegister(String openId, String nickname, String avatarUrl, Integer gender) {
        User user = baseMapper.selectByOpenId(openId);
        
        if (user == null) {
            user = new User();
            user.setOpenId(openId);
            user.setNickname(nickname);
            user.setAvatarUrl(avatarUrl);
            user.setGender(gender);
            user.setStatus(1);
            baseMapper.insert(user);
        } else {
            user.setNickname(nickname);
            user.setAvatarUrl(avatarUrl);
            user.setGender(gender);
            baseMapper.updateById(user);
        }
        
        String token = jwtUtil.generateToken(user.getId());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("nickname", user.getNickname());
        result.put("avatarUrl", user.getAvatarUrl());
        
        return Result.success(result);
    }

    public Result<User> getUserInfo(Long userId) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    public Result<User> updateUserInfo(Long userId, User userInfo) {
        User user = baseMapper.selectById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        user.setNickname(userInfo.getNickname());
        user.setAvatarUrl(userInfo.getAvatarUrl());
        user.setPhone(userInfo.getPhone());
        user.setDueDate(userInfo.getDueDate());
        user.setPregnancyWeek(userInfo.getPregnancyWeek());
        user.setBio(userInfo.getBio());
        
        baseMapper.updateById(user);
        return Result.success(user);
    }
}
