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
    activeNames: [],
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
    projectListSource: [],
    projectList: [],
    projectValue: '',
    projectLabel: '',
    offerListSource: [],
    incompleteListSource: []
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
          role: app.globalData.currentRegisterInfo.role
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
      let projectListSource = [{
        proName: '总计',
        proId: '-999999999',
      }]
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
              children: [item],
              projectTotal: 0
            })
            projectListSource.push({
              proName: item.proName,
              proId: item.proId,
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
        region: data.townCode,
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
        hasTax: data.hasTax ? true : false,
        coinLevel: data.level || 1,
        projectListSource: projectListSource,
        projectList: projectListSource.map(item => item.proName),
        projectValue: 0,
        projectLabel: projectListSource[0].proName,
      }
      _this.setData(result, () => {
        _this.calculate()
        wx.hideLoading()
      })
    })
  },
  projectChange (event) {
    this.setData({
      'projectValue': event.detail.value,
      'projectLabel': this.data.projectListSource[event.detail.value].proName
    }, () => {
      this.calculate()
    })
  },
  calculate (name) {
    let _this = this
    let offerList = this.data.projectValue == 0 ? this.data.offerListSource : this.data.offerListSource.filter(item => item.proId == _this.data.projectListSource[_this.data.projectValue].proId)
    let incompleteList = this.data.projectValue == 0 ? this.data.incompleteListSource : this.data.incompleteListSource.filter(item => item.proId == _this.data.projectListSource[_this.data.projectValue].proId)
    let offerListTotal = 0
    offerList.forEach(project => {
      let projectTotal = 0
      project.children.forEach(item => {
        projectTotal += (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        offerListTotal += (parseFloat(item.price || 0) * parseFloat(item.num || 0))
      })
      project.projectTotal = projectTotal
    })
    offerListTotal = parseFloat(offerListTotal.toFixed(2))

    let incompleteTotal = 0
    incompleteList.forEach(item => {
      incompleteTotal += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
    })
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))

    let amountMoney =  offerListTotal - incompleteTotal
    let tax = parseFloat(this.data.taxRate) / 100 * amountMoney

    let offerResult = this.data.hasTax ? Math.round(amountMoney + tax) : Math.round(amountMoney)

    this.setData({
      amountMoney,
      tax,
      offerListTotal,
      incompleteTotal,
      offerResult,
      offerList: offerList
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
