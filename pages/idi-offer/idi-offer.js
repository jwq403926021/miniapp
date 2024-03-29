//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
Page({
  data: {
    orderId: null,
    role: 1,
    statusMap: {
      '20': '已派送',
      '13': '已确认',
      '42': '已中标',
      '37': '待处理人指派比价人员',
      '38': '申请退单',
      '52': '待查勘员审核',
      '53': '查勘员驳回',
      '39': '比价中',
      '51': '待处理人确认',
      '33': '处理人驳回',
      '41': '待报价',
      '43': '报价驳回',
      '36': '待查勘员处理',
      '35': '待施工',
      '50': '已完工待财务处理',
      '11': '已办结'
    },
    activeTab: '1',
    activeNames: ['0'],
    hasTax: true,
    workerText: '',
    offerRemark: '',
    show: false,
    areaList: {},
    regionLabel: '',
    region: '',
    townCode: '',
    cityCode: '',
    provinceCode: '',
    categoryoptions: [],
    handleTypeList: [{
      id: 0,
      name: '更换'
    }, {
      id: 1,
      name: '维修'
    }],
    offerList: [{
      uuid: +new Date(),
      proName: '',
      proId: '1',
      children: [],
      projectTotal: 0
    }],
    incompleteList: [],
    showLibrary: false,
    mainList: ['1', '2', '3'],
    library: {
      insureType: 3,
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
    offerListTotalWorker: 0,
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
    libraryDataList: [],
    operateProIndex: 0,
    operateIndex: 0,
    filterLoading: false,
    active0: true,
    active1: false,
    plateNumber: '',
    reportId : '',
    // --工程量清单
    directionMoney: '',
    manualMoney: '',
    materialMoney: '',
    machineMoney: '',
    manageProfit: '',
    measureMoney: '',
    workMeasureMoney: '',
    subTotal: '',
    subMoney: '',
    pollutionMoney: '',
    insuranceMoney: '',
    fundsMoney: '',
    ruleTotal: '',
    beforeTax: '',
    taxs: '',
    afterTax: '',
    materialA: '',
    workMoney: '',
    templateName: '',
    showTemplate: false,
    searchTemplateName: '',
    templateDataList: [],
    manualMoneyRate: 45,
    materialMoneyRate: 40,
    machineMoneyRate: 15,
    manageProfitRate: 30,
    measureMoneyRate: 100,
    insuranceMoneyRate: 29.41,
    fundsMoneyRate: 1.96,
    taxsRate: 6
  },
  initArea () {
    try {
      let _this = this
      util.request({
        path: '/sys/area/list',
        method: 'GET'
      }, function (err, res) {
        _this.setData({
          areaList: res ? res.DATA.DATA : []
        })
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
  openHandleTypeSheet (e) {
    this.setData({
      operateProIndex: e.currentTarget.dataset.pindex,
      operateIndex: e.currentTarget.dataset.index,
      showHandleTypeSheet: true
    })
  },
  onClose() {
    this.setData({
      showHandleTypeSheet: false
    });
  },
  onSelect(e) {
    let name = e.currentTarget.dataset.name;
    let pindex = this.data.operateProIndex;
    let index = this.data.operateIndex;
    let target = e.currentTarget.dataset.target || 'offerList';
    let nameMap = {}
    if (name == 'project') {
      nameMap[`${target}[${pindex}].children[${index}].projectId`] = e.detail.id
      nameMap[`${target}[${pindex}].children[${index}].projectName`] = e.detail.name
    } else if (name == 'handleType'){
      nameMap[`${target}[${pindex}].children[${index}].handleType`] = e.detail.id
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
    let arr = event.detail
    this.setData({
      activeNames: arr,
      active0: arr.indexOf('0') != -1,
      active1: arr.indexOf('1') != -1
    });
  },
  onSwitchChange (event) {
    this.setData({
      hasTax: event.detail
    }, () => {
      this.calculate()
    })
  },
  openLibrary (e) {
    this.setData({
      operateProIndex: e.currentTarget.dataset.pindex,
      showLibrary: true
    })
  },
  changeStepper (e) {
    let name = e.currentTarget.dataset.name;
    let value = e.detail
    this.setData({
      [name]: value
    }, () => {
      this.calculate(name)
    })
  },
  inputgetName (e) {
    let isStep = e.currentTarget.dataset.step;
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let pindex = e.currentTarget.dataset.pindex;
    let target = e.currentTarget.dataset.target || `offerList`;
    let nameMap = {}
    let value = isStep ? e.detail : e.detail.value
    if (e.currentTarget.dataset.hasOwnProperty('pindex')) {
      if (e.currentTarget.dataset.hasOwnProperty('index')) {
        nameMap[`${target}[${pindex}].children[${index}].${name}`] = value
      } else {
        nameMap[`${target}[${pindex}].${name}`] = value
      }
    } else {
      if (e.currentTarget.dataset.hasOwnProperty('index')) {
        nameMap[`${target}[${index}].${name}`] = value
      } else {
        nameMap[name] = value
      }
    }
    this.setData(nameMap, () => {
      this.calculate(name)
    })
  },
  calculate (name) {
    let offerListTotal = 0
    let _this = this
    this.data.offerList.forEach(project => {
      let projectTotal = 0
      project.children.forEach(item => {
        let total = (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        item.itemTotal = total
        projectTotal += total
        offerListTotal += total
      })
      project.projectTotal = projectTotal
    })
    offerListTotal = parseFloat(offerListTotal.toFixed(2))

    let incompleteTotal = 0
    this.data.incompleteList.forEach(item => {
      let total = (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      item.itemTotal = total
      incompleteTotal += total
    })
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))

    let amountMoney =  offerListTotal - incompleteTotal
    let tax = (parseFloat(this.data.taxRate) / 100 * amountMoney).toFixed(2)

    let offerResult = (this.data.hasTax && this.data.hasTax == '1') ? (amountMoney + parseFloat(tax)) : (amountMoney)
    let coinNum = (this.data.offerListTotal != offerListTotal || this.data.incompleteTotal != incompleteTotal) ? amountMoney : this.data.coinNum

    let compareList = this.data.compareList.map(item => {
      item.offer = (offerListTotal * parseFloat(item.rate || 0)).toFixed(2)
      return item
    })
    let coinInsert = Math.round(coinNum * parseFloat(this.data.coinRate) * parseFloat(this.data.coinLevel))
    this.setData({
      amountMoney: (amountMoney || 0).toFixed(2),
      coinInsert: (coinInsert || 0).toFixed(2),
      tax: (tax || 0),
      offerListTotal: (offerListTotal || 0).toFixed(2),
      incompleteTotal: (incompleteTotal || 0).toFixed(2),
      offerResult: (offerResult || 0).toFixed(2),
      coinNum: parseFloat(coinNum || 0).toFixed(2),
      compareList,
      offerList: this.data.offerList
    }, () => {
      _this.calculateBook()
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
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    let _this = this
    util.request({
      path: `/app/businessmaintype/getMainByInsure`,
      method: 'GET',
      data: {
        insureType: '3'
      }
    }, function (err, res) {
      let data = res.data || []
      _this.mainSource = data
      _this.setData({
        mainList: data.map(item => item.name)
      })
    })

    util.request({
      path: `/sys/area/list`,
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res ? res.DATA.DATA : [],
        options: _this.formatAreaOptions(res.DATA.DATA)
      })
      _this.loadData()
    })
  },
  loadData () {
    let _this = this
    util.request({
      path: `/app/businessinsuranceidi/idiPriceDetail`,
      method: 'GET',
      data: {
        flowId: _this.data.orderId
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
      let offerList = [{
        uuid: +new Date(),
        proName: '',
        proId: '1',
        children: [],
        projectTotal: 0
      }]
      let list = res.offerList.filter(item => {
        if (_this.data.role === 12) {
          return item.offerType === '1'
        } else {
          return item.offerType === '0'
        }
      })
      let list2 = res.offerList.filter(item => {
        return item.offerType === '1'
      })
      let idiList = res.idiList.find(item => {
        if (_this.data.role === 12) {
          return item.type === 1
        } else {
          return item.type === 0
        }
      })

      if (idiList) {
      }
      if (list.length > 0) {
        list.forEach(item => {
          offerList[0].children.push(item)
        })
      }
      let offerListTotalWorker = 0
      if (list2.length > 0) {
        list.forEach(item => {
          offerListTotalWorker += (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        })
      }

      let result = {
        isAllowEdit: (_this.data.role == 12 && (data.status == 43 || data.status == 42)) || (_this.data.role == 13 && data.status == 41),
        ...data,
        offerList: offerList,
        incompleteList: res.incompleteList.filter(item => {
          if (_this.data.role === 12) {
            return item.type === '1'
          } else {
            return item.type === '0'
          }
        }),
        taxRate: taxData[0] ? taxData[0].taxRate : 0,
        amountMoney: taxData[0] ? taxData[0].amountMoney : 0,
        compareList: res.compareList ? res.compareList : _this.data.compareList,
        hasTax: (data.hasTax && data.hasTax == '1') ? true : false,
        coinLevel: data.level || 1,
        offerListTotalWorker: offerListTotalWorker || 0
      }
      _this.setData(result, () => {
        _this.getRegionLabel()
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
    if (value == 'childId') {
      this.changeSubCategory(this[source][e.detail.value].id)
    }
  },
  changeParentCategory (value) {
    let _this = this
    this.setData({
      'library.childId': '',
      'library.childName': '',
      'library.projectId': '',
      'library.projectName': '',
      childList: [],
      projectPickerList: []
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
  changeSubCategory (value) {
    let _this = this
    this.setData({
      'library.projectId': '',
      'library.projectName': '',
      projectPickerList: []
    })
    util.request({
      path: `/app/businessprojecttype/getProjectType`,
      method: 'GET',
      data: {
        childId: value
      }
    }, function (err, res) {
      let data = res.data || []
      _this.projectSource = data
      _this.setData({
        projectPickerList: data.map(item => item.name)
      })
    })
  },
  filter () {
    let _this = this
    this.setData({
      filterLoading: true
    })
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
      _this.setData({
        libraryDataList: res.page.records,
        filterLoading: false
      })
    })
  },
  addToOfferList (e) {
    let index = e.currentTarget.dataset.index;
    let pindex= this.data.operateProIndex;
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
      handleType = '1',
      custom = false
    } = this.data.libraryDataList[index]
    this.data.offerList[pindex].children.push({
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
      price: this.data.role == 12 ? '' : price,
      num,
      remark: '',
      handleType,
      custom
    })
    this.setData({
      libraryDataList: this.data.libraryDataList,
      offerList: this.data.offerList
    }, () => {
      this.calculate()
      wx.showToast({
        mask: true,
        title: '追加成功',
        icon: 'none',
        duration: 500
      })
    })
  },
  resetFilter () {
    this.setData({
      library: {
        insureType: 3,
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
    let pindex = e.currentTarget.dataset.pindex;
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
    } = this.data.offerList[pindex].children[index]
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
      num,
      proName: this.data.offerList[pindex].proName,
      proId: this.data.offerList[pindex].proId,
      remark: ''
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
    let pindex = e.currentTarget.dataset.pindex;
    let index = e.currentTarget.dataset.index;
    this.data.offerList[pindex].children.splice(index, 1)
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
  checkOfferListItem () {
    let result = true
    let list = this.data.offerList
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].children.length; j++) {
        let item = list[i].children[j]
        if (item.name === null || item.name === '' ||
          item.unit === null || item.unit === '' ||
          item.price === null || item.price === '' ||
          item.num === null || item.num === '') {
          result = false
          break
        }
      }
    }
    return result
  },
  submitOfferByWorker (e) {
    let _this = this
    let save = e.currentTarget.dataset.save
    this.data.offerList.map(item => {
      item.orderId = this.data.orderId
      item.offerType = this.data.role == 12 ? 1 : 0
      item.incompleteList = []
    })
    this.data.incompleteList.map(item => {
      item.orderId = this.data.orderId
      item.type = this.data.role == 12 ? 1 : 0
      let proIndex = this.data.offerList.findIndex(ll => ll.proId === item.proId)
      this.data.offerList[proIndex].incompleteList.push(item)
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
      businessIdiPriceEntity: {
        orderId: this.data.orderId,
        directionMoney: this.data.directionMoney,
        manualMoney: this.data.manualMoney,
        materialMoney: this.data.materialMoney,
        machineMoney: this.data.machineMoney,
        manageProfit: this.data.manageProfit,
        measureMoney: this.data.measureMoney,
        workMeasureMoney: this.data.workMeasureMoney,
        subTotal: this.data.subTotal,
        subMoney: this.data.subMoney,
        pollutionMoney: this.data.pollutionMoney,
        insuranceMoney: this.data.insuranceMoney,
        fundsMoney: this.data.fundsMoney,
        ruleTotal: this.data.ruleTotal,
        beforeTax: this.data.beforeTax,
        tax: this.data.taxs,
        afterTax: this.data.afterTax,
        materialA: this.data.materialA,
        workMoney: this.data.workMoney,
        type: 1
      }
    }
    if (this.data.offerList.filter(item => item.proName === '' || item.proName === null).length > 0) {
      wx.showToast({
        mask: true,
        title: '请填写工程项目名称',
        icon: 'none',
        duration: 1000
      })
      return
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
    if (!this.checkOfferListItem()) {
      wx.showToast({
        mask: true,
        title: '请填写所有报价条目的 名称 单价 单位 数量.',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.hasTax && (this.data.taxRate == '' || this.data.taxRate == 0)) {
      wx.showToast({
        mask: true,
        title: '请填写税率',
        icon: 'none',
        duration: 500
      })
      return
    }
    if (this.data.workMoney && (this.data.workMoney == '' || Number(this.data.workMoney) == 0)) {
      wx.showToast({
        mask: true,
        title: '请填写工程报价书',
        icon: 'none',
        duration: 500
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: save == 0 ? '/app/businessinsuranceidi/workerPriceSave' : '/app/businessinsuranceidi/workerPriceCommit',
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
            wx.navigateTo({
              url: '../idi-form/idi-form?id=' + _this.data.orderId,
              success: function(res) {
                res.eventChannel.emit('reload')
              }
            })
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
      item.incompleteList = []
    })
    this.data.incompleteList.map(item => {
      item.orderId = this.data.orderId
      item.type = this.data.role == 12 ? 1 : 0
      let proIndex = this.data.offerList.findIndex(ll => ll.proId === item.proId)
      this.data.offerList[proIndex].incompleteList.push(item)
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
      offerListTotalWorker: this.data.offerListTotalWorker, // 报价列表合计
      incompleteTotal: this.data.incompleteTotal, // 残值合计
      hasTax: this.data.hasTax ? '1' : '0', // 是否有税
      compareList: this.data.compareList,
      coinNum: this.data.coinNum,
      coinRate: this.data.coinRate,
      reward: this.data.coinInsert,
      workerText: this.data.workerText,
      offerRemark: this.data.offerRemark,
      customerUser: this.data.customerUser,
      handlingType: this.data.handlingType,
      workerId: this.data.workerId,
      surveyId: this.data.surveyId,
      businessIdiPriceEntity: {
        orderId: this.data.orderId,
        directionMoney: this.data.directionMoney,
        manualMoney: this.data.manualMoney,
        materialMoney: this.data.materialMoney,
        machineMoney: this.data.machineMoney,
        manageProfit: this.data.manageProfit,
        measureMoney: this.data.measureMoney,
        workMeasureMoney: this.data.workMeasureMoney,
        subTotal: this.data.subTotal,
        subMoney: this.data.subMoney,
        pollutionMoney: this.data.pollutionMoney,
        insuranceMoney: this.data.insuranceMoney,
        fundsMoney: this.data.fundsMoney,
        ruleTotal: this.data.ruleTotal,
        beforeTax: this.data.beforeTax,
        tax: this.data.taxs,
        afterTax: this.data.afterTax,
        materialA: this.data.materialA,
        workMoney: this.data.workMoney,
        type: 0
      }
    }
    if (this.data.offerList.filter(item => item.proName === '' || item.proName === null).length > 0) {
      wx.showToast({
        mask: true,
        title: '请填写工程项目名称',
        icon: 'none',
        duration: 1000
      })
      return
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
    if (!this.checkOfferListItem()) {
      wx.showToast({
        mask: true,
        title: '请填写所有报价条目的 名称 单价 单位 数量.',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.hasTax && (this.data.taxRate == '' || this.data.taxRate == 0)) {
      wx.showToast({
        mask: true,
        title: '请填写税率',
        icon: 'none',
        duration: 500
      })
      return
    }
    if (this.data.workMoney && (this.data.workMoney == '' || Number(this.data.workMoney) == 0)) {
      wx.showToast({
        mask: true,
        title: '请填写工程报价书',
        icon: 'none',
        duration: 500
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: save == 0 ? '/app/businessinsuranceidi/offerPriceSave' : '/app/businessinsuranceidi/offerPriceCommit',
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
      path: '/app/businessinsuranceidi/offerPriceReject',
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
  },
  removeProjectItem (e) {
    let index = e.currentTarget.dataset.index
    this.data.offerList.splice(index, 1)
    this.setData({
      offerList: this.data.offerList
    }, () => {
      this.calculate()
    })
  },
  addCustomItem (e) {
    this.data.offerList[this.data.operateProIndex].children.push({
      'id': '',
      'name': '',
      'num': 1,
      'mainId': this.data.library.mainId || '',
      'childId': this.data.library.childId || '',
      'mainName': this.data.library.mainName || '',
      'childName': this.data.library.childName || '',
      'custom': true,
      'insureType': 3,
      'insureName': 'IDI',
      'projectId': this.data.library.projectId || '',
      'projectName': this.data.library.projectName || '',
      'unit': '',
      'price': '',
      'maxPrice': '',
      'minPrice': '',
      'remark': '',
      'status': 1,
      'createTime': null,
      'updateTime': null,
      'createId': null,
      'updateId': null,
      'province': this.data.provinceCode,
      'city': this.data.cityCode,
      'handleType': '1'
    })
    this.setData({
      offerList: this.data.offerList
    }, () => {
      wx.showToast({
        mask: true,
        title: '追加成功',
        icon: 'none',
        duration: 500
      })
    })
  },
  addToLibrary (e) {
    let pindex = e.currentTarget.dataset.pindex;
    let index = e.currentTarget.dataset.index;
    let data = this.data.offerList[pindex].children[index]

    if (data.mainName == '' || data.childName == '' || data.unit == '' || data.price == '' || data.name == '' || data.projectId == '' ||
        data.mainName == null || data.childName == null || data.unit == null || data.price == null || data.name == null || data.projectId == null) {
      wx.showToast({
        mask: true,
        title: '大类 小类 子类 单位 单价 名称不能为空。',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    util.request({
      path: `/app/businessdamagenew/insertPrice`,
      method: 'POST',
      data: data
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
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
  calculateBook () {
    let data = this.data
    let one = Number(data.offerResult)
    let two = Number(data.offerResult) * (data.manualMoneyRate / 100)
    let three = Number(data.offerResult) * (data.materialMoneyRate / 100)
    let four = Number(data.offerResult) * (data.machineMoneyRate / 100)
    let five = Number(two) * (data.manageProfitRate / 100)
    let six = (one + five) * (data.measureMoneyRate / 100)
    let eight = one + five + six + Number(data['workMeasureMoney'])
    let eleven = Number(two) * (data.insuranceMoneyRate / 100)
    let twelve = Number(two) * (data.fundsMoneyRate / 100)
    let thirteen = Number(data['pollutionMoney']) + eleven + twelve
    let fifteen = (eight + Number(data['subMoney']) + thirteen + Number(data['beforeTax'])) * (data.taxsRate / 100)
    let eighteen = eight + Number(data['subMoney']) + thirteen + Number(data['beforeTax']) + fifteen + Number(data['afterTax']) + Number(data['materialA'])
    this.setData({
      directionMoney: one.toFixed(2),
      manualMoney: two.toFixed(2),
      materialMoney: three.toFixed(2),
      machineMoney: four.toFixed(2),
      manageProfit: five.toFixed(2),
      measureMoney: six.toFixed(2),
      subTotal: eight.toFixed(2),
      insuranceMoney: eleven.toFixed(2),
      fundsMoney: twelve.toFixed(2),
      ruleTotal: thirteen.toFixed(2),
      taxs: fifteen.toFixed(2),
      workMoney: eighteen.toFixed(2)
    })
  },
  inputChange (e) {
    let that = this
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail.value
    this.setData(nameMap, () => {
      that.calculateBook()
    })
  },
  importTemplate (e) {
    let that = this
    let id = this.data.templateDataList[e.currentTarget.dataset.index].id
    util.request({
      path: `/app/businesspricetemplate/info/${id}`,
      method: 'GET'
    }, function (err, res) {
      let key = `offerList[${that.currentPindex}].children`
      let data = res.businessPriceTemplate.detailList || []
      that.setData({
        filterLoading: false,
        [key]: data.map(i => {
          return {
            'name': i.name,
            'num': 1,
            'mainId': i.mainId,
            'childId': i.childId,
            'mainName': i.mainName,
            'childName': i.childName,
            'insureType': 3,
            'insureName': 'IDI',
            'projectId': i.projectId,
            'projectName': i.projectName,
            'unit': i.unit,
            'price': i.price,
            'remark': i.remark,
            'status': 1
          }
        })
      }, () => {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
      })
    })

  },
  showImportTemplate (e) {
    this.currentPindex = e.currentTarget.dataset.pindex
    this.setData({
      showTemplate: true
    })
  },
  saveAsTemplate (e) {
    let that = this
    let pindex = e.currentTarget.dataset.pindex
    util.request({
      path: '/app/businesspricetemplate/save',
      method: 'POST',
      data: {
        templateName: that.data.templateName,
        orderType: 3,
        status: 1,
        detailList: that.data.offerList[pindex].children.map(item => {
          return {
            // id: item.id,
            // templateId: item.templateId,
            mainName: item.mainName,
            mainId: item.mainId,
            childName: item.childName,
            childId: item.childId,
            projectName: item.projectName,
            projectId: item.projectId,
            name: item.name,
            remark: item.remark,
            price: item.price,
            unit: item.unit
          }
        })
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
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
  filterTemplate () {
    let _this = this
    this.setData({
      filterLoading: true
    })
    let params = {
      'page': 1,
      'size': 20,
      'status': 1,
      'orderType': 3
    }
    if (this.data.templateName) {
      params.name = this.data.templateName
    }
    util.request({
      path: '/app/businesspricetemplate/list',
      method: 'GET',
      data: params
    }, function (err, res) {
      _this.setData({
        templateDataList: res.data.records || [],
        filterLoading: false
      })
    })
  },
  resetTemplateFilter () {
    this.setData({
      searchTemplateName: '',
      templateDataList: []
    }, () => {
      this.filterTemplate()
    })
  },
  closeTemplateFilter () {
    this.resetTemplateFilter()
    this.setData({
      showTemplate: false
    })
  }
})
