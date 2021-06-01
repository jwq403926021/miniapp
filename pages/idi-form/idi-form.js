import util from "../../utils/util";
import common from "../../utils/common";
const computedBehavior = require('miniprogram-computed')
const plugin = requirePlugin('WechatSI')
const today = new Date()
const manager = plugin.getRecordRecognitionManager()
const app = getApp()
Page({
  behaviors: [computedBehavior.behavior],
  computed: {
    isEditable (data) {
      // 1 查勘员、业主、物业、施工人员、平台处理人、报价人员、财务人员、tis人员、市级负责人、省级负责人
      // data.role data.status
      let isEditable = true
      return isEditable
    },
    disabledCase (data) {
      return data.role == 12 && data.status == 13
    },
    warningCase (data) {
      if (data.offerListTotalWorker && data.estimatePrice) {
        return (Math.abs(data.offerListTotalWorker - data.estimatePrice) / data.estimatePrice) >= 0.3
      } else {
        return false
      }
    }
  },
  data: {
    role: 1,
    currentUserId: '-1',
    workerId: null,
    orderId: null,
    statusMap: {
      '20': '已派送',
      '13': '已确认',
      '42': '已中标',
      '37': '待处理人指派比价人员',
      '38': '申请退单',
      '52': '待查勘员审核',
      '39': '比价中',
      '51': '待处理人确认',
      '33': '处理人驳回',
      '41': '待报价',
      '43': '报价驳回',
      '36': '待查勘员处理',
      '35': '待施工',
      '50': '已完工待财务处理',
      '11': '已办结'
    },
    showWorkerHit: false,
    recordState: false,
    showAreaPopup: false,
    showComeDateTimePopup: false,
    showInsuranceTimePopup: false,
    showExpireDateTimePopup: false,
    showExpireDateTimeEndPopup: false,
    areaList: {},
    // -- order data --
    status: null,
    reportId: '',
    insuranceOrderId: '',
    region: '',
    regionLabel: '',
    countryId: '',
    cityId: '',
    provinceId: '',
    runCompanySourceList: [],
    runCompanyList: [],
    runCompanyValue: '',
    runCompanyLabel: '',
    address: '',
    damageTarget: '0',
    insuredName: '',
    insuredPhone: '',
    ownerName: '',
    ownerPhone: '',
    investigatorName: '',
    investigatorPhone: '',
    managerName: '',
    managerPhone: '',
    orderInfo: '',
    comment: '',
    workerComment: '',
    estimatePrice: '',
    offerPrice: '',
    accidentReasonSourceList: [],
    accidentReasonList: [],
    accidentReasonValue: '',
    accidentReasonLabel: '',
    insurerResponsibility: '',
    noResponsibilityConstruct: '',
    tisCompanySourceList: [],
    tisCompanyList: [],
    tisCompanyValue: '',
    tisCompanyLabel: '',
    tisUserSourceList: [],
    tisUserList: [],
    tisUserValue: '',
    tisUserLabel: '',
    pendingWorkerList: [],
    weatherBusiness: '',
    orderImageFiles: [],
    investigatorImageFiles: [],
    workerInfoImageFiles: [],
    workerApplicationImageFiles: [],
    workerCompleteImageFiles: [],
    comeDateTimeValue: today.getTime(),
    comeDateTimeLabel: common.formatDateTimePicker(today),
    insuranceTimeValue: today.getTime(),
    insuranceTimeLabel: common.formatDateTimePicker(today),
    expireDateTimeValue: today.getTime(),
    expireDateTimeLabel: common.formatDateTimePicker(today),
    expireDateTimeEndValue: today.getTime(),
    expireDateTimeEndLabel: common.formatDateTimePicker(today),
    jobRole: '',
    userLocationInfo: {
      latitude: null,
      longitude: null,
      name: '位置'
    },
    investigatorId: '',
    compareEstimatePrice: ''
  },
  async onLoad (routeParams) {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel.on) {
      eventChannel.on('reload', () => {
        this.initDataById(routeParams.id)
      })
    }
    this.initRecord()
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    await this.initCondition()
    this.setData({
      orderId: routeParams?.id || null,
      region: app.globalData.currentRegisterInfo?.townCode || '',
      countryId: app.globalData.currentRegisterInfo?.townCode || '',
      cityId: app.globalData.currentRegisterInfo?.cityCode || '',
      provinceId: app.globalData.currentRegisterInfo?.provinceCode || '',
      role: app.globalData.currentRegisterInfo?.role, // 查勘员、业主、物业、施工人员、平台处理人、报价人员、财务人员、tis人员、市级负责人、省级负责人
      currentUserId: app.globalData.currentRegisterInfo.userId
    }, async () => {
      if (routeParams.id) {
        await this.initDataById(routeParams.id)
      } else {
        setTimeout(() => this.refreshRegionLabel(), 500)
      }
      wx.hideLoading()
    })
  },
  async initDataById (orderId) {
    let _this = this
    await util.request({
      path: `/app/businessinsuranceidi/idiDetail`,
      method: 'GET',
      data: {
        flowId: orderId
      }
    }, function (err, res) {
      let data = res.data
      if (data.status == 20 && _this.data.role == 12) {
        _this.setData({
          showWorkerHit: true
        })
      }
      let accidentReasonIndex = _this.data.accidentReasonSourceList.findIndex(i => i.id == data.troubleReason)
      let tisCompanyIndex = _this.data.tisCompanySourceList.findIndex(i => i.id == data.tisCompanyValue)
      let runCompanyIndex = _this.data.runCompanySourceList.findIndex(i => i['user_id'] == data.businessId)
      let state = {
        ...data,
        compareList: (res.compareList || []).map(item => {
          return {
            ...item,
            checked: false
          }
        }),
        reportId: data.reportId,
        orderId: data.flowId,
        status: data.status,
        countryId: `${data.areaCountry || ''}`,
        cityId: `${data.areaCity || ''}`,
        provinceId: `${data.areaProvince || ''}`,
        region: `${data.areaCountry || ''}`,
        insuranceOrderId: data.insuranceNumber,
        expireDateTimeValue: data.insuranceTimeLimit ? +new Date(data.insuranceTimeLimit.replaceAll('-', '/')) : '',
        expireDateTimeLabel: data.insuranceTimeLimit ? common.formatDateTimePicker(new Date(data.insuranceTimeLimit.replaceAll('-', '/'))) : '',
        expireDateTimeEndValue: data.insuranceTimeLimitEnd ? +new Date(data.insuranceTimeLimitEnd.replaceAll('-', '/')) : '',
        expireDateTimeEndLabel: data.insuranceTimeLimitEnd ? common.formatDateTimePicker(new Date(data.insuranceTimeLimitEnd.replaceAll('-', '/'))) : '',
        runCompanyValue: runCompanyIndex,
        runCompanyLabel: runCompanyIndex != -1 ? _this.data.runCompanySourceList[runCompanyIndex].name : '',
        accidentReasonValue: accidentReasonIndex,
        accidentReasonLabel: accidentReasonIndex != -1 ? _this.data.accidentReasonSourceList[accidentReasonIndex].name : '',
        address: data.address,
        damageTarget: `${data.target}`,
        insuredName: data.customerName,
        insuredPhone: data.customerPhone,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        investigatorName: data.investigatorName,
        investigatorPhone: data.investigatorPhone,
        managerName: data.managerName,
        managerPhone: data.managerPhone,
        comeDateTimeValue: data.doorTime ? +new Date(data.doorTime.replaceAll('-', '/')) : '',
        comeDateTimeLabel: data.doorTime ? common.formatDateTimePicker(new Date(data.doorTime.replaceAll('-', '/'))) : '',
        insuranceTimeValue: data.insuranceTime ? +new Date(data.insuranceTime.replaceAll('-', '/')) : '',
        insuranceTimeLabel: data.insuranceTime ? common.formatDateTimePicker(new Date(data.insuranceTime.replaceAll('-', '/'))) : '',
        estimatePrice: data.estimatePrice,
        offerPrice: data.offerMoney,
        insurerResponsibility: `${data.insuranceDuty || ''}`,
        noResponsibilityConstruct: `${data.notDutyWork || ''}`,
        tisCompanyValue: tisCompanyIndex != -1 ? tisCompanyIndex : '',
        tisCompanyLabel: tisCompanyIndex != -1 ? _this.data.tisCompanySourceList[tisCompanyIndex].name : '',
        tisId: data.tisId,
        jobRole: `${data.station || ''}`,
        weatherBusiness: `${data.weatherBusiness || ''}`,
        orderInfo: data.investigatorText,
        workerComment: data.workerText,
        comment: data.offerText,
        userLocationInfo: {
          latitude: data.lat,
          longitude: data.lon
        },
        insuranceId: data.insuranceId
      }
      _this.sourceData = data
      _this.sourceImage = res.Image
      let orderImageFiles = []
      let investigatorImageFiles = []
      let workerInfoImageFiles = []
      let workerApplicationImageFiles = []
      let workerCompleteImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            orderImageFiles.push(item)
            break
          case 2:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            investigatorImageFiles.push(item)
            break
          case 3:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workerInfoImageFiles.push(item)
            break
          case 4:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workerApplicationImageFiles.push(item)
            break
          case 5:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workerCompleteImageFiles.push(item)
            break
        }
      })
      state.orderImageFiles = orderImageFiles
      state.investigatorImageFiles = investigatorImageFiles
      state.workerInfoImageFiles = workerInfoImageFiles
      state.workerApplicationImageFiles = workerApplicationImageFiles
      state.workerCompleteImageFiles = workerCompleteImageFiles
      _this.setData(state, () => {
        _this.getTisCompany()
        if (this.data.role == 1) {
          _this.getRunCompany()
        }
        _this.getComparePerson()
        _this.getTisUser(false)
        _this.refreshRegionLabel()
      })
    })
  },
  async initCondition () {
    let _this = this
    await this.getAccident()
    await util.request({
      path: '/sys/area/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res ? res.DATA.DATA : []
      })
    })
  },
  refreshRegionLabel () {
    let arr = []
    if (this.data.region) {
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
  offerDetail () {
    if (this.data.role == 12 && (this.data.status == 42 || this.data.status == 43)) {
      // console.log('worker temp save!')
      // return
    }
    if (this.data.role == 1) {
      // console.log('go to offer survey!')
      // return
    }
    wx.navigateTo({
      url: `../idi-offer/idi-offer?id=${this.data.orderId}`
    })
  },
  confirmAreaPopup (e) {
    let strArr = []
    e.detail.values.forEach(item => {
      strArr.push(item.name)
    })
    this.setData({
      showAreaPopup: false,
      region: e.detail.values[2].code,
      regionLabel: strArr.join(','),
      countryId: e.detail.values[2].code,
      cityId: e.detail.values[1].code,
      provinceId: e.detail.values[0].code
    })
  },
  confirmDateTimePopup (e) {
    let name = e.currentTarget.dataset.name
    let d = new Date(e.detail)
    let data = {}
    if (name === 'showComeDateTimePopup') {
      data = {
        showComeDateTimePopup: false,
        comeDateTimeValue: e.detail,
        comeDateTimeLabel: common.formatDateTimePicker(d)
      }
    } else if (name === 'showInsuranceTimePopup') {
      data = {
        showInsuranceTimePopup: false,
        insuranceTimeValue: e.detail,
        insuranceTimeLabel: common.formatDateTimePicker(d)
      }
    } else if (name === 'showExpireDateTimePopup') {
      let nextYearDate = new Date(e.detail + 31536000000)
      data = {
        showExpireDateTimePopup: false,
        expireDateTimeValue: e.detail,
        expireDateTimeLabel: common.formatDateTimePicker(d),
        expireDateTimeEndValue: +nextYearDate,
        expireDateTimeEndLabel: common.formatDateTimePicker(nextYearDate)
      }
    } else if (name === 'showExpireDateTimeEndPopup') {
      data = {
        showExpireDateTimeEndPopup: false,
        expireDateTimeEndValue: e.detail,
        expireDateTimeEndLabel: common.formatDateTimePicker(d)
      }
    }
    this.setData(data)
  },
  prepareUploadImage () {
    let _this = this
    let orderImageFiles = []
    let investigatorImageFiles = []
    let workerInfoImageFiles  = []
    let workerApplicationImageFiles = []
    let workerCompleteImageFiles = []
    _this.data.orderImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        orderImageFiles.push({path: item.path, type: 1})
      }
    })
    _this.data.investigatorImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        investigatorImageFiles.push({path: item.path, type: 2})
      }
    })
    _this.data.workerInfoImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerInfoImageFiles.push({path: item.path, type: 3})
      }
    })
    _this.data.workerApplicationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerApplicationImageFiles.push({path: item.path, type: 4})
      }
    })
    _this.data.workerCompleteImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerCompleteImageFiles.push({path: item.path, type: 5})
      }
    })
    return [...orderImageFiles, ...investigatorImageFiles, ...workerInfoImageFiles, ...workerApplicationImageFiles, ...workerCompleteImageFiles]
  },
  uploadImage () {
    let _this = this
    let imgPaths = this.prepareUploadImage()
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
          _this.goToList()
        }
      })
    }
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length, callback) {
    let that = this
    let formData = {
      'flowId': that.data.orderId,
      'type': imgPaths[count].type
    }
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload',
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
          if (callback) {
            callback()
          }
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
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length, callback);
          console.log('正在上传第' + count + '张');
        }
      }
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
        orderInfo: text
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
        content: that.data.orderInfo
      }
    }, function (err, res) {
      let data = res.data
      that.setData({
        region: data.county || that.data.region,
        countryId: data.county || that.data.countryId,
        cityId: data.city || that.data.cityId,
        provinceId: data.province || that.data.provinceId,
        insuredName: data.person || that.data.insuredName,
        insuredPhone: data.phonenum || that.data.insuredPhone
      }, () => {
        setTimeout(() => that.refreshRegionLabel(), 250)
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '识别完成',
          duration: 1000
        })
      })
    })
  },
  goToList () {
    wx.redirectTo({
      url: '../my-list-idi/my-list-idi'
    })
  },
  getSubmitParams () {
    return {
      flowId: this.data.orderId,
      areaProvince: this.data.provinceId,
      areaCity: this.data.cityId,
      areaCountry: this.data.countryId,
      address: this.data.address,
      lon: this.data.userLocationInfo.longitude,
      lat: this.data.userLocationInfo.latitude,
      insuranceNumber: this.data.insuranceOrderId,
      reportId: this.data.reportId,
      target: this.data.damageTarget,
      customerName: this.data.insuredName,
      customerPhone: this.data.insuredPhone,
      ownerName: this.data.ownerName,
      ownerPhone: this.data.ownerPhone,
      doorTime: this.formatDate(new Date(this.data.comeDateTimeValue), 'yyyy-MM-dd hh:mm:ss'),
      insuranceTime: this.formatDate(new Date(this.data.insuranceTimeValue), 'yyyy-MM-dd hh:mm:ss'),
      investigatorText: this.data.orderInfo,
      estimatePrice: this.data.estimatePrice,
      offerMoney: this.data.offerPrice,
      troubleReason: (this.data.accidentReasonValue && this.data.accidentReasonSourceList[this.data.accidentReasonValue]) ? this.data.accidentReasonSourceList[this.data.accidentReasonValue].id : '',
      insuranceDuty: this.data.insurerResponsibility,
      notDutyWork: this.data.noResponsibilityConstruct,
      tisId: this.data.tisId,
      tisCompanyValue: (this.data.tisCompanyValue && this.data.tisCompanySourceList[this.data.tisCompanyValue]) ? this.data.tisCompanySourceList[this.data.tisCompanyValue].id : '',
      station: this.data.jobRole,
      // constructionMethod: '',
      offerText: this.data.comment,
      // finishDate: '',
      investigatorId: this.data.investigatorId,
      managerId: this.data.managerId,
      workerId: this.data.workerId,
      offerCenterId: this.data.offerCenterId,
      propertyId: this.data.propertyId,
      insuranceTimeLimit: this.formatDate(new Date(this.data.expireDateTimeValue), 'yyyy-MM-dd hh:mm:ss'),
      insuranceTimeLimitEnd: this.formatDate(new Date(this.data.expireDateTimeEndValue), 'yyyy-MM-dd hh:mm:ss'),
      workerText: this.data.workerComment,
      weatherBusiness: this.data.weatherBusiness,
      financeId: this.data.financeId,
      businessId: (this.data.runCompanyValue && this.data.runCompanySourceList[this.data.runCompanyValue]) ? this.data.runCompanySourceList[this.data.runCompanyValue]['user_id'] : ''
    }
  },
  getAccident () {
    let that = this
    util.request({
      path: '/app/businessinsuranceidi/getAccident',
      method: 'GET'
    }, function (err, res) {
      let accidentReasonList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      that.setData({
        accidentReasonSourceList: res.data,
        accidentReasonList: accidentReasonList
      })
    })
  },
  getTisCompany () {
    let that = this
    util.request({
      path: '/app/businessinsuranceidi/getTisByCity',
      method: 'GET',
      data: {
        cityCode: this.data.cityId
      }
    }, function (err, res) {
      (res.data || []).forEach(i => i.name = i['company_name'])
      let tisCompanyList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      that.setData({
        tisCompanyList: tisCompanyList,
        tisCompanySourceList: res.data || []
      })
    })
  },
  getRunCompany () {
    let that = this
    util.request({
      path: '/app/user/getBusinessByCityInsurance',
      method: 'GET',
      data: {
        city: this.data.cityId,
        insuranceId: app.globalData.currentRegisterInfo.sysCompanyEntity.insuranceId
      }
    }, function (err, res) {
      let runCompanyList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      that.setData({
        runCompanyList: runCompanyList,
        runCompanySourceList: res.data || []
      })
    })
  },
  getComparePerson () {
    let that = this
    util.request({
      path: '/app/businessinsuranceidi/getCompareUser',
      method: 'GET',
      data: {
        cityCode: this.data.cityId
      }
    }, function (err, res) {
      if (res.data) {
        res.data.forEach(item => {
          item.checked = false
        })
      }
      that.setData({
        pendingWorkerList: res.data || []
      })
    })
  },
  getTisUser (clearValue = true) {
    let that = this
    if (clearValue) {
      this.setData({
        tisUserValue: '',
        tisUserLabel: ''
      })
    }
    util.request({
      path: '/app/businessinsuranceidi/getTisUser',
      method: 'GET',
      data: {
        id: this.data.tisCompanyValue ? this.data.tisCompanySourceList[this.data.tisCompanyValue].id : ''
      }
    }, function (err, res) {
      let tisUserList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      that.setData({
        tisUserSourceList: res.data || [],
        tisUserList: tisUserList
      })
    })
  },
  applyReject () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/workBack',
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      that.uploadImage()
    })
  },
  rejectRejectApplication () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/managerReject',
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      that.uploadImage()
    })
  },
  passRejectApplication () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/managerPass',
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      that.uploadImage()
    })
  },
  compareWorkerSubmit () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/workCompare',
      method: 'POST',
      data: {
        flowId: that.data.orderId,
        estimatePrice: that.data.compareEstimatePrice
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  workerSubmit (event) {
    let that = this
    let isSave = event.currentTarget.dataset.type == '1'
    if (!(this.data.expireDateTimeValue && this.data.expireDateTimeEndValue)) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '请输入保险期限',
        duration: 1000
      })
      return
    }
    if (!this.data.estimatePrice) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '请输入估损金额',
        duration: 1000
      })
      return
    }
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: isSave ? `/app/businessinsuranceidi/workSave` : `/app/businessinsuranceidi/workCommit`,
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      that.uploadImage()
    })
  },
  orderSubmit (event) {
    let that = this
    if (!this.data.insuranceOrderId){
      wx.showToast({
        mask: true,
        title: '请输入保单号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.reportId){
      wx.showToast({
        mask: true,
        title: '请输入报案号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.insuredPhone != ''){
      let isVaidinsuredPhone = this.checkPhone(this.data.insuredPhone, '请输入正确的沟通方式')
      if (!isVaidinsuredPhone) {
        return
      }
    }
    if (this.data.insuredPhone != ''){
      let isVaidinsuredPhone = this.checkPhone(this.data.insuredPhone, '请输入正确的沟通方式')
      if (!isVaidinsuredPhone) {
        return
      }
    }

    if(this.data.ownerPhone != '') {
      let isVaidownerPhone = this.checkPhone(this.data.ownerPhone, '请输入正确的沟通方式')
      if (!isVaidownerPhone) {
        return
      }
    }

    let isSave = event.currentTarget.dataset.type == '1'
    let url = this.data.role == 1 ? (isSave ? `/app/businessinsuranceidi/surveySave` : `/app/businessinsuranceidi/surveyCommit`) : (isSave ? `/app/businessinsuranceidi/propertySave` : `/app/businessinsuranceidi/propertyCommit`)
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: url,
      method: 'POST',
      data: {
        ...this.getSubmitParams(),
        investigatorId: app.globalData.currentRegisterInfo.userId
      }
    }, function (err, res) {
      wx.hideLoading()
      that.setData({
        orderId: res.data.flowId
      }, () => {
        that.uploadImage()
      })
    })
  },
  investigatorSubmit (event) {
    let that = this
    let type = parseInt(event.currentTarget.dataset.type)
    let url = ''
    if (type === 0) {
      url = '/app/businessinsuranceidi/surveyDealSave'
    } else if (type === 1) {
      url = '/app/businessinsuranceidi/surveyDeal'
    } else {
      url = '/app/businessinsuranceidi/surveyCancel'
    }
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: url,
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  investagatorPass (event) {
    let that = this
    let url = '/app/businessinsuranceidi/surveyDealSave'
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: url,
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  investagatorFinish (event) {
    let that = this
    let url = '/app/businessinsuranceidi/surveyDealSave'
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: url,
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  workerAfterOfferSubmit () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/workerCommit2',
      method: 'POST',
      data: {
        ...this.getSubmitParams(),
        isWarnFlag: this.data.warningCase ? "1" : "0"
      }
    }, function (res) {
      if (res.code == 0) {
        wx.hideLoading()
        that.uploadImage()
      } else {
        wx.showToast({
          mask: true,
          title: '没有报价信息',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  workerFinishSubmit (event) {
    let that = this
    let isSave = event.currentTarget.dataset.type == '1'
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: isSave ? `/app/businessinsuranceidi/workSave3` : `/app/businessinsuranceidi/workCommit3`,
      method: 'POST',
      data: this.getSubmitParams()
    }, function (err, res) {
      wx.hideLoading()
      that.uploadImage()
    })
  },
  assignSubmit () {
    let that = this
    let userIdList = that.data.pendingWorkerList.filter(i => i.checked)
    if (userIdList.length == 0) {
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '请选择参与比价人员',
        duration: 1000
      })
      return false
    }
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/businessinsuranceidi/managerChoose',
      method: 'POST',
      data: {
        ...this.getSubmitParams(),
        userIds: userIdList.map(i => i['user_id'])
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  confirmWorkerSubmit () {
    let that = this
    wx.showLoading({ mask: true, title: '提交中' })
    let confirmUser = this.data.compareList.find(i => i.checked)
    if (!confirmUser) return
    util.request({
      path: '/app/businessinsuranceidi/managerChooseRight',
      method: 'POST',
      data: {
        ...this.getSubmitParams(),
        flowId: confirmUser.orderId,
        estimatePrice: confirmUser.offer,
        workerId: confirmUser.workerId
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    })
  },
  goToPay () {
    wx.navigateTo({
      url: `../pay/pay?id=${this.data.orderId}&money=${this.data.offerPrice || 0}&latitude=${this.data.userLocationInfo.latitude}&longitude=${this.data.userLocationInfo.longitude}`
    })
  },
  goToSign () {
    wx.navigateTo({
      url: `../sign/sign?id=${this.data.orderId}`
    })
  },
  goToComplain () {
    wx.navigateTo({
      url: `../idi-feedback-form/idi-feedback-form?id=${this.data.orderId}&type=1`
    })
  },
  goToSatisfaction () {
    wx.navigateTo({
      url: `../idi-feedback-form/idi-feedback-form?id=${this.data.orderId}&type=2`
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
  // ------- COMMON FUNCTION --------
  checkboxChange (e) {
    let checked = e.detail
    let index = e.currentTarget.dataset.index
    let target = e.currentTarget.dataset.target
    if (target === 'compareList') {
      this.data.compareList.forEach((item, idx) => {
        if (idx == index) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.setData({
        compareList: this.data.compareList
      })
    } else {
      let data = {}
      data[`${target}[${index}].checked`] = checked
      this.setData(data)
    }
  },
  formatDate (date, fmt) {
    if (typeof date == 'string') {
      return date;
    }

    if (!fmt) fmt = "yyyy-MM-dd";

    if (!date || date == null) return null;
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
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
  },
  openPopup (e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: true
    })
  },
  closePopup (e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: false
    })
  },
  pickerChange (e) {
    let that = this
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}SourceList`][e.detail.value] ? this.data[`${name}SourceList`][e.detail.value].name : ''
    }, () => {
      if (name === 'tisCompany') {
        that.getTisUser()
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
  inputChange (e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail.value
    this.setData(nameMap)
  },
  radioChange (event) {
    let name = event.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = event.detail
    this.setData(nameMap)
  },
  dialPhone (e) {
    let _this = this
    let phone = e.currentTarget.dataset.phone+'';
    if (this.data.status == 20 && this.data.role == 12) {
      util.request({
        path: `/app/businessinsuranceidi/contanctCustomer`,
        method: 'POST',
        data: {
          flowId: _this.data.orderId,
          investigatorId: _this.data.investigatorId,
          target: _this.data.damageTarget,
          customerPhone: _this.data.insuredPhone,
          ownerPhone: _this.data.ownerPhone,
          propertyId: _this.data.propertyId
        }
      }, function (err, res) {
        wx.showToast({
          mask: true,
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
      })
    }
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  chooseImage (e) {
    let key = e.currentTarget.dataset.name
    let that = this;
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
              let list = that.data[key].concat([{
                "path": tempFilePath, "id": null
              }])
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
    app.globalData.isIgnoreRefresh = true
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
})
