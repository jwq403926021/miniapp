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
    let that = this
    this.setData({
      id: routeParams.id,
      feedbackType: routeParams.type,
      role: app.globalData.currentRegisterInfo?.role
    }, () => {
      that.initDataById()
    })
  },
  initDataById () {
    let that = this
    let url = ``
    if (this.data.feedbackType == '1') {
      url = `/app/businessinsuranceidi/complaintInfo`
    } else {
      url = `/app/businessinsuranceidi/satisfactionInfo`
    }
    util.request({
      path: url,
      method: 'GET',
      data: {
        userId: app.globalData.currentRegisterInfo.userId,
        orderId: this.data.id
      }
    }, function (err, res) {
      if (that.data.feedbackType == '1') {
        that.setData({
          content: res.data.remark,
          cause: res.data.cause.split(',')
        })
      } else {
        that.setData({
          content: res.data.remark,
          satisfactionDegree: res.data.satisfactionDegree + ''
        })
      }
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
  commitSubmit () {
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
