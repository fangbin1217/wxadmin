const app = getApp();
var wxCharts = require('../../utils/wxcharts.js');
var yuelineChart = null;
Page({
  data: {
    about: null,
    width: 320,
    height: 200,
    isPullDownRefresh: false
  },

  onLoad: function (option) {

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

  onShow: function () {
    if (app.globalData.isRefresh) {
      console.log(1);
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
    this.getData();
  },

  getData: function () {
    var access_token = wx.getStorageSync('access_token') || ''
    wx.request({
      url: app.globalData.serverHost + 'member/userindex', //概况
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
        wx.showToast({
          title: '查询超时！',
          image: app.globalData.image_warning,
          duration: 1200,
          mask: true
        });
      },
      complete: () => {
        if (this.data.isPullDownRefresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  },

  jumpLogin: function () {
    wx.navigateTo({ url: "/pages/login/index" });
  },

  draw: function (xList, yList) { //当月用电触摸显示
    var series = [];
    var tmp = {
      name: '用户访问折线图',
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
        title: '人',
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