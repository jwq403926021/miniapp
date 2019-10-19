var util = require('./utils/util.js')
//app.js
App({
  onLaunch: function (data) {
    // this.globalData.logining = true
    this.login(data.query)
  },
  onShow (obj) {
    let _this = this
    let page = getCurrentPages().pop()
    if (page == undefined || page == null) return
    if ([
      "pages/index/index",
      "pages/register/register",
      "pages/my-list-home/my-list-home",
      "pages/my-list-ws/my-list-ws",
      "pages/my-list-jc/my-list-jc",
      "pages/my-list-cx/my-list-cx",
      "pages/my-list-lock/my-list-lock",
      "pages/my-list-feedback/my-list-feedback",
      "pages/my-list-pipe/my-list-pipe"
    ].indexOf(obj.path) != -1) {
      if (!_this.globalData.token) {
        _this.login()
      }
      page.onLoad()
    }
  },
  login (routerParams) {
    let _this = this

    if (wx.canIUse('getUpdateManager')) { // 基础库 1.9.90 开始支持，低版本需做兼容处理
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(result) {
        if (result.hasUpdate) { // 有新版本
          updateManager.onUpdateReady(function() { // 新的版本已经下载好
            wx.showModal({
              title: '更新提示',
              content: '新版本已经下载好，请重启应用。',
              success: function(result) {
                if (result.confirm) { // 点击确定，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function() { // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            });
          });
        }
      });
    }
    else { // 有更新肯定要用户使用新版本，对不支持的低版本客户端提示
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
      });
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.showLoading({
            title: '登录中',
            mask: true
          })
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
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                // if (page.route == 'pages/index/index') {
                page.onLoad(routerParams);
                // }
                // wx.switchTab({
                //   url: '../index/index',
                //   success: function (e) {
                //     var page = getCurrentPages().pop();
                //     if (page == undefined || page == null) return;
                //     page.onLoad();
                //   }
                // })
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
