const app = getApp()

Page({
  data: {
    isLogin: false,
    role: null
  },
  goToWsForm: function(event) {
    let type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '../ws-form/ws-form?type='+type
    })
  },
  goToNewWsForm: function(event) {
    let type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '../new-ws-form/new-ws-form?type='+type
    })
  },
  goToJcForm: function () {
    wx.navigateTo({
      url: '../jc-form/jc-form'
    })
  },
  goToNewJcForm: function () {
    wx.navigateTo({
      url: '../new-jc-form/new-jc-form'
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
  goToSign () {
    wx.navigateTo({
      url: '../sign/sign'
    })
  },
  goToAccident () {
    wx.navigateTo({
      url: '../accident-form/accident-form'
    })
  },
  onLoad: function () {
    this.setData({
      isLogin: true,
      role: app.globalData.currentRegisterInfo && app.globalData.currentRegisterInfo.role
    })
  }
})
