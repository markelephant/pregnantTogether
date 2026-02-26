const { get } = require('../../utils/request.js');

Page({
  data: {
    userInfo: null,
    isLogin: false
  },

  onShow() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
      this.loadUserInfo();
    } else {
      this.setData({
        isLogin: false,
        userInfo: null
      });
    }
  },

  // 加载用户信息
  loadUserInfo() {
    get('/user/info', {}, false).then(res => {
      this.setData({
        userInfo: res
      });
      wx.setStorageSync('userInfo', res);
    });
  },

  // 登录
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userId');
          wx.removeStorageSync('userInfo');
          this.setData({
            isLogin: false,
            userInfo: null
          });
          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  },

  // 编辑资料
  editProfile() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 我的帖子
  myPosts() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 我的收藏
  myFavorites() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 设置
  settings() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});