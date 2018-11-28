//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    array1: ['美国1', '中国2', '巴西3', '日本4'],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogin: false
  },
  //事件处理函数
  goToWsForm: function() {
    wx.navigateTo({
      url: '../ws-form/ws-form'
    })
  },
  goToJcForm: function () {
    wx.navigateTo({
      url: '../jc-form/jc-form'
    })
  },
  goToCxForm: function () {
    wx.navigateTo({
      url: '../cx-form/cx-form'
    })
  },
  bindGetUserInfo (data) {
    console.log('bindGetUserInfo:::', data)
  },
  onLoad: function () {
    var value = wx.getStorageSync('state')
    if(value === 1) {
      console.log('显示 index', '|', value, '|')
      this.setData({
        isLogin: true
      })
      wx.showTabBar()
    }else{
      console.log('隐藏 index', '|', value, '|')
      wx.switchTab({
        url: '../register/register'
      })
      wx.hideTabBar()
    }
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  }
})
