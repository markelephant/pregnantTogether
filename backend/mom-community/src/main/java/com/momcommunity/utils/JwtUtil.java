package com.momcommunity.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.momcommunity.config.JwtConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Autowired
    private JwtConfig jwtConfig;

    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtConfig.getExpiration());
        
        return JWT.create()
                .withSubject(userId.toString())
                .withIssuedAt(now)
                .withExpiresAt(expiration)
                .sign(Algorithm.HMAC256(jwtConfig.getSecret()));
    }

    public Long verifyToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(jwtConfig.getSecret())).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            return Long.parseLong(decodedJWT.getSubject());
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
