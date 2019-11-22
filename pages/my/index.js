const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    userIcon: '../../images/user.png',
    balanceIcon: '../../images/balance.png',
    guanyuIcon: '../../images/guanyu.png',
    memberIcon: '../../images/member.png',
    bannerIcon: '../../images/banner.png',
    meIcon: '../../images/me.png',
    youIcon: '../../images/you.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  jumpUserindex: function() {
    wx.navigateTo({ url: "/pages/my/user" });
  },

  jumpMyabout: function() {
    wx.navigateTo({ url: "/pages/my/about" });
  },

  jumpUsermember: function() {
    wx.navigateTo({ url: "/pages/my/member" });
  },

  jumpLogin: function () {
    wx.navigateTo({ url: "/pages/login/index" });
  },

  jumpOneself: function (e) {
    wx.navigateTo({ url: "/pages/user/look?member_id="+e.currentTarget.dataset.memberid });
  }


});