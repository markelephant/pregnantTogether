// 微信小程序环境下的请求封装

const BASE_URL = 'http://localhost:8080/api'; // 替换为实际后端域名
const TOKEN_KEY = 'token';

// 显示加载提示
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  });
};

// 隐藏加载提示
const hideLoading = () => {
  wx.hideLoading();
};

// 请求方法
const request = (url, method, data, header = {}, showLoadingTip = true) => {
  return new Promise((resolve, reject) => {
    // 获取token
    const token = wx.getStorageSync(TOKEN_KEY);
    
    // 是否显示loading
    if (showLoadingTip) {
      showLoading();
    }
    
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        ...header
      },
      success: (res) => {
        if (showLoadingTip) {
          hideLoading();
        }
        
        // 处理响应
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            // 业务错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none',
              duration: 2000
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转登录
          wx.removeStorageSync(TOKEN_KEY);
          wx.showModal({
            title: '提示',
            content: '登录已过期，请重新登录',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.navigateTo({
                  url: '/pages/login/login'
                });
              }
            }
          });
          reject('未登录或登录过期');
        } else {
          // 其他错误
          wx.showToast({
            title: '网络错误：' + res.statusCode,
            icon: 'none',
            duration: 2000
          });
          reject(res);
        }
      },
      fail: (err) => {
        if (showLoadingTip) {
          hideLoading();
        }
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      },
      complete: () => {
        if (showLoadingTip) {
          hideLoading();
        }
      }
    });
  });
};

// GET请求
const get = (url, data, showLoadingTip = true) => {
  return request(url, 'GET', data, {}, showLoadingTip);
};

// POST请求
const post = (url, data, showLoadingTip = true) => {
  return request(url, 'POST', data, {}, showLoadingTip);
};

// PUT请求
const put = (url, data, showLoadingTip = true) => {
  return request(url, 'PUT', data, {}, showLoadingTip);
};

// DELETE请求
const del = (url, data, showLoadingTip = true) => {
  return request(url, 'DELETE', data, {}, showLoadingTip);
};

// 上传文件
const upload = (url, filePath, name, formData = {}, showLoadingTip = true) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync(TOKEN_KEY);
    
    if (showLoadingTip) {
      showLoading('上传中...');
    }
    
    wx.uploadFile({
      url: BASE_URL + url,
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        'Authorization': token ? 'Bearer ' + token : ''
      },
      success: (res) => {
        if (showLoadingTip) {
          hideLoading();
        }
        
        try {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1500
            });
            resolve(data.data);
          } else {
            wx.showToast({
              title: data.message || '上传失败',
              icon: 'none',
              duration: 2000
            });
            reject(data);
          }
        } catch (e) {
          wx.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 2000
          });
          reject(e);
        }
      },
      fail: (err) => {
        if (showLoadingTip) {
          hideLoading();
        }
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      }
    });
  });
};

// 导出模块（CommonJS风格，微信小程序支持）
module.exports = {
  get: get,
  post: post,
  put: put,
  delete: del,
  upload: upload
};