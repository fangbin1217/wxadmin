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
  }
})