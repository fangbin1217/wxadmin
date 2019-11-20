const app = getApp()
const updateManager = wx.getUpdateManager()

Page({
  data: {
    userInfo: null,
    about:null,
    isPullDownRefresh: false
  },

  onLoad: function (option) {

    //version update
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '升级失败',
        content: '新版本下载失败，请检查网络！',
        showCancel: false
      });
    });

    this.indexInit();
  },

  onShow: function() {
    if (app.globalData.isRefresh) {
      this.indexInit();
      app.globalData.isRefresh = false;
    }
  },

  onPullDownRefresh: function (e) {
    this.setData({
      isPullDownRefresh: true
    })
    this.getData();
  },

  indexInit: function () {
    var access_token = wx.getStorageSync('access_token') || ''
    wx.showLoading({
      title: '努力拉取数据..',
    })
    //没有access_token 就是第一次登录
    if (!access_token) {
      wx.navigateTo({ url: "/pages/login/index" });
    } else {
      //否则就根据没有access_token去获取用户信息
      app.getUserInfo(access_token);
    }

    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res
      });
      console.log(this.data.userInfo)
      this.getData();
    }
  },

  getData: function () {
    var access_token = wx.getStorageSync('access_token') || ''
    wx.request({
      url: app.globalData.serverHost + 'member/indexincomes', //概况
      method: 'post',
      data: { access_token: access_token, admin: 1 },
      success: res => {
        wx.hideLoading();
        var ret = res.data;
        if (ret.code == 0) {
          console.log(ret.data)
          this.setData({
            about: ret.data
          })

        } else if (ret.code == 101) {  //如果access_token过期，则重新登录
          app.jumpLogin('登录过期！', 1);
        }
      },
      fail: () => {
        wx.hideLoading();
        // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
        app.jumpLogin('登录超时！', 1);
      },
      complete: () => {
        if (this.data.isPullDownRefresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  }


})