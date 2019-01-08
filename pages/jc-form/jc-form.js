//获取应用实例
import util from "../../utils/util";
const app = getApp()

Page({
  data: {
    flowId: null,
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    status: '',
    statusMap: {
      '12': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善', // 也是驳回状态
      '31': '被保险人已完善,待报价中心报价',
      '32': '已报价,待被保险人审阅',
      '33': '被保险人不满意，待沟通',
      '40': '待合作商完善', // 也是驳回状态
      '41': '合作商已完善,待报价中心报价',
      '42': '已报价,需协商',
      '50': '已报价,待财务处理'
      // '11': '已办结',
      // '99': '处理中'
    },
    taskData: {
      "cityId": '',
      "countryId": '',
      "provinceId": '',
      "customerName": '',
      "customerPhone": '',
      "investigatorName": '',
      "investigatorPhone": '',
      "investigatorText": '',
      "bankTransactionId": '',
      "constructionMethod": '',
      "deposit": ''
    },
    caleImageFiles: [],
    authorityImageFiles: []
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        flowId: routeParams.flowId,
        role: app.globalData.currentRegisterInfo.role// app.globalData.currentRegisterInfo.role//  TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  onConstructionMethodChange (event) {
    this.setData({
      'taskData.constructionMethod': event.detail
    });
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/lock/info',
      method: 'GET',
      data: {
        id: id
      }
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.image
      let informationImageFiles = []
      let liveImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            informationImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
          case 9:
            liveImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
        }
      })
      _this.setData({
        'status': data.status,
        'taskData.countryId': data.areaCode,
        'taskData.cityId': data.cityCode,
        'taskData.provinceId': data.provinceCode,
        "taskData.customerPhone": data.customMobile,
        "taskData.customerName": data.customName,
        "taskData.investigatorName": data.investigatorName,
        "taskData.investigatorPhone": data.investigatorPhone,
        "taskData.investigatorText": data.investigatorText,
        "taskData.bankTransactionId": data.bankTransactionId,
        "taskData.constructionMethod": data.constructionMethod,
        "taskData.deposit": data.deposit
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.countryId': app.globalData.currentRegisterInfo.townCode,
      'taskData.cityId': app.globalData.currentRegisterInfo.cityCode,
      'taskData.provinceId': app.globalData.currentRegisterInfo.provinceCode
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
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  previewAuthorityImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.authorityImageFiles
    })
  },
  chooseAuthorityImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let list = that.data.authorityImageFiles.concat(res.tempFilePaths)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '授权图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            authorityImageFiles: list
          });
        }
      }
    })
  },
  removeAuthorityImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.authorityImageFiles.splice(index, 1)
    this.setData({
      authorityImageFiles: _this.data.authorityImageFiles
    })
  },
  previewCaleImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.caleImageFiles
    })
  },
  chooseCaleImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let list = that.data.caleImageFiles.concat(res.tempFilePaths)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '保险计算书图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            caleImageFiles: list
          });
        }
      }
    })
  },
  removeCaleImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.caleImageFiles.splice(index, 1)
    this.setData({
      caleImageFiles: _this.data.caleImageFiles
    })
  },
  commitOrder(e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      "cityId": data.cityId,
      "countryId": data.countryId,
      "provinceId": data.provinceId,
      "customerName": data.customerName,
      "customerPhone": data.customerPhone,
      "investigatorText": data.investigatorText
    }

    // if (this.data.modifyId) {
    //   taskData.id = _this.data.modifyId
    //   taskData.liveImage = liveImageFiles.length > 0 ? 1 : 0
    //   taskData.damageId = _this.data.id
    // }

    if (taskData.customerName == '') {
      wx.showToast({
        mask: true,
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
    if (!isVaidcustomerPhone) {
      return
    }

    if (taskData.investigatorText == '') {
      wx.showToast({
        mask: true,
        title: '请填写查勘员备注',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log('工单新建 改善参数：', taskData)
    wx.showLoading({
      mask: true,
      title: '提交中',
      duration: 1000
    })
    util.request({
      path: isSave ? '/app/family/saveBySurvey' : '/app/family/orders',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建 改善结果：', res)
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '创建成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index'
              })
            }, 1000)
          }
        })
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
  checkPhone (str, msg){
    if(!(/^1[34578]\d{9}$/.test(str))){
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
    wx.navigateBack({
      url: '../my-jc-lock/my-jc-lock',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }
})
