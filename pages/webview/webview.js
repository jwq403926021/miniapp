//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
Page({
  data: {
  },
  onLoad: function (routeParams) {
    console.log('sign routeParams:', routeParams)
  },
  loadData () {
    // let _this = this
    // util.request({
    //   path: '/app/businessdamagenew/damageDetail',
    //   method: 'GET',
    //   data: {
    //     orderId: _this.data.orderId
    //   }
    // }, function (err, res) {
    //   let data = res.data
    //   _this.setData({
    //     plateNumber: data.plateNumber,
    //     reportNumber: data.reportNumber,
    //     offerRemark: data.offerRemark
    //   })
    // })
  }
})
