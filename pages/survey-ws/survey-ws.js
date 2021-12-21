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
      reason: [],
      other: ""
    },
    type2: {
      degree: "0",
      reason: [],
      other: ""
    },
    type3: {
      degree: "0",
      reason: [],
      other: ""
    },
    type4: {
      degree: "0",
      reason: [],
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
        let data = {}
        if (res.businessSatisfactionMainEntityList.length > 0) {
          let ii = res.businessSatisfactionMainEntityList
          data.flag = ii[0].flag + ''
          data.type1 = { degree: ii[0].satisfactionDegree + '', remark: ii[0].childList.map(i => i.remark).join(', ') }
          data.type2 = { degree: ii[1].satisfactionDegree + '', remark: ii[1].childList.map(i => i.remark).join(', ') }
          data.type3 = { degree: ii[2].satisfactionDegree + '', remark: ii[2].childList.map(i => i.remark).join(', ') }
          data.type4 = { degree: ii[3].satisfactionDegree + '', remark: ii[3].childList.map(i => i.remark).join(', ') }
        }
        data.isAllowSubmit = res.businessSatisfactionMainEntityList.length === 0
        _this.setData(data)
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
  onCheckboxChange (e) {
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
      let reason = []
      if ((this.data[type].degree == '2' || this.data[type].degree == '3')) {
        this.data[type].reason.map(r => {
          reason.push({
            remark: r
          })
        })
        if (this.data[type].other) {
          reason.push({
            remark: this.data[type].other
          })
        }
      }

      return {
        orderId: this.data.id,
        userId: app.globalData.currentRegisterInfo.userId,
        satisfactionDegree: this.data[type].degree,
        flag: this.data.isAnonymous,
        type: i,
        childList: reason
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
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
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
  }
})
