const app = getApp()

Page({
  data: {
    isLogin: false,
    role: null
  },
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
  goToKsForm: function () {
    wx.navigateTo({
      url: '../lock-form/lock-form'
    })
  },
  goToGdForm: function () {
    wx.navigateTo({
      url: '../pipe-form/pipe-form'
    })
  },
  goToFeedback () {
    wx.navigateTo({
      url: '../feedback-form/feedback-form'
    })
  },
  onShow () {
    var value = wx.getStorageSync('status')
    if(value == 2 || value == '') {
      console.log('隐藏 index', '|', value, '|')
      wx.switchTab({
        url: '../register/register'
      })
      wx.hideTabBar()
    }
  },
  onLoad: function () {
    var value = wx.getStorageSync('status')
    if(value == 2 || value == '') {
      console.log('隐藏 index', '|', value, '|')
      wx.switchTab({
        url: '../register/register'
      })
      wx.hideTabBar()
    }else{
      console.log('显示 index', '|', value, '|')
      this.setData({
        isLogin: true,
        role: app.globalData.currentRegisterInfo && app.globalData.currentRegisterInfo.role
      })
      wx.showTabBar()
    }
  }
})
