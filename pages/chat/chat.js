const { get, post } = require('../../utils/request.js');

const BASE_URL = 'https://your-domain.com';

Page({
  data: {
    targetUserId: null,
    targetNickname: '',
    messages: [],
    inputValue: '',
    socketOpen: false,
    scrollToMessage: '',
    userId: null,
    userAvatar: '',
    targetAvatar: ''
  },

  socket: null,

  onLoad(options) {
    const targetUserId = options.userId;
    const targetNickname = options.nickname || '聊天';
    const userId = wx.getStorageSync('userId');
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    this.setData({ 
      targetUserId: targetUserId, 
      targetNickname: targetNickname,
      userId: userId,
      userAvatar: userInfo.avatarUrl || '/images/profile.png',
      targetAvatar: '/images/profile.png'
    });
    
    // 加载历史消息
    this.loadMessages();
    
    // 连接WebSocket
    this.connectSocket();
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  onUnload() {
    // 关闭WebSocket
    if (this.socket) {
      wx.closeSocket();
    }
  },

  // 加载历史消息
  loadMessages() {
    get('/message/history/' + this.data.targetUserId, {}, false).then(res => {
      this.setData({
        messages: res,
        scrollToMessage: 'msg-' + (res.length - 1)
      });
    });
  },

  // 连接WebSocket
  connectSocket() {
    const token = wx.getStorageSync('token');
    if (!token) return;

    const socketUrl = BASE_URL.replace('https', 'wss') + '/ws/chat/' + token;
    
    this.socket = wx.connectSocket({
      url: socketUrl
    });

    wx.onSocketOpen(() => {
      console.log('WebSocket连接已打开');
      this.setData({ socketOpen: true });
    });

    wx.onSocketMessage((res) => {
      const data = JSON.parse(res.data);
      if (data.type === 'message') {
        const messages = [...this.data.messages, {
          fromUserId: data.fromUserId,
          content: data.content,
          createTime: data.createTime
        }];
        this.setData({
          messages: messages,
          scrollToMessage: 'msg-' + (messages.length - 1)
        });
      }
    });

    wx.onSocketClose(() => {
      console.log('WebSocket连接已关闭');
      this.setData({ socketOpen: false });
    });

    wx.onSocketError((err) => {
      console.error('WebSocket错误:', err);
    });
  },

  // 输入消息
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content) return;

    const userId = wx.getStorageSync('userId');
    
    // 通过WebSocket发送
    if (this.data.socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          toUserId: this.data.targetUserId,
          content: content
        })
      });
    } else {
      // WebSocket未连接时通过HTTP发送
      post('/message/send', {
        toUserId: this.data.targetUserId,
        content: content
      }, false);
    }

    // 本地添加消息
    const messages = [...this.data.messages, {
      fromUserId: userId,
      content: content,
      createTime: new Date().toISOString()
    }];

    this.setData({
      messages: messages,
      inputValue: '',
      scrollToMessage: 'msg-' + (messages.length - 1)
    });
  }
});