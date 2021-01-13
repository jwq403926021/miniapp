var util = require('./utils/util.js')
//app.js
App({
  onLaunch: function (data) {
    console.log('app onLaunch:', data)
    if (data.path === 'pages/sign/sign') {

    } else {
      this.login(data.query)
    }
  },
  onShow (obj) {
    let pageStages = getCurrentPages()
    let currentPage = pageStages[pageStages.length - 1]
    console.log('app onShow:', obj, currentPage)
    currentPage && currentPage.onLoad(obj ? (obj.query || {}) : {})
  },
  login (routerParams) {
    console.log('app login:', routerParams)
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
            title: '加载中',
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
            if (res.code == 0) {
              wx.setStorageSync('status', res.status)
              wx.setStorageSync('token', res.token)
              wx.setStorageSync('mobile', res.mobile)
              _this.globalData.status = res.status
              _this.globalData.token = res.token
              _this.globalData.mobile = res.mobile
              _this.globalData.openId = res.openId
              if (res.status == 2 || res.status == null) {
                console.log('未注册', res)
                wx.switchTab({
                  url: '../register/register'
                })
                wx.hideTabBar()
                let page = getCurrentPages().pop()
                page && page.onLoad()
              } else {
                _this.globalData.currentRegisterInfo = res.userInfo
                let page = getCurrentPages().pop()
                page && page.onLoad(routerParams)
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
    currentRegisterInfo: {
      role: ''
    },
    userInfo: null,
    status: null,
    token: ''
  }
})
