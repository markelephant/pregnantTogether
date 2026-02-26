package com.momcommunity.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        String token = jwtUtil.extractToken(authHeader);
        
        if (token == null) {
            response.setStatus(401);
            return false;
        }
        
        Long userId = jwtUtil.verifyToken(token);
        if (userId == null) {
            response.setStatus(401);
            return false;
        }
        
        request.setAttribute("userId", userId);
        return true;
    }
}
