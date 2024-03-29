//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
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
    cancelRemark: '',
    customerUser: '',
    customerPhone: '',
    damagedUser: '',
    damagedPhone: '',
    plateNumber: '',
    surveyId: '',
    type: '',
    manageType: '',
    isComplaint: '0',
    isSelf: '',
    managerRemark: '',
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
      path: `/app/businessdamagenew/damageDetail`,
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
        insuranceType: data.insuranceType,
        isComplaint: data.isComplaint || '0',
        isSelf: data.isSelf || '0',
        managerRemark: data.managerRemark
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
    let url = '/app/businessdamagenew/updateOff'
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
  onRadioChange (event) {
    let key = `${event.currentTarget.dataset.name}`
    this.setData({
      [key]: event.detail
    });
  },
  submitModifyRequest () {
    let _this = this
    let url = '/app/businessdamagenew/updateBasic'
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
        plateNumber: _this.data.plateNumber,
        isComplaint: _this.data.isComplaint,
        isSelf: _this.data.isSelf,
        managerRemark: _this.data.managerRemark
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
