//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1, // 1 查勘员、 12 施工人员、 13 报价人员、6 汇世达市级负责人、22 财务人员
    liveImageFiles: [], // 案件图片
    workLiveImageFiles: [], // 现场图片(施工方)
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    modifyId: null,
    workerList: [],
    workerValue: '',
    workerLabel: '',
    statusMap: {
      '11': '已办结',
      '12': '暂存',
      '13': '处理中',
      '20': '已派送',
      '41': '待报价',
      '43': '驳回',
      '50': '已报价',
    },
    taskData: {
      status: null,
      provinceCode: '',
      cityCode: '',
      townCode: '',
      area: '',
      insuranceType: '1',
      damagedUser: '',
      damagedPhone: '',
      customerUser: '',
      customerPhone: '',
      plateNumber: '',
      live: '',
      surveyUser: '',
      surveyPhone: '',
      workerUser: '',
      workerPhone: '',
      workType: 0,
      budgetPreliminary: '', // 初步估损金额
      damageMoney: '', // 受损方索赔金额
      handlingType: 0,
      isAcceptance: 0,
      isAgree: 0,
      deposit: '',
      bidder: '',
      offerRemark: '',
      companyName: ''
    }
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/damage/damageDetail',
      method: 'GET',
      data: {
        damageId: id
      }
    }, function (err, res) {
      let data = res.data
      _this.sourceData = data
      _this.sourceImage = res.Image
      let liveImageFiles = []
      let workLiveImageFiles = []

      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 2:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            liveImageFiles.push(item)
            break
          case 3:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workLiveImageFiles.push(item)
            break
        }
      })
      _this.setData({
        modifyId: data.id,
        region: data.area,
        liveImageFiles: liveImageFiles,
        workLiveImageFiles: workLiveImageFiles,
        'taskData.status': data.status,
        'taskData.area': data.area,
        'taskData.insuranceType': data.insuranceType,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone || '',
        'taskData.customerUser': data.customerUser,
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        'taskData.live': data.live,
        "taskData.surveyUser": data.surveyUser,
        "taskData.surveyPhone": data.surveyPhone,
        "taskData.workerUser": data.workerUser,
        "taskData.workerPhone": data.workerPhone,
        "taskData.workType": data.workType,
        "taskData.budgetPreliminary": data.budgetPreliminary,
        "taskData.damageMoney": data.damageMoney,
        'taskData.handlingType': data.handlingType,
        'taskData.deposit': data.deposit,
        'taskData.bidder': data.bidder,
        'taskData.offerRemark': data.offerRemark,
        'taskData.companyName': data.companyName
      })
      _this.initReassignList()
      _this.getRegionLabel()
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
  isLicenseNo(str){
    str = str.toUpperCase()
    str = str.replace(/\s+/g,"")
    if (str) {
      let flag = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
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
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.area': app.globalData.currentRegisterInfo.townCode,
      'taskData.townCode': app.globalData.currentRegisterInfo.townCode,
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
  initReassignList () {
    let _this = this
    util.request({
      path: '/app/damage/getPersonList',
      method: 'GET',
      data: {
        role: 12,
        townCode: (this.data.region.slice(0,4) + '00')
      }
    }, function (err, res) {
      _this.workListSource = res.data
      let workerList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      _this.setData({
        'workerList': workerList
      })
    })
  },
  workerChange (event) {
    this.setData({
      'workerValue': event.detail.value,
      'workerLabel': this.workListSource[event.detail.value].name
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
      'taskData.area': data.detail.values[2].code,
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
  onRadioChange (event) {
    let key = `taskData.${event.currentTarget.dataset.name}`
    if (event.detail != '1' && event.currentTarget.dataset.name == 'insuranceType') {
      this.setData({
        'taskData.plateNumber': ''
      })
    }
    this.setData({
      [key]: event.detail
    });
  },
  chooseImage: function (e) {
    let key = e.currentTarget.dataset.name
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data[key].concat(tempList)
        that.setData({
          [key]: list
        })
      }
    })
  },
  previewImage: function (e) {
    let key = e.currentTarget.dataset.name
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data[key].map(item => {return item.path})
    })
  },
  removeImage (e) {
    let key = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          _this.data[key].splice(index, 1)
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
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload',
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.id || that.data.id,
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
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  uploadImage () {
    let _this = this
    let workLiveImageFiles = []
    _this.data.workLiveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workLiveImageFiles.push({path: item.path, type: 3})
      }
    })

    let imgPaths = [...workLiveImageFiles]
    console.log('Upload Files:', imgPaths)
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  submitWS (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      townCode: data.townCode,
      area: data.area,
      insuranceType: data.insuranceType,
      damagedUser: data.damagedUser,
      damagedPhone: data.damagedPhone,
      customerUser: data.customerUser,
      customerPhone: data.customerPhone,
      plateNumber: data.plateNumber,
      information: data.information,
      live: data.live
    }

    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })

    if (this.data.modifyId) {
      taskData.id = _this.data.modifyId
      taskData.liveImage = liveImageFiles.length > 0 ? 1 : 0
      taskData.damageId = _this.data.id
    }

    if (taskData.customerPhone != ''){
      let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    if(taskData.damagedPhone != '') {
      let isVaiddamagedPhone = this.checkPhone(taskData.damagedPhone, '请输入正确的受损人手机号')
      if (!isVaiddamagedPhone) {
        return
      }
    }

    if (taskData.damagedPhone == '' && taskData.customerPhone == ''){
      wx.showToast({
        mask: true,
        title: '请填写客户手机、受损人手机',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.insuranceType == '1') {
      let flag = this.isLicenseNo(taskData.plateNumber)
      if (!flag) {
        return
      }
    }

    console.log('工单新建 改善参数：', taskData)
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? '/app/damage/saveBySurvey' : '/app/damage/addBySurvey',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建 改善结果：', res)
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
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-ws/my-list-ws'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-ws/my-list-ws'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-ws/my-list-ws'
      })
    }
  },
  workHandleWS (e) {
    let _this = this
    let data = this.data.taskData
    let isSave = e.currentTarget.dataset.save
    if (data.workType == '' || data.workType == null) {
      wx.showToast({
        mask: true,
        title: '请选择处理方式',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (data.damageMoney == '' || data.damageMoney == null) {
      wx.showToast({
        mask: true,
        title: '请填写报损金额',
        icon: 'none',
        duration: 1000
      })
      return
    }

    let workLiveImageFiles = []
    _this.data.workLiveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workLiveImageFiles.push({path: item.path, type: 3})
      }
    })
    let params = {
      id: this.data.modifyId,
      damageId: this.data.id,
      surveyUser: data.surveyUser,
      surveyPhone: data.surveyPhone,
      workerUser: data.workerUser,
      workerPhone: data.workerPhone,
      workType: data.workType,
      budgetPreliminary: data.budgetPreliminary,
      damageMoney: data.damageMoney,
      handlingType: data.handlingType,
      deposit: data.deposit,
      bidder: data.bidder,
      offerRemark: data.offerRemark,
      isTempSave: isSave ? 'save' : 'commit'
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/addByWorker',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...workLiveImageFiles]
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
  modifyWS () {
    this.submitWS()
  },
  cooperaterManagerAssign () {
    let _this = this
    if (this.data.workerValue == null || this.data.workerValue == undefined || this.data.workerValue == ''){
      wx.showToast({
        mask: true,
        title: '请选择改派人员',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/reassignment',
      method: 'POST',
      data: {
        damageId: this.data.id,
        workerId: this.workListSource[this.data.workerValue].userId,
        workerPhone: this.workListSource[this.data.workerValue].mobile
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      urls.push(item.path)
    })
    common.downloadImages({
      urls: urls
    })
  },
  goToOffer (event) {
    wx.navigateTo({
      url: '../new-ws-offer/new-ws-offer?id=' + event.currentTarget.dataset.id
    })
  }
})
