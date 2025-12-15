//获取应用实例
import util from "../../../utils/util";

const app = getApp()
import location from '../../../asset/location'
Page({
  data: {
    totalPage: 1,
    page: 1,
    show: false,
    isShowStatusFilter: false,
    statusFilter: '-1',
    dataList: [],
    height: '',
    searchCustomerUser: '',
    searchReportNumber: '',
    searchOrderId: '',
    statusMap: {
      '11': '已办结',
      '20': '已派送',
    },
    role: 1,
    current: 0
  },
  onPullDownRefresh () {
    this.setData({
      current: 0,
      page: 1
    }, () => {
      this.getInitData()
    })
  },
  onReachBottom () {
    let page = (this.data.page + 1) > this.data.totalPage ? this.data.totalPage : (this.data.page + 1)
    this.setData({
      page: page
    }, () => {
      this.getInitData(true)
    })
  },
  openFilterStatusPop () {
    this.setData({
      isShowStatusFilter: true
    });
  },
  resetFilter () {
    this.setData({
      current: 0,
      page: 1,
      totalPage: 1,
      searchOrderId: '',
      searchCustomerUser: '',
      searchReportNumber: '',
      statusFilter: '-1',
      dataList: []
    }, () => {
      this.getInitData()
    })
  },
  statusFilterChange (data) {
  },
  typeFilterChange (data) {
  },
  dateFilterChange (data) {
  },
  statusFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      statusFilter: value,
      isShowStatusFilter: false
    });
  },
  searchOrderIdChange (data) {
    this.setData({
      searchOrderId: data.detail
    })
  },
  searchReportNumberChange (data) {
    this.setData({
      searchReportNumber: data.detail
    })
  },
  searchCustomerUserChange (data) {
    this.setData({
      searchCustomerUser: data.detail
    })
  },

  filter () {
    this.setData({
      current: 0,
      dataList: []
    }, () => {
      this.getInitData()
    })
  },
  getInitData (flag) {
    let _this = this
    let filter = {
      page: this.data.page,
      size: 20,
      surveyName: this.data.searchCustomerUser,
      reportNumber: this.data.searchReportNumber,
      orderId: this.data.searchOrderId
    }
    if (this.data.statusFilter != '-1') {
      filter.status = this.data.statusFilter
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessinsurancewuyue/orders',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      let data = _this.data.dataList || []
      if (res.data.current === _this.data.current && flag) return false
      _this.setData({
        current: res.data.current,
        totalPage: res.data.total,
        dataList: flag ? data.concat(res.data.records || []) : (res.data.records || [])
      })
    })
  },
  onShow () {
    this.setData({
      current: 0,
      page: 1
    }, () => {
      this.getInitData()
    })
  },
  onLoad: function (routeParams) {
    let _this = this
    _this.setData({
      role: app.globalData.currentRegisterInfo.role
    })
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../wy-form/wy-form?id=' + event.currentTarget.dataset.id
    })
  },
  onCancel () {
    this.setData({
      show: false
    })
  },
  onConfirm () {
    this.setData({
      show: false
    })
  },
  closeFilter () {
    this.setData({
      isShowStatusFilter: false
    })
  }
})
