const { get, post } = require('../../utils/request');

Page({
  data: {
    currentDate: '',
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    checkinTypes: [
      { id: 1, name: '体重', icon: '⚖️', unit: 'kg', value: '' },
      { id: 2, name: '胎动', icon: '👶', unit: '次', value: '' },
      { id: 3, name: '血压', icon: '❤️', unit: 'mmHg', value: '' },
      { id: 4, name: '血糖', icon: '💉', unit: 'mmol/L', value: '' },
      { id: 5, name: '心情', icon: '😊', unit: '', value: '' },
      { id: 6, name: '胎心', icon: '🎵', unit: '次/分', value: '' }
    ],
    todayRecords: [],
    selectedDate: '',
    showAddModal: false,
    selectedType: null,
    inputValue: '',
    remark: '',
    moodIndex: 0,
    moodText: '',
    moodOptions: ['很差', '较差', '一般', '较好', '很好']
  },

  onLoad() {
    const today = this.formatDate(new Date());
    this.setData({
      currentDate: today,
      selectedDate: today
    });
    this.generateCalendar();
    this.loadTodayRecords();
  },

  onShow() {
    this.loadTodayRecords();
  },

  // 生成日历
  generateCalendar() {
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
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
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
  loadCheckinMarks(year, month) {
    const userId = wx.getStorageSync('userId');
    if (!userId) return;
    
    get(`/checkin/${userId}/calendar`, { year, month }).then(dates => {
      const days = this.data.calendarDays.map(day => {
        if (!day.isEmpty) {
          const hasCheckin = dates.includes(day.fullDate);
          return { ...day, hasCheckin };
        }
        return day;
      });
      this.setData({ calendarDays: days });
    }).catch(err => {
      console.error('加载打卡标记失败', err);
    });
  },

  // 选择日期
  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    
    this.setData({
      selectedDate: date
    });
    
    // 更新日历选中样式
    const days = this.data.calendarDays.map(day => {
      if (!day.isEmpty) {
        return { ...day, isSelected: day.fullDate === date };
      }
      return day;
    });
    this.setData({ calendarDays: days });
    
    this.loadTodayRecords();
  },

  // 加载当天记录
  loadTodayRecords() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      this.setData({ todayRecords: [] });
      return;
    }
    
    get(`/checkin/${userId}/daily`, { date: this.data.selectedDate }).then(records => {
      this.setData({ todayRecords: records || [] });
    }).catch(err => {
      console.error('加载记录失败', err);
      this.setData({ todayRecords: [] });
    });
  },

  // 显示添加打卡弹窗
  showAddModal(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      showAddModal: true,
      selectedType: type,
      inputValue: '',
      remark: '',
      moodIndex: 0,
      moodText: ''
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showAddModal: false,
      selectedType: null,
      inputValue: '',
      remark: '',
      moodIndex: 0,
      moodText: ''
    });
  },

  // 输入值变化
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 备注变化
  onRemarkChange(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 心情选择
  onMoodChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      moodIndex: index,
      moodText: this.data.moodOptions[index],
      inputValue: (index + 1).toString()
    });
  },

  // 提交打卡
  submitCheckin() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.navigateTo({ url: '/pages/login/login' });
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
    
    const record = {
      userId: userId,
      type: this.data.selectedType.id,
      recordDate: this.data.selectedDate,
      remark: this.data.remark
    };
    
    // 根据类型设置对应的字段
    switch(this.data.selectedType.id) {
      case 1: 
        record.weight = parseFloat(this.data.inputValue); 
        break;
      case 2: 
        record.fetalMovementCount = parseInt(this.data.inputValue); 
        break;
      case 3: 
        // 血压格式：收缩压/舒张压
        const pressures = this.data.inputValue.split('/');
        if (pressures.length === 2) {
          record.systolicPressure = parseInt(pressures[0]);
          record.diastolicPressure = parseInt(pressures[1]);
        } else {
          wx.showToast({
            title: '血压格式应为：收缩压/舒张压',
            icon: 'none'
          });
          return;
        }
        break;
      case 4: 
        record.bloodSugar = parseFloat(this.data.inputValue); 
        break;
      case 5: 
        record.mood = parseInt(this.data.inputValue); 
        break;
      case 6: 
        record.fetalHeartRate = parseInt(this.data.inputValue); 
        break;
    }
    
    wx.showLoading({ title: '提交中...' });
    
    post('/checkin', record).then(() => {
      wx.hideLoading();
      wx.showToast({
        title: '打卡成功',
        icon: 'success'
      });
      this.closeModal();
      this.loadTodayRecords();
      this.loadCheckinMarks(new Date().getFullYear(), new Date().getMonth() + 1);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      });
    });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});