//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    show: false,
    areaList: location,
    isShowFilterOne: false,
    filterOne: '0',
    dataList: [],
    height: '',
    statusMap: {
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
  openFilterOne () {
    this.setData({
      isShowFilterOne: true
    });
  },
  filterOneChange (data) {
    console.log('filterOneChange::', data)
  },
  filterItemClick (event) {
    const value = event.currentTarget.dataset.name;
    console.log(value)
    this.setData({
      filterOne: value,
      isShowFilterOne: false
    });
  },
  openLocation () {
    this.setData({
      show: !this.show
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
        size: 500
      }
    }, function (err, res) {
      _this.setData({
        dataList: res.page.list
      })
    })
  },
  getMore () {

  },
  goToHandleTask (event) {
    wx.navigateTo({
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
  }
})
