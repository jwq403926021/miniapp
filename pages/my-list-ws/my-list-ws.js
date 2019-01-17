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
    statusMap: {
      '-1': '状态不限',
      '1': '查勘员已派送',
      '2': '待查勘员完善',
      '3': '查勘员已完善',
      '4': '待区域负责人线下报价',
      '5': '待报价中心报价',
      '6': '施工人员去现场',
      '7': '施工中',
      '8': '计算书已上传',
      '9': '报价中心驳回',
      '10': '已报价',
      '11': '已办结',
      '12': '暂存'
    }
  },
  onPullDownRefresh () {
    let _this = this
    util.request({
      path: '/app/damage/damageList',
      method: 'GET',
      data: {
        page: 1,
        size: 500
      }
    }, function (err, res) {
      wx.stopPullDownRefresh()
      _this.setData({
        dataList: res.page.list
      })
    })
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
    console.log('statusFilterChange::', data)
  },
  typeFilterChange (data) {
    console.log('typeFilterChange::', data)
  },
  dateFilterChange (data) {
    console.log('dateFilterChange::', data)
  },
  statusFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      statusFilter: value,
      isShowStatusFilter: false
    });
    this.getInitData()
  },
  typeFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      typeFilter: value,
      isShowTypeFilter: false
    });
  },
  dateFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      dateFilter: value,
      isShowDateFilter: false
    });
    this.getInitData()
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
      size: 1000,
      datetime: this.data.dateFilter
    }
    if (this.data.statusFilter != '-1') {
      filter.status = this.data.statusFilter
    }
    util.request({
      path: '/app/damage/damageList',
      method: 'GET',
      data: filter
    }, function (err, res) {
      _this.setData({
        dataList: res.data
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

    util.request({
      path: '/app/damage/damageList',
      method: 'GET',
      data: {
        page: 1,
        size: 1000,
        datetime: '0'
      }
    }, function (err, res) {
      _this.setData({
        dataList: res.data
      })
    })
  },
  getMore () {

  },
  goToHandleTask (event) {
    wx.redirectTo({
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
