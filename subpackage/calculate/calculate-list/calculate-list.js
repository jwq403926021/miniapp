//获取应用实例
import util from "../../../utils/util";

const app = getApp()
import location from '../../../asset/location'
Page({
  data: {},
  goToCalculateGlass (event) {
    wx.navigateTo({
      url: '../calculate-glass/calculate-glass'
    })
  },
  goToCalculateWs (event) {
    wx.navigateTo({
      url: '../calculate-ws/calculate-ws'
    })
  },
})
