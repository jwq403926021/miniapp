//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },
  goToClientUpload (e) {
    console.log('goToClientUpload-->', e.currentTarget.dataset['index'])
    wx.navigateTo({
      url: '../jc-form-client-upload/jc-form-client-upload?userId=' + 123
    })
  }
})
