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
    offerList: [{
      id: '',
      mainName: '',
      mainId: '',
      childId: '',
      childName: '',
      projectName: '',
      projectId: '',
      minPrice: '',
      maxPrice: '',
      avgPrice: '',
      name: '',
      unit: '',
      price: '',
      num: '',
      handleType: '',
      remark: ''
    }],
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
    }
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
      _this.setData({
        projectList: res.data || []
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
      console.log(res)
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
  }
})
