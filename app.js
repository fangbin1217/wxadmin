App({
  onLaunch: function (option) {
    
  },
  globalData: {
    userInfo: null,
    serverHost: 'http://api.fyy6.fb/',   //https://api.fyy6.com/   http://api.fyy6.fb/
    imgHost: 'https://img.fyy6.com/',
    avatar: '../../images/defaultAvatar.png',
    image_warning: '../../images/Warning.png',
    logo: 'admin/logo1118.jpg',
    yonghu: 'admin/yonghu.png',
    lock: 'admin/lock.png',
    isRefresh: false,
    version:'1.0.0'
  },

  login: function (mobile, passwd) {
      wx.request({
        url: this.globalData.serverHost + 'login/member',
        method: 'post',
        data: { admin: 1, mobile: mobile, passwd: passwd},
        success: res => {
          wx.hideLoading();
        var ret = res.data;
            console.log(ret)
        if (ret.code == 0) {
          wx.setStorageSync('access_token', ret.data.access_token)
          //this.globalData.userInfo = ret.data;
          this.globalData.isRefresh = true;
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(this.globalData.userInfo)
          }

          wx.switchTab({
            url: '/pages/index/index',
            success: function (e) {
            }
          })

        } else {
          this.jumpLogin(ret.msg, 0);
        }
      },
      fail: () => {
        wx.hideLoading();
        this.jumpLogin('登录超时！', 0);
      }
    })
  },

  getUserInfo: function (access_token) {
    wx.request({
      url: this.globalData.serverHost+'member/info', //接口地址
      method: 'post',
      data: { access_token: access_token, admin: 1 },
      success: res => {
      wx.hideLoading();
    var ret = res.data;
    if (ret.code == 0) {
      this.globalData.userInfo = ret.data;
      this.globalData.isRefresh = true;
      // 所以此处加入 callback 以防止这种情况  登录成功回调
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(this.globalData.userInfo)
      }

    } else if (ret.code == 101) {  //如果access_token过期，则重新登录
      this.jumpLogin('登录过期！', 1);
    }
  },
    fail: () => {
      wx.hideLoading();
      // 这里调用你想设置的提示, 比如展示一个页面，一个toast提示
      this.jumpLogin('登录超时！', 1);
    }
  })
  },

  jumpLogin: function (msg = '', isJump = 1) {
    if (!msg) {
      msg = '登录过期！';
    }

    if (isJump) {
      wx.showToast({
        title: msg,
        image: this.globalData.image_warning,
        duration: 1200,
        mask: true,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({ url: "/pages/login/index" })
          }, 1200)

        }
      })
    } else {
      wx.showToast({
        title: msg,
        image: this.globalData.image_warning,
        duration: 1200,
        mask: true
      });
    }
  }
})