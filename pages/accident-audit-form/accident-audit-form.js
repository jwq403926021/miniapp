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
      '11': '已办结'
    },
    taskData: {
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

      'outpatientLimitedNum': 0,
      'outpatientDeductible': 0,
      'outpatientPercent': 0,
      'outpatientSelfPrice': 0,
      'outpatientComputedPrice': 0,

      'inpatientLimitedNum': 0,
      'inpatientDeductible': 0,
      'inpatientPercent': 0,
      'inpatientSelfPrice': 0,
      'inpatientComputedPrice': 0,

      'days': 0,
      'deductibleDays': 0,
      'pricePerDay': 0,
      'allowance': 0,

      'totalAmount': 0
    },
    datePickerType: '',
    insuranceBegin: '',
    insuranceBeginLabel: '',
    insuranceEnd: '',
    insuranceEndLabel: '',
    informationImageFiles: [],
    idImageFrontImageFiles: [],
    idImageBackImageFiles: [],
    receiptImageImageFiles: [],
    rescueType: [],
    payType: '',
    activeNames: ['0','1','2'],
    detailListArr: [],
    detailListArr2: [],
    tempDetailList: []
  },
  onLoad: function (routeParams ) {
    this.initArea()
    this.initMedicine()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
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
        }
      })
      console.log('12313', data)
      _this.setData({
        'informationImageFiles': informationImageFiles,
        'idImageFrontImageFiles': idImageFrontImageFiles,
        'idImageBackImageFiles': idImageBackImageFiles,
        'receiptImageImageFiles': receiptImageImageFiles,
        'status': data.status,
        "taskData.customerPhone": data.customerPhone,
        "taskData.reportNumber": data.reportNumber,
        "taskData.customerName": data.customerName,
        "taskData.investigatorText": data.investigatorText,
        "taskData.rescueAmount": data.emergencyMoney || 0,
        "taskData.insuranceAmount": data.hospitalMoney || 0,
        "taskData.selfAmount": data.medicalMoney || 0,
        'taskData.clientName': data.woundName,
        'taskData.clientIdNum': data.woundCard,
        'taskData.investigatorName': data.investigatorName,
        'taskData.investigatorPhone': data.investigatorPhone,
        'taskData.insurantName': data.insurantName,
        'taskData.injuredName': data.woundName,
        'taskData.injuredId': data.woundCard,
        'insuranceBegin': data.insuranceBegin ? new Date(data.insuranceBegin).getTime() : '',
        'insuranceEnd': data.insuranceEnd ? new Date(data.insuranceEnd).getTime() : '',
        insuranceBeginLabel:  data.insuranceBegin ? new Date(data.insuranceBegin).toLocaleDateString() : '',
        insuranceEndLabel:  data.insuranceEnd ? new Date(data.insuranceEnd).toLocaleDateString() : '',
        'rescueType': data.cureMethod ? JSON.stringify(data.cureMethod) : ['0', '1'],
        'payType': data.moneyMethod || '0',

        'taskData.outpatientLimitedNum': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientLimitedNum : 0,
        'taskData.outpatientDeductible': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientDeductible : 0,
        'taskData.outpatientPercent': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientPercent : 0,
        'taskData.outpatientSelfPrice': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientSelfPrice : 0,
        'taskData.outpatientComputedPrice': data.businessPatientOutEntity ? data.businessPatientOutEntity.outpatientComputedPrice : 0,
        'detailListArr': data.medicOutList || [],

        'taskData.inpatientLimitedNum': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientLimitedNum : 0,
        'taskData.inpatientDeductible': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientDeductible : 0,
        'taskData.inpatientPercent': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientPercent : 0,
        'taskData.inpatientSelfPrice': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientSelfPrice : 0,
        'taskData.inpatientComputedPrice': data.businessPatientInEntity ? data.businessPatientInEntity.inpatientComputedPrice : 0,
        'detailListArr2': data.medicInList || [],

        'taskData.days': data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.days : 0,
        'taskData.deductibleDays':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.deductibleDays : 0,
        'taskData.pricePerDay':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.pricePerDay : 0,
        'taskData.allowance':  data.businessHospitalBenefitEntity ? data.businessHospitalBenefitEntity.allowance : 0,

        'taskData.totalAmount': data.offerMoney || 0
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode
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
    util.request({
      path: '/app/businessmedicine/list',
      method: 'GET',
      data: {
        limit: 10,
        page: page,
        name: keyword
      }
    }, function (err, res) {
      _this.setData({
        detailListArr: data.page.records,
        medicineTotalPage: Math.ceil(data.page.total/10)
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
    this.data.detailListArr.splice(itemindex, 1)
    console.log(itemindex, this.data.detailListArr, '???')
    this.setData({
      detailListArr: this.data.detailListArr
    })
  },
  addItemToTempList () {
    let _list = this.data.tempDetailList
    _list.push({'name':'1', 'percent': '10', 'price': '20', isCustom: false})
    this.setData({
      ['tempDetailList']: _list
    })
  },
  addItemSubmit (event) {
    let isCancel = event.currentTarget.dataset.cancel;
    let _list = [...this.data.detailListArr, ...this.data.tempDetailList]
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
      detailListArr: _list,
      tempDetailList: [],
      medicineKeyword: '',
      medicinePage: ''
    })
    this.calculateMoney()
  },
  addNewItem (event) {
    this.setData({
      show: true
    })
  },
  addCustomNewItem () {
    let _list = [...this.data.detailListArr, {'name':'', 'percent': '', 'price': '', 'isCustom': true}]
    this.setData({
      detailListArr: _list
    })
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
    let urls = this.sourceImage.map(item => {
      if (!((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4 )) {
        return item.path
      }
    })
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
      nameMap[`${arrayname}[${index}].${name}`] = e.detail.value
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
    this.setData(nameMap)
    this.calculateMoney()
  },
  calculateMoney () {
    console.log('calculateMoney!!', this.data)
    this.outpatientSelfPrice()
    this.outpatientComputedPrice()
    this.inpatientSelfPrice()
    this.inpatientComputedPrice()
  },
  totalAmount () {
    let data = this.data.taskData
    return (parseFloat(data.outpatientComputedPrice) || 0) + (parseFloat(data.inpatientComputedPrice) || 0) + (parseFloat(data.allowance) || 0)
  },
  allowance () {
    let data = this.data.taskData
    let days = (data.days - data.deductibleDays) >= 0 ? (data.days - data.deductibleDays) : 0
    this.setData({
      'taskData.allowance': days * this.pricePerDay
    })
  },
  outpatientSelfPrice () {
    let list = this.data.detailListArr
    let result = 0
    list.forEach(item => {
      result += parseFloat(item.price || 0)
    })
    this.setData({
      'taskData.outpatientSelfPrice': result
    })
  },
  inpatientSelfPrice () {
    let list = this.data.detailListArr2
    let result = 0
    list.forEach(item => {
      result += parseFloat(item.price || 0)
    })
    this.setData({
      'taskData.inpatientSelfPrice': result
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
  }
})
