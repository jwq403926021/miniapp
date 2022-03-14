//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
Page({
  data: {
    orderId: null,
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
    handlingType: '',
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
    plateNumber: '',
    reportNumber: ''
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
    this.setData({
      offerList: []
    }, () => {
      _this.loadData()
    })
  },
  loadData () {
    let _this = this
    util.request({
      path: '/app/businessdamagenew/damageDetail',
      method: 'GET',
      data: {
        orderId: _this.data.orderId
      }
    }, function (err, res) {
      let data = res.data
      _this.setData({
        plateNumber: data.plateNumber,
        reportNumber: data.reportNumber,
        offerRemark: data.offerRemark
      })
    })

    util.request({
      path: `/app/businessdamagenew/damagePriceDetail`,
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
      let offerList = []
      if (list.length > 0) {
        list.forEach(item => {
          let proIndex = offerList.findIndex(ll => ll.proName === item.proName)
          if (proIndex === -1) {
            offerList.push({
              proName: item.proName,
              proId: item.proId,
              proType: parseInt(item.proType),
              children: [item]
            })
          } else {
            offerList[proIndex].children.push(item)
          }
        })
      }
      let incompleteList = res.incompleteList.filter(item => {
        return item.type === '0'
      })
      let result = {
        ...data,
        townCode: data.townCode,
        cityCode: data.cityCode,
        provinceCode: data.provinceCode,
        offerList: offerList,
        incompleteList: incompleteList,
        offerListSource: offerList,
        incompleteListSource: incompleteList,
        taxRate: taxData[0] ? taxData[0].taxRate : 0,
        amountMoney: taxData[0] ? taxData[0].amountMoney : 0,
        compareList: res.compareList.length ? res.compareList : _this.data.compareList,
        hasTax: data.hasTax == 1 ? true : false,
        handlingType: data.handlingType,
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

    offerList.forEach(project => {
      let incompleteList = this.data.incompleteListSource.filter(item => item.proId == project.proId)
      let projectOfferTotal = 0
      let projectIncompleteTotal = 0

      project.children.forEach(item => {
        let total = (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        item.itemTotal = total.toFixed(2)
        projectOfferTotal += total
        offerListTotal += total
      })
      project.projectOfferTotal = projectOfferTotal

      incompleteList.forEach(item => {
        let total = (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        item.itemTotal = total.toFixed(2)
        projectIncompleteTotal += total
        incompleteTotal += total
      })
      project.projectIncompleteTotal = projectIncompleteTotal
      project.incompleteList = incompleteList

      project.amountMoney = project.projectOfferTotal - project.projectIncompleteTotal
      project.tax = parseFloat((parseFloat(this.data.taxRate) / 100 * project.amountMoney).toFixed(2))
      project.offerResult = (this.data.hasTax && this.data.hasTax == '1') ? (project.amountMoney + project.tax).toFixed(2) : project.amountMoney.toFixed(2)
    })

    offerListTotal = parseFloat(offerListTotal.toFixed(2))
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))
    amountMoney =  offerListTotal - incompleteTotal
    tax = (parseFloat(this.data.taxRate) / 100 * amountMoney).toFixed(2)
    offerResult = (this.data.hasTax && this.data.hasTax == '1') ? (amountMoney + parseFloat(tax)).toFixed(2) : amountMoney.toFixed(2)

    this.setData({
      offerList: offerList,
      amountMoney: amountMoney.toFixed(2),
      tax: (tax || 0),
      offerListTotal,
      incompleteTotal,
      offerResult
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
