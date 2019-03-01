//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    modifyId: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    repairPlantValue: '',
    repairPlantLabel: '',
    repairPlantList: [],
    insurer: '',
    insurerLabel: '',
    insurerList: [],
    insurerUser: '',
    insurerUserLabel: '',
    insurerUserList: [],
    status: '',
    statusMap: {
      '51': '提交至修理厂',
      '52': '待修理厂报价',
      '53': '待报价中心报价',
      '54': '待保险公司核价',
      '56': '保险公司核价完成'
    },
    taskData: {
      autoInsuranceName: '',
      autoInsuranceMobile: '',
      plateNumber: '',
      type: '1',
      areaCode: '',
      cityCode: '',
      provinceCode: '',
      repairPlantId: '',
      remark: '',

      originatorUserName: '',
      originatorUserMobile: '',
      insurerId: '',
      insurerUserId: '',
      insurerUserMobile: '',
      insurerPrice: ''
    },
    informationImageFiles: [],
    assessImageFiles: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../register/register?id='+123
    })
  },
  onLoad: function (routeParams ) {
    console.log('车险 工单号：->', routeParams)
    console.log('当前用户信息->', app.globalData.currentRegisterInfo)
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role//  TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/autoInsurance/info',
      method: 'GET',
      data: {
        autoInsuranceId: id
      }
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.Image
      let informationImageFiles = []
      let assessImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 2:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 8:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            assessImageFiles.push(item)
            break
        }
      })
      _this.setData({
        'modifyId': data.id,
        'taskData.autoInsuranceName': data.autoInsuranceName,
        'taskData.autoInsuranceMobile': data.autoInsuranceMobile,
        'taskData.plateNumber': data.plateNumber,
        'taskData.type': data.type,
        'taskData.areaCode': data.areaCode,
        'taskData.cityCode': data.cityCode,
        'taskData.provinceCode': data.provinceCode,
        'taskData.repairPlantId': data.repairPlantId,
        "taskData.remark": data.remark,

        'status': data.status,
        'repairPlantLabel': data.repairPlantName,
        'taskData.originatorUserName': data.originatorUserName,
        'taskData.originatorUserMobile': data.originatorUserMobile,

        'insurerUserLabel': data.insurerUserName,
        'insurerLabel': data.insurerName,

        "taskData.insurerId": data.insurerId,
        "taskData.insurerUserId": data.insurerUserId,
        "taskData.insurerUserMobile": data.insurerUserMobile,
        'taskData.insurerPrice': data.insurerPrice,
        'informationImageFiles': informationImageFiles,
        'assessImageFiles': assessImageFiles
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
    this.initRepairPlant()
    this.initinsurerCompany()
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
  initinsurerCompany () {
    let _this = this
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: {
        industryCode: '2',
        organization: '2',
        insurance: '2',
        cityCode: _this.data.taskData.cityCode,
        provinceCode: _this.data.taskData.provinceCode,
        areaCode: _this.data.taskData.areaCode
      }
    }, function (err, res) {
      _this.insurerCompanySource = res.data
      _this.setData({
        'insurerList': res.data.map(item => {
          return item.companyName
        })
      })
    })
  },
  initRepairPlant () {
    let _this = this
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: {
        industryCode: '8',
        organization: '2',
        cityCode: _this.data.taskData.cityCode,
        provinceCode: _this.data.taskData.provinceCode,
        areaCode: _this.data.taskData.areaCode
      }
    }, function (err, res) {
      _this.repairPlantSource = res.data
      _this.setData({
        'repairPlantList': res.data.map(item => {
          return item.companyName
        })
      })
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
  repairPlantChange (event) {
    let repairPlantId = this.repairPlantSource[event.detail.value].id
    this.setData({
      'taskData.repairPlantId': repairPlantId,
      'repairPlantValue': event.detail.value,
      'repairPlantLabel': this.repairPlantSource[event.detail.value].companyName
    })
  },
  bindInsurerChange (event) {
    let _this = this
    let insurerCompanyId = this.insurerCompanySource[event.detail.value].id
    console.log('insurerCompanyId:', insurerCompanyId)
    util.request({
      path: '/app/userList',
      method: 'GET',
      data: {
        companyId: insurerCompanyId
      }
    }, function (err, res) {
      _this.insurerUserSource = res.data
      _this.setData({
        'insurerUserList': res.data.map(item => {
          return item.name
        })
      })
    })
    this.setData({
      'taskData.insurerId': insurerCompanyId,
      'insurer': event.detail.value,
      'insurerLabel': this.insurerCompanySource[event.detail.value].companyName
    })
  },
  bindInsurerUserChange (event) {
    let insurerUserId = this.insurerUserSource[event.detail.value].userId
    let insurerUserMobile = this.insurerUserSource[event.detail.value].mobile
    this.setData({
      'taskData.insurerUserId': insurerUserId,
      'taskData.insurerUserMobile': insurerUserMobile,
      'insurerUser': event.detail.value,
      'insurerUserLabel': this.insurerUserSource[event.detail.value].name
    })
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
  previewAssessImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.assessImageFiles.map(item => {return item.path})
    })
  },
  removeAssessImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.assessImageFiles.splice(index, 1)
    this.setData({
      assessImageFiles: _this.data.assessImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  chooseAssessImage: function (e) {
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
        let list = that.data.assessImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '报案图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            assessImageFiles: list
          });
        }
      }
    })
  },
  newSubmit () {
    let data = this.data.taskData
    let _this = this
    let taskData = {
      "areaCode": data.areaCode,
      "cityCode": data.cityCode,
      "provinceCode": data.provinceCode,
      "autoInsuranceMobile": data.autoInsuranceMobile,
      "autoInsuranceName": data.autoInsuranceName,
      "plateNumber": data.plateNumber,
      "remark": data.remark,
      "repairPlantId": data.repairPlantId,
      "type": data.type
    }
    // type=2 现场图片上传  type=8 上传定损图片
    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 2})
      }
    })

    if (taskData.autoInsuranceName == '') {
      wx.showToast({
        mask: true,
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.autoInsuranceMobile, '请输入正确的客户手机号')
    if (!isVaidcustomerPhone) {
      return
    }

    let flag = this.isLicenseNo(taskData.plateNumber)
    if (!flag) {
      return
    }

    if (!informationImageFiles.length){
      wx.showToast({
        mask: true,
        title: '请上传报案照片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.repairPlantId == '' || taskData.repairPlantId == null){
      wx.showToast({
        mask: true,
        title: '请选择修理厂',
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
      path: '/app/autoInsurance',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        let imgPaths = [...informationImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'id': res.autoInsuranceId
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
  assessSubmit () {
    let data = this.data.taskData
    let _this = this
    let taskData = {
      "id": this.data.modifyId,
      "autoInsuranceId": this.data.id,
      "insurerId": '1' || data.insurerId,
      "insurerUserId": '1' || data.insurerUserId,
      "insurerUserMobile": '1504992092' || data.insurerUserMobile
    }

    let assessImageFiles = []
    _this.data.assessImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        assessImageFiles.push({path: item.path, type: 8})
      }
    })

    if (taskData.insurerId == '' || taskData.insurerId == null) {
      wx.showToast({
        mask: true,
        title: '请选择保险公司',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (taskData.insurerUserId == '' || taskData.insurerUserId == null) {
      wx.showToast({
        mask: true,
        title: '请选择定损人员',
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
      path: '/app/autoInsurance',
      method: 'PUT',
      data: taskData
    }, function (err, res) {
      console.log('定损 提交：', res)
      if (res.code == 0) {
        let imgPaths = [...assessImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'id': res.autoInsuranceId
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
        'flowId': that.data.id,
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
    if(!(/^1[345789]\d{9}$/.test(str))){
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
      return item.route == 'pages/my-list-cx/my-list-cx'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-cx/my-list-cx'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-cx/my-list-cx'
      })
    }
  },
  downloadImages () {
    let urls = this.sourceImage.map(item => {
      if (!((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4 )) {
        return item.path
      }
    })
    common.downloadImages({
      urls: urls
    })
  }
})
