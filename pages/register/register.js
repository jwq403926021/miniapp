const app = getApp()

Page({
  data: {
    array: ['游客', '查勘员', '服务者'],
    region: ['辽宁省', '大连市'],
    role: 0,
    companyCategory: 0,
    companyName: 0,
    companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
    companyNameList: ['Name 1', 'Name 2', 'Name 3'],
    regionData: {
      "abc": {
        "eee": ["1","2"]
      }
    },
    regionPickerFlag: false
  },
  onLoad: function (routeParams) {
    console.log('routeParams->', routeParams)

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
  }
})
