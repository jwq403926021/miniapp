//获取应用实例
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    familyImages:{
      house: [],// 房屋及装修
      electrical: [],// 家电及文体用品
      cloths: [],// 衣物床品
      furniture: [],// 家具及其他生活用品
      overall : [],// 全景
      certificate: [],// 房产证、楼号、门牌号
      identification: [],// 省份证
      bank: [],// 银行卡
      register: [],// 户口本、关系证明
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
    this.setData({
      clientIndex: routeParams ? routeParams.index : 0,
      type: routeParams.type,
      flowId: routeParams.flowId,
      status: routeParams.status,
      'familyImages.house': familyImages.house,
      'familyImages.cloths': familyImages.cloths,
      'familyImages.electrical': familyImages.electrical,
      'familyImages.furniture': familyImages.furniture,
      'familyImages.overall': familyImages.overall,
      'familyImages.certificate': familyImages.certificate,
      'familyImages.identification': familyImages.identification,
      'familyImages.bank': familyImages.bank,
      'familyImages.register': familyImages.register,
      'familyImages.source': familyImages.source,
      role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role
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
    app.globalData.isIgnoreRefresh = true
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null,
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
        wx.setStorageSync('familyImages', _this.data.familyImages)
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 100)
      }
    })
  },
  previewImage: function (e) {
    let _this = this
    let imageTypeStr = e.currentTarget.dataset.imagetype
    wx.previewImage({
      current: e.currentTarget.id,
      urls: _this.data.familyImages[imageTypeStr].map(item => {return item.path})
    })
  },
  removeImageFiles (e) {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          let index = e.currentTarget.dataset.index;
          let imageTypeStr = e.currentTarget.dataset.imagetype
          _this.data.familyImages[imageTypeStr].splice(index, 1)
          _this.setData({
            [`familyImages.${imageTypeStr}`]: _this.data.familyImages[imageTypeStr]
          })
          let id = e.currentTarget.dataset.id;
          if (id) {
            common.deleteImage(id)
          }
          wx.setStorageSync('familyImages', _this.data.familyImages)
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  back () {
    wx.navigateBack({
      delta: 1
    })
  }
})
