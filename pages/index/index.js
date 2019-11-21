const app = getApp();
var wxCharts = require('../../utils/wxcharts.js');
var yuelineChart = null;
const updateManager = wx.getUpdateManager();

Page({
  data: {
    userInfo: null,
    about:null,
    width: 320,
    height: 200,
    isPullDownRefresh: false,
    visible5: false,
    oldPwd:null,
    newPwd: null,
    actions5: [
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#09BB07',
        loading: false
      }
    ]
  },

  handleOpen5: function () {
    this.setData({
      visible5: true
    });
  },

  handleClick5: function (e) {
    //console.log(e)
    if (e.detail.index === 0) {
      this.setData({
        visible5: false
      });
    } else {
      const action = [...this.data.actions5];
      action[1].loading = true;

      this.setData({
        actions5: action
      });

      this.savePwd(action);
    }
  },

  oldPwd: function (e) {
    this.setData({
      oldPwd: e.detail.value
    })
  },

  newPwd: function (e) {
    this.setData({
      newPwd: e.detail.value
    })
  },

  savePwd: function (action) {
    var access_token = wx.getStorageSync('access_token') || ''
    wx.request({
      url: app.globalData.serverHost + 'member/updpwd', //接口地址
      method: 'post',
      data: { access_token: access_token, admin: 1, oldpwd: this.data.oldPwd, newpwd: this.data.newPwd },
      success: res => {
        action[1].loading = false;
        this.setData({
          visible5: false,
          actions5: action
        });

        var ret = res.data;
        if (ret.code == 0) {
          setTimeout(function(){
            app.jumpLogin('修改成功..');
          }, 1500)
          
        } else if (ret.code == 101) {
          app.jumpLogin();
        } else {
          wx.showToast({
            title: ret.msg,
            image: app.globalData.image_warning,
            duration: 1500,
            mask: true,
          })
        }
      },

      fail: () => {
        wx.hideLoading();
        // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
        wx.showToast({
          title: '请求超时！',
          icon: 'loading',
          duration: 1500,
          mask: true
        })
      }
    })
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

    var windowWidth = 320;
    var windowHeight = 200;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
    } catch (e) {
      console.log('getSystemInfoSync failed!');
    }
    windowHeight = Math.round(windowHeight * 0.62);
    this.setData({
      width: windowWidth,
      height: windowHeight
    })
    this.indexInit();
  },

  onShow: function() {
    if (app.globalData.isRefresh) {
      console.log('index refresh');
      app.globalData.isRefresh = false;
      this.indexInit();
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
          this.draw(ret.data.lastWeekX, ret.data.lastWeekY);

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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '专业的麻将记分后台管理系统', //转发的标题。当前小程序名称
      path: '/pages/index/index', //转发的路径
    }

  },

  jumpLogin: function() {
    wx.navigateTo({ url: "/pages/login/index" });
  },

  draw: function (xList, yList) { //当月用电触摸显示
    var series = [];
    var tmp = {
      name: '个人收益折线图',
      data: yList,
      format: function (val, name) {
        return val;
      }
    };
    series.push(tmp);

    yuelineChart = new wxCharts({ //当月用电折线图配置
      canvasId: 'yueEle',
      type: 'area',
      categories: xList, //categories X轴
      animation: true,
      series: series,
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '元',
        format: function (val) {
          return val;
        }
      },
      width: this.data.width,
      height: this.data.height,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve',
      }
    });
  }

})