//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
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
  openFilterOne () {
    this.setData({
      isShowFilterOne: true
    });
  },
  filterOneChange (data) {
    console.log('filterOneChange::', data)
  },
  filterItemClick (event) {
    const value = event.currentTarget.dataset.name
    const label = event.currentTarget.dataset.label
    this.setData({
      searchStatus: value,
      isShowFilterOne: false,
      searchStatusLabel: label
    })
    this.getInitData()
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
  getInitData () {
    let _this = this
    let filter = {}
    if (this.data.searchKeyword) {
      filter.customName = this.data.searchKeyword
    }
    if (this.data.searchStatus != -1) {
      filter.status = this.data.searchStatus
    }
    console.log(filter, this.data.searchKeyword, this.data.searchStatus)
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
      _this.setData({
        dataList: res.data
      })
    })
  },
  closeFilter () {
    this.setData({
      isShowFilterOne:false
    })
  }
})
