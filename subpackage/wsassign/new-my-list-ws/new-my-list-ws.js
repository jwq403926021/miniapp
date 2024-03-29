//获取应用实例
import util from "../../../utils/util";

const app = getApp()
import location from '../../../asset/location'
Page({
  data: {
    totalPage: 1,
    page: 1,
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
    searchCustomerUser: '',
    searchReportNumber: '',
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
    role: 1,
    type: 1,
    current: 0,
    showactionsheet: false,
    actions: [
      {
        name: '注销',
      },
      {
        name: '修改信息',
      }
    ]
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
      [target]: new Date(new Date().toLocaleDateString()).getTime(),
      [targetpop]: true
    });
  },
  onInputDate (event) {
    let target = event.currentTarget.dataset.target;
    let targetpop = event.currentTarget.dataset.targetpop
    let timestamp = event.detail
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
      current: 0,
      page: 1,
      totalPage: 1,
      searchCarNumber: '',
      searchOrderId: '',
      searchCustomerUser: '',
      searchReportNumber: '',
      statusFilter: '-1',
      startDate: '',
      endDate: '',
      dataList: []
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
      plateNumber: this.data.searchCarNumber,
      customerUser: this.data.searchCustomerUser,
      reportNumber: this.data.searchReportNumber,
      orderId: this.data.searchOrderId,
      insuranceType: this.data.type
    }
    if (this.data.statusFilter != '-1') {
      filter.status = this.data.statusFilter
    }
    if (this.data.startDate) {
      filter.startDate = this.formatDate(new Date(this.data.startDate), 'yyyy-MM-dd hh:mm:ss')
    }
    if (this.data.endDate) {
      filter.endDate = this.formatDate(new Date(this.data.endDate + 86399999), 'yyyy-MM-dd hh:mm:ss')
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
      type: routeParams.type,
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
  openOperation (event) {
    this.id = event.currentTarget.dataset.id
    this.setData({ showactionsheet: true })
  },
  onactionsheetClose () {
    this.setData({ showactionsheet: false })
  },
  onactionsheetSelect (event) {
    this.setData({
      current: 0,
      page: 1,
      totalPage: 1,
      searchCarNumber: '',
      searchOrderId: '',
      searchCustomerUser: '',
      searchReportNumber: '',
      statusFilter: '-1',
      startDate: '',
      endDate: '',
      dataList: []
    })
    switch (event.detail.name) {
      case '注销':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.type + '&manageType=' + 0
        })
        break
      case '修改信息':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.type + '&manageType=' + 1
        })
        break
    }
  },
  goToOffer (event) {
    if (this.data.role === 1 || this.data.role === 5 || this.data.role === 6 || this.data.role === 7 || this.data.role === 8) {
      wx.navigateTo({
        url: '../new-ws-offer-survey/new-ws-offer-survey?id=' + event.currentTarget.dataset.id
      })
    } else {
      wx.navigateTo({
        url: '../new-ws-offer/new-ws-offer?id=' + event.currentTarget.dataset.id
      })
    }
  },
  goToSurvey (event) {
    wx.navigateTo({
      url: '../survey-ws/survey-ws?id=' + event.currentTarget.dataset.id
    })
  },
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../new-ws-form/new-ws-form?id=' + event.currentTarget.dataset.id
    })
  },
  setFinishCase (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
    const id = event.currentTarget.dataset.id;
    const value = event.currentTarget.dataset.value == 1 ? 0 : 1;
    const index = event.currentTarget.dataset.index;
    const key = type == '0' ? 'isCompulsory' : 'isBusiness'
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: `/app/businessdamagenew/${key}`,
      method: 'GET',
      data: {
        orderId: id,
        [key]: value
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.data.dataList[index][key] = value
      _this.setData({
        dataList: _this.data.dataList
      })
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
