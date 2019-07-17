//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1, // 1 查勘员 | 12 合作商施工人员 | 6 公司市级负责人 | 11 合作商市级负责人 |
    statusMap: {
      '1': '查勘员已派送',
      '2': '待查勘员完善',
      '3': '查勘员已完善',
      '4': '待区域负责人线下报价',
      '5': '待报价中心报价',
      '6': '施工人员去现场',
      '7': '施工中',
      '8': '计算书已上传',
      '9': '报价中心驳回',
      '10': '已报价',
      '11': '已办结',
      '12': '暂存'
    },
    activeNames: ['0'],
    data: [],
    total: 0
  },
  onLoad: function (routeParams) {
    console.log('工单号：->', routeParams)
    console.log('????', app.globalData.currentRegisterInfo)
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role //app.globalData.currentRegisterInfo.role 1 查勘员 | 12 施工人员 | 6 公司市级负责人 | 11 合作商市级负责人
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
      let total = 0
      data.forEach(item => {
        total += parseFloat(item.categoryTotalPrice)
      })
      _this.setData({
        data: data,
        total : total.toFixed(2)
      })
    })
  }
})