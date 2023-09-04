import util from "../../utils/util";
import common from "../../utils/common";
import MetaData from './metadata.js'
const computedBehavior = require('miniprogram-computed')
const app = getApp()
const DefaultValue = {
  'PolicyNo': '',
  'ProductType': { index: '', value: '', label: '' },
  'EffectiveDate': '',
  'ExpireDate': '',
  'PolicyStatus': { index: '', value: '', label: '' },
  'StandardPremium': '',
  'Property': {
    'PropertyProvince': '',
    'PropertyCity': '',
    'PropertyDistrict': '',
    'PropertyDetailAddress': '',
    'CoverageList': [{
      'IsFinalLevelCt': { index: '', value: '', label: '' },
      'CoverageCode': { index: '', value: '', label: '' },
      'SumInsured': '',
      'LimitDescription': '',
      'SumPaymentAmt': '',
      'BenefitList': [{
        'IsFinalLevelCt': { index: '', value: '', label: '' },
        'BenefitCode': { index: '', value: '', label: '' },
        'SumInsured': '',
        'SumPaymentAmt': ''
      }]
    }]
  },
  'ClaimInfo': {
    'ClaimNo': '',
    'AccidentTime': '',
    'ReportTime': '',
    'ReportDelayCause': { index: '', value: '', label: '' },
    'AccidentCause': { index: '', value: '', label: '' },
    'AccidentCauseDesc': '',
    'IsCatastrophe': { index: '', value: '', label: '' },
    'CatastropheCode': { index: '', value: '', label: '' },
    'PropertyLossAmt': '',
    'InjuryLossAmt': '',
    'ReportType': { index: '', value: '', label: '' },
    'ReportName': '',
    'ReportTel': '',
    'InsuredRelation': { index: '', value: '', label: '' },
    'AccidentProvince': '',
    'AccidentCity': '',
    'AccidentDistrict': '',
    'AccidentDetailAddress': '',
    'AccidentDesc': '',
    'SubClaimInfo': {
      'SubClaim': '',
      'RiskName': '',
      'SubClaimType': { index: '', value: '', label: '' },
      'DamageObject': '',
      'DamageDesc': '',
      'Owner': '',
      'TotalLoss': { index: '', value: '', label: '' },
      'CertiType': { index: '', value: '', label: '' },
      'CertiNo': '',
      'Sex': { index: '', value: '', label: '' },
      'DateOfBirth': '',
      'Mobile': '',
      'InjuryName': '',
      'InjuryType': { index: '', value: '', label: '' },
      'InjuryLevel': { index: '', value: '', label: '' },
      'DisabilityGrade': { index: '', value: '', label: '' },
      'Treatment': { index: '', value: '', label: '' },
      'HospitalName': '',
      'DateOfAdmission': '',
      'DateOfDischarge': '',
      'DaysInHospital': '',
      'CareName': '',
      'CareDays': '',
      'ContactProvince': '',
      'ContactCity': '',
      'ContactDistrict': '',
      'ContactDetailAddress': '',
      'AppraisalType': { index: '', value: '', label: '' },
      'TotalLossAmount': 0,
      'TotalRescueAmount': 0,
      'IsDocQualified': { index: '', value: '', label: '' },
      'UnQualifiedDoc': '',
      'Remark': '',
      'TaskInfo': {
        'TaskType': { index: '', value: '', label: '' },
        'TaskID': '',
        'DueDate': '',
        'InvestigationProvince': '',
        'InvestigationCity': '',
        'InvestigationDistrict': '',
        'InvestigationDetailAddress': '',
        'CurrentCalculationTime': '',
        'IsConfirmed': { index: '', value: '', label: '' },
        'Remark': ''
      },
      'TaskInfo2': {
        'TaskType': { index: '', value: '', label: '' },
        'TaskID': '',
        'DueDate': '',
        'InvestigationProvince': '',
        'InvestigationCity': '',
        'InvestigationDistrict': '',
        'InvestigationDetailAddress': '',
        'CurrentCalculationTime': '',
        'IsConfirmed': { index: '', value: '', label: '' },
        'Remark': ''
      },
      'InvestigationInfo': {
        'PropertyNature': { index: '', value: '', label: '' },
        'IsInvolveRecovery': { index: '', value: '', label: '' },
        'InvestigatorContact': '',
        'InvestigatorArrivalDate': '',
        'InvestigationProvince': '',
        'InvestigationCity': '',
        'InvestigationDistrict': '',
        'InvestigationDetailAddress': '',
        'InvestigationDescription': '',
        'PropertyTotalEstimatedAmount': '',
        'Remark': '',
        'LossItemList': [{
          'SequenceNo': '',
          'LossItemName': '',
          'LossItemType': { index: '', value: '', label: '' },
          'BenefitCode': { index: '', value: '', label: '' },
          'Number': '',
          'UnitPrice': '',
          'Salvage': '',
          'EstimatedAmount': '',
          'Remark': '',
          'AppraisalTimes': '',
          'LossAmount': ''
        }],
        'LossItemList2': [{
          'SequenceNo': '',
          'LossItemName': '',
          'LossItemType': { index: '', value: '', label: '' },
          'BenefitCode': { index: '', value: '', label: '' },
          'Number': '',
          'UnitPrice': '',
          'Salvage': '',
          'EstimatedAmount': '',
          'Remark': '',
          'AppraisalTimes': '',
          'LossAmount': ''
        }],
        'RescueFeeList': [{
          'OperationType': { index: '', value: '', label: '' },
          'SequenceNo': '',
          'AppraisalTimes': '',
          'RescueUnit': '',
          'BenefitCode': { index: '', value: '', label: '' },
          'RescueAmount': '',
          'Remark': ''
        }]
      },
      'CalculationInfoList': [{
        'SequenceNo': '',
        'CalculationTimes': '',
        'ReserveType': { index: '', value: '', label: '' },
        'BenefitCode': { index: '', value: '', label: '' },
        'RequestedAmount': '',
        'Deductible': '',
        'AccidentLiabilityRatio': '',
        'RecognizedAmount': '',
        'PreviousRecognizedAmount': '',
        'TotalRecognizedAmount': '',
        'PreviousAdjustedAmount': '',
        'CalculationAmount': '',
        'AdjustedAmount': '',
        'TotalAdjustedAmount': '',
        'CalculationFormula': { index: '', value: '', label: '' },
        'IsDeclined': ''
      }],
      'PayeeInfoList': [{
        'SequenceNo': '',
        'CalculationTimes': '',
        'PayeeName': '',
        'PayMode': { index: '', value: '', label: '' },
        'AccountType': { index: '', value: '', label: '' },
        'BankCode': { index: '', value: '', label: '' },
        'OpenAccountBranchCode': '',
        'AccountName': '',
        'BankCardNo': '',
        'TotalIndemnityAmount': '',
        'IndemnityInfoList': [{
          'SequenceNo': '',
          'ReserveType': { index: '', value: '', label: '' },
          'BenefitCode': { index: '', value: '', label: '' },
          'UnrecognizedAmount': '',
          'IndemnityAmount': '',
          'Remark': ''
        }]
      }]
    }
  }
}
Page({
  behaviors: [computedBehavior.behavior],
  computed: {
    isEditable (data) {
      let isEditable = true
      return isEditable
    }
  },
  data: {
    role: 1, // 理算 施工人员
    orderId: null,
    pickerType: 'datetime',
    showAreaPopup: false,
    showDateTimePopup: false,
    workerList: [],
    workerValue: '',
    workerLabel: '',
    areaList: {},
    regionKey: '',
    region: '',
    dateTimePickerKey: '',
    dateTimeValue: '',
    statusMap: MetaData.orderStatus,
    DefaultValue: DefaultValue,
    'PolicyInfo': DefaultValue,
    image001Files: [],
    image002Files: [],
    image003Files: [],
    image004Files: []
  },
  addList (e) {
    let name = e.currentTarget.dataset.name;
    let current = e.currentTarget.dataset.current;
    let defaultValue = e.currentTarget.dataset.default;
    this.setData({
      [name]: current.concat(defaultValue)
    })
  },
  inputChange (e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail.value
    this.setData(nameMap)
  },
  openAreaPopup (e) {
    let regionKey = e.currentTarget.dataset.name;
    let value = e.currentTarget.dataset.value;
    this.setData({
      showAreaPopup: true,
      regionKey: regionKey,
      region: value
    })
  },
  openDatePickerPopup (e) {
    let dateTimePickerKey = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    let value = e.currentTarget.dataset.value.replaceAll('Z', ' ').replaceAll('T', ' ');
    this.setData({
      pickerType: type || 'datetime',
      showDateTimePopup: true,
      dateTimePickerKey: dateTimePickerKey,
      dateTimeValue: value ? (+new Date(value)) : (+new Date())
    })
  },
  closePopup (e) {
    this.setData({
      showAreaPopup: false,
      showDateTimePopup: false
    })
  },
  confirmDateTimePopup (e) {
    let data = {
      showDateTimePopup: false,
      [`${this.data.dateTimePickerKey}`]: common.formatDateTimeForHjb(new Date(e.detail))
    }
    this.setData(data)
  },
  confirmAreaPopup (e) {
    let strArr = []
    const regionKey = this.data.regionKey
    e.detail.values.forEach(item => {
      strArr.push(item.name)
    })
    this.setData({
      showAreaPopup: false,
      [`${regionKey}Label`]: strArr.join(','),
      [`${regionKey}Province`]: e.detail.values[0].code,
      [`${regionKey}PropertyCity`]: e.detail.values[1].code,
      [`${regionKey}District`]: e.detail.values[2].code
    })
  },
  pickerChange (e) {
    let value_name = e.currentTarget.dataset.vname;
    let list_name = e.currentTarget.dataset.lname;
    let source = MetaData[list_name]
    let key = Object.keys(source)[e.detail.value]
    this.setData({
      [value_name]: {
        index: e.detail.value,
        value: key,
        label: source[key] ? source[key] : '',
      }
    })
  },
  generateParameters (data) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(child => {
          this.generateParameters(child)
        })
      } else if (typeof data[key] === 'object') {
        if (
          data[key] &&
          data[key].hasOwnProperty('value') &&
          data[key].hasOwnProperty('label') &&
          data[key].hasOwnProperty('index')
        ) {
          data[key] = data[key].value
        } else {
          this.generateParameters(data[key])
        }
      }
    }
    return data
  },
  handleResponse (data) {
    const that = this
    if (data.code === 0 || (data.Head && data.Head.ResponseCode === '1')) {
      wx.showToast({
        mask: true,
        title: '提交成功',
        icon: 'success',
        duration: 1000,
        success () {
          that.goToList()
        }
      })
    } else {
      wx.showToast({
        mask: true,
        title: (data.Head && data.Head.ErrorMessage) || data.msg || 'Error',
        icon: 'error',
        duration: 1000
      })
    }
  },
  save () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/save',
      method: 'POST',
      data: this.generateParameters({
        PolicyInfo: this.data.PolicyInfo
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  changeWorker () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/changeWorker',
      method: 'POST',
      data: this.generateParameters({
        'policyNo': this.data.PolicyInfo.PolicyNo,
        'claimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
        'workerId': this.workListSource[this.data.workerValue] ? this.workListSource[this.data.workerValue]['user_id'] : ''
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  workerCommit () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/workerCommit',
      method: 'POST',
      data: this.generateParameters({
        SubClaimInfo: {
          'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
          'TaskID': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskID,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo
        }
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  managerCommit () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/managerCommit',
      method: 'POST',
      data: this.generateParameters({
        SubClaimInfo: {
          'PolicyNo': this.data.PolicyInfo.PolicyNo,
          'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
          'TaskID': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskID,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo
        }
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  lossAssessment () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/lossAssessment',
      method: 'POST',
      data: this.generateParameters({
        TaskInfo: {
          'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
          'SubClaim': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.SubClaim,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo
        },
        AppraisalInfo: {
          LossItemList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.InvestigationInfo.LossItemList,
          RescueFeeList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.InvestigationInfo.RescueFeeList,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo
        },
        CalculationInfoList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.CalculationInfoList,
        PayeeInfoList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.PayeeInfoList
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  lossAssessmentCommit () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/lossAssessmentCommit',
      method: 'POST',
      data: this.generateParameters({
        TaskInfo: {
          'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
          'SubClaim': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.SubClaim,
          // PropertyDetailAddress: this.data.PolicyInfo.Property.PropertyDetailAddress,
          // StandardPremium: this.data.PolicyInfo.StandardPremium,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo2
        },
        AppraisalInfo: {
          LossItemList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.InvestigationInfo.LossItemList2,
          RescueFeeList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.InvestigationInfo.RescueFeeList,
          ...this.data.PolicyInfo.ClaimInfo.SubClaimInfo
        },
        CalculationInfoList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.CalculationInfoList,
        PayeeInfoList: this.data.PolicyInfo.ClaimInfo.SubClaimInfo.PayeeInfoList
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  closeTask () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/closeTask',
      method: 'POST',
      data: this.generateParameters({
        'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
        'TaskID': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskID,
        'SubClaim': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.SubClaim,
        'TaskType': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskType
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  pass () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/pass',
      method: 'POST',
      data: this.generateParameters({
        'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
        'TaskID': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskID,
        'CalculationTimes': '1',
        'IsDeclined': '01'
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  reject () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/reject',
      method: 'POST',
      data: this.generateParameters({
        'ClaimNo': this.data.PolicyInfo.ClaimInfo.ClaimNo,
        'TaskID': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.TaskID,
        'SubClaim': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.SubClaim,
        'IsDocQualified': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.IsDocQualified,
        'UnQualifiedDoc': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.UnQualifiedDoc,
        'Remark': this.data.PolicyInfo.ClaimInfo.SubClaimInfo.Remark
      })
    }, function (err, res) {
      wx.hideLoading()
      that.handleResponse(res)
      // that.uploadImage()
    })
  },
  async onLoad (routeParams) {
    const _this = this
    _this.setData({
      areaList: {
        province_list: {
          310000: '上海'
        },
        city_list: {
          310100: '上海'
        },
        county_list: {
          310101:'黄浦区',
          310104:'徐汇区',
          310105:'长宁区',
          310106:'静安区',
          310107:'普陀区',
          310109:'虹口区',
          310110:'杨浦区',
          310112:'闵行区',
          310113:'宝山区',
          310114:'嘉定区',
          310115:'浦东新区',
          310116:'金山区',
          310117:'松江区',
          310118:'青浦区',
          310120:'奉贤区',
          310151:'崇明区'
        }
      }
    })
    await util.request({
      path: '/app/businessdamagenew/getSameUnitWorker',
      method: 'GET',
      data: {
        workerId: 310100
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
    this.initPickerList()
    if (routeParams.id && routeParams.claimno) {
      this.initDataById(routeParams.id, routeParams.claimno)
    }
  },
  compileData (data) {
    let result
    if (data) {
      if (Array.isArray(data)) {
        let arr = []
        data.forEach(i => {
          let obj = {}
          Object.entries(i).forEach(item => {
            const key = item[0].slice(0, 1).toUpperCase() + item[0].slice(1)
            if (MetaData.KeyMap[key]) {
              const index = Object.keys(MetaData[MetaData.KeyMap[key]]).findIndex(i => i === item[1])
              obj[key] = {
                value: item[1] || '',
                label: MetaData[MetaData.KeyMap[key]][item[1]] || '',
                index: index === -1 ? '' : index
              }
            } else {
              obj[key] = item[1]
            }
          })
          arr.push(obj)
        })
        result = arr
      } else {
        let obj = {}
        Object.entries(data).forEach(item => {
          const key = item[0].slice(0, 1).toUpperCase() + item[0].slice(1)
          if (key.endsWith('List')) {
            obj[key] = item[1] ? [
              ...this.compileData(item[1])
            ] : []
          } else {
            if (MetaData.KeyMap[key]) {
              const index = Object.keys(MetaData[MetaData.KeyMap[key]]).findIndex(i => i === item[1])
              obj[key] = {
                value: item[1] || '',
                label: MetaData[MetaData.KeyMap[key]][item[1]] || '',
                index: index === -1 ? '' : index
              }
            } else {
              obj[key] = item[1]
            }
          }
        })
        result = obj
      }
    }
    return result || data
  },
  async initDataById (id,claimno) {
    let _this = this
    await util.request({
      path: `/app/hjbpolicyinfo/detail`,
      method: 'GET',
      data: {
        policyNo: id,
        claimNo: claimno
      }
    }, function (err, res) {
      const data = res
      let state = {
        ..._this.compileData(data.policyInfo),
        'Property': {
          ..._this.compileData(data.property),
          CoverageList: _this.compileData(data.coverageList).map(i => {
            i.BenefitList = data.benefitMap[i.Id] ? _this.compileData(data.benefitMap[i.Id]) : []
            i.BenefitList.forEach(b => {
              const idx = Object.keys(MetaData[i.CoverageCode.value]).findIndex(ff => ff === b.BenefitCode.value)
              b.BenefitCode.index = idx
              b.BenefitCode.label = Object.values(MetaData[i.CoverageCode.value])[idx]
            })
            return i
          })
        },
        'ClaimInfo': {
          ..._this.compileData(data.claimInfo),
          'SubClaimInfo': {
            ..._this.compileData(data.subClaimInfo),
            'TaskInfo': {
              ..._this.compileData(data.taskInfo)
            },
            'TaskInfo2': {
              ..._this.compileData(data.taskInfo2)
            },
            'InvestigationInfo': {
              ..._this.compileData(data.investigationInfo),
              'LossItemList': [
                ..._this.compileData(data.lossItemList)
              ],
              'LossItemList2': [
                ..._this.compileData(data.lossItem2List)
              ],
              'RescueFeeList': [
                ..._this.compileData(data.rescueFeeList)
              ]
            },
            'CalculationInfoList': [
              ..._this.compileData(data.calculationInfoList)
            ],
            'PayeeInfoList': [
              ..._this.compileData(data.payeeInfoList)
            ]
          }
        }
      }
      // _this.sourceData = data
      // _this.sourceImage = res.Image
      // let investigatorImageFiles = []
      // _this.sourceImage.forEach(item => {
      //   switch (item.type) {
      //     case 2:
      //       item.path = `https://aplusprice.xyz/file/${item.path}`
      //       investigatorImageFiles.push(item)
      //       break
      //   }
      // })
      // state.investigatorImageFiles = investigatorImageFiles
      _this.setData({
        PolicyInfo: state
      })
      _this.setData({
        ['PolicyInfo.Property.PropertyLabel']: data.property.propertyDistrict ? `上海,上海,${MetaData.district.find(i => data.property.propertyDistrict).label}` : '',
        ['PolicyInfo.ClaimInfo.AccidentLabel']: data.claimInfo.accidentDistrict ? `上海,上海,${MetaData.district.find(i => data.claimInfo.accidentDistrict).label}` : '',
        ['PolicyInfo.ClaimInfo.SubClaimInfo.ContactLabel']: data.subClaimInfo.contactDistrict ? `上海,上海,${MetaData.district.find(i => data.subClaimInfo.contactDistrict).label}` : '',
        ['PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo.InvestigationLabel']: data.taskInfo.investigationDistrict ? `上海,上海,${MetaData.district.find(i => data.taskInfo.investigationDistrict).label}` : '',
        ['PolicyInfo.ClaimInfo.SubClaimInfo.TaskInfo2.InvestigationLabel']: data.taskInfo2.investigationDistrict ? `上海,上海,${MetaData.district.find(i => data.taskInfo2.investigationDistrict).label}` : '',
        ['PolicyInfo.ClaimInfo.SubClaimInfo.InvestigationInfo.InvestigationLabel']: data.InvestigationInfo.investigationDistrict ? `上海,上海,${MetaData.district.find(i => data.InvestigationInfo.investigationDistrict).label}` : '',
      })
    })
  },
  goToList () {
    wx.redirectTo({
      url: '../my-list-hujiabao/my-list-hujiabao'
    })
  },
  workerChange (event) {
    this.setData({
      'workerValue': event.detail.value,
      'workerLabel': this.workListSource[event.detail.value].name
    })
  },
  initPickerList () {
    const initList = {
      insuranceTypeChild: {}
    }
    Object.entries(MetaData).forEach(i => {
      if (i[0].startsWith('CF')) {
        initList.insuranceTypeChild[i[0]] = Object.values(i[1])
      } else {
        initList[i[0] + 'List'] = Object.values(i[1])
      }
    })
    this.setData(initList)
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
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 300)
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
  prepareUploadImage () {
    let _this = this
    let image001Files = []
    let image002Files = []
    let image003Files = []
    let image004Files = []
    _this.data.image001Files.map(item => {
      if (item.path.indexOf('https://') == -1){
        image001Files.push({path: item.path, 'BusinessNo': _this.data.PolicyInfo.ClaimInfo.ClaimNo, 'BusinessType': '001', 'Directory': '001'})
      }
    })
    _this.data.image002Files.map(item => {
      if (item.path.indexOf('https://') == -1){
        image002Files.push({path: item.path, 'BusinessNo': _this.data.PolicyInfo.ClaimInfo.ClaimNo, 'BusinessType': '002', 'Directory': '002'})
      }
    })
    _this.data.image003Files.map(item => {
      if (item.path.indexOf('https://') == -1){
        image003Files.push({path: item.path, 'BusinessNo': _this.data.PolicyInfo.ClaimInfo.ClaimNo, 'BusinessType': '003', 'Directory': '003'})
      }
    })
    _this.data.image004Files.map(item => {
      if (item.path.indexOf('https://') == -1){
        image004Files.push({path: item.path, 'BusinessNo': _this.data.PolicyInfo.ClaimInfo.ClaimNo, 'BusinessType': '003', 'Directory': '003'})
      }
    })

    return [...image001Files,...image002Files,...image003Files,...image004Files]
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
      'BusinessNo': that.data.PolicyInfo.ClaimInfo.ClaimNo,
      'BusinessType': imgPaths[count].BusinessType,
      'Directory': imgPaths[count].Directory
    }
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload',
      filePath: imgPaths[count].path,
      name: `Files`,
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
})
