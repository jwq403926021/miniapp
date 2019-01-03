//获取应用实例
import util from "../../utils/util";

const app = getApp()

Page({
  data: {
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    repairPlantValue: '',
    repairPlantLabel: '',
    repairPlantList: [],
    taskData: {
      autoInsuranceName: '',
      autoInsuranceMobile: '',
      plateNumber: '',
      type: '1',
      areaCode: '',
      cityCode: '',
      provinceCode: '',
      repairPlantId: '',
      remark: ''
    },
    informationImageFiles: [],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../register/register?id='+123
    })
  },
  onLoad: function (routeParams ) {
    console.log('车险 工单号：->', routeParams)
    console.log('当前用户信息->', app.globalData.currentRegisterInfo)
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role// 1 查勘员 | 12 施工人员 | 6 公司市级负责人 | 11 合作商市级负责人 | TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/autoInsurance/info',
      method: 'GET',
      data: {
        autoInsuranceId: id
      }
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.Image
      // let informationImageFiles = []
      // let liveImageFiles = []
      // let workLiveImageFiles = []
      // let damageImageFiles = []
      // let authorityImageFiles = []
      // let caleImageFiles = []
      // _this.sourceImage.forEach(item => {
      //   switch (item.type) {
      //     case 1:
      //       informationImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //     case 2:
      //       liveImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //     case 3:
      //       workLiveImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //     case 4:
      //       damageImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //     case 5:
      //       authorityImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //     case 7:
      //       caleImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
      //       break
      //   }
      // })
      // _this.setData({
      //   'taskData.status': data.status,
      //   'taskData.area': data.area,
      //   'taskData.insuranceType': data.insuranceType,
      //   'taskData.damagedUser': data.damagedUser,
      //   'taskData.damagedPhone': data.damagedPhone || '',
      //   'taskData.customerUser': data.customerUser,
      //   'taskData.customerPhone': data.customerPhone,
      //   'taskData.plateNumber': data.plateNumber,
      //   'taskData.information': data.information,
      //   'taskData.live': data.live,
      //   "taskData.surveyUser": data.surveyUser,
      //   "taskData.surveyPhone": data.surveyPhone,
      //   "taskData.workerUser": data.workerUser,
      //   "taskData.workerPhone": data.workerPhone,
      //   "taskData.workType": data.workType,
      //   "taskData.budgetPreliminary": data.budgetPreliminary,
      //   'taskData.handlingType': data.handlingType,
      //   'taskData.deposit': data.deposit,
      //   'taskData.trasactionId': data.trasactionId,
      //   'taskData.offer': data.offer,
      //   'taskData.bidder': data.bidder,
      //   'taskData.offerRemark': data.offerRemark
      // })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.area': app.globalData.currentRegisterInfo.townCode,
      'taskData.areaCode': app.globalData.currentRegisterInfo.townCode,
      'taskData.cityCode': app.globalData.currentRegisterInfo.cityCode,
      'taskData.provinceCode': app.globalData.currentRegisterInfo.provinceCode
    })
    this.initRepairPlant()
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
  initRepairPlant () {
    let _this = this
    util.request({
      path: '/sys/company/list',
      method: 'GET',
      data: {
        industryCode: '8',
        organization: '2',
        cityCode: _this.data.taskData.cityCode,
        provinceCode: _this.data.taskData.provinceCode,
        areaCode: _this.data.taskData.areaCode
      }
    }, function (err, res) {
      _this.repairPlantSource = res.data
      _this.setData({
        'repairPlantList': res.data.map(item => {
          return item.companyName
        })
      })
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
      'taskData.areaCode': data.detail.values[2].code,
      'taskData.cityCode': data.detail.values[1].code,
      'taskData.provinceCode': data.detail.values[0].code,
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
  onTypeChange (event) {
    this.setData({
      'taskData.type': event.detail
    });
  },
  isLicenseNo(str){
    str = str.replace(/\s+/g,"")
    if (str) {
      let flag = /(^[\u4E00-\u9FA5]{1}[A-Za-z0-9]{6}$)|(^[A-Za-z]{2}[A-Za-z0-9]{2}[A-Za-z0-9\u4E00-\u9FA5]{1}[A-Za-z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Za-z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Za-z]{2}[0-9]{5}$)|(^(08|38){1}[A-Za-z0-9]{4}[A-Za-z0-9挂学警军港澳]{1}$)/.test(str);
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
  repairPlantChange (event) {
    this.setData({
      'taskData.repairPlantId': this.repairPlantSource[event.detail.value].id,
      'repairPlantValue': event.detail.value,
      'repairPlantLabel': this.repairPlantSource[event.detail.value].companyName
    })
  },
  previewInfoImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.informationImageFiles
    })
  },
  removeinformationImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.informationImageFiles.splice(index, 1)
    this.setData({
      informationImageFiles: _this.data.informationImageFiles
    })
  },
  chooseInfoImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let list = that.data.informationImageFiles.concat(res.tempFilePaths)
        if (res.tempFilePaths.length >= 9) {
          wx.showToast({
            title: '报案图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            informationImageFiles: list
          });
        }
      }
    })
  },
  newSubmit () {
    let data = this.data.taskData
    let _this = this
    let taskData = {
      "areaCode": data.areaCode,
      "cityCode": data.cityCode,
      "provinceCode": data.provinceCode,
      "autoInsuranceMobile": data.autoInsuranceMobile,
      "autoInsuranceName": data.autoInsuranceName,
      "plateNumber": data.plateNumber,
      "remark": data.remark,
      "repairPlantId": data.repairPlantId,
      "type": data.type
    }
    // type=2 现场图片上传  type=8 上传定损图片
    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.indexOf('https://') == -1){
        informationImageFiles.push({file: item, type: 2})
      }
    })

    if (taskData.autoInsuranceName == '') {
      wx.showToast({
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.autoInsuranceMobile, '请输入正确的客户手机号')
    if (!isVaidcustomerPhone) {
      return
    }

    let flag = this.isLicenseNo(taskData.plateNumber)
    if (!flag) {
      return
    }

    if (!informationImageFiles.length){
      wx.showToast({
        title: '请上传报案照片',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.repairPlantId == '' || taskData.repairPlantId == null){
      wx.showToast({
        title: '请选择修理厂',
        icon: 'none',
        duration: 2000
      })
      return
    }

    util.request({
      path: '/app/autoInsurance',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        let imgPaths = [...informationImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'id': res.autoInsuranceId
        })
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
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
        }
      } else {
        wx.showToast({
          title: '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].file,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.data.id,
        'type': imgPaths[count].type
      },
      success:function(e){
        let responseCode = JSON.parse(e.data)
        if (responseCode.code == 0) {
          successUp++;//成功+1
        } else {
          failUp++;//失败+1
        }
      },
      fail:function(e){
        failUp++;//失败+1
      },
      complete:function(e){
        count++;//下一张
        if(count == length){
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: length == successUp ? '提交成功' : `图片上传失败:${failUp}`,
            icon: length == successUp ? 'success' : 'none',
            duration: 1000,
            success () {
              if (length == successUp) {
                setTimeout(() => {
                  if (that.data.modifyId){
                    that.goToList()
                  }else {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }
                }, 1000)
              }
            }
          })
        }else{
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          console.log('正在上传第' + count + '张');
        }
      }
    })
  },
  checkPhone (str, msg){
    if(!(/^1[34578]\d{9}$/.test(str))){
      wx.showToast({
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
      url: '../my-list-cx/my-list-cx',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }
})
