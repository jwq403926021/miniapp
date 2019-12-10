//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1, // 1 查勘员 | 12 合作商施工人员 | 6 公司市级负责人 | 11 合作商市级负责人 |
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善', // 也是驳回状态
      '31': '被保险人已完善,待报价中心报价',
      '32': '已报价,待被保险人审阅',
      '33': '被保险人不满意，待沟通',
      '40': '待合作商完善', // 也是驳回状态
      '41': '合作商已完善,待报价中心报价',
      '42': '已报价',
      '50': '已报价,待财务处理',
      '51': '待定损员处理',
      '52': '定损员已驳回',
      '11': '已办结',
      '99': '处理中'
    },
    activeNames: ['0'],
    data: [],
    total: 0,
    assistMoney: 0,
    num1: 0,
    num2: 0,
    num3: 0,
    num4: 0
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
      path: `/app/family/priceList`,
      method: 'GET',
      data: {
        orderId: id
      }
    }, function (err, res) {
      let data = res.data
      let total = 0
      let num1 = 0
      let num2 = 0
      let num3 = 0
      let num4 = 0

      data.forEach(item => {
        if (item.category === '赔偿/被保险人') {
          num2 += parseInt(item.categoryTotalPrice)
          num3 += parseInt(item.categoryTotalPrice)
        } else if (item.category === '施工/被保险人') {
          num1 += parseInt(item.categoryTotalPrice)
          num3 += parseInt(item.categoryTotalPrice)
        } else if (item.category === '赔偿/三者') {
          num2 += parseInt(item.categoryTotalPrice)
          num4 += parseInt(item.categoryTotalPrice)
        } else if (item.category === '施工/三者') {
          num1 += parseInt(item.categoryTotalPrice)
          num4 += parseInt(item.categoryTotalPrice)
        }
        total += parseFloat(item.categoryTotalPrice)
      })

      _this.setData({
        data: data,
        total : total.toFixed(2),
        assistMoney: data[0] ? data[0].assistMoney : 0,
        num1: num1.toFixed(2), //支付平台金额
        num2: num2.toFixed(2), //支付被保险人金额
        num3: num3.toFixed(2), //水渍险合计
        num4: num4.toFixed(2) //三者险合计
      })
    })
  }
})
