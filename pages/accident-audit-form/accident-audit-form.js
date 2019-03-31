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
      'injuredId': ''
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
    tempDetailList: []
  },
  onLoad: function (routeParams ) {
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
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
        "taskData.rescueAmount": data.emergencyMoney,
        "taskData.insuranceAmount": data.hospitalMoney,
        "taskData.selfAmount": data.medicalMoney,
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
        'payType': data.moneyMethod || '0'
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
    _list.push({'name':'1', 'percent': '10', 'price': '20'})
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
        tempDetailList: []
      })
      return false
    }
    this.setData({
      show: false,
      detailListArr: _list,
      tempDetailList: []
    })
  },
  addNewItem (event) {
    this.setData({
      show: true
    })
  },
  addCustomNewItem () {
    let _list = [...this.data.detailListArr, {'name':'', 'percent': '', 'price': ''}]
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
  }
})
