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
      '51': '提交至修理厂',
      '52': '待修理厂报价',
      '53': '待报价中心报价',
      '54': '待保险公司核价',
      '56': '保险公司核价完成'
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
  onPullDownRefresh () {
    util.request({
      path: '/app/autoInsurance',
      method: 'GET',
      data: {
        page: 1,
        size: 1000
      }
    }, function (err, res) {
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

    util.request({
      path: '/app/autoInsurance',
      method: 'GET',
      data: {
        page: 1,
        size: 1000
      }
    }, function (err, res) {
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  getMore () {

  },
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../cx-form/cx-form?id=' + event.currentTarget.dataset.id
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
