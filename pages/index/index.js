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
  goToNewWsForm2: function(event) {
    let type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '../../subpackage/wscompare/new-ws-form/new-ws-form?type='+type
    })
  },
  goToHjbForm: function(event) {
    wx.navigateTo({
      url: '../hujiabao-form/hujiabao-form'
    })
  },
  goToPeace: function(event) {
    wx.navigateTo({
      url: '../../subpackage/peace/peace'
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
  goToFastJcForm: function () {
    wx.navigateTo({
      url: '../new-jc-form/new-jc-form?isQuick=1'
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
  goToWebview () {
    wx.navigateTo({
      url: '../webview/webview'
    })
  },
  goToIdiForm () {
    wx.navigateTo({
      url: '../idi-form/idi-form'
    })
  },
  goToPay () {
    wx.navigateTo({
      url: '../pay/pay'
    })
  },
  goToUpdateBasic () {
    wx.navigateTo({
      url: '../updateBasic/updateBasic'
    })
  },
  goToCalculate () {
    wx.navigateTo({
      url: '../../subpackage/calculate/calculate-list/calculate-list'
    })
  },
  goToCalculateGlass () {
    wx.navigateTo({
      url: '../../subpackage/calculate/calculate-glass/calculate-glass'
    })
  },
  onLoad () {
    this.setData({
      isLogin: true,
      role: app.globalData.currentRegisterInfo && app.globalData.currentRegisterInfo.role,
      userId: app.globalData.currentRegisterInfo && app.globalData.currentRegisterInfo.userId || '',
    })
  }
})
