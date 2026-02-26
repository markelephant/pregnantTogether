const { post, upload } = require('../../utils/request.js');

Page({
  data: {
    title: '',
    content: '',
    contentLen: 0,
    images: [],
    tags: [],
    tagInput: '',
    loading: false
  },

  // 标题输入
  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  // 内容输入
  onContentInput(e) {
    const content = e.detail.value;
    this.setData({ 
      content: content,
      contentLen: content.length
    });
  },

  // 选择图片
  chooseImage() {
    const remainingCount = 9 - this.data.images.length;
    if (remainingCount <= 0) {
      wx.showToast({ title: '最多选择9张图片', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: remainingCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          images: [...this.data.images, ...newImages]
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  // 标签输入
  onTagInput(e) {
    this.setData({ tagInput: e.detail.value });
  },

  // 添加标签
  addTag() {
    const tag = this.data.tagInput.trim();
    if (!tag) return;
    if (this.data.tags.includes(tag)) {
      wx.showToast({ title: '标签已存在', icon: 'none' });
      return;
    }
    if (this.data.tags.length >= 5) {
      wx.showToast({ title: '最多5个标签', icon: 'none' });
      return;
    }
    this.setData({
      tags: [...this.data.tags, tag],
      tagInput: ''
    });
  },

  // 删除标签
  deleteTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags.filter((_, i) => i !== index);
    this.setData({ tags });
  },

  // 发布帖子
  submitPost() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    if (this.data.loading) return;
    this.setData({ loading: true });
    wx.showLoading({ title: '发布中...', mask: true });

    // 先上传图片
    const uploadImages = () => {
      if (this.data.images.length === 0) {
        return Promise.resolve([]);
      }
      const uploadPromises = this.data.images.map(path => {
        return upload('/upload/image', path, 'file', {}, false);
      });
      return Promise.all(uploadPromises);
    };

    uploadImages().then(imageUrls => {
      const postData = {
        title: this.data.title,
        content: this.data.content,
        images: imageUrls.join(','),
        tags: this.data.tags.join(',')
      };

      return post('/post', postData, false);
    }).then(() => {
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({ title: '发布失败', icon: 'none' });
    });
  },

  // 取消
  cancel() {
    wx.navigateBack();
  }
});