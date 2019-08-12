//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";

const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    show: false,
    status: '',
    statusMap: {
      '12': '暂存',
      '1': '查勘员已派送',
      '13': '负责人已确认',
      '11': '已办结',
      '99': '处理中'
    },
    taskData: {
      "title": "",
      "content": "",
      "feedbackType": "1"
    }
  },
  onLoad: function (routeParams ) {
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
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
        "title": "",
        "content": "",
        "feedbackType": ""
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
  onTypeChange (event) {
    this.setData({
      'taskData.feedbackType': event.detail
    });
  },
  commitSubmit (e) {
    let taskData = this.data.taskData
    let _this = this

    if (taskData.title == '') {
      wx.showToast({
        mask: true,
        title: '请填写标题',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.content == '') {
      wx.showToast({
        mask: true,
        title: '请填写内容',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // let isVaidcustomerPhone = this.checkPhone(taskData.customMobile, '请输入正确的客户手机号')
    // if (!isVaidcustomerPhone) {
    //   return
    // }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/feedbacks',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '创建成功',
          icon: 'success',
          duration: 1000,
          success () {
            setTimeout(() => {
              _this.goToList()
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
    if(!(/^1[3456789]\d{9}$/.test(str))){
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
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-feedback/my-list-feedback'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-feedback/my-list-feedback'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-feedback/my-list-feedback'
      })
    }
  }
})
