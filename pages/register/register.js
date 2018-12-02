const app = getApp()
import util from '../../utils/util'

Page({
  data: {
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    companyCategory: '',
    companyName: '',
    companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
    companyNameList: ['Name 1', 'Name 2', 'Name 3'],
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
    isOurUser: false
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
      isOurUser: _isOurUser
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              _this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfoAuth: true,
                region: app.globalData.currentRegisterInfo.townCode,
                'registeInfo.avatarUrl': app.globalData.userInfo.avatarUrl,
                'registeInfo.country': app.globalData.userInfo.country,
                'registeInfo.gender': app.globalData.userInfo.gender,
                'registeInfo.language': app.globalData.userInfo.language,
                'registeInfo.nickName': app.globalData.userInfo.nickName,
                "registeInfo.cityCode": app.globalData.currentRegisterInfo.cityCode,
                "registeInfo.companyName": app.globalData.currentRegisterInfo.companyNameCode,
                "registeInfo.companyType": app.globalData.currentRegisterInfo.companyType,
                "registeInfo.inviteCode": app.globalData.currentRegisterInfo.inviteCode,
                "registeInfo.mobile": app.globalData.currentRegisterInfo.mobile,
                "registeInfo.name": app.globalData.currentRegisterInfo.name,
                "registeInfo.provinceCode": app.globalData.currentRegisterInfo.provinceCode,
                "registeInfo.role": app.globalData.currentRegisterInfo.role+'',
                "registeInfo.townCode": app.globalData.currentRegisterInfo.townCode
              })
            }
          })
        }
      }
    })
    this.initArea()
  },
  getRegionLabel () {
    let arr = []
    arr.push(this.data.areaList['province_list'][app.globalData.currentRegisterInfo.provinceCode])
    arr.push(this.data.areaList['city_list'][app.globalData.currentRegisterInfo.cityCode])
    arr.push(this.data.areaList['county_list'][app.globalData.currentRegisterInfo.townCode])
    this.setData({
      regionLabel: arr.join(',')
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
  companyTypeChange (data) {
    console.log(data.detail.value)
    // companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
  },
  companyNameChange (data) {
    console.log(data.detail.value)
    // companyNameList: ['Name 1', 'Name 2', 'Name 3'],
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
    if (!this.checkPhone()) {
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
