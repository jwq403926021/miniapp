//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
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
    countryId: '',
    cityId: '',
    provinceId: '',
    looserList: [],
    losserValue: '',
    losserLabel: '',
    workerValue: '',
    workerLabel: '',
    workerList: [],
    customerName: '',
    customerPhone: '',
    losserText: '',
    investigatorText: ''
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        type: routeParams.type,
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initReassignListForCitymanger () {
    let _this = this
    util.request({
      path: `/app/family/getWorkerByCity?city=${this.data.cityId}`,
      method: 'GET'
    }, function (err, res) {
      if (res) {
        _this.workListSource = res.data
        let workerList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          'workerList': workerList
        })
      }
    })
  },
  workerChange (event) {
    this.setData({
      'workerValue': event.detail.value,
      'workerLabel': this.workListSource[event.detail.value].name
    })
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/family/orders/${id}`,
      method: 'GET'
    }, function (err, res) {
      let data = res.data
      _this.setData({
        id: data.flowId,
        status: data.status,
        countryId: data.areaCountryId,
        cityId: data.areaCityId,
        provinceId: data.areaProvinceId,
        region: data.areaCountryId + '',
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        losserText: data.losserText,
        investigatorText: data.investigatorText
      }, () => {
        _this.getRegionLabel()
        if (_this.data.type == 1) {
          _this.getLosserList()
        }
        if (_this.data.type == 2) {
          _this.initReassignListForCitymanger()
        }
      })
    })
  },
  losserChange (event) {
    this.setData({
      'losserValue': event.detail.value,
      'losserLabel': this.losserListSource[event.detail.value].name
    })
  },
  getLosserList () {
    let _this = this
    util.request({
      path: `/app/family/getLosserByCity?city=${_this.data.cityId}`,
      method: 'GET'
    }, function (err, res) {
      _this.losserListSource = res.data || []
      let losserList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      _this.setData({
        'losserList': losserList,
        'losserValue': 0,
        'losserLabel': _this.losserListSource.length > 0 ? _this.losserListSource[0].name : ''
      })
    })
  },
  initArea () {
    let _this = this
    util.request({
      path: '/sys/area/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res ? res.DATA.DATA : []
      })
    })
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
  openLocation() {
    this.setData({
      show: !this.show
    })
  },
  onConfirm(data) {
    let _this = this
    let strArr = []
    data.detail.values.forEach(item => {
      strArr.push(item.name)
    })

    this.setData({
      show: false,
      region: data.detail.values[2].code,
      regionLabel: strArr.join(','),
      countryId: data.detail.values[2].code,
      cityId: data.detail.values[1].code,
      provinceId: data.detail.values[0].code,
    }, () => {
      if (_this.data.type == 1) {
        _this.getLosserList()
      }
      if (_this.data.type == 2) {
        _this.initReassignListForCitymanger()
      }
    })
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail.value
    this.setData(nameMap)
  },
  submitRequest () {
    let _this = this
    let params = {
      flowId: _this.data.id
    }
    let url = ''
    switch (this.data.type) {
      case '1':
        url = '/app/family/updateLosser'
        params.losserId = _this.losserListSource[_this.data.losserValue]['user_id']
        // if (_this.data.losserValue == '' || _this.data.losserValue == null){
        //   wx.showToast({
        //     mask: true,
        //     title: '定损员不能为空',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   return false
        // }
        break
      case '2':
        url = '/app/family/updateWorker'
        params.partnerId = _this.workListSource[_this.data.workerValue]['user_id']
        params.customerPhone = _this.data.customerPhone
        params.customerName = _this.data.customerName
        params.investigatorText = _this.data.investigatorText
        if (_this.data.workerValue == '' || _this.data.workerValue == null){
          wx.showToast({
            mask: true,
            title: '施工人员不能为空',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        break
      case '3':
        url = '/app/family/updateOff'
        params.losserText = _this.data.losserText
        if (_this.data.losserText == '' || _this.data.losserText == null){
          wx.showToast({
            mask: true,
            title: '定损备注不能为空',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        break
      case '4':
        url = '/app/family/updateBasic'
        params.customerPhone = _this.data.customerPhone
        params.customerName = _this.data.customerName
        if (_this.data.customerPhone == '' || _this.data.customerPhone == null || !this.checkPhone(_this.data.customerPhone)){
          wx.showToast({
            mask: true,
            title: '请输入正确的沟通方式',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        break
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url,
      method: 'PUT',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              _this.goToList()
            }, 1000)
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
  checkPhone (str, msg){
    if(!(/^(((0\d{2,3}-){0,1}\d{7,8})|(1[3456789]\d{9}))$/.test(str))){
      return false
    }
    return true
  },
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-jc/my-list-jc'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-jc/my-list-jc'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-jc/my-list-jc'
      })
    }
  }
})
