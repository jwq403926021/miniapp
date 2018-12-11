const app = getApp()
import util from '../../utils/util'

Page({
  data: {
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    companyCategory: '',
    companyCategoryLabel: '',
    companyCategoryList: [],
    companyName: '',
    companyNameLabel: '',
    companyNameList: [],
    companySubCategory: '',
    companySubCategoryLabel: '',
    companySubCategoryList: [],
    showAskUserInfoBtn: false,
    hasUserInfoAuth: false,
    hasBindPhone: false,
    userInfo: null,
    isDisableVerfiyBtn: false,
    verifyLabel: '获取验证码',
    registeInfo: {
      "avatarUrl": "",
      "cityCode": "",
      // "city": "",
      "companyName": "110", // 暂时
      "companyType": "119", // 暂时
      insurance: '',
      "gender": "",
      "inviteCode": "",
      "mobile": "",
      "mobileCode": "",
      "name": "",
      "nickName": "",
      "provinceCode": "",
      // "province": "",
      "role": "1", // 暂时
      "townCode": "",
      // "town": ""
    },
    isOurUser: false,
    isModifyPhone: true
  },
  onChange(event) {
    this.setData({
      'registeInfo.role': event.detail
    });
  },
  onLoad: function (routeParams) {
    wx.hideLoading()
    let _this = this
    let value = wx.getStorageSync('status')
    let _isOurUser = (value == 2 || value == '') ? false : true
    this.setData({
      hasBindPhone: _isOurUser,
      isOurUser: _isOurUser,
      isModifyPhone: _isOurUser
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              let currentData = app.globalData.currentRegisterInfo
              _this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfoAuth: true,
                region: currentData ? currentData.townCode : '',
                'registeInfo.avatarUrl': app.globalData.userInfo.avatarUrl,
                'registeInfo.country': app.globalData.userInfo.country,
                'registeInfo.gender': app.globalData.userInfo.gender,
                'registeInfo.language': app.globalData.userInfo.language,
                'registeInfo.nickName': app.globalData.userInfo.nickName,
                "registeInfo.cityCode": currentData ? currentData.cityCode : '',
                "registeInfo.companyName": currentData ? currentData.companyNameCode : '',
                "registeInfo.companyType": currentData ? currentData.companyType : '',
                "registeInfo.inviteCode": currentData ? currentData.inviteCode : '',
                "registeInfo.mobile": currentData ? currentData.mobile : '',
                "registeInfo.name": currentData ? currentData.name : '',
                "registeInfo.provinceCode": currentData ? currentData.provinceCode : '',
                "registeInfo.role": currentData ? (currentData.role + '') : '',
                "registeInfo.townCode": currentData ? currentData.townCode : ''
              })
            }
          })
        } else {
          this.setData({
            showAskUserInfoBtn: true
          })
        }
      }
    })
    this.initArea()
    this.initCompanyCategory()
  },
  initCompanyCategory () {
    let _this = this
    util.request({
      path: '/sys/industry/all',
      method: 'GET'
    }, function (err, res) {
      if (res.code == 0) {
        _this.companySourceData = res.data
        _this.setData({
          'companyCategoryList': _this.companySourceData.map(item => { return item.name })
        })
      }
    })

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
  getRegionLabel () {
    let arr = []
    if (app.globalData.currentRegisterInfo) {
      arr.push(this.data.areaList['province_list'][app.globalData.currentRegisterInfo.provinceCode])
      arr.push(this.data.areaList['city_list'][app.globalData.currentRegisterInfo.cityCode])
      arr.push(this.data.areaList['county_list'][app.globalData.currentRegisterInfo.townCode])
    }
    this.setData({
      regionLabel: arr.length ? arr.join(',') : ''
    })
  },
  initArea () {
    let _this = this
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
  initCompanyName () {
    // companyNameList
    let _this = this
    let data = {
      areaCode: this.data.registeInfo.townCode,
      industryCode: this.data.registeInfo.companyType
    }
    if (this.data.userInfo.companyType == 2) {
      data.insurance = this.data.registeInfo.insurance
    }
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: data
    }, function (err, res) {
      console.log('!! c name', res)
    })
  },
  companyTypeChange (data) {
    this.setData({
      'registeInfo.companyType': this.companySourceData[data.detail.value].id,
      companyCategoryLabel: this.companySourceData[data.detail.value].name
    })

    if (this.companySourceData[data.detail.value].id == 2) { // 当为2 保险行业 时不load 单位名称
      // do nothing
    } else {
      this.initCompanyName()
    }
  },
  insuranceChange (data) {
    this.setData({
      'registeInfo.insurance': this.companySubSourceData[data.detail.value].id,
      companySubCategoryLabel: this.companySubSourceData[data.detail.value].name
    })
    this.initCompanyName()
  },
  companyNameChange (data) {
    console.log(data.detail.value)
  },
  checkCompanyName () {
    if (!this.data.registeInfo.townCode) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!this.data.registeInfo.companyType) {
      wx.showToast({
        title: '请选择单位类别',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (this.data.registeInfo.companyType == 2 && (this.data.registeInfo.insurance == ''  || this.data.registeInfo.insurance == null)) {
      wx.showToast({
        title: '请选择公司子类',
        icon: 'none',
        duration: 2000
      })
      return false
    }
  },
  bindGetUserInfo(data) {
    if (data.detail.errMsg == "getUserInfo:fail auth deny") {
      return false
    }
    app.globalData.userInfo = data.detail.userInfo
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfoAuth: true,
      'registeInfo.avatarUrl': app.globalData.userInfo.avatarUrl,
      'registeInfo.country': app.globalData.userInfo.country,
      'registeInfo.gender': app.globalData.userInfo.gender,
      'registeInfo.language': app.globalData.userInfo.language,
      'registeInfo.nickName': app.globalData.userInfo.nickName
    })


  },
  submitRegiste() {
    let _this = this
    if (!this.checkPhone()) {
      return false
    }
    if (this.data.isOurUser && this.data.registeInfo.mobile != app.globalData.currentRegisterInfo.mobile && this.data.registeInfo.mobileCode == '') {
      wx.showToast({
        title: '手机验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let params = this.data.registeInfo
    util.request({
      path: '/app/register',
      method: 'POST',
      data: params
    }, function (err, res) {
      console.log('rrr---', res)
      if (res.code == 0) {
        _this.setData({
          isModifyPhone: false
        })
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
        wx.setStorageSync('status', 1)
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }
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
      regionLabel: strArr.join(','),
      'registeInfo.townCode': data.detail.values[2].code,
      'registeInfo.cityCode': data.detail.values[1].code,
      'registeInfo.provinceCode': data.detail.values[0].code,
      'registeInfo.town': data.detail.values[2].name,
      'registeInfo.city': data.detail.values[1].name,
      'registeInfo.province': data.detail.values[0].name
    })
    console.log(this.data.registeInfo)
    // console.log('1!!', data.detail.values)
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  requestVerifyCode () {
    let _this = this
    if (!this.checkPhone() || this.data.isDisableVerfiyBtn) {
      return false
    }

    util.request({
      path: '/app/register/code',
      method: 'GET',
      data: {
        mobile: this.data.registeInfo.mobile
      }
    }, function (err, res) {
      if (res.code == 0) {
        let count = 120
        _this.setData({
          isDisableVerfiyBtn: true,
          verifyLabel: `${count}s后再试`
        })
        _this.countTimer = setInterval(() => {
          count--
          if (count <= 0){
            _this.setData({
              isDisableVerfiyBtn: false,
              verifyLabel: `获取验证码`
            })
            _this.countTimer && clearInterval(_this.countTimer)
          } else {
            _this.setData({
              isDisableVerfiyBtn: true,
              verifyLabel: `${count}s后再试`
            })
          }
        }, 1000)
      }
    })
  },
  checkPhone (){
    var phone = this.data.registeInfo.mobile
    if(!(/^1[34578]\d{9}$/.test(phone))){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
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
  bindPhoneNum () {
    let _this = this
    if (!this.checkPhone()) {
      return false
    }
    if (this.data.registeInfo.mobileCode == '' || this.data.registeInfo.mobileCode == null){
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    util.request({
      path: '/app/binding',
      method: 'POST',
      data: {
        mobile: this.data.registeInfo.mobile,
        code: this.data.registeInfo.mobileCode
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.setData({
          isModifyPhone: false,
          'hasBindPhone': true,
          "registeInfo.companyName": res.userInfo.companyNameCode || '119',
          "registeInfo.companyType": res.userInfo.companyType || '119',
          "registeInfo.inviteCode": res.userInfo.inviteCode,
          "registeInfo.name": res.userInfo.name,
          "registeInfo.role": res.userInfo.role,
          'registeInfo.townCode': res.userInfo.townCode,
          'registeInfo.cityCode': res.userInfo.cityCode,
          'registeInfo.provinceCode': res.userInfo.provinceCode
          // ,
          // 'registeInfo.town': res.userInfo.town,
          // 'registeInfo.city': res.userInfo.city,
          // 'registeInfo.province': res.userInfo.province
        })
      }
    })
  }
})
