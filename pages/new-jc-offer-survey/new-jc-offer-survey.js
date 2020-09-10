//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
Page({
  data: {
    orderId: null,
    role: 1,
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待指派测漏',
      '31': '待测漏人员处理',
      '32': '已测漏',
      '40': '待合作商完善',
      '41': '待报价中心报价',
      '42': '合作商已驳回',
      '44': '待合作商联系客户',
      '51': '待定损员处理',
      '52': '定损员已驳回',
      '54': '待定损员联系客户',
      '61': '已报价,待财务处理',
      '62': '报价中心驳回',
      '11': '已办结'
    },
    activeNames: [0],
    hasTax: true,
    commentToOffer: '',
    offerRemark: '',
    show: false,
    areaList: {},
    townCode: '',
    cityCode: '',
    provinceCode: '',
    offerList: [],
    incompleteList: [],
    tax: '',
    taxRate: '',
    amountMoney: '',
    incompleteTotal: '',
    offerListTotal: '',
    offerResult: '',
    compareList: [{
      companyName: '企业1',
      id: 0,
      rate: '',
      offer: ''
    }, {
      companyName: '企业2',
      id: 1,
      rate: '',
      offer: ''
    }, {
      companyName: '企业3',
      id: 2,
      rate: '',
      offer: ''
    }],
    coinNum: '',
    coinRate: '',
    coinLevel: 1,
    coinInsert: '',
    offerListSource: [],
    incompleteListSource: [],
    testPrice: 0,
    reportId: '',
    isTest: '',
    computedCateogryTotalPrice: ''
  },
  onLoad: function (routeParams) {
    try {
      if (routeParams && routeParams.id) {
        this.setData({
          orderId: routeParams.id,
          role: app.globalData.currentRegisterInfo.role
        }, () => {
          this.init(routeParams.id)
        })
      }
    } catch (e) {}
  },
  init () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    _this.loadData()
  },
  loadData () {
    let _this = this
    util.request({
      path: `/app/businessinsurancefamilynew/familyPriceDetail`,
      method: 'GET',
      data: {
        orderId: _this.data.orderId
      }
    }, function (err, res) {
      let data = res.data
      let taxData = res.taxList.filter(item => {
        if (_this.data.role === 12) {
          return item.type === '1'
        } else {
          return item.type === '0'
        }
      })

      let list = res.offerList.filter(item => {
        return item.offerType === '0'
      })
      if (list.length > 0) {
        list.forEach(item => {
          let proIndex = _this.data.offerList.findIndex(ll => ll.proName === item.proName)
          if (proIndex === -1) {
            _this.data.offerList.push({
              proName: item.proName,
              proId: item.proId,
              proType: parseInt(item.proType),
              children: [item]
            })
          } else {
            _this.data.offerList[proIndex].children.push(item)
          }
        })
      }
      let incompleteList = res.incompleteList.filter(item => {
        return item.type === '0'
      })
      let result = {
        ...data,
        offerRemark: data.offerRemark,
        townCode: data.townCode,
        cityCode: data.cityCode,
        provinceCode: data.provinceCode,
        offerList: _this.data.offerList,
        incompleteList: incompleteList,
        offerListSource: _this.data.offerList,
        incompleteListSource: incompleteList,
        taxRate: taxData[0] ? taxData[0].taxRate : 0,
        amountMoney: taxData[0] ? taxData[0].amountMoney : 0,
        compareList: res.compareList.length ? res.compareList : _this.data.compareList,
        hasTax: data.hasTax == 1 ? true : false,
        coinLevel: data.level || 1
      }
      _this.setData(result, () => {
        _this.calculate()
        wx.hideLoading()
      })
    })
  },
  calculate () {
    let _this = this
    let offerList = this.data.offerListSource
    let offerListTotal = 0
    let incompleteTotal = 0
    let amountMoney = 0
    let tax = 0
    let offerResult = 0
    let num1 = 0
    let num2 = 0
    let num3 = 0
    let num4 = 0
    let computedCateogryTotalPrice = ''

    offerList.forEach(project => {
      let incompleteList = this.data.incompleteListSource.filter(item => item.proId == project.proId)
      let projectOfferTotal = 0
      let projectIncompleteTotal = 0

      project.children.forEach(item => {
        let total = (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        item.itemTotal = total
        projectOfferTotal += total
        offerListTotal += total
      })
      project.projectOfferTotal = projectOfferTotal

      if (project.proType === 0) {
        num2 += parseInt(project.projectOfferTotal)
        num3 += parseInt(project.projectOfferTotal)
      } else if (project.proType === 1) {
        num1 += parseInt(project.projectOfferTotal)
        num3 += parseInt(project.projectOfferTotal)
      } else if (project.proType === 2) {
        num2 += parseInt(project.projectOfferTotal)
        num4 += parseInt(project.projectOfferTotal)
      } else if (project.proType === 3) {
        num1 += parseInt(project.projectOfferTotal)
        num4 += parseInt(project.projectOfferTotal)
      }

      num1 += (this.data.testPrice || 0)
      num3 += (this.data.testPrice || 0)

      incompleteList.forEach(item => {
        let total = (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        item.itemTotal = total
        projectIncompleteTotal += total
        incompleteTotal += total
      })
      project.projectIncompleteTotal = projectIncompleteTotal
      project.incompleteList = incompleteList

      project.amountMoney = project.projectOfferTotal - project.projectIncompleteTotal
      project.tax = parseFloat((parseFloat(this.data.taxRate) / 100 * project.amountMoney).toFixed(2))
      project.offerResult = this.data.hasTax ? Math.round(project.amountMoney + project.tax).toFixed(2) : project.amountMoney.toFixed(2)
    })
    offerListTotal += parseFloat(this.data.testPrice || 0)
    offerListTotal = parseFloat(offerListTotal.toFixed(2))
    computedCateogryTotalPrice = `支付平台金额：${num1.toFixed(2)} | 支付被保险人金额：${num2.toFixed(2)}<br/>水渍险合计：${num3.toFixed(2)} | 三者险合计：${num4.toFixed(2)} `
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))
    amountMoney =  offerListTotal - incompleteTotal
    tax = parseFloat(this.data.taxRate) / 100 * amountMoney
    offerResult = this.data.hasTax ? Math.round(amountMoney + tax).toFixed(2) : amountMoney.toFixed(2)

    this.setData({
      offerList: offerList,
      amountMoney: amountMoney.toFixed(2),
      tax: tax.toFixed(2),
      offerListTotal,
      incompleteTotal,
      offerResult,
      computedCateogryTotalPrice
    })
  },
  onChange (event) {
    this.setData({
      activeNames: event.detail
    });
  },
  goBack () {
    wx.navigateBack({
      delta: 1
    })
  }
})
