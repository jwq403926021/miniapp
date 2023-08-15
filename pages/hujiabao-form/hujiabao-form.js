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
        'CalculationFormula': '',
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
    showAreaPopup: false,
    areaList: {},
    regionKey: '',
    region: '',
    statusMap: MetaData.orderStatus,
    'PolicyInfo': DefaultValue,
    investigatorImageFiles: []
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
  closePopup (e) {
    this.setData({
      showAreaPopup: false
    })
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
  submit () {
    const that = this
    wx.showLoading({ mask: true, title: '提交中' })
    util.request({
      path: '/app/hjbpolicyinfo/save',
      method: 'POST',
      data: {
        PolicyInfo: this.data.PolicyInfo
      }
    }, function (err, res) {
      wx.hideLoading()
      // that.uploadImage()
    })
  },
  async onLoad (routeParams) {
    const _this = this
    await util.request({
      path: '/sys/area/list',
      method: 'GET'
    }, function (err, res) {
      _this.setData({
        areaList: res ? res.DATA.DATA : []
      })
    })
    this.initPickerList()
  },
  initPickerList () {
    const initList = {}
    Object.entries(MetaData).forEach(i => {
      initList[i[0] + 'List'] = Object.values(i[1])
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
    let investigatorImageFiles = []
    _this.data.investigatorImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        investigatorImageFiles.push({path: item.path, type: 2})
      }
    })

    return [...investigatorImageFiles]
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
})
