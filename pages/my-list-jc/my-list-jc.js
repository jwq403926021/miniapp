//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    show: false,
    areaList: location,
    isShowStatusFilter: false,
    statusFilter: '0',
    isShowTypeFilter: false,
    typeFilter: '0',
    isShowDateFilter: false,
    dateFilter: '0',
    dataList: [],
    dateFilterArr: ['时间不限', '最近3天', '最近7天', '最近30天'],
    height: '',
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善', // 也是驳回状态
      '31': '被保险人已完善,待报价中心报价',
      '32': '已报价,待被保险人审阅',
      '33': '被保险人不满意，待沟通',
      '40': '待合作商完善', // 也是驳回状态
      '41': '合作商已完善,待报价中心报价',
      '42': '已报价',
      '50': '已报价,待财务处理',
      '11': '已办结',
      '99': '处理中'
    },
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
    console.log(value)
    this.setData({
      statusFilter: value,
      isShowStatusFilter: false
    });
  },
  typeFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    console.log(value)
    this.setData({
      statusFilter: value,
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
  getInitData () {
    let _this = this
    let todayDate = +new Date()
    let tempDate
    let start
    let end = todayDate
    let onDay = 1000 * 60 * 60 * 24
    switch (this.data.dateFilter) {
      case '0':
        start = null
        end = null
        break
      case '1':
        tempDate = new Date(todayDate - onDay * 3)
        start = (+new Date(`${tempDate.getFullYear()}/${tempDate.getMonth()+1}/${tempDate.getDate()} 00:00:00`))
        break
      case '2':
        tempDate = new Date(todayDate - onDay * 7)
        start = (+new Date(`${tempDate.getFullYear()}/${tempDate.getMonth()+1}/${tempDate.getDate()} 00:00:00`))
        break
      case '3':
        tempDate = new Date(todayDate - onDay * 30)
        start = (+new Date(`${tempDate.getFullYear()}/${tempDate.getMonth()+1}/${tempDate.getDate()} 00:00:00`))
        break
    }
    let filter = {
      page: 1,
      size: 1000
    }
    if (start && end) {
      filter.start = start
      filter.end = end
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/family/insured/orders',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  openLocation () {
    this.setData({
      show: !this.show
    })
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
    wx.navigateTo({
      url: '../jc-form/jc-form?id=' + event.currentTarget.dataset.id
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
      isShowTypeFilter:false,
      isShowStatusFilter:false
    })
  }
})
