const app = getApp()
import util from '../../utils/util'

Page({
  data: {
    show: false,
    areaList: {},
    region: '',
    role: '',
    companyCategory: '',
    companyName: '',
    companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
    companyNameList: ['Name 1', 'Name 2', 'Name 3'],
    hasUserInfoAuth: false,
    userInfo: null,
    isDisableVerfiyBtn: false,
    verifyLabel: '获取验证码',
    registeInfo: {
      "avatarUrl": "",
      "cityCode": "",
      "companyName": "110", // 暂时
      "companyType": "119", // 暂时
      "gender": "",
      "inviteCode": "",
      "mobile": "",
      "mobileCode": "",
      "name": "",
      "nickName": "",
      "provinceCode": "",
      "role": "1", // 暂时
      "townCode": ""
    },
    isOurUser: 0
  },
  onChange(event) {
    this.setData({
      'registeInfo.role': event.detail
    });
  },
  onLoad: function (routeParams) {
    let _this = this
    this.setData({
      isOurUser: 0
    })
    wx.hideLoading()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              let _data = Object.assign(_this.data.registeInfo, res.userInfo)
              _this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfoAuth: true,
                registeInfo: _data
              })
            }
          })
        }
      }
    })
    this.initArea()
  },
  initArea () {
    // util.request({
    //   path: '/sys/area/list',
    //   method: 'GET'
    // }, function (err, res) {
    //   console.log('----', res)
    //   if (res.code == 0) {
    //
    //   }
    // })
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
    let _data = Object.assign(this.data.registeInfo, data.detail.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfoAuth: true,
      registeInfo: _data
    })
  },
  submitRegiste() {
    let params = this.data.registeInfo
    console.log(params, '---')
    util.request({
      path: '/app/register111',
      method: 'POST',
      data: params
    }, function (err, res) {
      console.log('----', res)
      if (res.code == 0) {

      }
    })
  },
  openLocation() {
    this.setData({
      show: !this.show
    })
  },
  onConfirm(data) {
    console.log('1!!', data)
    this.setData({
      show: false
    })
  },
  onClose() {
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
        let count = 10
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
  }
})
