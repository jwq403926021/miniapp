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
      '12': '暂存',
      '1': '查勘员已派送',
      '13': '负责人已确认',
      '11': '已办结',
      '99': '处理中'
    }
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
      path: '/app/lock/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        dataList: res.data
      })
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
  }
})
