// pages/my-list-home/my-list-home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: null
  },
  //事件处理函数
  goToWsList: function () {
    wx.navigateTo({
      url: '../my-list-ws/my-list-ws'
    })
  },
  goToJcList: function () {
    wx.navigateTo({
      url: '../my-list-jc/my-list-jc'
    })
  },
  goToCxList: function () {
    wx.navigateTo({
      url: '../my-list-cx/my-list-cx'
    })
  },
  goToLockList () {
    wx.navigateTo({
      url: '../my-list-lock/my-list-lock'
    })
  },
  goToPipeList () {
    wx.navigateTo({
      url: '../my-list-pipe/my-list-pipe'
    })
  },
  goToFeedbackList () {
    wx.navigateTo({
      url: '../my-list-feedback/my-list-feedback'
    })
  },
  goToAccidentList () {
    wx.navigateTo({
      url: '../my-list-accident/my-list-accident'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      role: app.globalData.currentRegisterInfo && app.globalData.currentRegisterInfo.role
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})