//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";

const app = getApp()

Page({
  data: {

  },
  onLoad: function (routeParams ) {

  },
  commitSubmit: function () {
    wx.showLoading({
      title: '提交订单中',
      mask: true
    })
    util.request({
      authorization: false,
      path: '/app/wxPay/js',
      method: 'GET',
      data: {
        openId:  app.globalData.openId,
        orderId: '20210318210708000109',
        money: 1 * 100
      }
    }, function (err, res) {
      console.log(res, '??')
      if (res.msg === 'success') {
        wx.requestPayment({
          "timeStamp": res.timeStamp,
          "nonceStr": res.nonceStr,
          "package": res.package,
          "signType": "RSA",
          "paySign": res.paySign,
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
      }
    })
  }
})
