const app = getApp()

Page({
  data: {
    array: ['游客', '查勘员', '服务者'],
    region: ['辽宁省', '大连市'],
    role: '',
    companyCategory: 0,
    companyName: 0,
    companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
    companyNameList: ['Name 1', 'Name 2', 'Name 3'],
    regionData: {
      "abc": {
        "eee": ["1","2"]
      }
    },
    regionPickerFlag: false,
    hasUserInfoAuth: false,
    userInfo: null
  },
  onChange(event) {
    this.setData({ role: event.detail });
  },
  onLoad: function (routeParams) {
    console.log('routeParams->', routeParams)
    wx.hideLoading()

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfoAuth: true
          })
        } else {
          this.setData({
            userInfo: null,
            hasUserInfoAuth: false
          })
        }
      }
    })
  },
  bindGetUserInfo (data) {
    app.globalData.userInfo = data.detail.userInfo
    this.setData({
      hasUserInfoAuth: true,
      userInfo: app.globalData.userInfo,
      hasUserInfoAuth: true
    })
  },
  onChange3 (e) {
    console.log("onChange3", e)
  },
  cancelRegionPicker () {
    this.setData({
      regionPickerFlag: false
    })
  },
  openRegionPicker () {
    this.setData({
      regionPickerFlag: true
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit (data) {
    console.log("formSubmit::", data)
  }
})
