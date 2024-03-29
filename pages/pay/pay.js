//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";

const app = getApp()

Page({
  data: {
    orderId: '',
    money: '',
    userLocationInfo: {
      latitude: '',
      longitude: ''
    }
  },
  onLoad: function (routeParams) {
    this.setData({
      orderId: routeParams.id || '',
      money: routeParams.money || 0,
      userLocationInfo: {
        latitude: routeParams.latitude || '',
        longitude: routeParams.longitude || ''
      }
    })
  },
  backDetail () {
    let that = this
    wx.navigateBack({
      delta: 1,
      success () {
        let pages = getCurrentPages()
        let backTarget = pages[pages.length - 1]
        backTarget.onLoad({
          id: that.data.orderId
        })
      }
    })
  },
  commitSubmit: function () {
    let that = this
    wx.showLoading({
      title: '提交订单中',
      mask: true
    })
    util.request({
      authorization: false,
      path: '/app/wxPay/js',
      method: 'POST',
      data: {
        openId:  app.globalData.openId,
        orderId: that.data.orderId + '-' + Math.ceil(Math.random() * 1000),
        money: that.data.money
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.requestPayment({
        ...res,
        "success":function(res){
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          that.backDetail()
        },
        "fail":function(res){
          console.log('pay fail:', res)
          wx.showToast({
            title: '支付失败',
            icon: 'error',
            duration: 2000
          })
        },
        "complete":function(res){

        }
      })
    })
  },
  goto () {
    wx.openLocation({
      latitude: Number(this.data.userLocationInfo.latitude),
      longitude: Number(this.data.userLocationInfo.longitude),
      name: '',
      address: ''
    })
  }
})
