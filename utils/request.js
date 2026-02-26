const BASE_URL = 'https://your-domain.com/api'; // 替换为实际域名
const TOKEN_KEY = 'token';

// 请求拦截器
const request = (url, method, data, header = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync(TOKEN_KEY);
    
    wx.request({
      url: `${BASE_URL}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            // 业务逻辑错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转登录
          wx.removeStorageSync(TOKEN_KEY);
          wx.navigateTo({
            url: '/pages/login/login'
          });
          reject('未登录');
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// GET请求
const get = (url, data, header) => request(url, 'GET', data, header);

// POST请求
const post = (url, data, header) => request(url, 'POST', data, header);

// PUT请求
const put = (url, data, header) => request(url, 'PUT', data, header);

// DELETE请求
const del = (url, data, header) => request(url, 'DELETE', data, header);

// 上传文件
const upload = (url, filePath, name, formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync(TOKEN_KEY);
    
    wx.uploadFile({
      url: `${BASE_URL}${url}`,
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data.data);
          } else {
            wx.showToast({
              title: data.message || '上传失败',
              icon: 'none'
            });
            reject(data);
          }
        } catch (e) {
          reject(e);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

module.exports = {
  get,
  post,
  put,
  delete: del,
  upload
};