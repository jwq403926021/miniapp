import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
let today = new Date()
Page({
  data: {
    orderId: '1',
    status: '',
    statusMap: {
      '20': '已派送',
      '13': '已确认',
      '42': '待施工人员报价',
      '40': '申请退单',
      '39': '比价中',
      '51': '待处理人处理',
      '33': '处理人驳回',
      '41': '待报价',
      '43': '报价驳回',
      '36': '待查勘员处理',
      '35': '待施工',
      '50': '已完工待财务处理',
      '11': '已办结'
    },
    showAreaPopup: false,
    showDateTimePopup: false,
    areaList: {},
    // -- order data --
    region: '',
    regionLabel: '',
    countryId: '',
    cityId: '',
    provinceId: '',
    insuranceCompanySourceList: [],
    insuranceCompanyList: [],
    insuranceCompanyValue: '',
    insuranceCompanyLabel: '',
    address: '',
    damageTarget: '',
    insuredName: '',
    insuredPhone: '',
    ownerName: '',
    ownerPhone: '',
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
    isPay: '',
    orderImageFiles: [],
    investigatorImageFiles: [],
    workerInfoImageFiles: [],
    workerApplicationImageFiles: [],
    workerCompleteImageFiles: [],
    comeDateTimeValue: today.getTime(),
    comeDateTimeLabel: common.formatDateTimePicker(today),
    jobRole: ''
  },
  async onLoad (routeParams) {
    routeParams = {id: '1'}
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    await this.initCondition()
    this.setData({
      orderId: routeParams?.id || '',
      region: app.globalData.currentRegisterInfo?.townCode || '',
      countryId: app.globalData.currentRegisterInfo?.townCode || '',
      cityId: app.globalData.currentRegisterInfo?.cityCode || '',
      provinceId: app.globalData.currentRegisterInfo?.provinceCode || '',
      role: app.globalData.currentRegisterInfo?.role || '' // 查勘员、业主、物业、施工人员、平台处理人、报价人员、财务人员、tis人员、市级负责人、省级负责人
    }, async () => {
      if (routeParams.id) {
        await this.initDataById(routeParams.id)
      } else {
        setTimeout(() => this.refreshRegionLabel(), 10)
      }
      wx.hideLoading()
    })
  },
  async initDataById (orderId) {
    let _this = this
    // await util.request({
    //   path: `/app/businessinsurancefamilynew/familyDetail`,
    //   method: 'GET',
    //   data: {
    //     orderId: orderId
    //   }
    // }, function (err, res) {
    //   let data = res.data
    //   _this.sourceData = data
    //   _this.sourceImage = res.Image
    //   let informationImageFiles = []
    //   _this.sourceImage.forEach(item => {
    //     switch (item.type) {
    //       case 1:
    //         item.path = `https://aplusprice.xyz/file/${item.path}`
    //         informationImageFiles.push(item)
    //         break
    //     }
    //   })
    //   _this.setData({}, () => {
    //     _this.refreshRegionLabel()
    //   })
    // })
  },
  async initCondition () {
    let _this = this
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
    let d = new Date(e.detail)
    this.setData({
      showDateTimePopup: false,
      comeDateTimeValue: e.detail,
      comeDateTimeLabel: common.formatDateTimePicker(d)
    })
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
        investigatorImageFiles.push({path: item.path, type: 1})
      }
    })
    _this.data.workerInfoImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerInfoImageFiles.push({path: item.path, type: 1})
      }
    })
    _this.data.workerApplicationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerApplicationImageFiles.push({path: item.path, type: 1})
      }
    })
    _this.data.workerCompleteImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workerCompleteImageFiles.push({path: item.path, type: 1})
      }
    })
    return [...orderImageFiles, ...investigatorImageFiles, ...workerInfoImageFiles, ...workerApplicationImageFiles, ...workerCompleteImageFiles]
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
  goToList () {
    // wx.redirectTo({
    //   url: '../new-my-list-jc/new-my-list-jc'
    // })
  },
  // ------- COMMON FUNCTION --------
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
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}SourceList`][e.detail.value] ? this.data[`${name}SourceList`][e.detail.value].name : ''
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
        setTimeout(() => {app.globalData.isIgnoreRefresh = false}, 100)
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
})