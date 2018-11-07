//获取应用实例
const app = getApp()

Page({
  data: {

  },
  //事件处理函数
  bindTapToClient: function () {
    wx.navigateTo({
      url: '../jc-form-client/jc-form-client?userId=' + 123
    })
  },
  onLoad: function () {

  }
})
