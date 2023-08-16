//获取应用实例
import util from "../../utils/util";

const app = getApp()
import Metadata from "../hujiabao-form/metadata";
Page({
  data: {
    show: false,
    isShowStatusFilter: false,
    statusFilter: '-1',
    height: '',
    searchOrderId: '',
    Metadata: Metadata,
    statusMap: {
      '-1': '状态不限',
      ...Metadata.orderStatus
    },
    statusList: [
      {name: '状态不限', value: '-1'},
      ...Object.entries(Metadata.orderStatus).map(([v, l]) => {
        return {name: l, value: v}
      })
    ]
  },
  onPullDownRefresh () {
    this.getInitData()
  },
  openFilterStatusPop () {
    this.setData({
      isShowStatusFilter: true
    });
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
  getInitData () {
    let _this = this
    let filter = {
      page: 1,
      size: 100,
      policyNo: this.data.searchOrderId
    }
    if (this.data.statusFilter != '-1') {
      filter.status = this.data.statusFilter
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/hjbpolicyinfo/orders',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  onShow () {
    this.getInitData()
  },
  onLoad: function (routeParams) {
    let _this = this
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
      url: '../hujiabao-form/hujiabao-form?id=' + event.currentTarget.dataset.id
    })
  },
  closeFilter () {
    this.setData({
      isShowStatusFilter: false
    })
  }
})
