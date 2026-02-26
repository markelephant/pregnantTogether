// 引入请求工具
const { post } = require('../../utils/request.js');

Page({
  data: {
    canIUseGetUserProfile: false,
    userInfo: null,
    loading: false
  },

  onLoad() {
    // 检查是否支持 getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 微信登录
  wxLogin: function() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    wx.showLoading({
      title: '登录中...',
      mask: true
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
            }, false).then(data => {
              wx.hideLoading();
              this.setData({ loading: false });
              
              // 保存token和用户信息
              wx.setStorageSync('token', data.token);
              wx.setStorageSync('userId', data.userId);
              wx.setStorageSync('userInfo', {
                nickname: data.nickname,
                avatarUrl: data.avatarUrl
              });
              
              // 跳转到首页
              wx.switchTab({
                url: '/pages/index/index'
              });
              
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
              });
            }).catch(err => {
              wx.hideLoading();
              this.setData({ loading: false });
              wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 2000
              });
            });
          },
          fail: () => {
            wx.hideLoading();
            this.setData({ loading: false });
            wx.showToast({
              title: '获取code失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        this.setData({ loading: false });
        wx.showToast({
          title: '您拒绝了授权',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 跳转到首页（游客模式）
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});