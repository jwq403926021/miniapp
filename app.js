var util = require('./utils/util.js')
//app.js
App({
  onShow: function (obj) {
    // console.log(obj, '##')
    // if (this.globalData.logining == false && obj.scene != null) {
    //   this.login()
    // }
  },
  onLaunch: function () {
    // this.globalData.logining = true
    this.login()
  },
  login () {
    let _this = this
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.showLoading({title: '登录中'})
          util.request({
            authorization: false,
            path: '/app/login',
            method: 'POST',
            data: {
              code: res.code
            }
          }, function (err, res) {
            wx.hideLoading()
            _this.globalData.logining = false
            if (res.code == 0) {
              wx.setStorageSync('status', res.status)
              wx.setStorageSync('token', res.token)
              _this.globalData.status = res.status
              _this.globalData.token = res.token
              if (res.status == 2) {
                console.log('未注册', res)
                wx.switchTab({
                  url: '../register/register'
                })
                wx.hideTabBar()
              } else {
                console.log('已注册，直接登录', res)
                _this.globalData.currentRegisterInfo = res.userInfo
                wx.switchTab({
                  url: '../index/index',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              }
            } else {
              wx.showToast({mask: true,title: '登录出错请重试', icon: 'none', duration: 3000});
            }
          })
        } else {
          wx.showToast({mask: true,title: '登录失败', icon: 'none', duration: 3000});
        }
      }
    })
  },
  globalData: {
    currentRegisterInfo: null,
    userInfo: null,
    status: 0,
    token: ''
    // ,logining: false
  }
})