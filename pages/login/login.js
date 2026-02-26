const { post } = require('../../utils/request');

Page({
  data: {
    canIUseGetUserProfile: false,
    userInfo: null
  },

  onLoad() {
    // 检查是否支持 getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
  },

  // 微信登录
  wxLogin() {
    wx.showLoading({
      title: '登录中...'
    });

    // 1. 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        
        // 2. 获取登录code
        wx.login({
          success: (loginRes) => {
            const code = loginRes.code;
            
            // 3. 调用后端登录接口
            post('/user/login', {
              code: code,
              userInfo: userInfo
            }).then(data => {
              wx.hideLoading();
              
              // 保存token
              wx.setStorageSync('token', data.token);
              wx.setStorageSync('userId', data.userId);
              
              // 跳转到首页
              wx.switchTab({
                url: '/pages/index/index'
              });
              
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
            }).catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              });
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '获取code失败',
              icon: 'none'
            });
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '您拒绝了授权',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到首页（游客模式）
  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});