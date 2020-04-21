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
    searchOrderId: '',
    statusMap: {
      '11': '已办结',
      '12': '暂存',
      '13': '处理中',
      '20': '已派送',
      '41': '待报价',
      '43': '驳回',
      '50': '已报价',
    },
    startDate: '',
    startDateLabel: '开始时间',
    endDate: '',
    endDateLabel: '结束时间',
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
  openDatePop (event) {
    let targetpop = event.currentTarget.dataset.targetpop
    let target = event.currentTarget.dataset.target
    this.setData({
      [target]: new Date().getTime(),
      [targetpop]: true
    });
  },
  onInputDate (event) {
    let target = event.currentTarget.dataset.target;
    let targetpop = event.currentTarget.dataset.targetpop
    let timestamp = target === 'startDate' ? event.detail : event.detail + 86399999
    this.setData({
      [target]: timestamp,
      [`${target}Label`]: this.formatDate(new Date(timestamp)),
      [targetpop]: false
    });
  },
  formatDate (date, fmt) {
    if (typeof date == 'string') {
      return date;
    }

    if (!fmt) fmt = "yyyy-MM-dd";

    if (!date || date == null) return null;
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  },
  resetFilter () {
    this.setData({
      searchCarNumber: '',
      searchOrderId: '',
      statusFilter: '-1',
      startDate: '',
      endDate: ''
    }, () => {
      this.getInitData()
    })
  },
  cancelDate (event) {
    let targetpop = event.currentTarget.dataset.targetpop
    let target = event.currentTarget.dataset.target
    this.setData({
      [target]: '',
      [targetpop]: false
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
      plateNumber: this.data.searchCarNumber,
      orderId: this.data.searchOrderId
    }
    if (this.data.statusFilter != '-1') {
      filter.status = this.data.statusFilter
    }
    if (this.data.startDate) {
      filter.startDate = this.formatDate(new Date(this.data.startDate), 'yyyy-MM-dd hh:mm:ss')
    }
    if (this.data.endDate) {
      filter.endDate = this.formatDate(new Date(this.data.endDate), 'yyyy-MM-dd hh:mm:ss')
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessdamagenew/orders',
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
      url: '../new-ws-form/new-ws-form?id=' + event.currentTarget.dataset.id
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
