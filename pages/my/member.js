const app = getApp();

Page({
  data: {
    memberList: null,
    total:1,
    current: 1,
    memberCount:0,
    bannerIcon:'../../images/banner.png',
    lookIcon: '../../images/user.png'
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
          image: app.globalData.image_warning,
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
  },

  addMember: function() {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '确定要新增会员吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在保存..',
          })

          var access_token = wx.getStorageSync('access_token') || '';
          wx.request({
            url: app.globalData.serverHost + 'member/createmember', //接口地址
            method: 'post',
            data: { access_token: access_token, admin: 1 },
            success: res => {
              wx.hideLoading();
              var ret = res.data;
              if (ret.code == 0) {
                wx.showToast({
                  title: '保存成功！',
                  duration: 1500,
                  mask: true
                })
                that.setData({
                  current: 1
                });
                that.getData();

              } else if (ret.code == 101) {
                app.jumpLogin();
              } else {
                wx.showToast({
                  title: ret.msg,
                  icon: 'none',
                  image: app.globalData.image_warning,
                  duration: 1500,
                  mask: true
                })
              }

            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '请求超时！',
                icon: 'loading',
                duration: 1500,
                mask: true
              })
            }

          })
        } else {
          //console.log('弹框后点取消')
        }
      }
    })
  },

  editMember: function(e) {
    wx.navigateTo({ url: "/pages/user/edit?member_id=" + e.currentTarget.dataset.memberid });
  },

  lookMember: function(e) {
    wx.navigateTo({ url: "/pages/user/look?member_id=" + e.currentTarget.dataset.memberid });
  }

})