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
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善',
      '31': '待审核人员处理',
      '32': '审核人员已处理',
      '33': '查勘员已驳回',
      '34': '查勘员已处理',
      '35': '待被审核人完善',
      '36': '负责人已处理',
      '11': '已办结'
    },
    statusList: [
      {
        id: '29',
        name: '暂存'
      },
      {
        id: '20',
        name: '待客服人员处理'
      },
      {
        id: '30',
        name: '待被保险人完善'
      },
      {
        id: '31',
        name: '已办结'
      },
      {
        id: '32',
        name: '审核人员已处理'
      },
      {
        id: '33',
        name: '查勘员已驳回'
      },
      {
        id: '34',
        name: '查勘员已处理'
      },
      {
        id: '35',
        name: '待被审核人完善',
      },
      {
        id: '36',
        name: '负责人已处理',
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
    let role = app.globalData.currentRegisterInfo.role
    let status = event.currentTarget.dataset.status
    if ((status == 31 || status == 32 || status == 33 || status == 34 || status == 36 || status == 11) && role != 15) {
      wx.navigateTo({
        url: '../accident-audit-form/accident-audit-form?id=' + event.currentTarget.dataset.orderid
      })
    } else {
      wx.navigateTo({
        url: '../accident-form/accident-form?id=' + event.currentTarget.dataset.orderid
      })
    }
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
      path: '/app/accidentInsurance/orders?page=1&size=9999',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      res.data.records.forEach(item => {
        if (item.insuranceNum != '' && item.insuranceNum != null && item.status != 29) {
          item.isCustomerCreate = '是'
        } else {
          item.isCustomerCreate = '否'
        }
      })
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  closeFilter () {
    this.setData({
      isShowFilterOne:false
    })
  }
})
