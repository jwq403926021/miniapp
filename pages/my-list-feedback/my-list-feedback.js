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
    this.onSearch()
  },
  openLocation () {
    this.setData({
      show: !this.show
    })
  },
  onPullDownRefresh () {
    this.initData()
  },
  onShow () {
    this.initData()
  },
  initData () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/feedbacks',
      method: 'GET',
      data: {
        page: 1,
        size: 1000
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  onLoad: function () {
    let _this = this
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
    // wx.redirectTo({
    //   url: '../lock-form/lock-form?id=' + event.currentTarget.dataset.id
    // })
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
  onSearch () {
    let _this = this
    let filter = {}
    if (this.data.searchKeyword) {
      filter.customName = this.data.searchKeyword
    }
    if (this.data.searchStatus != -1) {
      filter.status = this.data.searchStatus
    }
    console.log(filter, this.data.searchKeyword, this.data.searchStatus)
    util.request({
      path: '/app/lock/list',
      method: 'GET',
      data: filter
    }, function (err, res) {
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
