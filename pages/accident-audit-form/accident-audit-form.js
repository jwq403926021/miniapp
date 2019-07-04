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
    medicinePage: 1,
    medicineTotalPage: 1,
    medicineKeyword: '',
    areaList: [],
    region: '',
    regionLabel: '',

    datePickerShow: false,
    currentDate: new Date().getTime(),

    status: '',
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善',
      '31': '待审核人员处理',
      '32': '审核人员已处理',
      '33': '查勘员已驳回',
      '34': '查勘员已处理',
      '35': '待被审核人完善',
      '36': '负责人已处理',
      '11': '已办结'
    },
    taskData: {
      'insuranceNum': '',
      "customerPhone": '',
      "reportNumber": '',
      "customerName": '',
      "investigatorText": '',
      "rescueAmount": '',
      "insuranceAmount": '',
      "selfAmount": '',
      'clientName': '',
      'clientIdNum': '',
      'investigatorName': '',
      'investigatorPhone': '',
      'insurantName': '',
      'injuredName': '',
      'injuredId': '',
      'bankName': '',
      'bankNum': '',

      'outpatientLimitedNum': 0,
      'outpatientDeductible': 0,
      'outpatientPercent': 0,
      'outpatientAmount': 0,
      'outpatientSelfPrice': 0,
      'outpatientComputedPrice': 0,

      'inpatientLimitedNum': 0,
      'inpatientDeductible': 0,
      'inpatientPercent': 0,
      'inpatientAmount': 0,
      'inpatientSelfPrice': 0,
      'inpatientComputedPrice': 0,

      'days': 0,
      'limitPriceDay': 0,
      'deductibleDays': 0,
      'pricePerDay': 0,
      'allowance': 0,
      'amountSum': 0,

      'totalAmount': 0,

      'rejectText': '',
      'managerText': ''
    },
    datePickerType: '',
    insuranceBegin: '',
    insuranceBeginLabel: '',
    insuranceEnd: '',
    insuranceEndLabel: '',
    informationImageFiles: [],
    bankImageFiles: [],
    idImageFrontImageFiles: [],
    idImageBackImageFiles: [],
    receiptImageImageFiles: [],
    rescueType: [],
    payType: '',
    activeNames: ['0','1','2'],
    detailListArr: [],
    detailListArr2: [],
    tempDetailList: [],
    currentActiveType: '0',
    companyNameLabel: '',
    insuranceText: '',
    'timepickerLabel': '',
    "rescueAmount": '',
    "insuranceAmount": '',
    "insuranceAlreadyPay": '',
    'isCustomerCreate': ''
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.role : 1
      })
      this.initDataById(routeParams.id)
    }
  },
  previewbankImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.bankImageFiles.map(item => {return item.path})
    })
  },
  previewidImageFrontImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.idImageFrontImageFiles.map(item => {return item.path})
    })
  },
  previewidImageBackImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.idImageBackImageFiles.map(item => {return item.path})
    })
  },
  previewreceiptImageImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.receiptImageImageFiles.map(item => {return item.path})
    })
  },
  removereceiptImageImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.receiptImageImageFiles.splice(index, 1)
    this.setData({
      receiptImageImageFiles: _this.data.receiptImageImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  choosereceiptImageImageFiles: function (e) {
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
        let list = that.data.receiptImageImageFiles.concat(tempList)
        that.setData({
          receiptImageImageFiles: list
        });
      }
    })
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/accidentInsurance/orders/${id}`,
      method: 'GET'
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.image
      let informationImageFiles = []
      let bankImageFiles = []
      let idImageFrontImageFiles = []
      let idImageBackImageFiles = []
      let receiptImageImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 10:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            idImageFrontImageFiles.push(item)
            break
          case 12:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            idImageBackImageFiles.push(item)
            break
          case 13:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            receiptImageImageFiles.push(item)
            break
          case 15:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            bankImageFiles.push(item)
            break
        }
      })
      let dd = new Date(parseInt(data.insuranceTimestamp))
      _this.setData({
        'cityCode': data.city,
        'cityCodeCompany': data.sysCompanyEntity ? data.sysCompanyEntity.cityCode : '',

        'insuranceText': data.insuranceText || '',
        'informationImageFiles': informationImageFiles,
        'bankImageFiles': bankImageFiles,
        'idImageFrontImageFiles': idImageFrontImageFiles,
        'idImageBackImageFiles': idImageBackImageFiles,
        'receiptImageImageFiles': receiptImageImageFiles,
        'status': data.status,

        'isCustomerCreate': (data.insuranceNum !== '' && data.insuranceNum !== null && data.status != 29) ? '是' : '否',

        "taskData.customerPhone": data.customerPhone,
        "taskData.reportNumber": data.reportNumber,
        "taskData.insuranceNum": data.insuranceNum,
        "taskData.customerName": data.customerName,
        "taskData.investigatorText": data.investigatorText,

        "rescueAmount": data.emergencyMoney,
        "insuranceAmount": data.hospitalMoney,
        "insuranceAlreadyPay": data.insuranceAlreadyPay,
        "taskData.rescueAmount": data.handledEmergencyMoney || data.emergencyMoney || 0,
        "taskData.insuranceAmount": data.handledHospitalMoney || data.hospitalMoney || 0,
        "taskData.insuranceAlreadyPay": data.handledInsuranceAlreadyPay || data.insuranceAlreadyPay || 0,

        "taskData.selfAmount": data.medicalMoney || 0,
        'taskData.clientName': data.woundName,
        'taskData.clientIdNum': data.woundCard,
        'taskData.investigatorName': data.investigatorName,
        'taskData.investigatorPhone': data.investigatorPhone,
        'taskData.insurantName': data.insurantName,
        'taskData.injuredName': data.woundName,
        'taskData.injuredId': data.woundCard,
        'taskData.bankNum': data.bankNum,
        'taskData.bankName': data.bankName,
        companyNameLabel: data.sysCompanyEntity ? data.sysCompanyEntity.companyName : '',
        'timepickerLabel': data.insuranceTimestamp ? (dd.toLocaleDateString() + '  ' + dd.getHours() + ':' + dd.getMinutes()) : '',
        'insuranceBegin': data.insuranceBegin ? new Date(data.insuranceBegin).getTime() : '',
        'insuranceEnd': data.insuranceEnd ? new Date(data.insuranceEnd).getTime() : '',
        insuranceBeginLabel:  data.insuranceBegin ? new Date(data.insuranceBegin).toLocaleDateString() : '',
        insuranceEndLabel:  data.insuranceEnd ? new Date(data.insuranceEnd).toLocaleDateString() : '',
        'rescueType': data.cureMethod ? JSON.parse(data.cureMethod).map(item => item+'') : ['0', '1'],
        'payType': data.moneyMethod || '0',

        'taskData.outpatientLimitedNum': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientLimitedNum || 0 : 0,
        'taskData.outpatientDeductible': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientDeductible || 0 : 0,
        'taskData.outpatientPercent': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientPercent || 0 : 0,
        'taskData.outpatientAmount': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientAmount || 0 : 0,
        'taskData.outpatientSelfPrice': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientSelfPrice || 0 : 0,
        'taskData.outpatientComputedPrice': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientComputedPrice || 0 : 0,
        'detailListArr': data.medicOutList || [],

        'taskData.inpatientLimitedNum': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientLimitedNum || 0 : 0,
        'taskData.inpatientDeductible': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientDeductible || 0 : 0,
        'taskData.inpatientPercent': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientPercent || 0 : 0,
        'taskData.inpatientAmount': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientAmount || 0 : 0,
        'taskData.inpatientSelfPrice': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientSelfPrice || 0 : 0,
        'taskData.inpatientComputedPrice': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientComputedPrice || 0 : 0,
        'detailListArr2': data.medicInList || [],

        'taskData.days': data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.days || 0 : 0,
        'taskData.limitPriceDay': data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.limitPriceDay || 0 : 0,
        'taskData.deductibleDays':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.deductibleDays || 0 : 0,
        'taskData.pricePerDay':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.pricePerDay || 0 : 0,
        'taskData.allowance':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.allowance || 0 : 0,
        'taskData.amountSum':  data.amountSum || 0,

        'taskData.totalAmount': data.offerMoney || 0,
        'taskData.rejectText': data.rejectText,
        'taskData.managerText': data.managerText
      }, () => {
        _this.initMedicine()
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : ''
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
  prevMedicinePage () {
    let page = this.data.medicinePage - 1
    if (page < 1) {
      page = 1
    }
    this.setData({
      medicinePage: page
    })
    this.initMedicine()
  },
  nextMedicinePage () {
    let page = this.data.medicinePage + 1
    if (page > this.data.medicineTotalPage) {
      page = this.data.medicineTotalPage
    }
    this.setData({
      medicinePage: page
    })
    this.initMedicine()
  },
  medicineKeywordChange (data) {
    this.setData({
      medicineKeyword: data.detail
    })
  },
  onSearch () {
    this.setData({
      medicinePage: 1
    })
    this.initMedicine()
  },
  initMedicine () {
    let _this = this
    let page = this.data.medicinePage || 1
    let keyword = this.data.medicineKeyword || ''
    let citycode = ''

    if (this.data.isCustomerCreate === '是') {
      citycode = this.data.cityCodeCompany
    } else {
      citycode = this.data.cityCode
    }

    util.request({
      path: '/app/businessmedicine/list',
      method: 'GET',
      data: {
        limit: 10,
        page: page,
        name: keyword,
        citycode: citycode
      }
    }, function (err, res) {
      _this.setData({
        medicineList: res.page.records,
        medicineTotalPage: Math.ceil(res.page.total/10)
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
  removeItem (event) {
    let itemindex = event.currentTarget.dataset.itemindex
    let type = event.currentTarget.dataset.type
    let list
    let listKey
    if (type == '0') {
      listKey = 'detailListArr'
      list = this.data.detailListArr
    } if (type == '1') {
      listKey = 'detailListArr2'
      list = this.data.detailListArr2
    }
    list.splice(itemindex, 1)
    this.setData({
      [listKey]: list
    }, () => {
      this.calculateMoney()
    })
  },
  addItemToTempList (event) {
    let _list = this.data.tempDetailList
    let item = this.data.medicineList[event.currentTarget.dataset.itemindex]
    _list.push({...item, isCustom: false})
    this.setData({
      ['tempDetailList']: _list
    })
  },
  addItemSubmit (event) {
    let isCancel = event.currentTarget.dataset.cancel;
    let type = this.data.currentActiveType
    let _list
    let listKey
    if (type == '0') {
      listKey = 'detailListArr'
      _list = [...this.data.detailListArr, ...this.data.tempDetailList]
    } if (type == '1') {
      listKey = 'detailListArr2'
      _list = [...this.data.detailListArr2, ...this.data.tempDetailList]
    }
    if (isCancel) {
      this.setData({
        show: false,
        tempDetailList: [],
        medicineKeyword: '',
        medicinePage: ''
      })
      return false
    }
    this.setData({
      show: false,
      [listKey]: _list,
      tempDetailList: [],
      medicineKeyword: '',
      medicinePage: ''
    }, () => {
      this.calculateMoney()
    })
  },
  addNewItem (event) {
    this.initMedicine()
    this.setData({
      show: true,
      currentActiveType: event.currentTarget.dataset.type+''
    })
  },
  addCustomNewItem (event) {
    let type = event.currentTarget.dataset.type;
    if (type == '0') {
      let _list = [...this.data.detailListArr, {'name':'', 'percent': '', 'price': '', 'confirmprice': '', 'ownprice': '', 'isCustom': true}]
      this.setData({
        detailListArr: _list
      })
    } else {
      let _list = [...this.data.detailListArr2, {'name':'', 'percent': '', 'price': '', 'confirmprice': '', 'ownprice': '', 'isCustom': true}]
      this.setData({
        detailListArr2: _list
      })
    }
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
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
  },
  openDatePicker (e) {
    let type = e.currentTarget.dataset.type
    console.log('openDatePicker::', type)
    this.setData({
      datePickerType: type,
      datePickerShow: true
    })
  },
  onDatePickerConfirm(data) {
    let key = this.data.datePickerType == 0 ? 'insuranceBegin' : 'insuranceEnd'
    let labelKey = this.data.datePickerType == 0 ? 'insuranceBeginLabel' : 'insuranceEndLabel'
    if (this.data.insuranceBegin > data.detail) {
      wx.showToast({
        mask: true,
        title: '结束日期不能小于开始日期',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    this.setData({
      [key]: data.detail,
      [labelKey]: new Date(data.detail).toLocaleDateString(),
      datePickerShow: false
    });
  },
  onDatePickerCancel() {
    this.setData({
      datePickerShow: false
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
  bindDataAndCalculate(e) {
    let name = e.currentTarget.dataset.name;
    let arrayname = e.currentTarget.dataset.arrayname;
    let index = e.currentTarget.dataset.itemindex;
    let nameMap = {}
    if (arrayname) {
      let percent = parseFloat(name == 'percent' ? e.detail.value : this.data[arrayname][index].percent)
      let price = name == 'price' ? e.detail.value : this.data[arrayname][index].price
      nameMap[`${arrayname}[${index}].${name}`] = e.detail.value
      let temp = price * (percent == 0 ? 1 : (1 - percent))
      nameMap[`${arrayname}[${index}].confirmprice`] = temp.toFixed(2)
      nameMap[`${arrayname}[${index}].ownprice`] = (price - temp).toFixed(2)
      // nameMap[`${arrayname}[${index}].confirmprice`] = price * (percent || 1)
    } else {
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
    }
    this.setData(nameMap, () => {
      this.calculateMoney()
    })
  },
  calculateMoney () {
    this.outpatientSelfPrice()
    this.outpatientComputedPrice()
    this.inpatientSelfPrice()
    this.inpatientComputedPrice()
    this.allowance()
    this.totalAmount()
  },
  totalAmount () {
    let data = this.data.taskData
    let result = ((parseFloat(data.outpatientComputedPrice) || 0) + (parseFloat(data.inpatientComputedPrice) || 0) + (parseFloat(data.allowance) || 0)).toFixed(2)
    this.setData({
      'taskData.totalAmount': result
    })
  },
  allowance () {
    let data = this.data.taskData
    let days = (data.days - data.deductibleDays) >= 0 ? (data.days - data.deductibleDays) : 0
    let result = 0
    if (days * data.pricePerDay >= data.limitPriceDay) {
      result = data.limitPriceDay
    } else {
      result = days * data.pricePerDay
    }
    this.setData({
      'taskData.allowance': result
    })
  },
  outpatientSelfPrice () {
    let list = this.data.detailListArr
    let result = 0
    let amount = 0
    list.forEach(item => {
      amount += parseFloat(item.price || 0)
      result += parseFloat(item.confirmprice || 0)
    })

    this.setData({
      'taskData.rescueAmount': amount.toFixed(2),
      'taskData.outpatientAmount': (amount - result).toFixed(2),
      'taskData.outpatientSelfPrice': (amount - (amount - result)).toFixed(2)
    })
  },
  inpatientSelfPrice () {
    let list = this.data.detailListArr2
    let amount = 0
    let result = 0
    list.forEach(item => {
      amount += parseFloat(item.price || 0)
      result += parseFloat(item.confirmprice || 0)
    })
    let inpatientSelfPrice = 0
    if (this.data.payType === 0) { // 0 医保 1 自费
      inpatientSelfPrice = amount - this.data.taskData.insuranceAlreadyPay - (amount - result)
    } else {
      inpatientSelfPrice = amount - (amount - result)
    }

    this.setData({
      'taskData.insuranceAmount': amount.toFixed(2),
      'taskData.inpatientAmount': (amount - result).toFixed(2),
      'taskData.inpatientSelfPrice': inpatientSelfPrice.toFixed(2)
    })
  },
  outpatientComputedPrice () {
    let data = this.data.taskData
    let outpatientSelfPrice = parseFloat(data.outpatientSelfPrice)
    let outpatientDeductible = parseFloat(data.outpatientDeductible)
    let outpatientPercent = data.outpatientPercent
    let outpatientLimitedNum = parseFloat(data.outpatientLimitedNum)
    let temp = (outpatientSelfPrice - outpatientDeductible) * outpatientPercent
    temp = temp >= 0 ? temp : 0
    if (temp >= outpatientLimitedNum) {
      this.setData({
        'taskData.outpatientComputedPrice': outpatientLimitedNum
      })
    } else {
      this.setData({
        'taskData.outpatientComputedPrice': temp.toFixed(2)
      })
    }
  },
  inpatientComputedPrice () {
    let data = this.data.taskData
    let inpatientSelfPrice = parseFloat(data.inpatientSelfPrice)
    let inpatientDeductible = parseFloat(data.inpatientDeductible)
    let inpatientPercent = data.inpatientPercent
    let inpatientLimitedNum = parseFloat(data.inpatientLimitedNum)
    let temp = (inpatientSelfPrice - inpatientDeductible) * inpatientPercent
    temp = temp >= 0 ? temp : 0
    if (temp >= inpatientLimitedNum) {
      this.setData({
        'taskData.inpatientComputedPrice': inpatientLimitedNum
      })
    } else {
      this.setData({
        'taskData.inpatientComputedPrice': temp.toFixed(2)
      })
    }
  },
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-accident/my-list-accident'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-accident/my-list-accident'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-accident/my-list-accident'
      })
    }
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
  managerCommit (e) {
    let _this = this
    let status = e.currentTarget.dataset.type == '0' ? 31 : 36
    let data = {
      orderId: _this.data.orderId,
      managerText: _this.data.taskData.managerText,
      status: status
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/accidentInsurance/manager/orders',
      method: 'PUT',
      data: data
    }, function (err, res) {
      wx.hideLoading()
      if (res.code == 0) {
        _this.goToList()
      }
    })
  },
  suvaryCommit (e) {
    let _this = this
    let url = e.currentTarget.dataset.type == '0' ? '/app/accidentInsurance/survey/reject/orders' : '/app/accidentInsurance/survey/agree/orders'
    let data = {
      orderId: _this.data.orderId
    }
    if (e.currentTarget.dataset.type == '0') {
      data.rejectText = _this.data.taskData.rejectText
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url,
      method: 'PUT',
      data: data
    }, function (err, res) {
      wx.hideLoading()
      if (res.code == 0) {
        _this.goToList()
      }
    })
  },
  commitSubmit () {
    let _this = this
    let beginDate = this.data.insuranceBegin ? new Date(this.data.insuranceBegin) : new Date()
    let endDate = this.data.insuranceEnd ? new Date(this.data.insuranceEnd) : new Date()
    let taskData = this.data.taskData
    let data = {
      rescueType: this.data.rescueType,
      payType: this.data.payType,

      orderId: this.data.orderId,
      bankName: taskData.bankName,
      bankNum: taskData.bankNum,
      insuranceNum: taskData.insuranceNum,
      insurantName: taskData.insurantName, // 被保险人姓名
      injuredName: taskData.injuredName, // 伤者姓名
      injuredId: taskData.injuredId, // 伤者身份证号
      insurancePeriod: [
        `${beginDate.getFullYear()}-${beginDate.getMonth()+1}-${beginDate.getDate()} 00:00:00`,
        `${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()} 00:00:00`
      ], // 保险期间
      outpatientLimitedNum: taskData.outpatientLimitedNum, // 门急诊限额
      outpatientDeductible: taskData.outpatientDeductible, // 门急诊免赔额
      outpatientPercent: taskData.outpatientPercent, // 门急诊给付比例
      outpatientList: this.data.detailListArr, // 药品列表
      outpatientSelfPrice: taskData.outpatientSelfPrice, // 门急诊自费核损总额
      rescueAmount: taskData.rescueAmount, // 门急诊医疗费总额
      outpatientComputedPrice: taskData.outpatientComputedPrice, // 门急诊医疗费理算金额
      outpatientAmount: taskData.outpatientAmount,

      inpatientLimitedNum: taskData.inpatientLimitedNum, // 住院限额
      inpatientDeductible: taskData.inpatientDeductible, // 住院免赔额
      inpatientPercent: taskData.inpatientPercent, // 住院给付比例
      inpatientList: this.data.detailListArr2, // 药品列表
      inpatientSelfPrice: taskData.inpatientSelfPrice, // 住院自费核损总额
      insuranceAmount: taskData.insuranceAmount, // 住院医疗费总额
      inpatientComputedPrice: taskData.inpatientComputedPrice, // 住院医疗费理算金额
      inpatientAmount: taskData.inpatientAmount,
      insuranceAlreadyPay: taskData.insuranceAlreadyPay,

      days: taskData.days, // 住院津贴 天数
      deductibleDays: taskData.deductibleDays, // 住院津贴 免赔天数
      limitPriceDay: taskData.limitPriceDay,
      pricePerDay: taskData.pricePerDay, // 住院津贴 每天钱数
      allowance: taskData.allowance, // 住院津贴 总额

      totalAmount: taskData.totalAmount// 所有总额
    }

    // if (taskData.totalAmount > parseFloat(taskData.amountSum)) {
    //   wx.showToast({
    //     mask: true,
    //     title: '理算总额不能超过累计赔款金额',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false
    // }

    let receiptImageImageFiles = []
    _this.data.receiptImageImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        receiptImageImageFiles.push({path: item.path, type: 13})
      }
    })
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/accidentInsurance/examine/deal/orders`,
      method: 'PUT',
      data: data
    }, function (err, res) {
      wx.hideLoading()
      if (res.code == 0) {
        let imgPaths = [...receiptImageImageFiles]
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
  onRescueTypeChange (event) {
    this.setData({
      'rescueType': event.detail
    });
  },
  onPayTypeChange (event) {
    this.setData({
      'payType': event.detail
    });
  },
})
