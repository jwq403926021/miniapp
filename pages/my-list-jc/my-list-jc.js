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
    isShowFinishCaseFilter: false,
    isShowWorkStatusFilter: false,
    dateFilter: '0',
    finishCaseFilter: '',
    workStatusFilter: '',
    dataList: [],
    dateFilterArr: ['时间不限', '最近3天', '最近7天', '最近30天'],
    finishCaseFilterArr: ['未结案', '已结案'],
    workStatusFilterArr: ['未施工', '已施工'],
    height: '',
    searchKeyword: '',
    searchFlowId: '',
    searchCustomerPhone: '',
    role: 1,
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
      '51': '待定损员处理',
      '52': '定损员已驳回',
      '11': '已办结',
      '99': '处理中'
    },
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
      path: '/app/family/finishCase',
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
  setworkEndStatus (event) {
    let _this = this
    const id = event.currentTarget.dataset.id;
    const workEndStatus = event.currentTarget.dataset.workendstatus == 1 ? 0 : 1;
    const index = event.currentTarget.dataset.index;
    if (this.data.role != 12) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/family/workEndStatus',
      method: 'GET',
      data: {
        flowId: id,
        workStatus: workEndStatus
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.data.dataList[index].workStatus = workEndStatus
      _this.setData({
        dataList: _this.data.dataList
      })
    })
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
  openFilterFinishCasePop () {
    this.setData({
      isShowFinishCaseFilter: true
    });
  },
  openFilterWorkStatusPop () {
    this.setData({
      isShowWorkStatusFilter: true
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
  finishCaseFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      finishCaseFilter: value,
      isShowFinishCaseFilter: false
    });
    this.getInitData()
  },
  workStatusFilterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    this.setData({
      workStatusFilter: value,
      isShowWorkStatusFilter: false
    });
    this.getInitData()
  },
  searchKeywordChange (data) {
    this.setData({
      searchKeyword: data.detail
    })
  },
  searchFlowIdChange (data) {
    this.setData({
      searchFlowId: data.detail
    })
  },
  searchWorkStatusChange (data) {
    this.setData({
      searchCustomerPhone: data.detail
    })
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

    if (this.data.finishCaseFilter) {
      filter.finish = this.data.finishCaseFilter
    }
    if (this.data.workStatusFilter) {
      filter.workStatus = this.data.workStatusFilter
    }
    if (this.data.searchKeyword) {
      filter.customerName = this.data.searchKeyword
    }
    if (this.data.searchFlowId) {
      filter.flowId = this.data.searchFlowId
    }
    if (this.data.searchCustomerPhone) {
      filter.customerPhone = this.data.searchCustomerPhone
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
      wx.stopPullDownRefresh()
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
      isShowFinishCaseFilter:false,
      isShowWorkStatusFilter:false,
      isShowTypeFilter:false,
      isShowStatusFilter:false
    })
  }
})
