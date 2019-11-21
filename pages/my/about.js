// pages/share/about.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: '',
    logo: null,
    logo2:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = 'v' + app.globalData.version;
    this.setData({
      version: version,
      logo: app.globalData.imgHost + 'admin/logo1118.jpg',
      logo2: app.globalData.imgHost + 'admin/me.png'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})