import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
Page({
  data: {
    reportNumber: '',
    name: '',
    phone: '',
    typeValue: '',
    typeList: ['家财', '车物', '非车', '其他'],
    typeLabel: '',
    liveImageFiles: [],
    show: false,
    comment: '',
    address: '',
    userLocationInfo: {
      latitude: null,
      longitude: null,
      name: '位置'
    }
  },
  onLoad: function (routeParams) {
  },
  pickerChange (e) {
    let that = this
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}List`][e.detail.value] || ''
    }, () => {
      if (name === 'tisCompany') {
        that.getTisUser()
      }
    })
  },
  chooseImage: function (e) {
    let key = e.currentTarget.dataset.name
    let hasChild = e.currentTarget.dataset.hasOwnProperty('index')
    let idx = e.currentTarget.dataset.index
    var that = this;
    app.globalData.isIgnoreRefresh = true
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        res.tempFilePaths.forEach((item, index) => {
          wx.compressImage({
            src: item,
            quality: res.tempFiles[index].size > 2 * 1024 * 1024 ? 50 : 90,
            success ({tempFilePath}) {
              let list = that.data[key]
              if (hasChild) {
                list[idx] = list[idx].concat([{
                  "path": tempFilePath, "id": null, "clientIndex": idx
                }])
              } else {
                list = that.data[key].concat([{
                  "path": tempFilePath, "id": null
                }])
              }
              that.setData({
                [key]: list
              })
            }
          })
        })
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 100)
      }
    })
  },
  previewImage: function (e) {
    let key = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    let data = index !== undefined ? this.data[key][index] : this.data[key]
    app.globalData.isIgnoreRefresh = true
    wx.previewImage({
      current: e.currentTarget.id,
      urls: data.map(item => {return item.path})
    })
  },
  removeImage (e) {
    let key = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let childindex = e.currentTarget.dataset.childindex;
    let hasChildindex = e.currentTarget.dataset.hasChildindex;
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          if (hasChildindex) {
            _this.data[key][childindex].splice(childindex, 1)
          } else {
            _this.data[key].splice(index, 1)
          }
          _this.setData({
            [key]: _this.data[key]
          })
          let id = e.currentTarget.dataset.id;
          if (id) {
            common.deleteImage(id)
          }
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let nameMap = {}
    if (index !== undefined) {
      nameMap[`${name}[${index}]`] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    this.setData(nameMap)
  },
  onRadioChange (event) {
    let key = `${event.currentTarget.dataset.name}`
    this.setData({
      [key]: event.detail
    });
  },
  chooseLocation () {
    let _this = this
    app.globalData.isIgnoreRefresh = true
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success (res) {
        const latitude = _this.data.userLocationInfo.latitude || res.latitude
        const longitude = _this.data.userLocationInfo.longitude || res.longitude
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          success (location) {
            console.log('location:', location)
            _this.setData({
              address: location.address,
              userLocationInfo: {
                latitude: location.latitude,
                longitude: location.longitude
              }
            })
            setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 100)
          }
        })
      },
      fail: function (res) {
        if (res.errMsg == 'getLocation:fail auth deny') {
          wx.openSetting({
            success: function (res) {
              if (res.authSetting['scope.userLocation'] == false) {
                wx.showModal({
                  title: '提示',
                  content: '您未开启定位权限.',
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '您已开启定位权限，请重新点击登录',
                  showCancel: false
                })
              }
            }
          })
        }
      }
    })
  }
})
