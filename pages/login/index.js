// pages/login/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    passwd:'',
    logo: '',
    yonghu: '',
    lock: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      logo: app.globalData.imgHost + app.globalData.logo,
      yonghu: app.globalData.imgHost + app.globalData.yonghu,
      lock: app.globalData.imgHost + app.globalData.lock,
    });
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    })
  },


  login: function () {
    wx.showLoading({
      title: '正在登录..',
    })


    app.login(this.data.mobile, this.data.passwd);
    app.userInfoReadyCallback = res => {
      //app.globalData.userInfo = res;
      app.globalData.isRefresh = true;
      wx.switchTab({
        url: '/pages/index/index',
        success: function (e) {
        }
      })
    }
    
  }
})