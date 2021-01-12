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
        item: '',
        openid:  app.globalData.currentRegisterInfo.openId,
        money: 1 * 100
      }
    }, function (err, res) {
      console.log(res, '??')
      // wx.showToast({
      //   title: '成功',
      //   icon: 'success',error
      //   duration: 2000
      // })
      // wx.requestPayment({
      //   "timeStamp": "1414561699",
      //   "nonceStr": "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
      //   "package": "prepay_id=wx201410272009395522657a690389285100",
      //   "signType": "RSA",
      //   "paySign": "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==",
      //   "success":function(res){
      //
      //   },
      //   "fail":function(res){
      //
      //   },
      //   "complete":function(res){
      //
      //   }
      // })
    })
  }
})
