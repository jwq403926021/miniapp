//获取应用实例
import util from "../../../utils/util";
import common from "../../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    statusMap: {
      '20': '待客服人员处理',
      '21': '客服驳回',
      '22': '已派送',
      '13': '待施工人员报价',
      '39': '比价中',
      '41': '待报价',
      '43': '报价驳回',
      '51': '待核损',
      '33': '核损人驳回',
      '50': '待财务处理',
      '11': '已办结'
    },
    cancelRemark: '',
    customerUser: '',
    customerPhone: '',
    damagedUser: '',
    damagedPhone: '',
    plateNumber: '',
    surveyId: '',
    type: '',
    manageType: '',
    showKeyboard: false,
    insuranceType: ''
  },
  onLoad: function (routeParams) {
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        type: routeParams.type,
        manageType: routeParams.manageType,
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/businessdamagecompare/damageDetail`,
      method: 'GET',
      data: {
        orderId: id
      }
    }, function (err, res) {
      let data = res.data
      _this.setData({
        id: data.orderId,
        status: data.status,
        customerUser: data.customerUser,
        customerPhone: data.customerPhone,
        surveyId: data.surveyId,
        damagedUser: data.damagedUser,
        damagedPhone: data.damagedPhone,
        plateNumber: data.plateNumber,
        insuranceType: data.insuranceType
      })
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
    let url = '/app/businessdamagecompare/updateOff'
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url,
      method: 'PUT',
      data: {
        orderId: _this.data.id,
        cancelRemark: _this.data.cancelRemark,
        customerUser: _this.data.customerUser,
        surveyId: _this.data.surveyId
      }
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
  closePlateNum () {
    this.setData({
      showKeyboard: false
    })
  },
  openPlatePicker () {
    this.setData({
      showKeyboard: true
    })
  },
  setNumber (event) {
    this.setData({
      'plateNumber': event.detail.value
    })
  },
  submitModifyRequest () {
    let _this = this
    let url = '/app/businessdamagecompare/updateBasic'
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url,
      method: 'PUT',
      data: {
        orderId: _this.data.id,
        customerUser: _this.data.customerUser,
        customerPhone: _this.data.customerPhone,
        damagedUser: _this.data.damagedUser,
        damagedPhone: _this.data.damagedPhone,
        plateNumber: _this.data.plateNumber
      }
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
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/new-my-list-ws/new-my-list-ws'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../new-my-list-ws/new-my-list-ws?type=' + this.data.type
      })
    } else {
      wx.redirectTo({
        url: '../new-my-list-ws/new-my-list-ws?type=' + this.data.type
      })
    }
  }
})
