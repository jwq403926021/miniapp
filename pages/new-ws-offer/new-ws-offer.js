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
    offerRemark: ''
  },
  onLoad: function (routeParams) {
    try {
      if (routeParams && routeParams.id) {
        this.setData({
          orderId: routeParams.id,
          role: app.globalData.currentRegisterInfo.role
        })
        this.init(routeParams.id)
      }
    } catch (e) {}
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
  inputgetName (e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    if (name.indexOf('.')) {
      let nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
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
      _this.setData({
        categoryoptions: res.data
      })
    })

    util.request({
      path: `/app/businessprojecttype/getProjectType`,
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        projectList: res.data
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
        id: _this.data.orderId
      }
    }, function (err, res) {
      console.log(res)
    })
  }
})
