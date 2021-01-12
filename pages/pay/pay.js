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
      path: '/sys/mini/getPrepay',
      method: 'GET',
      data: {
        item: '123',
        openId:  app.globalData.openId,
        orderId: '20210107121615000108',
        money: 1 * 100
      }
    }, function (err, res) {
      console.log(res, '??')
      // appid: "wxc9cdcd3084bb6aee"
      // code: 0
      // createTime: "2021-01-12 10:41:43"
      // msg: "success"
      // nonceStr: "209ff48310ca411f99df158d47a02841"
      // orderId: "20210107121615000108"
      // package: "prepay_id=wx12104143943301da41e4fd950d830f0000"
      // payPrice: 10000
      // paySign: "2BD4F2961017CDE90EE21A59002046C0"
      // timeStamp: "1610419304"
      // totalFeeStr: "100.0"
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
