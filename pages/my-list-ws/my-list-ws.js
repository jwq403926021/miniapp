//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    show: false,
    areaList: location,
    isShowStatusFilter: false,
    statusFilter: '-1',
    isShowTypeFilter: false,
    typeFilter: '0',
    isShowDateFilter: false,
    dateFilter: '0',
    dataList: [],
    dateFilterArr: ['时间不限', '最近3天', '最近7天', '最近30天'],
    height: '',
    searchCarNumber: '',
    searchReportNumber: '',
    searchOrderId: '',
    statusMap: {
      '-1': '状态不限',
      '1': '查勘员已派送',
      '2': '待查勘员完善',
      '3': '查勘员已完善',
      '4': '待区域负责人线下报价',
      '5': '待报价中心报价',
      '6': '施工人员施工',
      '7': '施工中',
      '8': '计算书已上传',
      '9': '报价中心驳回',
      '10': '已报价',
      '11': '已办结',
      '12': '暂存'
    },
    role: 1
  },
  onPullDownRefresh () {
    this.getInitData()
  },
  openFilterStatusPop () {
    this.setData({
      isShowStatusFilter: true
    });
  },
  openFilterTypePop () {
    this.setData({
      isShowTypeFilter: true
    });
  },
  openFilterDatePop () {
    this.setData({
      isShowDateFilter: true
    });
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
  typeFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      typeFilter: value,
      isShowTypeFilter: false
    });
  },
  searchCarNumberChange (data) {
    this.setData({
      searchCarNumber: data.detail
    })
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
  dateFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      dateFilter: value,
      isShowDateFilter: false
    });
  },
  openLocation () {
    this.setData({
      show: !this.show
    })
  },
  getInitData () {
    let _this = this
    let filter = {
      page: 1,
      size: 100,
      datetime: this.data.dateFilter,
      carNumber: this.data.searchCarNumber,
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
      path: '/app/damage/damageList',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      _this.setData({
        dataList: res.data
      })
    })
  },
  onShow () {
    this.getInitData()
  },
  onLoad: function () {
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
  getMore () {

  },
  goToOffer (event) {
    wx.navigateTo({
      url: '../ws-offer/ws-offer?id=' + event.currentTarget.dataset.id
    })
  },
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../ws-form/ws-form?id=' + event.currentTarget.dataset.id
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
      isShowDateFilter:false,
      isShowStatusFilter: false,
      isShowTypeFilter:false
    })
  }
})
