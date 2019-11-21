const app = getApp();

Page({
  data: {
    memberList: null,
    total:1,
    current: 1,
    memberCount:0,
    bannerIcon:'../../images/banner.png'
  },

  onLoad: function (option) {
    this.indexInit();
  },

  onShow: function () {
    if (app.globalData.isRefresh) {
      app.globalData.isRefresh = false;
      this.indexInit();
    }
  },

  indexInit: function () {
    this.getData();
  },

  getData: function () {
    var access_token = wx.getStorageSync('access_token') || '';
    wx.request({
      url: app.globalData.serverHost + 'member/memberindex', //概况
      method: 'post',
      data: { access_token: access_token, admin: 1, page: this.data.current },
      success: res => {
        wx.hideLoading();
        var ret = res.data;
        if (ret.code == 0) {
          console.log(ret.data);
          this.setData({
            memberList: ret.data.memberList,
            total: ret.data.total,
            current: ret.data.current,
            memberCount: ret.data.memberCount
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
          image: this.globalData.image_warning,
          duration: 1200,
          mask: true
        });
      }
    })
  },

  handleChange({ detail }) {
    const type = detail.type;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1
      });
    }
    this.getData();
  }

})