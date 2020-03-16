//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    statusMap: {
      '11': '已办结',
      '12': '暂存',
      '13': '处理中',
      '20': '已派送',
      '41': '待报价',
      '43': '驳回',
      '50': '已报价',
    },
    activeNames: ['0'],
    data: [],
    total: 0
  },
  onLoad: function (routeParams) {
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/price/priceList`,
      method: 'GET',
      data: {
        damageId: id
      }
    }, function (err, res) {
      let data = res.data
      _this.setData({
        data: data
      })
    })
  }
})
