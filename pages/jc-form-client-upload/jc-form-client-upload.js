//获取应用实例
const app = getApp()

Page({
  data: {
    // familyImages:{
    //   house: [],// 房屋及装修
    //   electrical: [],// 家电及文体用品
    //   cloths: [],// 衣物床品
    //   furniture: [],// 家具及其他生活用品
    //   overall : [],// 全景
    //   certificate: [],// 房产证
    //   identification: [],// 省份证
    //   bank: [],// 银行卡
    //   register: [],// 户口本
    //   source: []// 事故源
    // }
  },
  onLoad: function (routeParams) {
    let familyImages = wx.getStorageSync('familyImages')
    console.log(routeParams.index, routeParams.type, ' ||| upload image!!!!')
    // {
    //   "path": "20190109102004000102/55_vZyu2uSm.png",
    //   "type": 1,
    //   "clientIndex": 0
    // }
  },
  back () {
    wx.navigateBack({
      delta: 1
    })
  }
})
