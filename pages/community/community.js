const { get, post } = require('../../utils/request.js');

Page({
  data: {
    posts: [],
    pageNum: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,
    refreshing: false
  },

  onLoad() {
    this.loadPosts();
  },

  onShow() {
    this.loadPosts();
  },

  // 加载帖子列表
  loadPosts() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    get('/post/list', {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }, false).then(res => {
      // 处理帖子数据
      const records = res.records.map(item => {
        if (item.images) {
          item.imageList = item.images.split(',');
        } else {
          item.imageList = [];
        }
        if (item.tags) {
          item.tagList = item.tags.split(',');
        } else {
          item.tagList = [];
        }
        if (item.user) {
          item.userAvatar = item.user.avatarUrl;
          item.userNickname = item.user.nickname;
        }
        return item;
      });
      const posts = this.data.refreshing ? records : [...this.data.posts, ...records];
      this.setData({
        posts: posts,
        loading: false,
        refreshing: false,
        hasMore: records.length >= this.data.pageSize
      });
      wx.stopPullDownRefresh();
    }).catch(err => {
      this.setData({ loading: false, refreshing: false });
      wx.stopPullDownRefresh();
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      pageNum: 1,
      refreshing: true,
      posts: []
    });
    this.loadPosts();
  },

  // 上拉加载更多
  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return;
    this.setData({
      pageNum: this.data.pageNum + 1
    });
    this.loadPosts();
  },

  // 跳转到发帖页面
  goToCreatePost() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    wx.navigateTo({ url: '/pages/create-post/create-post' });
  },

  // 跳转到帖子详情
  goToPostDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/post-detail/post-detail?id=' + postId
    });
  },

  // 点赞
  likePost(e) {
    const postId = e.currentTarget.dataset.id;
    post('/post/' + postId + '/like', {}, false).then(() => {
      const posts = this.data.posts.map(post => {
        if (post.id === postId) {
          post.likeCount = (post.likeCount || 0) + 1;
        }
        return post;
      });
      this.setData({ posts });
      wx.showToast({ title: '点赞成功', icon: 'success' });
    });
  }
});