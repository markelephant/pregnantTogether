const { get, post } = require('../../utils/request.js');

Page({
  data: {
    currentDate: '',
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    checkinTypes: [
      { id: 1, name: '体重', icon: '⚖️', unit: 'kg' },
      { id: 2, name: '胎动', icon: '👶', unit: '次' },
      { id: 3, name: '血压', icon: '❤️', unit: 'mmHg' },
      { id: 4, name: '血糖', icon: '💉', unit: 'mmol/L' },
      { id: 5, name: '心情', icon: '😊', unit: '' },
      { id: 6, name: '胎心', icon: '🎵', unit: '次/分' }
    ],
    todayRecords: [],
    selectedDate: '',
    showAddModal: false,
    selectedType: null,
    inputValue: '',
    remark: '',
    moodIndex: 0,
    moodText: '',
    moodOptions: ['很差', '较差', '一般', '较好', '很好'],
    loading: false
  },

  onLoad: function() {
    const today = this.formatDate(new Date());
    this.setData({
      currentDate: today,
      selectedDate: today
    }, () => {
      this.generateCalendar();
      this.loadTodayRecords();
    });
  },

  onShow: function() {
    this.loadTodayRecords();
  },

  // 生成日历
  generateCalendar: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    
    let days = [];
    // 填充前导空白
    for (let i = 0; i < firstDay; i++) {
      days.push({ isEmpty: true });
    }
    
    // 填充日期
    for (let i = 1; i <= lastDate; i++) {
      const monthStr = month < 10 ? '0' + month : '' + month;
      const dayStr = i < 10 ? '0' + i : '' + i;
      const dateStr = year + '-' + monthStr + '-' + dayStr;
      
      days.push({
        isEmpty: false,
        date: i,
        fullDate: dateStr,
        isToday: dateStr === this.formatDate(new Date()),
        isSelected: dateStr === this.data.selectedDate,
        hasCheckin: false
      });
    }
    
    this.setData({ calendarDays: days });
    
    // 加载打卡标记
    this.loadCheckinMarks(year, month);
  },

  // 加载打卡标记
  loadCheckinMarks: function(year, month) {
    const userId = wx.getStorageSync('userId');
    if (!userId) return;
    
    get('/checkin/' + userId + '/calendar', { year: year, month: month }, false).then(dates => {
      if (!dates || !Array.isArray(dates)) return;
      
      const days = this.data.calendarDays.map(day => {
        if (!day.isEmpty) {
          const hasCheckin = dates.indexOf(day.fullDate) !== -1;
          return { 
            isEmpty: day.isEmpty,
            date: day.date, 
            fullDate: day.fullDate, 
            isToday: day.isToday, 
            isSelected: day.isSelected,
            hasCheckin: hasCheckin 
          };
        }
        return day;
      });
      this.setData({ calendarDays: days });
    }).catch(err => {
      console.error('加载打卡标记失败', err);
    });
  },

  // 选择日期
  selectDate: function(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    
    this.setData({
      selectedDate: date
    });
    
    // 更新日历选中样式
    const days = this.data.calendarDays.map(day => {
      if (!day.isEmpty) {
        return { 
          isEmpty: day.isEmpty,
          date: day.date, 
          fullDate: day.fullDate, 
          isToday: day.isToday, 
          isSelected: day.fullDate === date,
          hasCheckin: day.hasCheckin
        };
      }
      return day;
    });
    this.setData({ calendarDays: days });
    
    this.loadTodayRecords();
  },

  // 加载当天记录
  loadTodayRecords: function() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      this.setData({ todayRecords: [] });
      return;
    }
    
    get('/checkin/' + userId + '/daily', { date: this.data.selectedDate }, true).then(records => {
      this.setData({ todayRecords: records || [] });
    }).catch(err => {
      console.error('加载记录失败', err);
      this.setData({ todayRecords: [] });
    });
  },

  // 显示添加打卡弹窗
  showAddModal: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showAddModal: true,
      selectedType: type,
      selectedTypeId: type.id,
      selectedTypeName: type.name,
      selectedTypeUnit: type.unit,
      inputValue: '',
      remark: '',
      moodIndex: 0,
      moodText: ''
    });
  },

  // 关闭弹窗
  closeModal: function() {
    this.setData({
      showAddModal: false,
      selectedType: null,
      selectedTypeId: null,
      selectedTypeName: '',
      selectedTypeUnit: '',
      inputValue: '',
      remark: '',
      moodIndex: 0,
      moodText: ''
    });
  },

  // 输入值变化
  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 备注变化
  onRemarkChange: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 心情选择
  onMoodChange: function(e) {
    const index = parseInt(e.detail.value);
    const moodText = this.data.moodOptions[index];
    this.setData({
      moodIndex: index,
      moodText: moodText,
      inputValue: (index + 1).toString()
    });
  },

  // 提交打卡
  submitCheckin: function() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    if (!this.data.selectedType) {
      this.closeModal();
      return;
    }
    
    // 验证输入
    if (this.data.selectedType.id !== 5 && !this.data.inputValue) {
      wx.showToast({
        title: '请输入数值',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.loading) return;
    this.setData({ loading: true });
    
    wx.showLoading({ title: '提交中...', mask: true });
    
    // 构建记录对象
    var record = {
      userId: userId,
      type: this.data.selectedType.id,
      recordDate: this.data.selectedDate,
      remark: this.data.remark || ''
    };
    
    // 根据类型设置对应的字段
    var inputValue = this.data.inputValue;
    switch(this.data.selectedType.id) {
      case 1: 
        record.weight = parseFloat(inputValue); 
        break;
      case 2: 
        record.fetalMovementCount = parseInt(inputValue); 
        break;
      case 3: 
        // 血压格式：收缩压/舒张压
        if (inputValue.indexOf('/') !== -1) {
          var pressures = inputValue.split('/');
          record.systolicPressure = parseInt(pressures[0]);
          record.diastolicPressure = parseInt(pressures[1]);
        } else {
          wx.hideLoading();
          this.setData({ loading: false });
          wx.showToast({
            title: '血压格式应为：收缩压/舒张压',
            icon: 'none'
          });
          return;
        }
        break;
      case 4: 
        record.bloodSugar = parseFloat(inputValue); 
        break;
      case 5: 
        record.mood = parseInt(inputValue); 
        break;
      case 6: 
        record.fetalHeartRate = parseInt(inputValue); 
        break;
    }
    
    post('/checkin', record, false).then(() => {
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({
        title: '打卡成功',
        icon: 'success',
        duration: 1500
      });
      this.closeModal();
      this.loadTodayRecords();
      
      const now = new Date();
      this.loadCheckinMarks(now.getFullYear(), now.getMonth() + 1);
    }).catch(err => {
      wx.hideLoading();
      this.setData({ loading: false });
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      });
    });
  },

  // 格式化日期
  formatDate: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    var monthStr = month < 10 ? '0' + month : '' + month;
    var dayStr = day < 10 ? '0' + day : '' + day;
    
    return year + '-' + monthStr + '-' + dayStr;
  }
});