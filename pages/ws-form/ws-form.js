//获取应用实例
import util from "../../utils/util";

const app = getApp()

Page({
  data: {
    id: null,
    role: 0, // 0 查勘员 | 1 施工人员 | 2 区域负责人 | 3 合作商负责人 |
    status: 0, // 0 新建 | 1 施工人员画面 | 2 施工人员提交 押金页面
    files: [],
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    taskData: {
      provinceCode: '',
      cityCode: '',
      townCode: '',
      area: '',
      isCarDamaged: '1',
      damagedUser: '',
      damagedPhone: '',
      customerUser: '',
      customerPhone: '',
      plateNumber: '',
      information: '',
      informationImage: [],
      scene: '',
      sceneImage: []
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../register/register?id=' + 123
    })
  },
  onLoad: function (routeParams) {
    console.log('routeParams->', routeParams)
    if (routeParams.id) {
      this.setData({
        id: routeParams.id
      })
      this.initDataById(routeParams.id)
    } else {
      this.initArea()
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/damage/damageDetail',
      method: 'GET',
      data: {
        damageId: id
      }
    }, function (err, res) {
      let data = res.data
      _this.sourceData = data
      _this.setData({
        // 'taskData.provinceCode': data.area,
        // 'taskData.cityCode': data.area,
        // 'taskData.townCode': data.area,
        status: data.status,
        'taskData.area': data.area,
        'taskData.isCarDamaged': data.area,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone,
        'taskData.customerUser': data['customer_user'],
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        'taskData.informationImage': data.area,
        'taskData.scene': data.id,
        'taskData.sceneImage': data.area
      })
      // {
      //   "id": 10,
      //   "surveyUser": null,
      //   "surveyPhone": null,
      //   "workerUser": null,
      //   "workerPhone": null,
      //   "handlingType": null,
      //   "budgetPreliminary": null,
      //   "workType": null,
      //   "deposit": null,
      //   "trasactionId": null,
      //   "offer": null,
      //   "bidder": null,
      //   "offerRemark": null,
      //   "createUserId": null,
      //   "updateUserId": null,
      //   "createTime": null,
      //   "updateTime": null,
      //   "status": null
      // }
    })
  },
  checkPhone (str){
    if(!(/^1[34578]\d{9}$/.test(str))){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  },
  isLicenseNo(str){
    str = str.replace(/\s+/g,"")
    if (str) {
      let flag = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str);
      if (!flag) {
        wx.showToast({
          title: '车牌号不正确',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else {
      wx.showToast({
        title: '车牌号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
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
  getRegionLabel () {
    // let arr = []
    // if (app.globalData.currentRegisterInfo) {
    //   arr.push(this.data.areaList['province_list'][app.globalData.currentRegisterInfo.provinceCode])
    //   arr.push(this.data.areaList['city_list'][app.globalData.currentRegisterInfo.cityCode])
    //   arr.push(this.data.areaList['county_list'][app.globalData.currentRegisterInfo.townCode])
    // }
    // this.setData({
    //   regionLabel: arr.length ? arr.join(',') : ''
    // })
  },
  openLocation() {
    console.log('!!!')
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
      'taskData.area': data.detail.values[2].code,
      'taskData.townCode': data.detail.values[2].code,
      'taskData.cityCode': data.detail.values[1].code,
      'taskData.provinceCode': data.detail.values[0].code,
    })
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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
  onIsCarDamagedChange (event) {
    if (event.detail != '1') {
      this.setData({
        'taskData.plateNumber': ''
      })
    }
    this.setData({
      'taskData.isCarDamaged': event.detail
    });
  },
  submitWS (data) {
    console.log(this.data.taskData, '###')
    let taskData = this.data.taskData

    if (taskData.damagedUser == '' || taskData.customerUser == '') {
      wx.showToast({
        title: '请填写受损人姓名以及客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone)
    let isVaiddamagedPhone = this.checkPhone(taskData.damagedPhone)
    if (!isVaiddamagedPhone || !isVaidcustomerPhone) {
      return
    }
    if (taskData.isCarDamaged == '1') {
      let flag = this.isLicenseNo(taskData.plateNumber)
      if (!flag) {
        return
      }
    }
    if (taskData.information == '') {
      wx.showToast({
        title: '请填写报案信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    util.request({
      path: '/app/damage/addBySurvey',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('submit form:', res)
    })
  }
})
