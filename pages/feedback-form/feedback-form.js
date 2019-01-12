//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";

const app = getApp()

Page({
  data: {
    orderId: null,
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    repairPlantValue: '',
    repairPlantLabel: '',
    repairPlantList: [],
    status: '',
    statusMap: {
      '12': '暂存',
      '1': '查勘员已派送',
      '13': '负责人已确认',
      '11': '已办结',
      '99': '处理中'
    },
    taskData: {
      "provinceCode": "",
      "areaCode": "",
      "cityCode": "",
      "customMobile": '',
      "customName": "",
      "information": "",
      "offer": "",
      "live": "",
      "insurerUserMobile": "",
      "dredgeUserMobile": ""
    },
    informationImageFiles: [],
    liveImageFiles: []
  },
  onLoad: function (routeParams ) {
    console.log('开锁 工单号：->', routeParams)
    console.log('当前用户信息->', app.globalData.currentRegisterInfo)
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.orderId,
        role: app.globalData.currentRegisterInfo.role// app.globalData.currentRegisterInfo.role//  TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/dredge/info',
      method: 'GET',
      data: {
        id: id
      }
    }, function (err, res) {
      _this.setData({
        'informationImageFiles': informationImageFiles,
        'liveImageFiles': liveImageFiles,
        'status': data.status,
        'taskData.areaCode': data.areaCode,
        'taskData.cityCode': data.cityCode,
        'taskData.provinceCode': data.provinceCode,
        "taskData.customMobile": data.customMobile,
        "taskData.customName": data.customName,
        "taskData.information": data.information,
        "taskData.offer": data.offer,
        "taskData.live": data.live,
        "taskData.insurerUserMobile": data.insurerUserMobile,
        "taskData.dredgeUserMobile": data.dredgeUserMobile
      })
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
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  commitSubmit (e) {
    let data = this.data.taskData
    let _this = this

    if (taskData.customName == '') {
      wx.showToast({
        mask: true,
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.customMobile, '请输入正确的客户手机号')
    if (!isVaidcustomerPhone) {
      return
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/dredge/commit',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '创建成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              if (_this.data.modifyId){
                _this.goToList()
              }else{
                wx.switchTab({
                  url: '../index/index'
                })
              }
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
      url: '../my-list-feedback/my-list-feedback',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }
})
