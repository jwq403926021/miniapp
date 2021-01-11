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
    // /sys/mini/getPrepay
    wx.showLoading({
      title: '提交订单中',
      mask: true
    })
    util.request({
      authorization: false,
      path: '/sys/mini/getOpenId',
      method: 'GET',
      data: {}
    }, function (err, res) {
      console.log(res, '??')
    })
  }
})
