//获取应用实例
import util from "../../../utils/util";
import common from "../../../utils/common";
import {deptList, wsTypeList} from "../data.json";
const app = getApp()
const plugin = requirePlugin('WechatSI')
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    orderId: null,
    showKeyboard: false,
    role: 1, // 1 查勘员、 12 施工人员、 13 报价人员、6 汇世达市级负责人、22 财务人员
    liveImageFiles: [], // 案件图片
    projectBillImageFiles: [], // 工程量清单
    workerAuthImageFiles: [], // 授权（施工方）
    workLiveImageFiles: [[]], // 现场图片(施工方)
    authorityImageFiles: [], // 授权图片
    financeImageFiles: [], // 财务图片
    workVideo: [], // 视频(施工方)
    show: false,
    showreassign: false,
    showWorkerHit: false,
    recordState: false,
    areaList: {},
    region: '',
    regionLabel: '',
    reassignRegionArr: [],
    reassignRegion: '',
    reassignRegionLabel: '',
    typeValue: '',
    typeList: ['物损', '其他'],
    typeLabel: '',
    workerList: [],
    workerValue: '',
    workerLabel: '',
    managerList: [],
    wsTypeList: wsTypeList,
    deptList: deptList,
    managerValue: '',
    managerLabel: '',
    showTime: false,
    timepickerValue: new Date().getTime(),
    timepickerLabel: '',
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
      acceptInsurance: '2',
      insuranceType: '1',
      damagedUser: '',
      damagedPhone: '',
      customerUser: '',
      customerPhone: '',
      plateNumber: '',
      information: '',
      surveyUser: '',
      damageName: '',
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
      reportNumber: '',
      mail: '',
      accountName: '',
      weatherBill: '1',
      moneySurvey: '',
      managerReject: '',
      cancelRemark: '',
      managerRemark: ''
    },
    activeVideo: '',
    location: {
      latitude: '',
      longitude: ''
    },
    userLocationInfo: {
      latitude: null,
      longitude: null,
      name: '位置'
    },
    address: '',
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
    companySubCategory: '',
    companySubCategoryLabel: '',
    companySubCategoryList: [],

    companyName: '',
    companyNameLabel: '',
    companyNameList: [],

    companyLevel: '',
    companyLevelLabel: '',
    companyLevelList: ['省级', '市级', '区级'],

    surveyIdValue: '',
    surveyIdList: [],
    surveyIdLabel: '',

    branchValue: '',
    branchList: deptList,
    branchLabel: '',

    damageTypeValue: '',
    damageTypeList: wsTypeList,
    damageTypeLabel: ''

  },
  onLoad: function (routeParams) {
    setTimeout(() => {
      this.routeParams = routeParams
      this.initRecord()
      this.initCompanySubCategory()
      this.initArea(this.init)
    }, 500)
  },

  initCompanySubCategory () {
    let _this = this
    util.request({
      path: '/sys/industryInsurance/all',
      method: 'GET'
    }, function (err, res) {
      if (res.code == 0) {
        _this.companySubSourceData = res.data
        _this.setData({
          'companySubCategoryList': _this.companySubSourceData.map(item => { return item.name })
        })
      }
    })
  },
  companySubCategoryChange (data) {
    this.setData({
      insurance: this.companySubSourceData[data.detail.value].id,
      companySubCategoryLabel: this.companySubSourceData[data.detail.value].name,
      companySubCategory: data.detail.value,
      companyNameCode: '',
      companyNameLabel: '',
      companyName: ''
    }, () => {
      this.initCompanyName()
    })
  },
  checkCompanyNameList () {
    if (this.data.companyNameList.length == 0) {
      wx.showToast({
        mask: true,
        title: '没有可用单位名称',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checksurvey () {
    if (this.data.surveyIdList.length == 0) {
      wx.showToast({
        mask: true,
        title: '没有可用查勘员',
        icon: 'none',
        duration: 2000
      })
    }
  },
  initCompanyName () {
    let _this = this
    let data = {
      industryCode: '2',
      cityCode:this.data.taskData.cityCode,
      provinceCode:this.data.taskData.provinceCode,
      areaCode:this.data.taskData.townCode,
      organization:this.data.companyLevel,
      insurance: this.companySubSourceData[this.data.companySubCategory]?.id
    }
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: data
    }, function (err, res) {
      if (res.code == 0) {
        _this.companyNameSourceData = res.data
        _this.setData({
          'companyNameList': _this.companyNameSourceData.map(item => { return item.companyName })
        })
      }
    })
  },
  companyNameChange (data) {
    if (this.companyNameSourceData.length > 0) {
      this.setData({
        companyNameCode: this.companyNameSourceData[data.detail.value].id,
        companyNameLabel: this.companyNameSourceData[data.detail.value].companyName,
        companyName: data.detail.value
      }, () => {
        this.initInvestigator()
      })
    }
  },
  initInvestigator () {
    const _this = this
    util.request({
      path: '/app/userList',
      method: 'GET',
      data: {
        companyId: _this.data.companyNameCode
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.surveyIdSourceData = res.data
        _this.setData({
          'surveyIdList': _this.surveyIdSourceData.map(item => { return item.name })
        })
      }
    })
  },
  companyLevelChange (data) {
    this.setData({
      companyLevel: data.detail.value,
      companyLevelLabel: this.data.companyLevelList[data.detail.value],
      companyNameCode: '',
      companyNameLabel: '',
      companyName: ''
    }, () => {
      this.initCompanyName()
    })
  },

  init () {
    let routeParams = this?.routeParams
    if (routeParams && routeParams.type) {
      this.setData({
        'taskData.insuranceType': routeParams.type || '',
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
      path: '/app/businessdamagenew/damageDetail',
      method: 'GET',
      data: params
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
      _this.setData({
        surveyIdLabel: data.surveyUser,
        branchLabel: data.branch,
        damageTypeLabel: data.damageType,
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
        'taskData.cityManagerName': data.cityManagerName,
        'taskData.cityManagerMobile': data.cityManagerMobile,
        'taskData.surveyId': data.surveyId,
        'taskData.status': data.status,
        'taskData.insuranceType': data.insuranceType,
        'taskData.acceptInsurance': data.acceptInsurance,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone || '',
        'taskData.customerUser': data.customerUser,
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        "taskData.surveyUser": data.surveyUser,
        "taskData.damageName": data.damageName,
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
        'taskData.reportNumber': data.reportNumber,
        'taskData.mail': data.mail,
        'taskData.weatherBill': data.weatherBill,
        'taskData.accountName': data.accountName,
        'taskData.moneySurvey': data.moneySurvey,
        'taskData.managerReject': data.managerReject,
        'taskData.cancelRemark': data.cancelRemark,
        'taskData.managerRemark': data.managerRemark,
        'taskData.isCompulsory': data.isCompulsory,
        'taskData.isBusiness': data.isBusiness,
        'taskData.isSelf': data.isSelf,
        'address': data.address,
        'typeValue': data.type,
        'typeLabel': _this.data.typeList[data.type],
        'userLocationInfo': {
          longitude: data.lon,
          latitude: data.lat,
        }
      }, () => {
        _this.initReassignList()
        _this.initReassignListForCitymanger()
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
        'taskData.information': text
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
      path: `/app/businessdamagenew/${key}`,
      method: 'GET',
      data: {
        orderId: _this.data.orderId,
        [key]: value
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.data.taskData[key] = value
      _this.setData({
        taskData: _this.data.taskData
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
    if (!str) {
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
  initArea (callback) {
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    try {
      let _this = this
      _this.setData({
        region: '310101',
        'taskData.townCode': '310101',
        'taskData.cityCode': '310100',
        'taskData.provinceCode': '310000'
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
  initReassignList () {
    let _this = this
    if (!this.data.taskData.workerId) {
      return
    }
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
      path: `/app/getManager`,
      method: 'GET'
    }, function (err, res) {
      if (res) {
        _this.managerListSource = res.data
        let managerList = res.data ? res.data.map(item => {
          return item.name
        }) : []
        _this.setData({
          'managerList': managerList
        })
      }
    })
  },
  initReassignListForWorker () {
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
  managerChange (event) {
    this.setData({
      'managerValue': event.detail.value,
      'managerLabel': this.managerListSource[event.detail.value].name
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
      reassignRegionArr: data.detail.values,
      reassignRegion: data.detail.values[1].code,
      reassignRegionLabel: strArr.join(',')
    }, () => {
      this.initReassignListForWorker()
    })
  },
  onCancel() {
    this.setData({
      show: false,
      showreassign: false
    })
  },
  deleteWorkLiveImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        util.request({
          path: `/app/image/deleteDamagePerson?orderId=${_this.data.orderId}&type=${3}&clientIndex=${index}`,
          method: 'DELETE'
        }, function (err, res) {
          if (res.code == 0) {
            wx.showToast({
              mask: true,
              title: '操作成功',
              icon: 'success',
              duration: 1000,
              success () {
                _this.data.workLiveImageFiles.splice(index, 1)
                _this.setData({
                  workLiveImageFiles: _this.data.workLiveImageFiles
                })
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
      }
    })
  },
  updateImageName (e) {
    let index = e.currentTarget.dataset.index;
    util.request({
      path: '/app/image/changeName',
      method: 'POST',
      data: {
        flowId: this.data.orderId,
        type: 3,
        clientIndex: index,
        customerName: this.data.customerName[index]
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
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
  inputImageName (e) {
    let result = this.data.customerName;
    let index = e.currentTarget.dataset.index;
    result[index] = e.detail.value
    this.setData({
      customerName: result
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
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 300)
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
  submitSurveyImage (e) {
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
  submitWS (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
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
      address: _this.data.address,
      // type: _this.data.typeValue,
      lon: _this.data.userLocationInfo.longitude,
      lat: _this.data.userLocationInfo.latitude,

      damageName: data.damageName,
      damageType: _this.data.damageTypeLabel,
      branch: _this.data.branchLabel,
      surveyId: _this.surveyIdSourceData[_this.data.surveyIdValue].userId
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
      let flag = this.isLicenseNo(taskData.plateNumber || '')
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

    if ((taskData.insuranceType == 1 && taskData.reportNumber == '') || !(/^[A-Za-z0-9]+$/.test(taskData.reportNumber))) {
      wx.showToast({
        mask: true,
        title: '请输入正确的报案号',
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
    if (this.data.damageType == ''){
      wx.showToast({
        mask: true,
        title: '请填写物损类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.surveyId == ''){
      wx.showToast({
        mask: true,
        title: '请选择查勘员',
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
      path: isSave ? '/app/businessdamagenew/manualSave' : '/app/businessdamagenew/manualCommit',
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
      isAgree,
      isSelf
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
        isAgree,
        isSelf
      }
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...workLiveImageFiles, ...workVideo, ...projectBillImageFiles, ...workerAuthImageFiles]
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
  receiptApplySubmit (e) {
    let _this = this
    let data = this.data.taskData
    util.request({
      path: `/app/businessdamagenew/surveyBill`,
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
  receiptApproveSubmit (event) {
    let _this = this
    let data = this.data.taskData
    util.request({
      path: `/sys/businessdamagenew/managerBill`,
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
    let data = this.data.taskData
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
    let data = this.data.taskData
    let isSave = e.currentTarget.dataset.save
    let financeImageFiles = []
    _this.data.financeImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        financeImageFiles.push({path: item.path, type: 13})
      }
    })

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
  signSubmit () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagenew/sign',
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
  assignToOtherWorker () {
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
  assignToOtherProcessor () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagenew/changeManagerByUserId',
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        information: this.data.taskData.information,
        cityManager: this.managerListSource[this.data.managerValue]['userId'],
        surveyId: this.data.taskData.surveyId,
        insuranceType: this.data.taskData.insuranceType
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
    if ((this.data.taskData.status == 13 || this.data.taskData.status == 43) && this.data.role == 12) {
      this.workHandleWS(null, true, 1)
    } else {
      wx.navigateTo({
        url: (this.data.role === 1 || this.data.role === 5 || this.data.role === 6 || this.data.role === 7) ? `../new-ws-offer-survey/new-ws-offer-survey?id=${event.currentTarget.dataset.id}` : `../new-ws-offer/new-ws-offer?id=${event.currentTarget.dataset.id}`
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
  submitInfo () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/businessdamagenew/updateBasic',
      method: 'PUT',
      data: {
        orderId: _this.data.orderId,
        information: _this.data.taskData.information
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
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
  openOperation (event) {
    this.id = event.currentTarget.dataset.id
    this.setData({ showactionsheet: true })
  },
  onactionsheetClose () {
    this.setData({ showactionsheet: false })
  },
  goSurvey () {
    wx.navigateTo({
      url: '../survey-wx/survey-wx?id=' + this.id
    })
  },
  onactionsheetSelect (event) {
    switch (event.detail.name) {
      case '注销':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.taskData.insuranceType + '&manageType=' + 0
        })
        break
      case '修改信息':
        wx.navigateTo({
          url: '../new-ws-manage/new-ws-manage?id=' + this.id + '&type=' + this.data.taskData.insuranceType + '&manageType=' + 1
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
      path: '/app/businessdamagenew/getInfoByContent',
      method: 'POST',
      data: {
        content: that.data.taskData.information
      }
    }, function (err, res) {
      let data = res.data
      let state = {}
      if (data.county) {
        state.region = data.county
        state['taskData.townCode'] = data.county
      }
      if (data.city) {
        state['taskData.cityCode'] = data.city
      }
      if (data.province) {
        state['taskData.provinceCode'] = data.province
      }
      if (data.person) {
        state['taskData.customerUser'] = data.person
      }
      if (data.phonenum) {
        state['taskData.customerPhone'] = data.phonenum
      }
      that.setData(state, () => {
        that.getRegionLabel()
        wx.hideLoading()
      })
    })
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}List`][e.detail.value] || ''
    })
  },
  openTimePicker() {
    this.setData({
      showTime: !this.showTime
    })
  },
  onTimeConfirm(data) {
    console.log('onTimeConfirm', data.detail)
    let d = new Date(data.detail)
    this.setData({
      showTime: false,
      timepickerValue: data.detail,
      timepickerLabel: d.toLocaleDateString() + '  ' + d.getHours() + ':' + d.getMinutes(),
    })
  },
  onTimeCancel() {
    this.setData({
      showTime: false
    })
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
            setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 300)
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
  },
  goToLocation () {
    wx.openLocation({
      latitude: Number(this.data.userLocationInfo.latitude),
      longitude: Number(this.data.userLocationInfo.longitude),
      name: '',
      address: ''
    })
  },
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
