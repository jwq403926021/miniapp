//获取应用实例
import util from "../../utils/util";

const app = getApp()
import location from '../../asset/location'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    show: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    areaList: location,
    isShowFilterOne: false,
    filterOne: '0',
    dataList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../register/register?id='+123
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
    util.request({
      path: '/app/damage/damageList',
      method: 'GET',
      data: {
        page: 1,
        size: 10
      }
    }, function (err, res) {
      _this.setData({
        dataList: res.data.records
      })
    })
  },
  goToHandleTask (event) {
    wx.navigateTo({
      url: '../ws-form/ws-form?id=' + event.currentTarget.dataset.id
    })
  }
})
