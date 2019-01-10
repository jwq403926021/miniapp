//获取应用实例
const app = getApp()

Page({
  data: {
    familyImages:{
      house: [],// 房屋及装修
      electrical: [],// 家电及文体用品
      cloths: [],// 衣物床品
      furniture: [],// 家具及其他生活用品
      overall : [],// 全景
      certificate: [],// 房产证
      identification: [],// 省份证
      bank: [],// 银行卡
      register: [],// 户口本
      source: []// 事故源
    },
    clientIndex: 0,
    type: null,
    flowId: null,
    status: null,
    role: null
  },
  onLoad: function (routeParams) {
    let familyImages = wx.getStorageSync('familyImages')
    console.log('client index:', routeParams.index, 'type:', routeParams.type)
    this.setData({
      clientIndex: routeParams.index,
      type: routeParams.type,
      flowId: routeParams.flowId,
      status: routeParams.status,
      'familyImages.house': familyImages.house,
      'familyImages.cloths': familyImages.house,
      'familyImages.electrical': familyImages.electrical,
      'familyImages.furniture': familyImages.furniture,
      'familyImages.overall': familyImages.overall,
      'familyImages.certificate': familyImages.certificate,
      'familyImages.identification': familyImages.identification,
      'familyImages.bank': familyImages.bank,
      'familyImages.register': familyImages.register,
      'familyImages.source': familyImages.source,
      role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role
    })
  },
  getImageTypeNumber (str) {
    let num = null
    switch (str) {
      case 'house':
        num = 2001
        break
      case 'electrical':
        num = 2002
        break
      case 'cloths':
        num = 2003
        break
      case 'furniture':
        num = 2004
        break
      case 'overall':
        num = 2005
        break
      case 'certificate':
        num = 2006
        break
      case 'identification':
        num = 2007
        break
      case 'bank':
        num = 2008
        break
      case 'register':
        num = 2009
        break
      case 'source':
        num = 2010
        break
    }
    return num
  },
  chooseImage: function (e) {
    var _this = this;
    let imageTypeStr = e.currentTarget.dataset.imagetype
    let imageTypeNumber = _this.getImageTypeNumber(imageTypeStr);
    console.log('imageTypeStr:', imageTypeStr, 'imageTypeNumber:', imageTypeNumber, _this.data.familyImages[imageTypeStr])
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item,
            "type": imageTypeNumber,
            "clientIndex": _this.data.clientIndex
          })
        })

        let list = _this.data.familyImages[imageTypeStr].concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          _this.setData({
            [`familyImages.${imageTypeStr}`]: list
          });
        }
        console.log('after choose Image::', _this.data.familyImages)
        wx.setStorageSync('familyImages', _this.data.familyImages)
      }
    })
  },
  previewImage: function (e) {
    let _this = this
    let imageTypeStr = e.currentTarget.dataset.imagetype
    wx.previewImage({
      current: e.currentTarget.id,
      urls: _this.data.familyImages[imageTypeStr]
    })
  },
  removeImageFiles (e) {
    let _this = this
    let index = e.currentTarget.dataset.index;
    let imageTypeStr = e.currentTarget.dataset.imagetype
    this.data.familyImages[imageTypeStr].splice(index, 1)
    this.setData({
      [`familyImages.${imageTypeStr}`]: _this.data.familyImages[imageTypeStr]
    })
    console.log('after remove image', _this.data.familyImages)
    wx.setStorageSync('familyImages', _this.data.familyImages)
  },
  back () {
    wx.navigateBack({
      delta: 1
    })
  }
})
