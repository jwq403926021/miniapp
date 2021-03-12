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
      '32': '已测漏,待合作商处理',
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
    handleTypeList: [{
      id: 0,
      name: '更换'
    }, {
      id: 1,
      name: '维修'
    }],
    proTypeList: [{
      id: 0,
      name: '赔偿/被保险人'
    }, {
      id: 1,
      name: '施工/被保险人'
    }, {
      id: 2,
      name: '赔偿/三者'
    }, {
      id: 3,
      name: '施工/三者'
    }],
    offerList: [{
      proName: '',
      proId: '',
      proType: 0,
      children: [],
      projectTotal: 0
    }],
    incompleteList: [],
    showLibrary: false,
    mainList: ['1', '2', '3'],
    library: {
      insureType: 2,
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
    computedCateogryTotalPrice: '',
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
    constructionMethod: '',
    isTest: '0',
    testPrice: 0,
    reportId: '',
    investigatorCityCode: ''
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
          role: 8 // app.globalData.currentRegisterInfo.role // 13:报价员 12:施工人员 27:测漏人员 8:客服 22:财务 23:定损员
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
  openProTypeSheet (e) {
    this.setData({
      operateProIndex: e.currentTarget.dataset.pindex,
      showproTypeSheet: true
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
      showHandleTypeSheet: false,
      showproTypeSheet: false
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
    } else if (name == 'proType'){
      nameMap[`${target}[${pindex}].proType`] = e.detail.id
    }
    this.setData(nameMap, () => {
      this.calculate()
    })
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
    let computedCateogryTotalPrice = ''
    let offerListTotal = 0
    let num1 = 0
    let num2 = 0
    let num3 = 0
    let num4 = 0
    this.data.offerList.forEach(project => {
      let projectTotal = 0
      project.children.forEach(item => {
        let total = (parseFloat(item.price || 0) * parseFloat(item.num || 0))
        item.itemTotal = total
        projectTotal += total
        offerListTotal += total
      })
      project.projectTotal = projectTotal
      if (project.proType === 0) {
        num2 += parseInt(project.projectTotal)
        num3 += parseInt(project.projectTotal)
      } else if (project.proType === 1) {
        num1 += parseInt(project.projectTotal)
        num3 += parseInt(project.projectTotal)
      } else if (project.proType === 2) {
        num2 += parseInt(project.projectTotal)
        num4 += parseInt(project.projectTotal)
      } else if (project.proType === 3) {
        num1 += parseInt(project.projectTotal)
        num4 += parseInt(project.projectTotal)
      }
    })
    // num1 += parseFloat(this.data.testPrice || 0)
    // num3 += parseFloat(this.data.testPrice || 0)

    let incompletenum1 = 0
    let incompletenum2 = 0
    let incompletenum3 = 0
    let incompletenum4 = 0
    this.data.incompleteList.forEach(item => {
      if (parseInt(item.proType) === 0) {
        incompletenum2 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        incompletenum3 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      } else if (parseInt(item.proType) === 1) {
        incompletenum1 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        incompletenum3 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      } else if (parseInt(item.proType) === 2) {
        incompletenum2 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        incompletenum4 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      } else if (parseInt(item.proType) === 3) {
        incompletenum1 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
        incompletenum4 += (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      }
    })
    num1 -= incompletenum1
    num2 -= incompletenum2
    num3 -= incompletenum3
    num4 -= incompletenum4

    offerListTotal += parseFloat(this.data.testPrice || 0)
    offerListTotal = parseFloat(offerListTotal.toFixed(2))
    computedCateogryTotalPrice = `支付平台金额：${num1.toFixed(2)} | 支付被保险人金额：${num2.toFixed(2)}<br/>水渍险合计：${num3.toFixed(2)} | 三者险合计：${num4.toFixed(2)} `
    let incompleteTotal = 0
    this.data.incompleteList.forEach(item => {
      let total = (parseFloat(item.unitPrice || 0) * parseFloat(item.num || 0))
      item.itemTotal = total
      incompleteTotal += total
    })
    incompleteTotal = parseFloat(incompleteTotal.toFixed(2))
    let amountMoney =  offerListTotal - incompleteTotal
    let tax = parseFloat(this.data.taxRate) / 100 * amountMoney
    let offerResult = this.data.hasTax ? Math.round(amountMoney + tax) : Math.round(amountMoney)
    let coinNum = (this.data.offerListTotal != offerListTotal || this.data.incompleteTotal != incompleteTotal) ? amountMoney : this.data.coinNum

    let compareList = this.data.compareList.map(item => {
      item.offer = (offerListTotal * parseFloat(item.rate || 0)).toFixed(2)
      return item
    })
    let coinInsert = Math.round(coinNum * parseFloat(this.data.coinRate) * parseFloat(this.data.coinLevel))
    coinInsert = coinInsert < 1 ? 1 : coinInsert
    this.setData({
      computedCateogryTotalPrice: computedCateogryTotalPrice,
      amountMoney: (amountMoney || 0).toFixed(2),
      coinInsert: (coinInsert || 0).toFixed(2),
      tax: (tax || 0).toFixed(2),
      offerListTotal: (offerListTotal || 0).toFixed(2),
      incompleteTotal: (incompleteTotal || 0).toFixed(2),
      offerResult: (offerResult || 0).toFixed(2),
      coinNum: parseFloat(coinNum || 0).toFixed(2),
      compareList,
      offerList: this.data.offerList
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
        insureType: '2'
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
        if (_this.data.role === 12) {
          return item.offerType === '1'
        } else {
          return item.offerType === '0'
        }
      })
      let offerList = []
      if (list.length > 0) {
        list.forEach(item => {
          let proIndex = offerList.findIndex(ll => ll.proType === parseInt(item.proType))
          if (proIndex === -1) {
            offerList.push({
              proName: item.proName,
              proId: item.proId,
              proType: parseInt(item.proType),
              children: [item],
              projectTotal: 0
            })
          } else {
            offerList[proIndex].children.push(item)
          }
        })
      }
      let result = {
        isAllowEdit: (_this.data.role == 12 && (data.status == 32 || data.status == 40 || data.status == 62)) || (_this.data.role == 13 && data.status == 41) || (_this.data.role == 23 && data.status == 51),
        ...data,
        region: data.areaCountry + '',
        townCode: data.areaCountry + '',
        cityCode: data.areaCity + '',
        provinceCode: data.areaProvince + '',
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
        compareList: res.compareList.length ? res.compareList : _this.data.compareList,
        hasTax: (data.hasTax && data.hasTax == '1') ? true : false,
        coinLevel: data.level || 1,
        investigatorCityCode: data.investigatorCityCode || ''
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
        insureType: 2,
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
      proType: this.data.offerList[pindex].proType,
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
      url: '../new-jc-form/new-jc-form?id=' + this.data.orderId
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
    let url = ''
    let save = e.currentTarget.dataset.save
    let isLosser = e.currentTarget.dataset.loss == 1
    this.data.offerList.map(item => {
      item.orderId = this.data.orderId
      item.offerType = this.data.role == 12 ? 1 : 0
      item.incompleteList = []
    })
    this.data.incompleteList.map(item => {
      item.orderId = this.data.orderId
      item.type = this.data.role == 12 ? 1 : 0
      let proIndex = this.data.offerList.findIndex(ll => parseInt(ll.proType) === parseInt(item.proType))
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
      handlingType: this.data.constructionMethod,
      workerId: this.data.workerId,
      surveyId: this.data.investigatorId,
      testPrice: this.data.testPrice
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
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    if (isLosser) {
      url = save == 0 ? '/app/businessinsurancefamilynew/losserPriceSave' : '/app/businessinsurancefamilynew/losserPriceCommit'
    } else {
      url = save == 0 ? '/app/businessinsurancefamilynew/workerPriceSave' : '/app/businessinsurancefamilynew/workerPriceCommit'
    }
    util.request({
      path: url,
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
            wx.navigateBack({
              url: '../new-jc-form/new-jc-form?id=' + _this.data.orderId
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
      let proIndex = this.data.offerList.findIndex(ll => parseInt(ll.proType) === parseInt(item.proType))
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
      incompleteTotal: this.data.incompleteTotal, // 残值合计
      hasTax: this.data.hasTax ? '1' : '0', // 是否有税
      compareList: this.data.compareList,
      coinNum: this.data.coinNum,
      coinRate: this.data.coinRate,
      reward: this.data.coinInsert,
      offerRemark: this.data.offerRemark,
      customerUser: this.data.customerName,
      handlingType: this.data.constructionMethod,
      workerId: this.data.workerId,
      surveyId: this.data.investigatorId,
      testPrice: this.data.testPrice
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
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: save == 0 ? '/app/businessinsurancefamilynew/offerPriceSave' : '/app/businessinsurancefamilynew/offerPriceCommit',
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
      path: '/app/businessinsurancefamilynew/offerPriceReject',
      method: 'POST',
      data: {
        orderId: _this.data.orderId,
        offerRemark: _this.data.offerRemark,
        workerId: _this.data.workerId,
        customerUser: _this.data.customerName
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
  addProjectItem () {
    let arr = this.data.offerList
    arr.push({
      proName: '',
      proId: '',
      proType: 0,
      children: [],
      projectTotal: 0
    })
    this.setData({
      offerList: arr
    }, () => {
      wx.showToast({
        mask: true,
        title: '已追加',
        icon: 'none',
        duration: 500
      })
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
      'insureType': 2,
      'insureName': '家财',
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
      path: `/app/businessinsurancefamilynew/insertPrice`,
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
  }
})
