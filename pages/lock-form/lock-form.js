//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    orderId: null,
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    repairPlantValue: '',
    repairPlantLabel: '',
    repairPlantList: [],
    status: '',
    statusMap: {
      '12': '暂存',
      '1': '查勘员已派送',
      '13': '负责人已确认',
      '11': '已办结',
      '99': '处理中'
    },
    taskData: {
      "provinceCode": "",
      "areaCode": "",
      "cityCode": "",
      "customMobile": '',
      "customName": "",
      "information": "",
      "offer": "",
      "live": "",
      "insurerUserMobile": "",
      "lockUserMobile": ""
    },
    informationImageFiles: [],
    liveImageFiles: []
  },
  onLoad: function (routeParams ) {
    console.log('开锁 工单号：->', routeParams)
    console.log('当前用户信息->', app.globalData.currentRegisterInfo)
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.orderId,
        role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role // 19
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/lock/info',
      method: 'GET',
      data: {
        id: id
      }
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.image
      let informationImageFiles = []
      let liveImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 9:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            liveImageFiles.push(item)
            break
        }
      })
      _this.setData({
        'informationImageFiles': informationImageFiles,
        'liveImageFiles': liveImageFiles,
        'status': data.status,
        'taskData.areaCode': data.areaCode,
        'taskData.cityCode': data.cityCode,
        'taskData.provinceCode': data.provinceCode,
        "taskData.customMobile": data.customMobile,
        "taskData.customName": data.customName,
        "taskData.information": data.information,
        "taskData.offer": data.offer,
        "taskData.live": data.live,
        "taskData.insurerUserMobile": data.insurerUserMobile,
        "taskData.lockUserMobile": data.lockUserMobile
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.area': app.globalData.currentRegisterInfo.townCode,
      'taskData.areaCode': app.globalData.currentRegisterInfo.townCode,
      'taskData.cityCode': app.globalData.currentRegisterInfo.cityCode,
      'taskData.provinceCode': app.globalData.currentRegisterInfo.provinceCode
    })
    util.request({
      path: '/sys/area/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res.DATA.DATA
      })
      _this.getRegionLabel()
    })
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
  openLocation() {
    this.setData({
      show: !this.show
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
      'taskData.areaCode': data.detail.values[2].code,
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
    let nameMap = {}
    if (name.indexOf('.')) {
      let nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    this.setData(nameMap)
  },
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  onTypeChange (event) {
    this.setData({
      'taskData.type': event.detail
    });
  },
  isLicenseNo(str){
    str = str.replace(/\s+/g,"")
    if (str) {
      let flag = /(^[\u4E00-\u9FA5]{1}[A-Za-z0-9]{6}$)|(^[A-Za-z]{2}[A-Za-z0-9]{2}[A-Za-z0-9\u4E00-\u9FA5]{1}[A-Za-z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Za-z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Za-z]{2}[0-9]{5}$)|(^(08|38){1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警军港澳]{1}$)/.test(str);
      if (!flag) {
        wx.showToast({
          mask: true,
          title: '车牌号不正确',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else {
      wx.showToast({
        mask: true,
        title: '车牌号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  },
  previewInfoImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.informationImageFiles.map(item => {return item.path})
    })
  },
  removeinformationImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.informationImageFiles.splice(index, 1)
    this.setData({
      informationImageFiles: _this.data.informationImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  chooseInfoImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.informationImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '报案图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            informationImageFiles: list
          });
        }
      }
    })
  },
  previewLiveImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.liveImageFiles.map(item => {return item.path})
    })
  },
  removeLiveImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.liveImageFiles.splice(index, 1)
    this.setData({
      liveImageFiles: _this.data.liveImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  chooseLiveImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.liveImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '现场图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            liveImageFiles: list
          });
        }
      }
    })
  },
  commitSubmit (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      "customMobile": data.customMobile,
      "customName": data.customName,
      "information": data.information,
      "areaCode": data.areaCode,
      "cityCode": data.cityCode,
      "provinceCode": data.provinceCode
    }
    if (this.data.id) {
      taskData.id = this.data.id
      taskData.orderId = this.data.orderId
    }
    if (this.data.status == '12'){ // 暂存 二次点击
      taskData.status = '12'
    }
    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 1})
      }
    })

    if (taskData.customName == '') {
      wx.showToast({
        mask: true,
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.customMobile == '' && _this.data.informationImageFiles.length == 0) {
      wx.showToast({
        mask: true,
        title: '客户手机和报案图片必须填写一项',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.customMobile) {
      let isVaidcustomerPhone = this.checkPhone(taskData.customMobile, '请输入正确的客户手机号')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? '/app/lock/save' : '/app/lock/commit',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        let imgPaths = [...informationImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'orderId': res.orderId
        })
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: '创建成功',
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
          title: '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  managerSubmit () {
    let _this = this
    let taskData = {
      'id': this.data.id
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/lock/confirm',
      method: 'PUT',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '提交成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              _this.goToList()
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          mask: true,
          title: '提交失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  completeSubmit () {
    let data = this.data.taskData
    let _this = this
    let taskData = {
      "customMobile": data.customMobile,
      "customName": data.customName,
      "information": data.information,
      "areaCode": data.areaCode,
      "cityCode": data.cityCode,
      "provinceCode": data.provinceCode,
      'id': this.data.id,
      'offer': data.offer,
      'live': data.live
    }

    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 9})
      }
    })

    if (liveImageFiles.length == 0) {
      wx.showToast({
        mask: true,
        title: '请上传收款及现场照片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.offer == '') {
      wx.showToast({
        mask: true,
        title: '请填写收款金额',
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
      path: '/app/lock/finish',
      method: 'PUT',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...liveImageFiles]
        console.log('Upload Files:', imgPaths)
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: '提交成功',
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
          title: '提交失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.data.orderId,
        'type': imgPaths[count].type
      },
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
                  that.goToList()
                }, 1000)
              }
            }
          })
        }else{
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          console.log('正在上传第' + count + '张');
        }
      }
    })
  },
  checkPhone (str, msg){
    if(!(/^1[3456789]\d{9}$/.test(str))){
      wx.showToast({
        mask: true,
        title: msg,
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  },
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-lock/my-list-lock'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-lock/my-list-lock'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-lock/my-list-lock'
      })
    }
  },
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      if (!((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4 )) {
        urls.push(item.path)
      }
    })
    console.log(urls, '?')
    common.downloadImages({
      urls: urls
    })
  }
})
