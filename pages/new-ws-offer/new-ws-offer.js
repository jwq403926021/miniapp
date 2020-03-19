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
    categoryoptions: [],
    projectList: [],
    handleTypeList: [{
      id: 0,
      name: '更换'
    }, {
      id: 1,
      name: '维修'
    }],
    offerList: [],
    incompleteList: [],
    showProjectSheet: false,
    showLibrary: false,
    mainList: ['1', '2', '3'],
    library: {
      insureType: 1,
      status: 1,
      name: '',
      mainId: '',
      mainName: '',
      childId: '',
      childName: '',
      projectId: '',
      projectName: ''
    },
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
    workerId: '',
    surveyId: '',
    handlingType: '',
    customerUser: '',
    libraryDataList: []
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
  openProjectSheet (e) {
    this.setData({
      operateIndex: e.currentTarget.dataset.index,
      showProjectSheet: true
    })
  },
  openHandleTypeSheet (e) {
    this.setData({
      operateIndex: e.currentTarget.dataset.index,
      showHandleTypeSheet: true
    })
  },
  onClose() {
    this.setData({
      showProjectSheet: false,
      showHandleTypeSheet: false
    });
  },
  onSelect(e) {
    let name = e.currentTarget.dataset.name;
    let index = this.data.operateIndex;
    let target = e.currentTarget.dataset.target || 'offerList';
    let nameMap = {}
    if (name == 'project') {
      nameMap[`${target}[${index}].projectId`] = e.detail.id
      nameMap[`${target}[${index}].projectName`] = e.detail.name
    } else {
      nameMap[`${target}[${index}].handleType`] = e.detail.id
    }
    this.setData(nameMap)
    this.onClose()
  },
  openLocation() {
    this.setData({
      show: !this.show
    })
  },
  onConfirm(data) {
    let strArr = []
    data.detail.values.forEach(item => {
      strArr.push(item.name)
    })

    this.setData({
      show: false,
      offerList: [],
      incompleteList: [],
      region: data.detail.values[2].code,
      regionLabel: strArr.join(','),
      townCode: data.detail.values[2].code,
      cityCode: data.detail.values[1].code,
      provinceCode: data.detail.values[0].code,
    })
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  onChange (event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onSwitchChange (event) {
    this.setData({
      hasTax: event.detail
    })
  },
  openLibrary () {
    this.setData({
      showLibrary: true
    })
  },
  inputgetName (e) {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let target = e.currentTarget.dataset.target || 'offerList';
    let nameMap = {}
    if (e.currentTarget.dataset.hasOwnProperty('index')) {
      nameMap[`${target}[${index}].${name}`] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    this.setData(nameMap, () => {
      this.calculate(name)
    })
  },
  calculate (name) {
    let offerListTotal = 0
    this.data.offerList.forEach(item => {
      offerListTotal += (parseFloat(item.price || 0) * parseFloat(item.num || 0))
    })
    offerListTotal = parseFloat(offerListTotal.toFixed(2))

    let incompleteTotal = 0
    this.data.incompleteList.forEach(item => {
      incompleteTotal += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
    })
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))

    let tax = parseFloat(this.data.taxRate) * parseFloat(this.data.amountMoney)

    let offerResult = this.data.hasTax ? Math.round((offerListTotal + incompleteTotal) * tax) : Math.round(offerListTotal + incompleteTotal)
    let coinNum = (this.data.offerListTotal != offerListTotal || this.data.incompleteTotal != incompleteTotal) ? (offerListTotal - incompleteTotal) : this.data.coinNum

    let compareList = this.data.compareList.map(item => {
      item.offer = offerListTotal * parseFloat(item.rate || 0)
      return item
    })
    let coinInsert = Math.round(coinNum * parseFloat(this.data.coinRate) * parseFloat(this.data.coinLevel))
    this.setData({
      coinInsert,
      tax,
      offerListTotal,
      incompleteTotal,
      offerResult,
      coinNum,
      compareList
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
      path: `/app/businessmaintype/getMainByInsure`,
      method: 'GET',
      data: {
        insureType: '1'
      }
    }, function (err, res) {
      let data = res.data || []
      _this.mainSource = data
      _this.setData({
        mainList: data.map(item => item.name)
      })
    })

    util.request({
      path: `/app/businessprojecttype/getProjectType`,
      method: 'GET'
    }, function (err, res) {
      let data = res.data || []
      _this.projectSource = data
      _this.setData({
        projectList: data,
        projectPickerList: data.map(item => item.name)
      })
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
      console.log(_this.data.role, data.status)
      let result = {
        isAllowEdit: (_this.data.role == 12 && (data.status == 13 || data.status == 43)) || (_this.data.role == 13 && data.status == 41),
        ...data,
        region: data.townCode,
        offerList: res.offerList.filter(item => {
          if (_this.data.role === 12) {
            return item.offerType === '1'
          } else {
            return item.offerType === '0'
          }
        }),
        incompleteList: res.incompleteList.filter(item => {
          if (_this.data.role === 12) {
            return item.type === '1'
          } else {
            return item.type === '0'
          }
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
  pickerChange (e) {
    let value = e.currentTarget.dataset.value;
    let label = e.currentTarget.dataset.label;
    let source = e.currentTarget.dataset.source;
    let map = {}
    map[`library.${value}`] = this[source][e.detail.value].id
    map[`library.${label}`] = this[source][e.detail.value].name
    this.setData(map)
    if (value == 'mainId') {
      this.changeParentCategory(this[source][e.detail.value].id)
    }
  },
  changeParentCategory (value) {
    let _this = this
    this.setData({
      'library.childId': '',
      'library.childName': ''
    })
    util.request({
      path: '/app/businesschildtype/getChildByMain',
      method: 'GET',
      data: {
        mainId: value
      }
    }, function (err, res) {
      let data = res.data || []
      _this.childSource = data
      _this.setData({
        childList: data.map(item => item.name)
      })
    })
  },
  filter () {
    let _this = this
    util.request({
      path: '/app/businessprice/list',
      method: 'GET',
      data: {
        ..._this.data.library,
        province: _this.data.provinceCode,
        city: _this.data.cityCode,
        page: 1,
        limit: 20
      }
    }, function (err, res) {
      res.page.records.forEach(i => {
        i.disabled = _this.data.offerList.findIndex(item => i.id === item.id) != -1
      })
      _this.setData({
        libraryDataList: res.page.records
      })
    })
  },
  addToOfferList (e) {
    let index = e.currentTarget.dataset.index;
    let {
      id,
      mainName,
      mainId,
      childId,
      childName,
      projectName,
      projectId,
      minPrice,
      maxPrice,
      avgPrice,
      name,
      unit,
      price,
      num = 1,
      handleType = '1'
    } = this.data.libraryDataList[index]
    this.data.libraryDataList[index].disabled = true
    let arr = [...this.data.offerList]
    arr.push({
      id,
      mainName,
      mainId,
      childId,
      childName,
      projectName,
      projectId,
      minPrice,
      maxPrice,
      avgPrice,
      name,
      unit,
      price: this.data.role == 12 ? 0 : price,
      num,
      remark: '',
      handleType
    })
    this.setData({
      libraryDataList: this.data.libraryDataList,
      offerList: arr
    }, () => {
      this.calculate()
    })
  },
  resetFilter () {
    this.setData({
      library: {
        insureType: 1,
        status: 1,
        name: '',
        mainId: '',
        mainName: '',
        childId: '',
        childName: '',
        projectId: '',
        projectName: ''
      },
      libraryDataList: []
    })
  },
  closeFilter () {
    this.resetFilter()
    this.setData({
      showLibrary: false
    })
  },
  addIncomplete (e) {
    let index = e.currentTarget.dataset.index;
    let {
      id,
      mainName,
      mainId,
      childId,
      childName,
      projectName,
      projectId,
      name,
      unit,
      price,
      num = 1
    } = this.data.offerList[index]
    let arr = this.data.incompleteList
    arr.push({
      id,
      mainName,
      mainId,
      childId,
      childName,
      projectName,
      projectId,
      name,
      unit,
      unitPrice: price,
      num
    })
    this.setData({
      incompleteList: arr
    }, () => {
      this.calculate()
    })
    wx.showToast({
      mask: true,
      title: '追加成功',
      icon: 'none',
      duration: 1000
    })
  },
  removeOfferList (e) {
    let index = e.currentTarget.dataset.index;
    this.data.offerList.splice(index, 1)
    this.setData({
      offerList: this.data.offerList
    }, () => {
      this.calculate()
    })
  },
  removeIncomplete (e) {
    let index = e.currentTarget.dataset.index;
    this.data.incompleteList.splice(index, 1)
    this.setData({
      incompleteList: this.data.incompleteList
    }, () => {
      this.calculate()
    })
  },
  goBack () {
    wx.navigateBack({
      delta: 1
    })
  },
  submitOfferByWorker (e) {
    let _this = this
    let save = e.currentTarget.dataset.save
    this.data.offerList.map(item => {
      item.orderId = this.data.orderId
      item.offerType = this.data.role == 12 ? 1 : 0
    })
    this.data.incompleteList.map(item => {
      item.orderId = this.data.orderId
      item.type = this.data.role == 12 ? 1 : 0
    })
    let params = {
      orderId: this.data.orderId,
      provinceCode: this.data.provinceCode,
      cityCode: this.data.cityCode,
      offerList: this.data.offerList, // 报价列表
      incompleteList: this.data.incompleteList, // 残值列表
      taxRate: this.data.taxRate, // 税率
      amountMoney: this.data.amountMoney, // 税金额
      tax: this.data.tax, // 税额
      offerResult: this.data.offerResult, // 报价合计
      offerListTotal: this.data.offerListTotal, // 报价列表合计
      incompleteTotal: this.data.incompleteTotal, // 残值合计
      hasTax: this.data.hasTax ? '1' : '0' // 是否有税
    }
    if (!this.data.offerList.length) {
      wx.showToast({
        mask: true,
        title: '请填写报价信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: save == 0 ? '/app/businessdamagenew/workerPriceSave' : '/app/businessdamagenew/workerPriceCommit',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
            _this.goBack()
          }
        })
      } else {
        wx.showToast({
          mask: true,
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  submitOfferByOffer (e) {
    let _this = this
    let save = e.currentTarget.dataset.save
    this.data.offerList.map(item => {
      item.orderId = this.data.orderId
      item.offerType = this.data.role == 12 ? 1 : 0
    })
    this.data.incompleteList.map(item => {
      item.orderId = this.data.orderId
      item.type = this.data.role == 12 ? 1 : 0
    })
    this.data.compareList.map((item, index) => {
      item.type = this.data.role == 12 ? 1 : 0
      item.offer = item.rate * this.data.offerListTotal
      item.orderId = this.data.orderId
    })
    let params = {
      orderId: this.data.orderId,
      provinceCode: this.data.provinceCode,
      cityCode: this.data.cityCode,
      offerList: this.data.offerList, // 报价列表
      incompleteList: this.data.incompleteList, // 残值列表
      taxRate: this.data.taxRate, // 税率
      amountMoney: this.data.amountMoney, // 税金额
      tax: this.data.tax, // 税额
      offerResult: this.data.offerResult, // 报价合计
      offerListTotal: this.data.offerListTotal, // 报价列表合计
      incompleteTotal: this.data.incompleteTotal, // 残值合计
      hasTax: this.data.hasTax ? '1' : '0', // 是否有税
      compareList: this.data.compareList,
      coinNum: this.data.coinNum,
      coinRate: this.data.coinRate,
      reward: this.data.coinInsert,
      offerRemark: this.data.offerRemark,
      customerUser: this.data.customerUser,
      handlingType: this.data.handlingType,
      workerId: this.data.workerId,
      surveyId: this.data.surveyId
    }
    if (!this.data.offerList.length) {
      wx.showToast({
        mask: true,
        title: '请填写报价信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: save == 0 ? '/app/businessdamagenew/offerPriceSave' : '/app/businessdamagenew/offerPriceCommit',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
            _this.goBack()
          }
        })
      } else {
        wx.showToast({
          mask: true,
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  reject () {
    let _this = this
    if (this.data.offerRemark === '' || this.data.offerRemark == null) {
      wx.showToast({
        mask: true,
        title: '报价意见不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagenew/offerPriceReject',
      method: 'POST',
      data: {
        orderId: _this.data.orderId,
        offerRemark: _this.data.offerRemark,
        workerId: _this.data.workerId,
        customerUser: _this.data.customerUser
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
            _this.goBack()
          }
        })
      } else {
        wx.showToast({
          mask: true,
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})
