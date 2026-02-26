const { get, post } = require('../../utils/request.js');

Page({
  data: {
    postId: null,
    post: {},
    comments: [],
    commentContent: '',
    loading: false
  },

  onLoad(options) {
    const postId = options.id;
    this.setData({ postId });
    this.loadPostDetail(postId);
    this.loadComments(postId);
  },

  // 加载帖子详情
  loadPostDetail(postId) {
    get('/post/' + postId, {}, false).then(res => {
      // 处理数据，将字符串转换为数组
      if (res.images) {
        res.imageList = res.images.split(',');
      } else {
        res.imageList = [];
      }
      if (res.tags) {
        res.tagList = res.tags.split(',');
      } else {
        res.tagList = [];
      }
      // 处理用户信息
      if (res.user) {
        res.userAvatar = res.user.avatarUrl;
        res.userNickname = res.user.nickname;
      }
      this.setData({ post: res });
    });
  },

  // 加载评论
  loadComments(postId) {
    get('/comment/post/' + postId, {}, false).then(res => {
      // 处理评论数据
      const comments = res.map(item => {
        if (item.user) {
          item.userAvatar = item.user.avatarUrl;
          item.userNickname = item.user.nickname;
        }
        return item;
      });
      this.setData({ comments: comments });
    });
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({ commentContent: e.detail.value });
  },

  // 提交评论
  submitComment() {
    const content = this.data.commentContent.trim();
    if (!content) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }

    if (this.data.loading) return;
    this.setData({ loading: true });

    post('/comment', {
      postId: this.data.postId,
      content: content
    }, false).then(() => {
      this.setData({ commentContent: '', loading: false });
      wx.showToast({ title: '评论成功', icon: 'success' });
      this.loadComments(this.data.postId);
      this.loadPostDetail(this.data.postId);
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '评论失败', icon: 'none' });
    });
  },

  // 点赞帖子
  likePost() {
    post('/post/' + this.data.postId + '/like', {}, false).then(() => {
      const post = this.data.post;
      post.likeCount = (post.likeCount || 0) + 1;
      this.setData({ post });
      wx.showToast({ title: '点赞成功', icon: 'success' });
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.post.title || '孕妈社区',
      path: '/pages/post-detail/post-detail?id=' + this.data.postId
    };
  }
});