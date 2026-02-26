const { get } = require('../../utils/request.js');

Page({
  data: {
    sessions: [],
    loading: false
  },

  onLoad() {
    this.loadSessions();
  },

  onShow() {
    this.loadSessions();
  },

  // 加载会话列表
  loadSessions() {
    const token = wx.getStorageSync('token');
    if (!token) return;

    this.setData({ loading: true });
    get('/message/sessions', {}, false).then(res => {
      // 处理会话数据
      const sessions = res.map(item => {
        if (item.targetUser) {
          item.targetUserAvatar = item.targetUser.avatarUrl;
          item.targetUserNickname = item.targetUser.nickname;
        }
        return item;
      });
      this.setData({
        sessions: sessions,
        loading: false
      });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  // 跳转到聊天页面
  goToChat(e) {
    const userId = e.currentTarget.dataset.userid;
    const nickname = e.currentTarget.dataset.nickname;
    wx.navigateTo({
      url: '/pages/chat/chat?userId=' + userId + '&nickname=' + nickname
    });
  },

  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadSessions();
    wx.stopPullDownRefresh();
  }
});