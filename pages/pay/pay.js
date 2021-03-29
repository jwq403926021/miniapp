//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";

const app = getApp()

Page({
  data: {

  },
  onLoad: function (routeParams) {
    this.orderId = routeParams.id || 20210320214034001109
    this.money = routeParams.money || 1
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
        orderId: that.orderId + '-' + Math.ceil(Math.random() * 1000),
        money: that.money
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
  }
})
