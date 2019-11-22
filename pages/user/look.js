const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      member: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var memberId = decodeURIComponent(options.member_id);
    this.initIndex(memberId);
  },

    initIndex: function (memberId) {
        var access_token = wx.getStorageSync('access_token') || '';
        wx.request({
            url: app.globalData.serverHost + 'member/lookmember', //概况
            method: 'post',
            data: { access_token: access_token, admin: 1, member_id: memberId },
            success: res => {
            wx.hideLoading();
        var ret = res.data;
        if (ret.code == 0) {
            console.log(ret.data);
            this.setData({
                member: ret.data,
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
        });
    },

    downloadImg: function (e) {　　　　　　　　　　　　　　　　//触发函数
        console.log(e.currentTarget.dataset.url)
        wx.downloadFile({
            url: e.currentTarget.dataset.url,　　　　　　　//需要下载的图片url
            success: function (res) {　　　　　　　　　　　　//成功后的回调函数
                wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    },
                    fail: function (err) {
                        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                            wx.openSetting({
                                success(settingdata) {
                                    console.log(settingdata)
                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                                    } else {
                                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                                    }
                                }
                            })
                        }
                    }
                })
            }
        });
    },

    goHome: function () {
        wx.switchTab({
            url: '/pages/index/index',
            success: function (e) {
            }
        });
    },

    errorImage: function (e) {
        var qrcode = "member.qrcode";
        this.setData({
            [qrcode]: app.globalData.imgHost + '404.png'
        })

    },


})