import util from "../../../utils/util";
import common from "../../../utils/common";
const app = getApp()

Page({
  data: {
    orderId: null,
    role: 37, // 36 协办 37 吾悦人员
    liveImageFiles: [], // 案件图片
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    statusMap: {
      '11': '已办结',
      '20': '已派送',
    },
    businessInsuranceWuyueEntity: {},
    taskData: {
      status: null,
      provinceCode: '',
      cityCode: '',
      townCode: '',
      policyNo: '',
      reportNumber: '',
      budgetPreliminary: '',
      commentToSurvey: '',
      surveyUser: '',
      surveyPhone: '',
      workerUser: '',
      workerPhone: ''
    }
  },
  onLoad: function (routeParams) {
    setTimeout(() => {
      this.routeParams = routeParams
      this.initArea(this.init)
    }, 500)
  },
  init () {
    let routeParams = this?.routeParams
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role,
        userId: app.globalData.currentRegisterInfo.userId
      }, () => {
        this.initDataById(routeParams.id)
        this.getRegionLabel()
      })
    }
  },
  initDataById (id) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    let params = {
      orderId: id
    }
    util.request({
      path: '/app/businessinsurancewuyue/damageDetail',
      method: 'GET',
      data: params
    }, function (err, res) {
      let data = res.data
      _this.sourceData = data
      _this.sourceImage = res.Image
      let liveImageFiles = []

      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 2:
            item.path = `https://aplusprice.com/file/${item.path}`
            liveImageFiles.push(item)
            break
        }
      })

      _this.setData({
        orderId: data.orderId,
        region: data.townCode,
        liveImageFiles: liveImageFiles,
        businessInsuranceWuyueEntity: data,
        'taskData.status': data.status,
        'taskData.provinceCode': data.provinceCode,
        'taskData.cityCode': data.cityCode,
        'taskData.townCode': data.townCode,
        'taskData.policyNo': data.policyNo,
        'taskData.reportNumber': data.reportNumber,
        'taskData.budgetPreliminary': data.budgetPreliminary,
        'taskData.commentToSurvey': data.commentToSurvey || '',
        'taskData.surveyUser': data.surveyUser,
        'taskData.surveyPhone': data.surveyPhone,
        'taskData.workerUser': data.workerUser,
        'taskData.workerPhone': data.workerPhone
      }, () => {
        _this.getRegionLabel()
        wx.hideLoading()
      })
    })
  },
  openLocation() {
    this.setData({
      show: !this.show
    })
  },
  initArea (callback) {
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    try {
      let _this = this
      _this.setData({
        region: app.globalData.currentRegisterInfo.townCode,
        'taskData.townCode': app.globalData.currentRegisterInfo.townCode,
        'taskData.cityCode': app.globalData.currentRegisterInfo.cityCode,
        'taskData.provinceCode': app.globalData.currentRegisterInfo.provinceCode
      })
      util.request({
        path: '/sys/area/list',
        method: 'GET'
      }, function (err, res) {
        _this.setData({
          areaList: res ? res.DATA.DATA : []
        }, () => {
          _this.getRegionLabel()
          callback()
          wx.hideLoading()
        })
      })
    } catch (e) {

    }
  },
  getRegionLabel () {
    let arr = []
    if (this.data.region && this.data.areaList.hasOwnProperty('province_list')) {
      let provinceCode = this.data.region.slice(0,2) + '0000'
      let cityCode = this.data.region.slice(0,4) + '00'
      let townCode = this.data.region
      arr.push(this.data.areaList['province_list'][provinceCode])
      arr.push(this.data.areaList['city_list'][cityCode])
      arr.push(this.data.areaList['county_list'][townCode])
    }
    this.setData({
      regionLabel: arr.length ? arr.join(',') : ''
    })
  },
  onConfirm(data) {
    let strArr = []
    data.detail.values.forEach(item => {
      strArr.push(item.name)
    })

    this.setData({
      show: false,
      region: data.detail.values[2].code,
      regionLabel: strArr.join(','),
      'taskData.townCode': data.detail.values[2].code,
      'taskData.cityCode': data.detail.values[1].code,
      'taskData.provinceCode': data.detail.values[0].code,
    })
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let nameMap = {}
    if (name.indexOf('.') != -1) {
      let nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
    } else {
      if (index != undefined && index != null) {
        nameMap[name][index] = e.detail.value
      } else {
        nameMap[name] = e.detail.value
      }
    }
    this.setData(nameMap)
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
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 300)
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
  uploadOneByOne (imgPaths,successUp, failUp, count, length, isOfferSave) {
    var that = this
    let formData = {
      'flowId': that.data.orderId,
      'type': imgPaths[count].type
    }
    if (imgPaths[count].hasOwnProperty('clientIndex') && imgPaths[count].clientIndex != null) {
      formData.clientIndex = imgPaths[count].clientIndex
    }
    wx.uploadFile({
      url: imgPaths[count].type == 66  ? 'https://aplusprice.com/aprice/app/attachments/uploadVideo' : 'https://aplusprice.com/aprice/app/image/upload',
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: formData,
      success:function(e){
        let responseCode = JSON.parse(e.data)
        if (responseCode.code == 0) {
          successUp++;//成功+1
        } else {
          failUp++;//失败+1
        }
      },
      fail:function(e){
        failUp++;//失败+1
      },
      complete:function(e){
        count++;//下一张
        if(count == length){
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            mask: true,
            title: length == successUp ? '提交成功' : `图片上传失败:${failUp}`,
            icon: length == successUp ? 'success' : 'none',
            duration: 1000,
            success () {
              if (length == successUp) {
                setTimeout(() => {
                  if (isOfferSave == 1) {
                    wx.navigateTo({
                      url: `../new-ws-offer/new-ws-offer?id=${that.data.orderId}`
                    })
                  } else {
                    that.goToList()
                  }
                }, 1000)
              }
            }
          })
        }else{
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length, isOfferSave);
          console.log('正在上传第' + count + '张');
        }
      }
    })
  },
  copy (e) {
    let content = e.currentTarget.dataset.content+'';
    wx.setClipboardData({
      data: content,
      success (res) {
        wx.showToast({
          mask: true,
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  copyInfo () {
    wx.setClipboardData({
      data: `工单号: ${this.data.orderId}
被保险人姓名: ${this.data.taskData.surveyUser}
被保险人电话: ${this.data.taskData.surveyPhone}
现场信息: ${this.data.taskData.commentToSurvey}`,
      success (res) {
        wx.showToast({
          mask: true,
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  submitWS (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      townCode: data.townCode,
      policyNo: data.policyNo,
      reportNumber: data.reportNumber,
      budgetPreliminary: data.budgetPreliminary,
      commentToSurvey: data.commentToSurvey
    }
    if (this.data.orderId) {
      taskData.orderId = _this.data.orderId
    }
    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })
    if (liveImageFiles.length === 0) {
      wx.showToast({
        mask: true,
        title: '请上传现场照片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.townCode == ''){
      wx.showToast({
        mask: true,
        title: '请填写事故地',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.commentToSurvey == ''){
      wx.showToast({
        mask: true,
        title: '请填写现场信息',
        icon: 'none',
        duration: 2000
      })
      return
    }


    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? '/app/businessinsurancewuyue/surveySave' : '/app/businessinsurancewuyue/surveyCommit',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        _this.setData({
          orderId: res.data.flowId
        })
        let imgPaths = [...liveImageFiles]
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: isSave ? '暂存成功' : '创建成功',
            icon: 'success',
            duration: 1000,
            success () {
              setTimeout(() => {
                _this.goToList()
              }, 1000)
            }
          })
        }
      } else {
        wx.showToast({
          mask: true,
          title: isSave ? '暂存失败' : '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  workHandleWS (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      townCode: data.townCode,
      policyNo: data.policyNo,
      reportNumber: data.reportNumber,
      budgetPreliminary: data.budgetPreliminary,
      commentToSurvey: data.commentToSurvey
    }
    if (this.data.orderId) {
      taskData.orderId = _this.data.orderId
    }
    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })
    if (liveImageFiles.length === 0) {
      wx.showToast({
        mask: true,
        title: '请上传现场照片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.townCode == ''){
      wx.showToast({
        mask: true,
        title: '请填写事故地',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.commentToSurvey == ''){
      wx.showToast({
        mask: true,
        title: '请填写现场信息',
        icon: 'none',
        duration: 2000
      })
      return
    }


    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? '/app/businessinsurancewuyue/workerSave' : '/app/businessinsurancewuyue/workerCommit',
      method: 'POST',
      data: {
        businessInsuranceWuyueEntity: {
          ..._this.data.businessInsuranceWuyueEntity,
          ...taskData
        }
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.setData({
          orderId: res.data.flowId
        })
        let imgPaths = [...liveImageFiles]
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: isSave ? '暂存成功' : '提交成功',
            icon: 'success',
            duration: 1000,
            success () {
              setTimeout(() => {
                _this.goToList()
              }, 1000)
            }
          })
        }
      } else {
        wx.showToast({
          mask: true,
          title: isSave ? '暂存失败' : '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  goToList () {
    let pages = getCurrentPages()
    let index = pages.findIndex((item) => {
      return item.route == 'subpackage/wy/wy-list/wy-list'
    })
    if (index != -1) {
      wx.navigateBack({
        delta: pages.length - 1 - index
      })
    } else {
      wx.redirectTo({
        url: '../wy-list/wy-list'
      })
    }
  },
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      urls.push(item.path)
    })
    common.downloadImages({
      urls: urls
    })
  }
})
