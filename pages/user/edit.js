const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId:null,
    is_admin: false,
    member:null,
    mobile:'',
    accountValue:'',
    array: ['支付宝转账', '微信转账', '工商银行卡转账'],
    index:0,
    array2: ['50成','55成', '60成','65成', '70成', '75成', '80成', '85成', '90成', '95成'],
    index2:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var memberId = decodeURIComponent(options.member_id);
    var is_admin =false;
    if (app.globalData.userInfo) {
      is_admin = app.globalData.userInfo.is_admin;
    }
    this.setData({ memberId: memberId, is_admin:is_admin });
    this.initIndex();
  },


  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindPickerChange2: function(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  initIndex: function () {
    var access_token = wx.getStorageSync('access_token') || '';
    wx.request({
      url: app.globalData.serverHost + 'member/lookmember', //概况
      method: 'post',
      data: { access_token: access_token, admin: 1, member_id: this.data.memberId },
      success: res => {
      wx.hideLoading();
      var ret = res.data;
      if (ret.code == 0) {
        console.log(ret.data);
        this.setData({
          member: ret.data,
          index: ret.data.types,
          index2: ret.data.index2,
          accountValue: ret.data.alipay_account
        });
      } else if (ret.code == 101) {  //如果access_token过期，则重新登录
        app.jumpLogin('登录过期！', 1);
      }
    },
      fail: () => {
        wx.hideLoading();
        // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
        wx.showToast({
          title: '查询超时！',
          image: app.globalData.image_warning,
          duration: 1200,
          mask: true
        });
      }
    })
  },

  updMember: function() {
    var access_token = wx.getStorageSync('access_token') || '';
    wx.request({
      url: app.globalData.serverHost + 'member/updmember',
      method: 'post',
      data: {
        access_token: access_token, admin: 1, member_id: this.data.memberId, mobile: this.data.mobile,
        alipay_account: this.data.accountValue, types: this.data.index, percent: this.data.index2
      },
      success: res => {
      wx.hideLoading();
    var ret = res.data;
    if (ret.code == 0) {
      app.globalData.isRefresh = true;
      wx.showToast({
        title: '修改成功！',
        duration: 1200,
        mask: true
      });
      wx.navigateTo({ url: "/pages/user/look?member_id=" + this.data.memberId });
      } else if (ret.code == 101) {  //如果access_token过期，则重新登录
        app.jumpLogin('登录过期！', 1);
      } else {
        wx.showToast({
          title: ret.msg,
          image: app.globalData.image_warning,
          duration: 1200,
          mask: true
        });
      }
    },
      fail: () => {
        wx.hideLoading();
        // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
        wx.showToast({
          title: '查询超时！',
          image: app.globalData.image_warning,
          duration: 1200,
          mask: true
        });
      }
    })
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  accountInput: function (e) {
    this.setData({
      accountValue: e.detail.value
    })
  },

  goHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
      success: function (e) {
      }
    });
  }

})