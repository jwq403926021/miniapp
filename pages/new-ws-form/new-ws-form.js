//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    orderId: null,
    showKeyboard: false,
    role: 1, // 1 查勘员、 12 施工人员、 13 报价人员、6 汇世达市级负责人、22 财务人员
    liveImageFiles: [], // 案件图片
    workLiveImageFiles: [], // 现场图片(施工方)
    workVideo: [], // 视频(施工方)
    show: false,
    showreassign: false,
    showWorkerHit: false,
    areaList: {},
    region: '',
    regionLabel: '',
    reassignRegion: '',
    reassignRegionLabel: '',
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
      insuranceType: '1',
      damagedUser: '',
      damagedPhone: '',
      customerUser: '',
      customerPhone: '',
      plateNumber: '',
      information: '',
      surveyUser: '',
      surveyPhone: '',
      workerUser: '',
      workerPhone: '',
      workType: '0',
      budgetPreliminary: '', // 初步估损金额
      damageMoney: '', // 受损方索赔金额
      handlingType: '0',
      isAcceptance: '0',
      isAgree: '0',
      deposit: '',
      prepay: '',
      offerRemark: '',
      commentToSurvey: '',
      commentToOffer: '',
      companyName: '',
      financeRemark: '',
      manageMoney: '',
      insurePay: '',
      payWorker: '',
      reportNumber: ''
    },
    activeVideo: '',
    location: {
      latitude: '',
      longitude: ''
    }
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.type) {
      this.setData({
        'taskData.insuranceType': routeParams.type || '',
      })
    }
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      }, () => {
        this.initDataById(routeParams.id)
      })
    }
  },
  initDataById (id) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessdamagenew/damageDetail',
      method: 'GET',
      data: {
        orderId: id
      }
    }, function (err, res) {
      let data = res.data

      if (data.status == 20 && _this.data.role == 12) {
        _this.setData({
          showWorkerHit: true
        })
      }

      _this.sourceData = data
      _this.sourceImage = res.Image
      _this.sourceAttachment = res.attachment
      let liveImageFiles = []
      let workLiveImageFiles = []
      let workVideo = []

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
      _this.sourceAttachment.forEach(item => {
        if (item.type) {
          item.path = `https://aplusprice.xyz/file/${item.path}`
          workVideo.push(item)
        }
      })
      _this.setData({
        orderId: data.orderId,
        region: data.townCode,
        liveImageFiles: liveImageFiles,
        workLiveImageFiles: workLiveImageFiles,
        workVideo: workVideo,
        'taskData.surveyId': data.surveyId,
        'taskData.status': data.status,
        'taskData.insuranceType': data.insuranceType,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone || '',
        'taskData.customerUser': data.customerUser,
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        "taskData.surveyUser": data.surveyUser,
        "taskData.surveyPhone": data.surveyPhone,
        "taskData.workerUser": data.workerUser,
        "taskData.workerPhone": data.workerPhone,
        "taskData.workType": data.workType,
        "taskData.budgetPreliminary": data.budgetPreliminary,
        "taskData.damageMoney": data.damageMoney,
        'taskData.handlingType': data.handlingType,
        'taskData.deposit': data.deposit,
        'taskData.prepay': data.prepay,
        'taskData.offerRemark': data.offerRemark,
        'taskData.companyName': data.companyName,
        'taskData.cityManager': data.cityManager,
        'taskData.workerId': data.workerId,
        'taskData.commentToSurvey': data.commentToSurvey,
        'taskData.commentToOffer': data.commentToOffer,
        'taskData.financeRemark': data.financeRemark,
        'taskData.manageMoney': data.manageMoney,
        'taskData.insurePay': data.insurePay,
        'taskData.payWorker': data.payWorker,
        'taskData.isAcceptance': data.isAcceptance,
        'taskData.isAgree': data.isAgree,
        'taskData.reportNumber': data.reportNumber
      })
      if (_this.data.role == 12 && (data.status == 13 || data.status == 20)) {
        _this.initReassignList()
      }
      _this.getRegionLabel()
      wx.hideLoading()
    })
  },
  checkPhone (str, msg){
    str = str.replace(/\s/g, '')
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
          areaList: res.DATA.DATA
        })
        _this.getRegionLabel()
      })
    } catch (e) {

    }
  },
  initReassignList () {
    let _this = this
    util.request({
      path: '/app/businessdamagenew/getSameUnitWorker',
      method: 'GET',
      data: {
        workerId: this.data.taskData.workerId
      }
    }, function (err, res) {
      if (res) {
        _this.workListSource = res.data
        let workerList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          'workerList': workerList
        })
      }
    })
  },
  initReassignListForCitymanger () {
    let _this = this
    util.request({
      path: `/app/family/getWorkerByCity?city=${this.data.reassignRegion}`,
      method: 'GET'
    }, function (err, res) {
      if (res) {
        _this.workListSource = res.data
        let workerList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          'workerList': workerList
        })
      }
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
  openReassignLocation() {
    this.setData({
      showreassign: !this.showreassign
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
  onConfirmReassign(data) {
    let strArr = []
    data.detail.values.forEach(item => {
      strArr.push(item.name)
    })
    this.setData({
      showreassign: false,
      reassignRegion: data.detail.values[1].code,
      reassignRegionLabel: strArr.join(',')
    }, () => {
      this.initReassignListForCitymanger()
    })
  },
  onCancel() {
    this.setData({
      show: false,
      showreassign: false
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
  chooseVideo: function (e) {
    let key = e.currentTarget.dataset.name
    var that = this;
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        let tempList = []
        tempList.push({
          "path": res.tempFilePath, "id": 66, "thumbTempFilePath": res.thumbTempFilePath
        })
        let list = that.data[key].concat(tempList)
        that.setData({
          [key]: list
        })
      }
    })
  },
  closePlateNum () {
    this.setData({
      showKeyboard: false
    })
  },
  openPlatePicker () {
    this.setData({
      showKeyboard: true
    })
  },
  setNumber (event) {
    this.setData({
      'taskData.plateNumber': event.detail.value
    })
  },
  previewVideo: function (e) {
    let key = e.currentTarget.dataset.name
    let id = e.currentTarget.id
    // let src = this.data[key].map(item => {return item.path})
    this.setData({
      activeVideo: id
    })
  },
  closePreviewVideo: function (e) {
    this.setData({
      activeVideo: ''
    })
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
  removeVideo (e) {
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
            common.deleteAttach(id)
          }
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length, isOfferSave) {
    var that = this
    wx.uploadFile({
      url: imgPaths[count].type == 66  ? 'https://aplusprice.xyz/aprice/app/attachments/uploadVideo' : 'https://aplusprice.xyz/aprice/app/image/upload',
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
  dialPhone (e) {
    let _this = this
    let phone = e.currentTarget.dataset.phone+'';
    let worker = e.currentTarget.dataset.worker+'';

    if (worker && this.data.taskData.status == 20 && this.data.role == 12) {
      util.request({
        path: '/app/businessdamagenew/contanctCustomer',
        method: 'GET',
        data: {
          orderId: _this.data.orderId,
          surveyId: _this.data.taskData.surveyId
        }
      }, function (err, res) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              _this.goToList()
            }, 1000)
          }
        })
      })
    }
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
      insuranceType: data.insuranceType,
      damagedUser: data.damagedUser,
      damagedPhone: data.damagedPhone,
      customerUser: data.customerUser,
      customerPhone: data.customerPhone,
      plateNumber: data.plateNumber,
      reportNumber: data.reportNumber,
      information: data.information
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

    if (taskData.insuranceType == 1) {
      let flag = this.isLicenseNo(taskData.plateNumber)
      if (!flag) {
        wx.showToast({
          mask: true,
          title: '请填写正确的车牌号',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    if (taskData.insuranceType == 1 && taskData.reportNumber == '') {
      wx.showToast({
        mask: true,
        title: '请填写报案号',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.customerPhone != ''){
      let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的沟通方式')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    if(taskData.damagedPhone != '') {
      let isVaiddamagedPhone = this.checkPhone(taskData.damagedPhone, '请输入正确的沟通方式')
      if (!isVaiddamagedPhone) {
        return
      }
    }

    if (taskData.damagedPhone == '' && taskData.customerPhone == ''){
      wx.showToast({
        mask: true,
        title: '请填写沟通方式',
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
      path: isSave ? '/app/businessdamagenew/surveySave' : '/app/businessdamagenew/surveyCommit',
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
  goToList () {
    let pages = getCurrentPages()
    let index = pages.findIndex((item) => {
      return item.route == 'pages/new-my-list-ws/new-my-list-ws'
    })
    if (index != -1) {
      wx.navigateBack({
        delta: pages.length - 1 - index
      })
    } else {
      wx.redirectTo({
        url: '../new-my-list-ws/new-my-list-ws?type=' + this.data.taskData.insuranceType
      })
    }
  },
  workHandleWS (e, save, isOfferSave) {
    let _this = this
    let isSave = e ? e.currentTarget.dataset.save : save
    let workLiveImageFiles = []
    let workLiveImageAlreadyFiles = []
    let workVideo = []
    let workVideoAlreadyFiles = []
    _this.data.workLiveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workLiveImageFiles.push({path: item.path, type: 3})
      } else {
        workLiveImageAlreadyFiles.push(item)
      }
    })
    _this.data.workVideo.map(item => {
      if (item.path.indexOf('https://') == -1){
        workVideo.push({path: item.path, type: 66})
      } else {
        workVideoAlreadyFiles.push(item)
      }
    })
    let isSendFirstTimeUpload = workLiveImageAlreadyFiles.length === 0 && workVideoAlreadyFiles.length === 0 && (workLiveImageFiles.length > 0 || workVideo.length > 0)
    let url = isSave ? `/app/businessdamagenew/workerSave` : `/app/businessdamagenew/workerCommit`
    let {
      provinceCode,
      cityCode,
      townCode,
      damagedUser,
      damagedPhone,
      customerUser,
      customerPhone,
      plateNumber,
      insuranceType,
      commentToSurvey,
      handlingType,
      budgetPreliminary,
      workType,
      deposit,
      prepay,
      commentToOffer,
      offerRemark,
      damageMoney,
      isAcceptance,
      isAgree
    } = this.data.taskData
    if (!isSave) {
      if (budgetPreliminary == null || budgetPreliminary == '') {
        wx.showToast({
          mask: true,
          title: '初步估损金额不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if (damageMoney == null || damageMoney == '') {
        wx.showToast({
          mask: true,
          title: '受损方索赔金额不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if (handlingType == null || handlingType == '') {
        wx.showToast({
          mask: true,
          title: '处理方式不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url,
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        provinceCode,
        cityCode,
        townCode,
        damagedUser,
        damagedPhone,
        customerUser,
        customerPhone,
        plateNumber,
        insuranceType,
        commentToSurvey,
        handlingType,
        budgetPreliminary,
        workType,
        deposit,
        prepay,
        commentToOffer,
        offerRemark,
        damageMoney,
        isAcceptance,
        isAgree
      }
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...workLiveImageFiles, ...workVideo]
        let count = 0
        let successUp = 0
        let failUp = 0
        if (isSendFirstTimeUpload) {
          util.request({
            path: `/app/businessdamagenew/insertUploadTime`,
            method: 'GET',
            data: {
              orderId: _this.data.orderId
            }
          }, function (err, res) {})
        }
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length, isOfferSave)
        } else {
          if (isOfferSave == 1) {
            wx.navigateTo({
              url: `../new-ws-offer/new-ws-offer?id=${_this.data.orderId}`
            })
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
  financeSubmit (e) {
    let _this = this
    let data = this.data.taskData
    let isSave = e.currentTarget.dataset.save
    util.request({
      path: isSave ? `/app/businessdamagenew/financeSave` : `/app/businessdamagenew/financeCommit`,
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        financeRemark: this.data.taskData.financeRemark,
        manageMoney: this.data.taskData.manageMoney,
        insurePay: this.data.taskData.insurePay,
        payWorker: this.data.taskData.payWorker,
        cityManager: this.data.taskData.cityManager,
        handlingType: this.data.taskData.handlingType
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
  workerSubmitComment () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagenew/workerMessage',
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        commentToSurvey: this.data.taskData.commentToSurvey,
        commentToOffer: this.data.taskData.commentToOffer
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
  assignToOther () {
    let _this = this
    if (this.data.workerValue == null || this.data.workerValue == undefined || this.data.workerValue == ''){
      wx.showToast({
        mask: true,
        title: '请选择转办人员',
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
      path: '/app/businessdamagenew/changeWorker',
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        information: this.data.taskData.information,
        userId: this.workListSource[this.data.workerValue]['user_id'] || this.workListSource[this.data.workerValue]['userId'],
        cityManager: this.data.taskData.cityManager
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
  modifyWS () {
    this.submitWS()
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
  },
  bindTapToOffer (event) {
    if ((this.data.taskData.status == 13 || this.data.taskData.status == 43) && this.data.role == 12) {
      this.workHandleWS(null, true, 1)
    } else {
      wx.navigateTo({
        url: (this.data.role === 1 || this.data.role === 5 || this.data.role === 6 || this.data.role === 7) ? `../new-ws-offer-survey/new-ws-offer-survey?id=${event.currentTarget.dataset.id}` : `../new-ws-offer/new-ws-offer?id=${event.currentTarget.dataset.id}`
      })
    }
  },
  workerSubmitImage () {
    let _this = this
    let workLiveImageFiles = []
    let workVideo = []
    _this.data.workLiveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workLiveImageFiles.push({path: item.path, type: 3})
      }
    })
    _this.data.workVideo.map(item => {
      if (item.path.indexOf('https://') == -1){
        workVideo.push({path: item.path, type: 66})
      }
    })
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let imgPaths = [...workLiveImageFiles, ...workVideo]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  }
  // getMyLocation () {
  //   wx.chooseLocation({
  //     success: (res) => {
  //       this.setData({
  //         'location.latitude': res.latitude,
  //         'location.longitude': res.longitude
  //       })
  //     },
  //     fail: (err) => {
  //       console.log(err, '??')
  //     }
  //   })
  // }
})
