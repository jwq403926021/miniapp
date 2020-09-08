//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    flowId: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    status: null,
    assignMethod: '1',
    looserList: [],
    losserValue: '',
    losserLabel: '',
    showWorkerHit: false,
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待指派测漏',
      '31': '待测漏人员处理',
      '32': '已测漏',
      '40': '待合作商完善',
      '41': '待报价中心报价',
      '42': '合作商已驳回',
      '44': '待合作商联系客户',
      '51': '待定损员处理',
      '52': '定损员已驳回',
      '54': '待定损员联系客户',
      '61': '已报价,待财务处理',
      '62': '报价中心驳回',
      '11': '已办结'
    },
    isNeedReportId: false,
    taskData: {
      "reportId": '',
      "cityId": '',
      "countryId": '',
      "provinceId": '',
      "customerName": '',
      "customerPhone": '',
      "investigatorName": '',
      "investigatorPhone": '',
      "workerName": '',
      "workerPhone": '',
      "investigatorText": '',
      "investigatorId": '',
      "bankTransactionId": '',
      "constructionMethod": '',
      "deposit": '',
      "offerText": '',
      "losserText": '',
      "offerPrice": '',
      "finishCase": '',
      "workStatus": '',
      "thirdName": '',
      "thirdPhone": '',
      "losserName": '',
      "losserPhone": ''
    },
    damageImageFiles: [],
    caleImageFiles: [],
    informationImageFiles: [],
    completeImageFiles: [],
    acceptanceImageFiles: [],
    testImageFiles: [],
    showactionsheet: false,
    actions: [
      {
        name: '转线上',
      },
      {
        name: '转线下',
      },
      {
        name: '注销',
      },
      {
        name: '修改基本信息',
      }
    ]
  },
  openOperation (event) {
    this.setData({ showactionsheet: true })
  },
  onactionsheetClose () {
    this.setData({ showactionsheet: false })
  },
  onactionsheetSelect (event) {
    switch (event.detail.name) {
      case '转线上':
        wx.navigateTo({
          url: '../jc-manage/jc-manage?id=' + this.data.flowId + '&type=1'
        })
        break
      case '转线下':
        wx.navigateTo({
          url: '../jc-manage/jc-manage?id=' + this.data.flowId + '&type=2'
        })
        break
      case '注销':
        wx.navigateTo({
          url: '../jc-manage/jc-manage?id=' + this.data.flowId + '&type=3'
        })
        break
      case '修改基本信息':
        wx.navigateTo({
          url: '../jc-manage/jc-manage?id=' + this.data.flowId + '&type=4'
        })
        break
    }
  },
  onLoad: function (routeParams) {
    if (Object.keys(this.data.areaList).length == 0) {
      this.routeParams = routeParams
      this.initArea(this.init)
    }
  },
  init () {
    let routeParams = this.routeParams
    if (routeParams && routeParams.id && app.globalData.currentRegisterInfo) {
      this.setData({
        orderId: routeParams.id,
        role: 12 // app.globalData.currentRegisterInfo.role // 12:施工人员 27:测漏人员 8:客服 22:财务 23:定损员
      }, () => {
        this.initDataById(routeParams.id)
      })
    }
  },
  surveyCommit (event) {
    let _this = this
    let isSave = event.currentTarget.dataset.type == '2';
    let data = this.data.taskData
    let taskData = {
      "cityId": data.cityId + '',
      "countryId": data.countryId + '',
      "provinceId": data.provinceId + '',
      "customerName": data.customerName,
      "customerPhone": data.customerPhone + '',
      "investigatorText": data.investigatorText,
      "reportId": data.reportId
    }
    if (this.data.flowId) {
      taskData.flowId = this.data.flowId
    }

    let isVaidcustomerPhone
    if (taskData.customerPhone != '') {
      isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的沟通方式')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 1})
      }
    })

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? `/app/businessinsurancefamilynew/surveySave` : `/app/businessinsurancefamilynew/surveyCommit`,
      method: 'POST',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        _this.setData({
          flowId: res.data.flowId
        })
        let imgPaths = [...informationImageFiles]
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
  workerUploadImage () {
    let _this = this
    let acceptanceImageFiles = []
    let testImageFiles = []
    _this.data.acceptanceImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        acceptanceImageFiles.push({path: item.path, type: 20})
      }
    })
    _this.data.testImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        testImageFiles.push({path: item.path, type: 21})
      }
    })
    let imgPaths = [...acceptanceImageFiles, ...testImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    if (imgPaths.length) {
      _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
    }
  },
  workerCommit (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  workerCancel (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  workerReject (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  workerNeedTest (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  losserCommit (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  losserReject (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  servicerCommit () {
    let _this = this
    let active
    if (_this.data.assignMethod === '1') {
      active = 'site'
    } else {
      active = 'loss'
    }
    let taskData = {
      flowId: _this.data.flowId,
      active: active,
      provinceId: _this.data.taskData.provinceId,
      cityId: _this.data.taskData.cityId,
      countryId: _this.data.taskData.countryId,
      customerName: _this.data.taskData.customerName,
      customerPhone: _this.data.taskData.customerPhone
    }
    if (active === 'loss') {
      taskData.losserId = _this.data.losserValue != '' ? _this.losserListSource[_this.data.losserValue]['user_id'] : ''
    }
    if (taskData.customerName == '') {
      wx.showToast({
        mask: true,
        title: '请填写出险方',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的沟通方式')
    if (!isVaidcustomerPhone) {
      return
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/businessinsurancefamilynew/serviceCommit`,
      method: 'POST',
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
  serviceAssignTester (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  testerCommit (event) {
    let _this = this
    const type = event.currentTarget.dataset.type;
  },
  losserChange (event) {
    this.setData({
      'losserValue': event.detail.value,
      'losserLabel': this.losserListSource[event.detail.value].name
    })
  },
  setFinishCase (event) {
    let _this = this
    const id = event.currentTarget.dataset.id;
    const finishcase = event.currentTarget.dataset.finishcase == 1 ? 0 : 1;
    if (this.data.role != 1) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessinsurancefamilynew/finishCase',
      method: 'GET',
      data: {
        flowId: id,
        finishCase: finishcase
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.setData({
        'taskData.finishCase': finishcase
      })
    })
  },
  setworkEndStatus (event) {
    let _this = this
    const id = event.currentTarget.dataset.id;
    const workEndStatus = event.currentTarget.dataset.workendstatus == 1 ? 0 : 1;
    if (this.data.role != 12) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: '/app/businessinsurancefamilynew/workEndStatus',
      method: 'GET',
      data: {
        flowId: id,
        workStatus: workEndStatus
      }
    }, function (err, res) {
      wx.hideLoading()
      _this.setData({
        'taskData.workStatus': workEndStatus
      })
    })
  },
  onAssignMethodChange (event) {
    this.setData({
      'assignMethod': event.detail
    });
  },
  onConstructionMethodChange (event) {
    this.setData({
      'taskData.constructionMethod': event.detail
    });
  },
  initDataById (id) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: `/app/businessinsurancefamilynew/familyDetail`,
      method: 'GET',
      data: {
        flowId: id
      }
    }, function (err, res) {
      let data = res.data
      _this.sourceData = data
      _this.sourceImage = res.Image
      let informationImageFiles = []
      let damageImageFiles = []
      let caleImageFiles = []
      let completeImageFiles = []
      let acceptanceImageFiles = []
      let testImageFiles = []

      let familyImages = {
        house: [],// 房屋及装修 2001
        electrical: [],// 家电及文体用品 2002
        cloths: [],// 衣物床品 2003
        furniture: [],// 家具及其他生活用品 2004
        overall : [],// 全景 2005
        certificate: [],// 房产证、楼号、门牌号 2006
        identification: [],// 省份证 2007
        bank: [],// 银行卡 2008
        register: [],// 户口本、关系证明 2009
        source: []// 事故源 2010
      }

      if ((_this.data.role == 12 && data.status == 44) || (_this.data.role == 23 && data.status == 54)) {
        _this.setData({
          showWorkerHit: true
        })
      }

      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 4:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            damageImageFiles.push(item)
            break
          case 6:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            completeImageFiles.push(item)
            break
          case 7:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            caleImageFiles.push(item)
            break
          case 20:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            acceptanceImageFiles.push(item)
            break
          case 21:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            testImageFiles.push(item)
            break
          case 2001:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.house.push(item)
            break
          case 2002:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.electrical.push(item)
            break
          case 2003:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.cloths.push(item)
            break
          case 2004:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.furniture.push(item)
            break
          case 2005:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.overall.push(item)
            break
          case 2006:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.certificate.push(item)
            break
          case 2007:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.identification.push(item)
            break
          case 2008:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.bank.push(item)
            break
          case 2009:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.register.push(item)
            break
          case 2010:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.source.push(item)
            break
        }
      })
      wx.setStorageSync('familyImages', familyImages)
      _this.setData({
        'id': data.flowId,
        'flowId': data.flowId,
        'status': data.status,
        'taskData.finishCase': data.finishCase,
        'taskData.workStatus': data.workStatus,
        'taskData.countryId': data.areaCountry,
        'taskData.cityId': data.areaCity,
        'taskData.provinceId': data.areaProvince,
        region: data.areaCountry + '',
        "taskData.customerPhone": data.customerPhone,
        "taskData.customerName": data.customerName,
        "taskData.investigatorName": data.investigatorName,
        "taskData.investigatorPhone": data.investigatorPhone,
        "taskData.workerName": data.workerName,
        "taskData.workerPhone": data.workerPhone,
        "taskData.investigatorText": data.investigatorText,
        "taskData.investigatorId": data.investigatorId,
        "taskData.constructionMethod": data.constructionMethod,
        "taskData.offerText": data.offerText || '',
        "taskData.losserText": data.losserText || '',
        "taskData.offerPrice": data.offerPrice || '',
        "taskData.thirdName": data.thirdName || '',
        "taskData.thirdPhone": data.thirdPhone || '',
        "taskData.losserName": data.losserName || '',
        "taskData.losserPhone": data.losserPhone || '',
        "taskData.servicerName": data.servicerName || '',
        "taskData.servicerPhone": data.servicerPhone || '',
        informationImageFiles: informationImageFiles,
        caleImageFiles: caleImageFiles,
        damageImageFiles: damageImageFiles,
        completeImageFiles: completeImageFiles,
        acceptanceImageFiles: acceptanceImageFiles,
        testImageFiles: testImageFiles
      }, () => {
        _this.getRegionLabel()
        _this.getLosserList()
        wx.hideLoading()
      })
    })
  },
  getLosserList () {
    let _this = this
    util.request({
      path: `/app/family/getLosserByCity?city=${_this.data.taskData.cityId}`,
      method: 'GET'
    }, function (err, res) {
      _this.losserListSource = res.data || []
      let losserList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      _this.setData({
        'losserList': losserList,
        'losserValue': _this.losserListSource.length > 0 ? 0 : '',
        'losserLabel': _this.losserListSource.length > 0 ? _this.losserListSource[0].name : ''
      })
    })
  },
  initArea (callback) {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    _this.setData({
      region: app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : '',
      'taskData.countryId': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : '',
      'taskData.cityId': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.cityCode : '',
      'taskData.provinceId': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.provinceCode : '',
      isNeedReportId: app.globalData.currentRegisterInfo.provinceCode == 310000 && app.globalData.currentRegisterInfo.sysCompanyEntity.insuranceId == 2
    })
    util.request({
      path: '/sys/area/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res.DATA.DATA
      }, () => {
        _this.getRegionLabel()
        callback()
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
      'taskData.countryId': data.detail.values[2].code,
      'taskData.cityId': data.detail.values[1].code,
      'taskData.provinceId': data.detail.values[0].code,
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
    let _this = this
    let phone = e.currentTarget.dataset.phone+'';
    if ((_this.data.role == 12 && _this.data.status == 44) || (_this.data.role == 23 && _this.data.status == 54)) {
      util.request({
        path: (_this.data.role == 12 && _this.data.status == 44) ? '/app/businessinsurancefamilynew/workerContanctCustomer' : '/app/businessinsurancefamilynew/losserContanctCustomer',
        method: 'POST',
        data: {
          flowId: _this.data.flowId,
          investigatorId: _this.data.taskData.investigatorId
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
  uploadOneByOne (imgPaths,successUp, failUp, count, length, callback) {
    var that = this
    let formData = {
      'flowId': that.data.flowId,
      'type': imgPaths[count].type
    }
    if (imgPaths[count].hasOwnProperty('clientIndex') && imgPaths[count].clientIndex != null) {
      formData.clientIndex = imgPaths[count].clientIndex
    }
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
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
      return item.route == 'pages/new-my-list-jc/new-my-list-jc'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../new-my-list-jc/new-my-list-jc'
      })
    } else {
      wx.redirectTo({
        url: '../new-my-list-jc/new-my-list-jc'
      })
    }
  },
  bindTapToClient (event) {
    wx.navigateTo({
      url: `../new-jc-form-client/new-jc-form-client?flowId=${event.currentTarget.dataset.id}&status=${this.data.status}`
    })
  },
  completeCommit () {
    let _this = this
    let completeImageFiles = []
    _this.data.completeImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        completeImageFiles.push({path: item.path, type: 6})
      }
    })
    let imgPaths = [...completeImageFiles]
    let count = 0
    let successUp = 0
    let failUp = 0
    _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length, _this.endWork)
  },
  endWork () {
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let _this = this
    util.request({
      path: `/app/businessinsurancefamilynew/workEnd`,
      method: 'GET',
      data: {
        flowId: _this.data.flowId
      }
    }, function (err, res) {

    })
  },
  getImageTypeStr (str) {
    let result = ''
    switch (str) {
      case 'house':
        result = '房屋及装修'
        break
      case 'electrical':
        result = '家电及文体用品'
        break
      case 'cloths':
        result = '衣物床品'
        break
      case 'furniture':
        result = '家具及其他生活用品'
        break
      case 'overall':
        result = '全景'
        break
      case 'certificate':
        result = '房产证、楼号、门牌号'
        break
      case 'identification':
        result = '身份证'
        break
      case 'bank':
        result = '银行卡'
        break
      case 'register':
        result = '户口本、关系证明'
        break
      case 'source':
        result = '事故源'
        break
    }
    return result
  },
  checkUploadImages (familyImages, flag) {
    let clientIndexArr = []
    let familyImagesList = []
    // Require-->: ['certificate','identification']
    let exclude = ['register', 'house', 'electrical', 'cloths', 'furniture', 'overall', 'bank', 'source']
    let excludeThird = ['house', 'electrical', 'cloths', 'furniture', 'overall', 'certificate', 'identification', 'bank', 'register', 'source']
    for(let key in familyImages) {
      if (Array.isArray(familyImages[key])) {
        familyImages[key].forEach(item => {
          if (item.hasOwnProperty('clientIndex')) {
            familyImagesList.push(item)
            clientIndexArr.push(parseInt(item.clientIndex))
          }
        })
      }
    }
    if (flag) { // flag true 无需校验 直接返回
      return {
        flag: true,
        data: familyImagesList
      }
    }
    clientIndexArr = Array.from(new Set(clientIndexArr))
    clientIndexArr.sort()
    let str = ''
    for (let i = 0; i < clientIndexArr.length; i++) {
      if (str != '') {
        break
      }
      for (let key in familyImages) {
        if (clientIndexArr[i] == 0) {
          if (exclude.indexOf(key) != -1) {
            continue
          }
        } else {
          if (excludeThird.indexOf(key) != -1) {
            continue
          }
        }
        let _arr = []
        if (Array.isArray(familyImages[key])) {
          _arr = familyImages[key].filter(item => {return item.clientIndex == clientIndexArr[i]})
        }
        if (key == 'identification' && clientIndexArr[i] == 0 && _arr.length != 2) {
          str = `出险方身份证图片须传2张`
          break
        }
        if (!_arr.length) {
          str = `${clientIndexArr[i] == 0 ? '出险方' : ('第三者' + clientIndexArr[i])}未上传${this.getImageTypeStr(key)}`
          break
        }
      }
    }
    if (str == '') {
      if (familyImagesList.length == 0) {
        return {
          flag: false,
          data: '图片信息不能为空'
        }
      }
      return {
        flag: true,
        data: familyImagesList
      }
    } else {
      return {
        flag: false,
        data: str
      }
    }
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
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      if (
        !((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4) &&
        !(this.data.role == 1 && item.type == 1)
      ) {
        urls.push(item.path)
      }
    })
    common.downloadImages({
      urls: urls
    })
  }
})
