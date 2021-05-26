//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    current: 0,
    totalPage: 1,
    page: 1,
    show: false,
    areaList: location,
    isShowFilterOne: false,
    searchStatus: '-1',
    searchStatusLabel: '不限',
    dataList: [],
    height: '',
    role: 1,
    searchKeyword: '',
    statusMap: {
      '20': '已派送',
      '13': '已确认',
      '42': '已中标',
      '37': '待处理人指派比价人员',
      '38': '申请退单',
      '52': '待查勘员审核',
      '39': '比价中',
      '51': '待处理人确认',
      '33': '处理人驳回',
      '41': '待报价',
      '43': '报价驳回',
      '36': '待查勘员处理',
      '35': '待施工',
      '50': '已完工待财务处理',
      '11': '已办结'
    },
    statusList: [
      { id: '20', name: '已派送' },
      { id: '13', name: '已确认' },
      { id: '42', name: '已中标' },
      { id: '37', name: '待处理人指派比价人员' },
      { id: '38', name: '申请退单' },
      { id: '52', name: '待查勘员审核' },
      { id: '39', name: '比价中' },
      { id: '51', name: '待处理人确认' },
      { id: '33', name: '处理人驳回' },
      { id: '41', name: '待报价' },
      { id: '43', name: '报价驳回' },
      { id: '36', name: '待查勘员处理' },
      { id: '35', name: '待施工' },
      { id: '50', name: '已完工待财务处理' },
      { id: '11', name: '已办结' }
    ]
  },
  setFinishCase (event) {
    let _this = this
    const id = event.currentTarget.dataset.id;
    const finishcase = event.currentTarget.dataset.finishcase == 1 ? 0 : 1;
    const index = event.currentTarget.dataset.index;
    if (this.data.role != 1) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/dredge/finishCase',
      method: 'GET',
      data: {
        flowId: id,
        finishCase: finishcase
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.data.dataList[index].finishCase = finishcase
      _this.setData({
        dataList: _this.data.dataList
      })
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
  openFilterOne () {
    this.setData({
      isShowFilterOne: true
    });
  },
  filterOneChange (data) {
  },
  filterItemClick (event) {
    const value = event.currentTarget.dataset.name
    const label = event.currentTarget.dataset.label
    this.setData({
      current: 0,
      page: 1,
      totalPage: 1,
      searchStatus: value,
      isShowFilterOne: false,
      searchStatusLabel: label
    }, () => {
      this.getInitData()
    })
  },
  openLocation () {
    this.setData({
      show: !this.show
    })
  },
  onPullDownRefresh () {
    this.getInitData()
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
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../idi-form/idi-form?id=' + event.currentTarget.dataset.id + '&orderId=' + event.currentTarget.dataset.orderid
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
  searchKeywordChange (data) {
    this.setData({
      searchKeyword: data.detail
    })
  },
  filter () {
    this.setData({
      current: 0,
      page: 1,
      totalPage: 1,
    }, () => {
      this.getInitData()
    })
  },
  getInitData (flag) {
    let _this = this
    let filter = {
      page: this.data.page,
      size: 100,
    }
    if (this.data.searchKeyword) {
      filter.customName = this.data.searchKeyword
    }
    if (this.data.searchStatus != -1) {
      filter.status = this.data.searchStatus
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessinsuranceidi/orders',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      let data = _this.data.dataList || []
      if (res && res.data.current === _this.data.current) return false
      _this.setData({
        current: res.data.current,
        totalPage: Math.ceil(res.data.total / 100),
        dataList: flag ? data.concat(res.data.records || []) : (res.data.records || [])
      })
    })
  },
  closeFilter () {
    this.setData({
      isShowFilterOne:false
    })
  }
})
