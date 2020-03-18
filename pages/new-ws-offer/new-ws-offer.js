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
      rate: ''
    }, {
      companyName: '企业2',
      id: 1,
      rate: ''
    }, {
      companyName: '企业3',
      id: 2,
      rate: ''
    }],
    coinNum: '',
    coinRate: '',
    coinLevel: '',
    coinInsert: '',
    workerId: '',
    surveyId: '',
    handlingType: '',
    customerUser: ''
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
        let role = 12 // app.globalData.currentRegisterInfo.role
        this.setData({
          orderId: routeParams.id,
          status: routeParams.status,
          role: role,
          isAllowEdit: (role == 12 && (routeParams.status == 13 || routeParams.status == 43)) || (role == 13 && routeParams.status == 41)
        })
        this.init(routeParams.id)
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
    this.setData(nameMap)
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
        if (this.role === 12) {
          return item.type === '1'
        } else {
          return item.type === '0'
        }
      })
      let result = {
        ...data,
        region: data.townCode,
        offerList: res.offerList.filter(item => {
          if (_this.role === 12) {
            return item.offerType === '1'
          } else {
            return item.offerType === '0'
          }
        }),
        incompleteList: res.incompleteList.filter(item => {
          if (_this.role === 12) {
            return item.type === '1'
          } else {
            return item.type === '0'
          }
        }),
        taxRate: taxData[0] ? taxData[0].taxRate : 0,
        amountMoney: taxData[0] ? taxData[0].amountMoney : 0,
        compareList: res.compareList,
        hasTax: data.hasTax ? '0' : '1'
      }
      _this.setData(result)
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
      console.log(res, '###')
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
      }
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
    })
  },
  removeIncomplete (e) {
    let index = e.currentTarget.dataset.index;
    this.data.incompleteList.splice(index, 1)
    this.setData({
      incompleteList: this.data.incompleteList
    })
  },
  back () {
    wx.navigateBack({
      delta: 1
    })
  },
  submitOfferByWorker (e) {
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
    if (!this.offerList.length) {
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
  submitOfferByOffer (e) {
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
    if (!this.offerList.length) {
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
