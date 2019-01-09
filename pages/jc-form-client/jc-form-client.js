//获取应用实例
const app = getApp()

Page({
  data: {
    clientIndexArr: [0],
    currentIndex: 0
  },
  onLoad: function () {
    let familyImages = wx.getStorageSync('familyImages')
    let clientIndexArr = []
    for(let key in familyImages) {
      familyImages[key].forEach(item => {
        if (item.hasOwnProperty('clientIndex')) {
          console.log('item.clientIndex:', item.clientIndex)
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
    console.log(this.data.clientIndexArr, '|clientIndexArr')
  },
  goToClientUpload (e) {
    console.log('goToClientUpload-->', this.data.currentIndex)
    wx.navigateTo({
      url: '../jc-form-client-upload/jc-form-client-upload?index=' + this.data.currentIndex + '&type=' + e.currentTarget.dataset['type']
    })
  },
  addClient () {
    let arr = this.data.clientIndexArr
    let lastIndex = arr.length
    arr.push(arr.length)
    this.setData({
      clientIndexArr: arr,
      currentIndex: lastIndex
    })
  },
  setCurrentIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset['index']
    })
  }
})
