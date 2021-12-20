//获取应用实例
import util from "../../utils/util";

const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    isAnonymous: '0',
    type1: {
      degree: "0",
      reason: "",
      other: ""
    },
    type2: {
      degree: "0",
      reason: "",
      other: ""
    },
    type3: {
      degree: "0",
      reason: "",
      other: ""
    },
    type4: {
      degree: "0",
      reason: "",
      other: ""
    },
    isAllowSubmit: false
  },
  onLoad: function (routeParams ) {
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/businesssatisfactionmain/info/${id}`,
      method: 'GET'
    }, function (err, res) {
      if (res.code == 0) {
        _this.setData({
          isAllowSubmit: res.businessSatisfactionMainEntityList.length === 0
        })
      }
    })
  },
  inputgetName(e) {
    let key = e.currentTarget.dataset.type;
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`type${key}.${name}`]: e.detail.value
    })
  },
  onRadioChange (e) {
    let key = e.currentTarget.dataset.type;
    let name = e.currentTarget.dataset.name;
    let data = {}
    if (key == undefined) {
      data[`${name}`] = e.detail
    } else {
      data[`type${key}.${name}`] = e.detail
    }
    this.setData(data);
  },
  commitSubmit (e) {
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let data = [0, 1, 2, 3].map(i => {
      let type = [`type${i + 1}`]
      return {
        orderId: this.data.id,
        userId: app.globalData.currentRegisterInfo.userId,
        satisfactionDegree: this.data[type].degree,
        flag: this.data.isAnonymous,
        type: i,
        childList: (this.data[type].degree == '2' || this.data[type].degree == '3') ? [{
          mainId: this.data[type].reason,
          remark: this.data[type].other
        }] : []
      }
    })
    util.request({
      path: '/app/businesssatisfactionmain/save',
      method: 'POST',
      data: data
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
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
