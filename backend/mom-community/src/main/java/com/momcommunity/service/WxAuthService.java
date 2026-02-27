package com.momcommunity.service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WxAuthService {

    @Value("${wx.appid:your_appid}")
    private String appid;

    @Value("${wx.secret:your_secret}")
    private String secret;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 调用微信接口，用 code 换取 openid 和 session_key
     * @param code 微信登录凭证
     * @return 包含 openid 和 session_key 的 JSON 对象
     */
    public JSONObject code2Session(String code) {
        String url = String.format(
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
            appid, secret, code
        );

        try {
            String response = restTemplate.getForObject(url, String.class);
            return JSON.parseObject(response);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取 OpenId
     * @param code 微信登录凭证
     * @return openid
     */
    public String getOpenId(String code) {
        JSONObject result = code2Session(code);
        if (result != null && result.containsKey("openid")) {
            return result.getString("openid");
        }
        return null;
    }
}
