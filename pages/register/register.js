const app = getApp()
import util from '../../utils/util'

Page({
  data: {
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',

    companyCategory: '0',
    companyCategoryLabel: '保险公司',
    // companyCategoryList: [],

    companySubCategory: '',
    companySubCategoryLabel: '',
    companySubCategoryList: [],

    companyName: '',
    companyNameLabel: '',
    companyNameList: [],

    companyLevel: '',
    companyLevelLabel: '',
    companyLevelList: ['省级', '市级', '区级'],

    showAskUserInfoBtn: false,
    hasUserInfoAuth: false,
    hasBindPhone: false,
    userInfo: null,
    isDisableVerfiyBtn: true,
    verifyLabel: '获取验证码',
    registeInfo: {
      "avatarUrl": "",
      "cityCode": "",
      "companyNameCode": "",
      "companyName": "",
      "companyType": "2", // 默认 查勘员 的公司类别 为 2 保险公司
      'insurance': '', // 保险 子类别
      "gender": "",
      "inviteCode": "",
      "mobile": "",
      "mobileCode": "",
      "name": "",
      "nickName": "",
      "provinceCode": "",
      "role": '1',
      "townCode": "",
      // "city": "",
      // "province": "",
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
  onShow: function () {
    let value = wx.getStorageSync('status')
    let _isOurUser = (value == 2 || value == '') ? false : true
    console.log('show-->',_isOurUser, value)
    this.setData({
      hasBindPhone: _isOurUser,
      isOurUser: _isOurUser,
      isModifyPhone: _isOurUser
    })
  },
  onLoad: function (routeParams) {
    wx.hideLoading()
    let _this = this
    let value = wx.getStorageSync('status')
    let _isOurUser = (value == 2 || value == '') ? false : true
    console.log('load-->',_isOurUser, value)
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
                'registeInfo.avatarUrl': app.globalData.userInfo.avatarUrl,
                'registeInfo.country': app.globalData.userInfo.country,
                'registeInfo.gender': app.globalData.userInfo.gender,
                'registeInfo.language': app.globalData.userInfo.language,
                'registeInfo.nickName': app.globalData.userInfo.nickName
              })
              if (currentData) {
                _this.setData({
                  region: currentData ? currentData.townCode : '',
                  "registeInfo.cityCode": currentData ? currentData.cityCode : '',
                  "registeInfo.companyNameCode": currentData ? currentData.companyNameCode : '',
                  "registeInfo.companyName": currentData ? (currentData.companyName || currentData.sysCompanyEntity.companyName) : '',
                  "registeInfo.companyType": currentData ? currentData.companyType : '',
                  "registeInfo.inviteCode": currentData ? currentData.inviteCode : '',
                  "registeInfo.mobile": currentData ? currentData.mobile : '',
                  "registeInfo.name": currentData ? currentData.name : '',
                  "registeInfo.provinceCode": currentData ? currentData.provinceCode : '',
                  "registeInfo.role": currentData ? (currentData.role + '') : '',
                  "registeInfo.roleName": currentData ? (currentData.roleName + '') : '',
                  "registeInfo.townCode": currentData ? currentData.townCode : ''
                })
              }
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
    this.initCompanySubCategory()
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
  initCompanySubCategory () {
    let _this = this
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
  companySubCategoryChange (data) {
    this.setData({
      'registeInfo.insurance': this.companySubSourceData[data.detail.value].id,
      companySubCategoryLabel: this.companySubSourceData[data.detail.value].name,
      companySubCategory: data.detail.value,
      'registeInfo.companyNameCode': '',
      companyNameLabel: '',
      companyName: ''
    })
    this.initCompanyName()
  },
  checkCompanyNameList () {
    if (this.data.companyNameList.length == 0) {
      wx.showToast({
        mask: true,
        title: '没有可用单位名称',
        icon: 'none',
        duration: 2000
      })
    }
  },
  initCompanyName () {
    let _this = this
    let data = {
      industryCode: this.data.registeInfo.companyType,
      cityCode:this.data.registeInfo.cityCode,
      provinceCode:this.data.registeInfo.provinceCode,
      areaCode:this.data.registeInfo.townCode,
      organization:this.data.companyLevel
    }
    if (this.data.registeInfo.companyType == 2) {
      data.insurance = this.data.registeInfo.insurance
    }
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: data
    }, function (err, res) {
      if (res.code == 0) {
        _this.companyNameSourceData = res.data
        _this.setData({
          'companyNameList': _this.companyNameSourceData.map(item => { return item.companyName })
        })
      }
    })
  },
  companyNameChange (data) {
    if (this.companyNameSourceData.length > 0) {
      this.setData({
        'registeInfo.companyNameCode': this.companyNameSourceData[data.detail.value].id,
        companyNameLabel: this.companyNameSourceData[data.detail.value].companyName,
        companyName: data.detail.value
      })
    }
  },
  companyLevelChange (data) {
    this.setData({
      companyLevel: data.detail.value,
      companyLevelLabel: this.data.companyLevelList[data.detail.value],
      'registeInfo.companyNameCode': '',
      companyNameLabel: '',
      companyName: ''
    })
    this.initCompanyName()
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

    let currentData = app.globalData.currentRegisterInfo
    if (currentData) {
      this.setData({
        region: currentData ? currentData.townCode : '',
        "registeInfo.cityCode": currentData ? currentData.cityCode : '',
        "registeInfo.companyNameCode": currentData ? currentData.companyNameCode : '',
        "registeInfo.companyName": currentData ? (currentData.companyName || currentData.sysCompanyEntity.companyName) : '',
        "registeInfo.companyType": currentData ? currentData.companyType : '',
        "registeInfo.inviteCode": currentData ? currentData.inviteCode : '',
        "registeInfo.mobile": currentData ? currentData.mobile : '',
        "registeInfo.name": currentData ? currentData.name : '',
        "registeInfo.provinceCode": currentData ? currentData.provinceCode : '',
        "registeInfo.role": currentData ? (currentData.role + '') : '',
        "registeInfo.roleName": currentData ? (currentData.roleName + '') : '',
        "registeInfo.townCode": currentData ? currentData.townCode : ''
      })
    }
    console.log('hasUserInfoAuth && hasBindPhone', this.data.hasUserInfoAuth,this.data.hasBindPhone)
  },
  submitRegiste() {
    let _this = this
    if (!this.checkPhone()) {
      return false
    }

    if (this.data.isOurUser && this.data.registeInfo.mobile != app.globalData.currentRegisterInfo.mobile && this.data.registeInfo.mobileCode == '') {
      wx.showToast({
        mask: true,
        title: '手机验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (this.data.registeInfo.name == '' || this.data.registeInfo.name == null){
      wx.showToast({
        mask: true,
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (!this.data.registeInfo.townCode) {
      wx.showToast({
        mask: true,
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (this.data.registeInfo.role == 1) {
      if (this.data.registeInfo.companyNameCode == null || this.data.registeInfo.companyNameCode == '') {
        wx.showToast({
          mask: true,
          title: '单位名称不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    }
    let params = Object.assign({}, this.data.registeInfo)
    if (this.data.registeInfo.role != 1) {
      delete params['companyNameCode']
      delete params['companyType']
      delete params['insurance']
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/register',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        app.globalData.currentRegisterInfo = res.userInfo
        _this.setData({
          isOurUser: true,
          isModifyPhone: false,
          "registeInfo.mobileCode": '',
          "registeInfo.inviteCode": res.userInfo.inviteCode,
          "registeInfo.roleName": res.userInfo.roleName,
          "registeInfo.companyName": res.userInfo.sysCompanyEntity ? res.userInfo.sysCompanyEntity.companyName : ''
        })
          wx.setStorageSync('status', 1)
          wx.showToast({
            mask: true,
            title: '操作成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                setTimeout(()=> {
                    wx.switchTab({
                        url: '../index/index',
                        success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();
                        }
                    })
                }, 2000)
            }
        })
      }
    })
  },
  openLocation() {
    if (!this.data.isOurUser) {
      this.setData({
        show: !this.show
      })
    }
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
      'registeInfo.province': data.detail.values[0].name,
      'registeInfo.companyNameCode': '',
      companyNameLabel: '',
      companyName: ''
    })
    this.initCompanyName()
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
    if(!(/^1[3456789]\d{9}$/.test(phone))){
      wx.showToast({
        mask: true,
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

    if (name == 'registeInfo.mobile') {
      this.setData({
        isDisableVerfiyBtn: false
      })
    }
  },
  bindPhoneNum () {
    let _this = this
    if (!this.checkPhone()) {
      return false
    }
    if (this.data.registeInfo.mobileCode == '' || this.data.registeInfo.mobileCode == null){
      wx.showToast({
        mask: true,
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/binding',
      method: 'POST',
      data: {
        mobile: this.data.registeInfo.mobile,
        code: this.data.registeInfo.mobileCode
      }
    }, function (err, res) {
      if (res.code == 0) {
        wx.hideLoading()
        _this.setData({
          isModifyPhone: false,
          'hasBindPhone': true,
          "registeInfo.companyNameCode": res.userInfo.companyNameCode,
          "registeInfo.companyName": res.userInfo.sysCompanyEntity ? res.userInfo.sysCompanyEntity.companyName : '',
          "registeInfo.companyType": res.userInfo.companyType || '2', // '新用户默认 单位类别 2保险公司'
          "registeInfo.inviteCode": res.userInfo.inviteCode,
          "registeInfo.name": res.userInfo.name,
          "registeInfo.role": res.userInfo.role || '1', // '新用户默认 1查勘员'
          "registeInfo.roleName": res.userInfo.roleName,
          'registeInfo.townCode': res.userInfo.townCode,
          'registeInfo.cityCode': res.userInfo.cityCode,
          'registeInfo.provinceCode': res.userInfo.provinceCode
        })
      }
    })
  },
  copyInviteCode (e) {
    let code = e.currentTarget.dataset.code;
    wx.setClipboardData({
      data: code,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  }
})
