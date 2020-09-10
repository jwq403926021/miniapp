//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    totalPage: 1,
    page: 1,
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
      '30': '待指派测漏',
      '31': '待测漏人员处理',
      '32': '已测漏',
      '40': '待合作商完善',
      '41': '待报价中心报价',
      '42': '合作商已驳回',
      '44': '待合作商联系客户',
      '51': '待定损员处理',
      '52': '定损员已驳回',
      '54': '待定损员联系客户',
      '61': '已报价,待财务处理',
      '62': '报价中心驳回',
      '11': '已办结'
    },
    showactionsheet: false,
    actions: [
      {
        name: '转线上',
      },
      {
        name: '转线下',
      },
      {
        name: '注销',
      },
      {
        name: '修改基本信息',
      }
    ],
    current: 0
  },
  onReachBottom () {
    let page = (this.data.page + 1) > this.data.totalPage ? this.data.totalPage : (this.data.page + 1)
    this.setData({
      page: page
    }, () => {
      this.getInitData(true)
    })
  },
  resetFilter () {
    this.setData({
      dateFilter: '0',
      finishCaseFilter: '',
      workStatusFilter: '',
      current: 0,
      page: 1,
      totalPage: 1,
      searchKeyword: '',
      searchFlowId: '',
      searchCustomerPhone: '',
      dataList: []
    }, () => {
      this.getInitData()
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
    switch (event.detail.name) {
      case '转线上':
        wx.navigateTo({
          url: '../new-jc-manage/new-jc-manage?id=' + this.id + '&type=1'
        })
        break
      case '转线下':
        wx.navigateTo({
          url: '../new-jc-manage/new-jc-manage?id=' + this.id + '&type=2'
        })
        break
      case '注销':
        wx.navigateTo({
          url: '../new-jc-manage/new-jc-manage?id=' + this.id + '&type=3'
        })
        break
      case '修改基本信息':
        wx.navigateTo({
          url: '../new-jc-manage/new-jc-manage?id=' + this.id + '&type=4'
        })
        break
    }
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
      path: '/app/businessinsurancefamilynew/finishCase',
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
      path: '/app/businessinsurancefamilynew/workEndStatus',
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
  goToOffer (event) {
    if (this.data.role === 1 || this.data.role === 5 || this.data.role === 6 || this.data.role === 7) {
      wx.navigateTo({
        url: '../new-jc-offer-survey/new-jc-offer-survey?id=' + event.currentTarget.dataset.id
      })
    } else {
      wx.navigateTo({
        url: '../new-jc-offer/new-jc-offer?id=' + event.currentTarget.dataset.id
      })
    }
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
      page: this.data.page,
      size: 100
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
      path: '/app/businessinsurancefamilynew/orders',
      method: 'GET',
      data: filter
    }, function (err, res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      let data = _this.data.dataList || []
      if (res.data.current === _this.data.current && flag) return false
      _this.setData({
        current: res.data.current,
        totalPage: Math.ceil(res.data.total / 100),
        dataList: flag ? data.concat(res.data.records || []) : (res.data.records || [])
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
      url: '../new-jc-form/new-jc-form?id=' + event.currentTarget.dataset.id
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
