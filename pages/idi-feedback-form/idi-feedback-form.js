//获取应用实例
import util from "../../utils/util";
const app = getApp()
Page({
  data: {
    id: null,
    role: 1,
    show: false,
    content: "",
    feedbackType: "1",
    satisfactionDegree: '0',
    cause: ''
  },
  onLoad: function (routeParams) {
    this.setData({
      id: routeParams.id,
      feedbackType: routeParams.type,
      role: app.globalData.currentRegisterInfo?.role
    })
  },
  initDataById (id) {
    util.request({
      path: '/app/dredge/info',
      method: 'GET',
      data: {
        id: id
      }
    }, function (err, res) {
    })
  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value
    })
  },
  onSatisfactionDegreeChange (event) {
    this.setData({
      'satisfactionDegree': event.detail
    });
  },
  onCauseChange (event) {
    this.setData({
      'cause': event.detail
    });
  },
  commitSubmit (e) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let url = ''
    let params = {}
    if (this.data.feedbackType == '1') {
      url = `/app/businessinsuranceidi/complaint`
      params = {
        orderId: this.data.id,
        userId: app.globalData.currentRegisterInfo.userId,
        cause: this.data.cause.join(','),
        remark: this.data.content
      }
    } else {
      url = `/app/businessinsuranceidi/satisfaction`
      params = {
        orderId: this.data.id,
        userId: app.globalData.currentRegisterInfo.userId,
        satisfactionDegree: this.data.satisfactionDegree,
        remark: this.data.content
      }
    }
    util.request({
      path: url,
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '提交成功',
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
          title: '提交失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})
