Page({
  data: {
    banners: [
      { id: 1, image: '/images/home.png', title: '欢迎来到孕妈社区' },
      { id: 2, image: '/images/community.png', title: '记录美好孕期' }
    ],
    features: [
      { id: 1, name: '每日打卡', icon: '✅', path: '/pages/checkin/checkin' },
      { id: 2, name: '社区交流', icon: '💬', path: '/pages/community/community' },
      { id: 3, name: '孕期知识', icon: '📚', path: '' },
      { id: 4, name: '专家问答', icon: '👩‍⚕️', path: '' }
    ],
    hotPosts: []
  },

  onLoad() {
    this.loadHotPosts();
  },

  onShow() {
    this.loadHotPosts();
  },

  // 加载热门帖子
  loadHotPosts() {
    // 这里可以调用接口获取热门帖子
    // 暂时使用模拟数据
    this.setData({
      hotPosts: [
        {
          id: 1,
          title: '孕早期注意事项',
          content: '分享我的孕早期经验，希望能帮助到大家...',
          author: '准妈妈小美',
          avatar: '/images/profile.png',
          likes: 128
        },
        {
          id: 2,
          title: '产检时间表',
          content: '整理了一份详细的产检时间表，建议收藏...',
          author: '宝妈达人',
          avatar: '/images/profile.png',
          likes: 256
        }
      ]
    });
  },

  // 跳转到功能页面
  goToFeature(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.switchTab({ url: path });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  // 跳转到帖子详情
  goToPost(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/post-detail/post-detail?id=' + postId
    });
  },

  // 跳转到社区
  goToCommunity() {
    wx.switchTab({ url: '/pages/community/community' });
  }
});
