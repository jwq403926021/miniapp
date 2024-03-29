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
      '12': '暂存',
      '1': '查勘员已派送',
      '13': '负责人已确认',
      '11': '已办结',
      '99': '处理中'
    },
    statusList: [
      {
        id: '12',
        name: '暂存'
      },
      {
        id: '1',
        name: '查勘员已派送'
      },
      {
        id: '13',
        name: '负责人已确认'
      },
      {
        id: '11',
        name: '已办结'
      }]
  },
  setFinishCase (event) {
    let _this = this
    const id = event.currentTarget.dataset.id;
    const finishcase = event.currentTarget.dataset.finishcase == 1 ? 0 : 1;
    const index = event.currentTarget.dataset.index;
    if (_this.data.role != 1) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/lock/finishCase',
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
      url: '../lock-form/lock-form?id=' + event.currentTarget.dataset.id + '&orderId=' + event.currentTarget.dataset.orderid
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
      path: '/app/lock/list',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      let data = _this.data.dataList || []
      if (res && res.data.current === _this.data.current) return false
      _this.setData({
        current: res.data.current,
        totalPage: res.data.total,
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
