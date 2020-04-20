//获取应用实例
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    clientIndexArr: [0],
    currentIndex: 0,
    flowId: null,
    status: null,
    role: null
  },
  onLoad: function (routeParams) {
    let familyImages = wx.getStorageSync('familyImages')
    let clientIndexArr = []
    for(let key in familyImages) {
      familyImages[key].forEach(item => {
        if (item.hasOwnProperty('clientIndex')) {
          clientIndexArr.push(parseInt(item.clientIndex))
        }
      })
    }
    clientIndexArr = Array.from(new Set(clientIndexArr))
    clientIndexArr.sort()
    if (clientIndexArr.length > 1) {
      this.setData({
        clientIndexArr: clientIndexArr
      })
    }
    this.setData({
      flowId: routeParams.flowId,
      status: routeParams.status,
      role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role
    })
    console.log(this.data.clientIndexArr, '|clientIndexArr')
  },
  goToClientUpload (e) {
    wx.navigateTo({
      url: `../jc-form-client-upload/jc-form-client-upload?index=${this.data.currentIndex}&type=${e.currentTarget.dataset['type']}&flowId=${this.data.flowId}&status=${this.data.status}`
    })
  },
  addClient () {
    let arr = this.data.clientIndexArr
    let lastIndex = parseInt(arr[arr.length - 1]) + 1
    arr.push(lastIndex)
    this.setData({
      clientIndexArr: arr,
      currentIndex: lastIndex
    })
  },
  removeClient () {
    let arr = this.data.clientIndexArr
    let index = arr.findIndex(item => {
      return item == this.data.currentIndex
    })
    if (index == 0) {
      wx.showToast({
        mask: true,
        title: '无法删除出险方项',
        icon: 'none',
        duration: 2000
      })
    } else {
      let clientIndex = arr.splice(index, 1)[0]
      let familyImages = wx.getStorageSync('familyImages')
      for(let key in familyImages) {
        familyImages[key].forEach((item,index) => {
          if (item.clientIndex == clientIndex) {
            familyImages[key].splice(index, 1)
            if (item.id != null) {
              common.deleteImage(item.id)
            }
          }
        })
      }
      wx.setStorageSync('familyImages', familyImages)
      console.log('clientIndex::', clientIndex, familyImages)
      this.setData({
        clientIndexArr: arr,
        currentIndex: 0
      })
    }
  },
  setCurrentIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset['index']
    })
  },
  back () {
    wx.navigateBack({
      delta: 1
    })
  }
})
