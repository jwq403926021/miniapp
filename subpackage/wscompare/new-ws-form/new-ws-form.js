//获取应用实例
import util from "../../../utils/util";
import common from "../../../utils/common";
const app = getApp()
const plugin = requirePlugin('WechatSI')
const manager = plugin.getRecordRecognitionManager()

// (role == 1 && (orderId == null || status == 21))
// (role == 8 && (status == 20 || status == 33))
// (role == 12 && (status == 13 || status == 39 || status == 43))
// (role == 22 && (status == 41 || status == 50))
// (role == 33 && (status == 51))

Page({
  data: {
    orderId: null,
    showKeyboard: false,
    // 1 查勘员、12 施工人员、8 客服人员、13 报价人员、22 财务人员、33 核损人、6 市级负责人、 5 省级负责人
    role: 1,
    liveImageFiles: [], // 案件图片
    projectBillImageFiles: [], // 工程量清单
    workerAuthImageFiles: [], // 授权（施工方）
    workLiveImageFiles: [[]], // 现场图片(施工方)
    authorityImageFiles: [], // 授权图片
    financeImageFiles: [], // 财务图片
    workVideo: [], // 视频(施工方)
    serviceTypeList: [],
    serviceTypeListSource: [],
    serviceTypeValue: '',
    serviceTypeLabel: '',
    show: false,
    showWorkerHit: false,
    areaList: {},
    region: '',
    regionLabel: '',
    statusMap: {
      '20': '待客服人员处理',
      '21': '客服驳回',
      '22': '已派送',
      '13': '待施工人员报价',
      '39': '比价中',
      '41': '待报价',
      '43': '报价驳回',
      '51': '待核损',
      '33': '核损人驳回',
      '50': '待财务处理',
      '11': '已办结'
    },
    status: null,
    provinceCode: '',
    cityCode: '',
    townCode: '',
    acceptInsurance: '2',
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
    serviceName: '',
    servicePhone: '',
    hasBudgetPreliminary: false,
    workType: '0',
    budgetPreliminary: '', // 初步估损金额
    damageMoney: '', // 受损方索赔金额
    budgetPreliminarySurvey: '', // 初步估损金额
    damageMoneySurvey: '', // 受损方索赔金额
    offerWorker: '',
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
    surveyLossRemark: '',
    serviceRemark: '',
    manageMoney: '',
    insurePay: '',
    payWorker: '',
    reportNumber: '',
    mail: '',
    accountName: '',
    weatherBill: '1',
    moneySurvey: '',
    managerReject: '',
    cancelRemark: '',
    activeVideo: '',
    recordState: false,
    location: {
      latitude: '',
      longitude: ''
    },
    compareList: [],
    showactionsheet: false,
    actions: [
      {
        name: '注销',
      },
      {
        name: '修改信息',
      }
    ],
    customerName: {
      0: '受损人1',
      1: '受损人2',
      2: '受损人3',
      3: '受损人4',
      4: '受损人5',
      5: '受损人6',
      6: '受损人7',
      7: '受损人8',
      8: '受损人9',
      9: '受损人10'
    },
    showreassign: false,
    reassignRegion: '',
    reassignRegionLabel: '',
    estimateCompanyValue: '',
    estimateCompanyLabel: '',
    estimatePersonValue: '',
    estimatePersonLabel: '',
    estimatePersonList: [],
  },
  onLoad: function (routeParams) {
    this.getServiceTypeList()
    setTimeout(() => {
      this.routeParams = routeParams
      this.initRecord()
      this.initArea(this.init)
    }, 500)
  },
  init () {
    let routeParams = this.routeParams
    if (routeParams && routeParams.type) {
      this.setData({
        'insuranceType': routeParams.type || '',
      })
    }
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role,
        userId: app.globalData.currentRegisterInfo.userId
      }, () => {
        this.initDataById(routeParams.id, routeParams.flag || null)
        this.getRegionLabel()
      })
    }
  },
  initDataById (id, flag) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    let params = {
      orderId: id
    }
    if (flag) {
      params.flag = flag
    }
    util.request({
      path: '/app/businessdamagecompare/damageDetail',
      method: 'GET',
      data: params
    }, function (err, res) {
      let data = res.data

      if (data.status == 22 && _this.data.role == 12) {
        _this.setData({
          showWorkerHit: true
        })
      }

      _this.sourceData = data
      _this.sourceImage = res.Image
      _this.sourceAttachment = res.attachment
      let liveImageFiles = []
      let workerAuthImageFiles = []
      let projectBillImageFiles = []
      let workLiveImageFiles = [[]]
      let authorityImageFiles = []
      let workVideo = []
      let financeImageFiles = []
      let customerName = _this.data.customerName

      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 2:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            liveImageFiles.push(item)
            break
          case 3:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            let clientIndex = item.clientIndex || 0
            if (!workLiveImageFiles[clientIndex]) {
              workLiveImageFiles[clientIndex] = []
            }
            customerName[clientIndex] = item.customerName || customerName[clientIndex]
            workLiveImageFiles[clientIndex].push(item)
            break
          case 13:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            financeImageFiles.push(item)
            break
          case 66:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            authorityImageFiles.push(item)
            break
          case 17:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            projectBillImageFiles.push(item)
            break
          case 16:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workerAuthImageFiles.push(item)
            break
        }
      })
      _this.sourceAttachment.forEach(item => {
        if (item.type) {
          item.path = `https://aplusprice.xyz/file/${item.path}`
          workVideo.push(item)
        }
      })
      let serviceTypeValue = _this.serviceTypeListSource.findIndex(i => i.id == data.serviceType)
      _this.setData({
        hasBudgetPreliminary: Boolean(data.budgetPreliminary),
        compareList: res.compareList || [],
        orderId: data.orderId,
        region: data.townCode,
        liveImageFiles: liveImageFiles,
        workerAuthImageFiles: workerAuthImageFiles,
        projectBillImageFiles: projectBillImageFiles,
        workLiveImageFiles: workLiveImageFiles,
        customerName: customerName,
        financeImageFiles: financeImageFiles,
        authorityImageFiles: authorityImageFiles,
        workVideo: workVideo,
        'cityManagerName': data.cityManagerName,
        'cityManagerMobile': data.cityManagerMobile,
        'surveyLossName': data.surveyLossName,
        'surveyLossTime': data.surveyLossTime,
        'surveyId': data.surveyId,
        'status': data.status,
        'insuranceType': data.insuranceType,
        'acceptInsurance': data.acceptInsurance,
        'damagedUser': data.damagedUser,
        'damagedPhone': data.damagedPhone || '',
        'customerUser': data.customerUser,
        'customerPhone': data.customerPhone,
        'plateNumber': data.plateNumber,
        'information': data.information,
        "surveyUser": data.surveyUser,
        "surveyPhone": data.surveyPhone,
        "workerUser": data.workerUser,
        "workerPhone": data.workerPhone,
        "serviceName": data.serviceName,
        "servicePhone": data.servicePhone,
        "workType": data.workType,
        "budgetPreliminary": data.budgetPreliminary,
        "damageMoney": data.damageMoney,
        "budgetPreliminarySurvey": data.budgetPreliminarySurvey,
        "offerWorker": data.offerWorker,
        "damageMoneySurvey": data.damageMoneySurvey,
        'handlingType': data.handlingType,
        'deposit': data.deposit,
        'prepay': data.prepay,
        'offerRemark': data.offerRemark,
        'companyName': data.companyName,
        'cityManager': data.cityManager,
        'workerId': data.workerId,
        'commentToSurvey': data.commentToSurvey,
        'serviceRemark': data.serviceRemark,
        'commentToOffer': data.commentToOffer,
        'financeRemark': data.financeRemark,
        'surveyLossRemark': data.surveyLossRemark,
        'manageMoney': data.manageMoney,
        'insurePay': data.insurePay,
        'payWorker': data.payWorker,
        'isAcceptance': data.isAcceptance,
        'isAgree': data.isAgree,
        'reportNumber': data.reportNumber,
        'mail': data.mail,
        'weatherBill': data.weatherBill,
        'accountName': data.accountName,
        'moneySurvey': data.moneySurvey,
        'managerReject': data.managerReject,
        'cancelRemark': data.cancelRemark,
        'isCompulsory': data.isCompulsory,
        'isBusiness': data.isBusiness,
        serviceTypeValue: serviceTypeValue,
        serviceTypeLabel: _this.serviceTypeListSource[serviceTypeValue].name
      }, () => {
        _this.getRegionLabel()
        wx.hideLoading()
      })
    })
  },
  initRecord: function () {
    const that = this
    manager.onRecognize = function (res) {
      console.log(res)
    }
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    manager.onError = function (res) {
      console.error("录音错误", res)
    }
    manager.onStop = function (res) {
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      }
      let text = res.result || ''
      that.setData({
        information: text
      })
    }
  },
  recordStart (e) {
    this.setData({
      recordState: true
    }, () => {
      manager.start({
        lang: 'zh_CN'
      })
    })
  },
  recordEnd (e) {
    this.setData({
      recordState: false
    }, () => {
      manager.stop()
    })
  },
  setFinishCase (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
    const value = event.currentTarget.dataset.value == 1 ? 0 : 1;
    const key = type == '0' ? 'isCompulsory' : 'isBusiness'
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: `/app/businessdamagecompare/${key}`,
      method: 'GET',
      data: {
        orderId: _this.data.orderId,
        [key]: value
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.setData({
        key: value
      })
    })
  },
  addAnotherWorkLiveImage () {
    let workLiveImageFiles = this.data.workLiveImageFiles
    workLiveImageFiles.push([])
    this.setData({
      workLiveImageFiles: workLiveImageFiles
    })
  },
  checkPhone (str, msg){
    str = str.replace(/\s/g, '')
    if(!(/^(((0\d{2,3}-){0,1}\d{7,8})|(1[3456789]\d{9}))$/.test(str))){
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
      let flag = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[ADF])|([ADF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
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
  getServiceTypeList () {
    try {
      let _this = this
      util.request({
        path: '/app/businessdamagecompare/getWorkerProject',
        method: 'GET'
      }, function (err, res) {
        _this.serviceTypeListSource = res.data
        let serviceTypeList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          serviceTypeList: serviceTypeList
        })
      })
    } catch (e) {
    }
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
        'townCode': app.globalData.currentRegisterInfo.townCode,
        'cityCode': app.globalData.currentRegisterInfo.cityCode,
        'provinceCode': app.globalData.currentRegisterInfo.provinceCode
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
  serviceTypeChange (event) {
    this.setData({
      'serviceTypeValue': event.detail.value,
      'serviceTypeLabel': this.serviceTypeListSource[event.detail.value].name
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
      'townCode': data.detail.values[2].code,
      'cityCode': data.detail.values[1].code,
      'provinceCode': data.detail.values[0].code,
    })
  },
  onConfirmReassign (data) {
    let strArr = []
    data.detail.values.forEach(item => {
      strArr.push(item.name)
    })
    this.setData({
      showreassign: false,
      reassignRegion: data.detail.values[1].code,
      reassignRegionLabel: strArr.join(','),
      estimateCompanyValue: '',
      estimateCompanyLabel: '',
      estimateCompanyList: [],
      estimatePersonValue: '',
      estimatePersonLabel: '',
      estimatePersonList: []
    }, () => {
      this.getEstimateCompanyList()
    })
  },
  getEstimateCompanyList () {
    let _this = this
    util.request({
      path: `/app/getEstimateCompany?city=${this.data.reassignRegion}`,
      method: 'GET'
    }, function (err, res) {
      if (res) {
        _this.estimateCompanyListSource = res.data
        let estimateCompanyList = res.data ? res.data.map(item => {
          return item['company_name']
        }) : []
        _this.setData({
          'estimateCompanyList': estimateCompanyList
        })
      }
    })
  },
  getEstimatePersonList () {
    let _this = this
    let company = _this.estimateCompanyListSource[this.data.estimateCompanyValue]['id']
    util.request({
      path: `/app/userList?companyId=${company}`,
      method: 'GET'
    }, function (err, res) {
      if (res) {
        _this.estimatePersonListSource = res.data
        let estimatePersonList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          'estimatePersonList': estimatePersonList
        })
      }
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
    if (event.detail != '1' && event.currentTarget.dataset.name == 'insuranceType') {
      this.setData({
        'plateNumber': ''
      })
    }
    this.setData({
      [key]: event.detail
    });
  },
  chooseVideo: function (e) {
    let key = e.currentTarget.dataset.name
    var that = this
    app.globalData.isIgnoreRefresh = true
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
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 100)
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
  pickerChange (e) {
    let _this = this
    let key = e.currentTarget.dataset.name
    this.setData({
      [`${key}Value`]: e.detail.value,
      [`${key}Label`]: this[`${key}ListSource`][e.detail.value].name
    }, () => {
      if (key == 'estimateCompany') {
        _this.getEstimatePersonList()
      }
    })
  },
  setNumber (event) {
    this.setData({
      'plateNumber': event.detail.value
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
    let formData = {
      'flowId': that.data.orderId,
      'type': imgPaths[count].type
    }
    if (imgPaths[count].hasOwnProperty('clientIndex') && imgPaths[count].clientIndex != null) {
      formData.clientIndex = imgPaths[count].clientIndex
    }
    wx.uploadFile({
      url: imgPaths[count].type == 66  ? 'https://aplusprice.xyz/aprice/app/attachments/uploadVideo' : 'https://aplusprice.xyz/aprice/app/image/upload',
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
  dialPhone (e) {
    let _this = this
    let phone = e.currentTarget.dataset.phone+'';
    let worker = e.currentTarget.dataset.worker+'';

    if (worker && this.data.status == 22 && this.data.role == 12) {
      util.request({
        path: '/app/businessdamagecompare/contanctCustomer',
        method: 'GET',
        data: {
          orderId: _this.data.orderId,
          surveyId: _this.data.surveyId
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
  estimateCommit (e) {
    let data = this.data
    let _this = this
    let {
      orderId,
      customerUser,
      customerPhone,
      plateNumber,
      handlingType,
      surveyLossId,
      surveyId,
      cityManager
    } = data
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/businessdamagecompare/needEstimate`,
      method: 'POST',
      data: {
        orderId,
        customerUser,
        customerPhone,
        plateNumber,
        handlingType,
        surveyLossId,
        surveyId,
        cityManager,
        estimateId: this.estimatePersonListSource[data.estimatePersonValue]['userId']
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: "操作成功",
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
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  submitSurveyImage () {
    let _this = this
    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })
    let imgPaths = [...liveImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  serviceSubmit (e) {
    let data = this.data
    let _this = this
    let type = e.currentTarget.dataset.type
    let url = ""
    switch (type) {
      case '0':
        url = '/app/businessdamagecompare/serviceSave'
        break;
      case '1':
        url = '/app/businessdamagecompare/serviceCommit'
        break;
      case '2':
        url = '/app/businessdamagecompare/serviceReject'
        break;
    }
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
      orderId,
      reportNumber,
      acceptInsurance,
      serviceRemark,
      budgetPreliminarySurvey,
      surveyId,
      workerId,
      information
    } = data
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    this.submitSurveyImage()
    util.request({
      path: url,
      method: 'POST',
      data: {
        provinceCode,
        cityCode,
        townCode,
        damagedUser,
        damagedPhone,
        customerUser,
        customerPhone,
        plateNumber,
        insuranceType,
        orderId,
        reportNumber,
        acceptInsurance,
        serviceRemark,
        budgetPreliminarySurvey,
        surveyId,
        serviceType: this.serviceTypeListSource[data.serviceTypeValue]['id'],
        workerId,
        information
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: "操作成功",
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
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  submitWS (e) {
    let data = this.data
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let payload = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      townCode: data.townCode,
      insuranceType: data.insuranceType,
      acceptInsurance: data.acceptInsurance,
      damagedUser: data.damagedUser,
      damagedPhone: data.damagedPhone,
      customerUser: data.customerUser,
      customerPhone: data.customerPhone,
      plateNumber: data.plateNumber,
      reportNumber: data.reportNumber,
      information: data.information,
      budgetPreliminarySurvey: data.budgetPreliminarySurvey,
      damageMoneySurvey: data.damageMoneySurvey,
      serviceType: this.serviceTypeListSource[data.serviceTypeValue]['id']
    }
    if (this.data.orderId) {
      payload.orderId = _this.data.orderId
    }

    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })

    if (payload.insuranceType == 1) {
      let flag = this.isLicenseNo(payload.plateNumber || '')
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

    if (
      app.globalData.currentRegisterInfo.provinceCode == 110000 && _this.data.liveImageFiles.length === 0
    ) {
      wx.showToast({
        mask: true,
        title: '北京地区必须传案件图片',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if ((payload.insuranceType == 1 && payload.reportNumber == '') || !(/^[A-Za-z0-9]+$/.test(payload.reportNumber))) {
      wx.showToast({
        mask: true,
        title: '请输入正确的报案号',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (payload.customerPhone != ''){
      let isVaidcustomerPhone = this.checkPhone(payload.customerPhone, '请输入正确的沟通方式')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    if(payload.budgetPreliminarySurvey == '') {
      wx.showToast({
        mask: true,
        title: '请输入初步估损金额(查)',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(payload.serviceType == '') {
      wx.showToast({
        mask: true,
        title: '请选择服务类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(payload.damageMoneySurvey == '') {
      wx.showToast({
        mask: true,
        title: '请输入受损方索赔金额(查)',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (payload.damagedPhone == '' && payload.customerPhone == ''){
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
      path: isSave ? '/app/businessdamagecompare/surveySave' : '/app/businessdamagecompare/surveyCommit',
      method: 'POST',
      data: payload
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
      return item.route == 'subpackage/wscompare/new-my-list-ws/new-my-list-ws'
    })
    if (index != -1) {
      wx.navigateBack({
        delta: pages.length - 1 - index
      })
    } else {
      wx.redirectTo({
        url: '../new-my-list-ws/new-my-list-ws?type=' + this.data.insuranceType
      })
    }
  },
  compareCommit () {
    let _this = this
    let {budgetPreliminary,orderId} = this.data
    if (budgetPreliminary == null || budgetPreliminary == '') {
      wx.showToast({
        mask: true,
        title: '初步估损金额(施)不能为空',
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
      path: '/app/businessdamagecompare/workCompare',
      method: 'POST',
      data: {
        orderId,
        budgetPreliminary
      }
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
  workHandleWS (e, save, isOfferSave) {
    let _this = this
    let isSave = e ? e.currentTarget.dataset.save : save
    let workLiveImageFiles = []
    let workLiveImageAlreadyFiles = []
    let workVideo = []
    let workVideoAlreadyFiles = []
    let projectBillImageFiles = []
    let workerAuthImageFiles = []
    _this.data.workLiveImageFiles.map((item, index) => {
      item.forEach(i => {
        if (i.path.indexOf('https://') == -1){
          workLiveImageFiles.push({path: i.path, type: 3, clientIndex:index, customerName: _this.data.customerName[index]})
        } else {
          workLiveImageAlreadyFiles.push(i)
        }
      })
    })
    _this.data.workVideo.map(item => {
      if (item.path.indexOf('https://') == -1){
        workVideo.push({path: item.path, type: 66})
      } else {
        workVideoAlreadyFiles.push(item)
      }
    })
    _this.data.projectBillImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        projectBillImageFiles.push({path: item.path, type: 17})
      }
    })
    _this.data.workerAuthImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerAuthImageFiles.push({path: item.path, type: 16})
      }
    })
    let isSendFirstTimeUpload = workLiveImageAlreadyFiles.length === 0 && workVideoAlreadyFiles.length === 0 && (workLiveImageFiles.length > 0 || workVideo.length > 0)
    let url = isSave ? `/app/businessdamagecompare/workerSave` : `/app/businessdamagecompare/workerCommit`
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
      isAgree,
      offerWorker
    } = this.data
    if (!isSave) {
      if (offerWorker && budgetPreliminary) {
        if (offerWorker > budgetPreliminary) {
          wx.showToast({
            mask: true,
            title: '报价金额大于初步估损金额, 无法提交. 请联系客服.',
            icon: 'none',
            duration: 1000
          })
          return false
        }
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
        let imgPaths = [...workLiveImageFiles, ...workVideo, ...projectBillImageFiles, ...workerAuthImageFiles]
        let count = 0
        let successUp = 0
        let failUp = 0
        if (isSendFirstTimeUpload) {
          util.request({
            path: `/app/businessdamagecompare/insertUploadTime`,
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
  receiptApplySubmit (e) {
    let _this = this
    let data = this.data
    util.request({
      path: `/app/businessdamagecompare/surveyBill`,
      method: 'POST',
      data: {
        mail: data.mail,
        weatherBill: data.weatherBill,
        accountName: data.accountName,
        moneySurvey: data.moneySurvey,
        orderId: _this.data.orderId,
        cityCode: data.cityCode,
        insuranceType: data.insuranceType
      }
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
  confirmSubmit (event) {
    let _this = this
    let data = this.data
    let type = event.currentTarget.dataset.type
    util.request({
      path: type == '1' ? `/app/businessdamagecompare/losserReject` : `/app/businessdamagecompare/losserPass`,
      method: 'POST',
      data: {
        surveyId: data.surveyId,
        orderId: data.orderId,
        serviceId: data.serviceId,
        surveyLossRemark: data.surveyLossRemark,
        handlingType: data.handlingType
      }
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
  receiptApproveSubmit (event) {
    let _this = this
    let data = this.data
    util.request({
      path: `/sys/businessdamagecompare/managerBill`,
      method: 'POST',
      data: {
        surveyId: data.surveyId,
        orderId: _this.data.orderId,
        cityCode: data.cityCode,
        insuranceType: data.insuranceType,
        managerReject: event.currentTarget.dataset.type
      }
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
  receiptImageSubmit (e) {
    let _this = this
    let data = this.data
    if (!(data.moneySurvey <= 1000 || (data.moneySurvey > 1000 && data.managerReject == 2))) {
      wx.showToast({
        mask: true,
        title: '开票未通过',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let financeImageFiles = []
    _this.data.financeImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        financeImageFiles.push({path: item.path, type: 13})
      }
    })
    let imgPaths = [...financeImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  financeSubmit (e) {
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let financeImageFiles = []
    _this.data.financeImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        financeImageFiles.push({path: item.path, type: 13})
      }
    })

    util.request({
      path: isSave ? `/app/businessdamagecompare/financeSave` : `/app/businessdamagecompare/financeCommit`,
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        financeRemark: this.data.financeRemark,
        manageMoney: this.data.manageMoney,
        insurePay: this.data.insurePay,
        payWorker: this.data.payWorker,
        cityManager: this.data.cityManager,
        handlingType: this.data.handlingType
      }
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...financeImageFiles]
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
  workerSubmitComment () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagecompare/workerMessage',
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        commentToSurvey: this.data.commentToSurvey,
        commentToOffer: this.data.commentToOffer
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
  signSubmit () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagecompare/sign',
      method: 'GET',
      data: {
        orderId: this.data.orderId
      }
    }, function (err, res) {
      wx.showToast({
        mask: true,
        title: res.msg || '提交失败',
        icon: 'none',
        duration: 1000
      })
    })
  },
  modifyWS () {
    this.submitWS()
  },
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      if (
        !((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && (item.type == 2 || item.type == 17))
      ) {
        urls.push(item.path)
      }
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
    if ((this.data.status == 13 || this.data.status == 43) && this.data.role == 12) {
      this.workHandleWS(null, true, 1)
    } else {
      wx.navigateTo({
        url: (this.data.role === 12 || this.data.role === 13) ? `../new-ws-offer/new-ws-offer?id=${event.currentTarget.dataset.id}` : `../new-ws-offer-survey/new-ws-offer-survey?id=${event.currentTarget.dataset.id}`
      })
    }
  },
  offerSubmitImage () {
    let _this = this
    let workLiveImageFiles = []
    _this.data.workLiveImageFiles.map((item, index) => {
      item.forEach(i => {
        if (i.path.indexOf('https://') == -1){
          workLiveImageFiles.push({path: i.path, type: 3, clientIndex:index, customerName: _this.data.customerName[index]})
        }
      })
    })
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let imgPaths = [...workLiveImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  managerSubmitImage () {
    let _this = this
    let workLiveImageFiles = []
    let projectBillImageFiles = []
    let workerAuthImageFiles = []
    let liveImageFiles = []
    _this.data.workLiveImageFiles.map((item, index) => {
      item.forEach(i => {
        if (i.path.indexOf('https://') == -1){
          workLiveImageFiles.push({path: i.path, type: 3, clientIndex:index, customerName: _this.data.customerName[index]})
        }
      })
    })
    _this.data.projectBillImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        projectBillImageFiles.push({path: item.path, type: 17})
      }
    })
    _this.data.workerAuthImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerAuthImageFiles.push({path: item.path, type: 16})
      }
    })
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let imgPaths = [...workLiveImageFiles, ...projectBillImageFiles, ...workerAuthImageFiles, ...liveImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  workerSubmitImage () {
    let _this = this
    let workLiveImageFiles = []
    let workVideo = []
    let projectBillImageFiles = []
    let workerAuthImageFiles = []
    _this.data.workLiveImageFiles.map((item, index) => {
      item.forEach(i => {
        if (i.path.indexOf('https://') == -1){
          workLiveImageFiles.push({path: i.path, type: 3, clientIndex:index, customerName: _this.data.customerName[index]})
        }
      })
    })
    _this.data.workVideo.map(item => {
      if (item.path.indexOf('https://') == -1){
        workVideo.push({path: item.path, type: 66})
      }
    })
    _this.data.projectBillImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        projectBillImageFiles.push({path: item.path, type: 17})
      }
    })
    _this.data.workerAuthImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerAuthImageFiles.push({path: item.path, type: 16})
      }
    })
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let imgPaths = [...workLiveImageFiles, ...workVideo, ...projectBillImageFiles, ...workerAuthImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  openOperation (event) {
    this.id = event.currentTarget.dataset.id
    this.setData({ showactionsheet: true })
  },
  onactionsheetClose () {
    this.setData({ showactionsheet: false })
  },
  onactionsheetSelect (event) {
    switch (event.detail.name) {
      case '注销':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.insuranceType + '&manageType=' + 0
        })
        break
      case '修改信息':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.insuranceType + '&manageType=' + 1
        })
        break
    }
  },
  digestRecord () {
    let that = this
    wx.showLoading({
      mask: true,
      title: '识别中'
    })
    util.request({
      path: '/app/businessdamagecompare/getInfoByContent',
      method: 'POST',
      data: {
        content: that.data.information
      }
    }, function (err, res) {
      let data = res.data
      let state = {}
      if (data.county) {
        state.region = data.county
        state['townCode'] = data.county
      }
      if (data.city) {
        state['cityCode'] = data.city
      }
      if (data.province) {
        state['provinceCode'] = data.province
      }
      if (data.person) {
        state['customerUser'] = data.person
      }
      if (data.phonenum) {
        state['customerPhone'] = data.phonenum
      }
      that.setData(state, () => {
        that.getRegionLabel()
        wx.hideLoading()
      })
    })
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
