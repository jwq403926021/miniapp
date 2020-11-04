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
    surveyId: ''
  },
  onLoad: function (routeParams) {
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        type: routeParams.type,
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
        surveyId: data.surveyId
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
        cancelRemark: this.cancelRemark,
        customerUser: this.customerUser,
        surveyId: this.surveyId
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
