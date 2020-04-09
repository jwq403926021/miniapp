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
    activeNames: ['0'],
    hasTax: true,
    commentToOffer: '',
    offerRemark: '',
    show: false,
    areaList: {},
    regionLabel: '',
    region: '',
    townCode: '',
    cityCode: '',
    provinceCode: '',
    offerList: [{
      proName: '',
      proType: 0,
      children: [],
      projectTotal: 0
    }],
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
    coinInsert: ''
  },
  initArea () {
    try {
      let _this = this
      _this.setData({
        region: app.globalData.currentRegisterInfo.townCode,
        townCode: app.globalData.currentRegisterInfo.townCode,
        cityCode: app.globalData.currentRegisterInfo.cityCode,
        provinceCode: app.globalData.currentRegisterInfo.provinceCode
      })
      util.request({
        path: '/sys/area/list',
        method: 'GET'
      }, function (err, res) {
        _this.setData({
          areaList: res.DATA.DATA
        })
        _this.getRegionLabel()
      })
    } catch (e) {

    }
  },
  onLoad: function (routeParams) {
    try {
      this.initArea()
      if (routeParams && routeParams.id) {
        this.setData({
          orderId: routeParams.id,
          role: 12 // app.globalData.currentRegisterInfo.role
        }, () => {
          this.init(routeParams.id)
        })
      }
    } catch (e) {}
  },
  getRegionLabel () {
    let arr = []
    if (this.data.region && this.data.areaList.hasOwnProperty('province_list')) {
      let provinceCode = this.data.region.slice(0,2) + '0000'
      let cityCode = this.data.region.slice(0,4) + '00'
      let townCode = this.data.region
      arr.push(this.data.areaList['province_list'][provinceCode])
      arr.push(this.data.areaList['city_list'][cityCode])
      arr.push(this.data.areaList['county_list'][townCode])
    }
    this.setData({
      regionLabel: arr.length ? arr.join(',') : ''
    })
  },
  formatAreaOptions (sourceData) {
    let provinceArr = []
    for (let key in sourceData.province_list) {
      provinceArr.push({
        value: key,
        label: sourceData.province_list[key],
        children: []
      })
    }
    let cityArr = []
    for (let key in sourceData.city_list) {
      cityArr.push({
        value: key,
        label: sourceData.city_list[key]
      })
    }

    for (let i = 0; i < provinceArr.length; i++) {
      let provinceCode = provinceArr[i].value.slice(0, 2)
      for (let j = 0; j < cityArr.length; j++) {
        if (provinceCode === cityArr[j].value.slice(0, 2)) {
          provinceArr[i].children.push(cityArr[j])
        }
      }
    }
    return provinceArr
  },
  init () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: `/sys/area/list`,
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res.DATA.DATA,
        options: _this.formatAreaOptions(res.DATA.DATA)
      })
      _this.loadData()
    })
  },
  loadData () {
    let _this = this
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
      let result = {
        ...data,
        region: data.townCode,
        townCode: data.townCode,
        cityCode: data.cityCode,
        provinceCode: data.provinceCode,
        offerList: res.offerList.filter(item => {
          return item.offerType === '0'
        }),
        incompleteList: res.incompleteList.filter(item => {
          return item.type === '0'
        }),
        taxRate: taxData[0] ? taxData[0].taxRate : 0,
        amountMoney: taxData[0] ? taxData[0].amountMoney : 0,
        compareList: res.compareList.length ? res.compareList : _this.data.compareList,
        hasTax: data.hasTax ? true : false,
        coinLevel: data.level || 1
      }
      _this.setData(result, () => {
        _this.calculate()
        wx.hideLoading()
      })
    })
  },
  goBack () {
    wx.navigateBack({
      delta: 1
    })
  }
})
