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
    assignMethod: '0',
    rescueType: ['0', '1'],
    payType: '0',
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善',
      '31': '待审核人员处理',
      '32': '审核人员已处理',
      '33': '查勘员已驳回',
      '34': '查勘员已处理',
      '35': '待被审核人完善',
      '11': '已办结'
    },
    taskData: {
      "provinceCode": "",
      "areaCode": "",
      "cityCode": "",
      "reportNumber": '',
      "customerPhone": '',
      "customerName": "",
      "examineName": '',
      "examinePhone": '',
      "woundName": '',
      "woundCard": '',
      "investigatorText": "",
      "rescueAmount": "",
      "insuranceAmount": "",
      "selfAmount": "",
      'clientName': "",
      'clientIdNum': "",
      'rejectText': "",
      'bankName': "",
      'bankNum': "",
    },
    // video: [],
    bankImageFiles: [],
    informationImageFiles: [],
    idImageFrontImageFiles: [],
    idImageBackImageFiles: [],
    receiptImageImageFiles: []
  },
  onLoad: function (routeParams ) {
    console.log('开锁 工单号：->', routeParams)
    console.log('当前用户信息->', app.globalData.currentRegisterInfo)
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        orderId: routeParams.id,
        role: app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.role : 1 //app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/accidentInsurance/orders/${id}`,
      method: 'GET'
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.image
      let bankImageFiles = []
      let informationImageFiles = []
      let idImageFrontImageFiles = []
      let idImageBackImageFiles = []
      let receiptImageImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 10:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            idImageFrontImageFiles.push(item)
            break
          case 12:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            idImageBackImageFiles.push(item)
            break
          case 13:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            receiptImageImageFiles.push(item)
            break
          case 15:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            bankImageFiles.push(item)
            break
        }
      })
      _this.setData({
        'bankImageFiles': bankImageFiles,
        'informationImageFiles': informationImageFiles,
        'idImageFrontImageFiles': idImageFrontImageFiles,
        'idImageBackImageFiles': idImageBackImageFiles,
        'receiptImageImageFiles': receiptImageImageFiles,
        'status': data.status,
        'taskData.areaCode': data.country,
        'taskData.cityCode': data.city,
        'taskData.provinceCode': data.province,
        "taskData.customerPhone": data.customerPhone,
        "taskData.reportNumber": data.reportNumber,
        "taskData.customerName": data.customerName,
        "taskData.investigatorText": data.investigatorText,
        "taskData.rescueAmount": data.emergencyMoney,
        "taskData.insuranceAmount": data.hospitalMoney,
        "taskData.selfAmount": data.medicalMoney,
        'taskData.clientName': data.woundName,
        'taskData.clientIdNum': data.woundCard,
        'taskData.rejectText': data.rejectText,
        'taskData.examineName': data.examineName,
        'taskData.examinePhone': data.examinePhone,
        'taskData.woundName': data.woundName,
        'taskData.woundCard': data.woundCard,
        'taskData.bankName': data.bankName,
        'taskData.bankNum': data.bankNum,
        'rescueType': data.cureMethod ? JSON.stringify(data.cureMethod) : ['0', '1'],
        'payType': data.moneyMethod || '0'
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : '',
      'taskData.area': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : '',
      'taskData.areaCode': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.townCode : '',
      'taskData.cityCode': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.cityCode : '',
      'taskData.provinceCode': app.globalData.currentRegisterInfo ? app.globalData.currentRegisterInfo.provinceCode : ''
    })
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

    if (name == 'taskData.rescueAmount' || name == 'taskData.insuranceAmount') {
      this.calculateSelfAmount()
    }
  },
  calculateSelfAmount () {
    this.setData({
      'taskData.selfAmount': parseFloat(this.data.taskData.rescueAmount || 0) + parseFloat(this.data.taskData.insuranceAmount || 0)
    })
  },
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
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
          mask: true,
          title: '车牌号不正确',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else {
      wx.showToast({
        mask: true,
        title: '车牌号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  },
  previewbankImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.bankImageFiles.map(item => {return item.path})
    })
  },
  previewInfoImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.informationImageFiles.map(item => {return item.path})
    })
  },
  previewidImageFrontImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.idImageFrontImageFiles.map(item => {return item.path})
    })
  },
  previewidImageBackImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.idImageBackImageFiles.map(item => {return item.path})
    })
  },
  previewreceiptImageImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.receiptImageImageFiles.map(item => {return item.path})
    })
  },
  removebankImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.bankImageFiles.splice(index, 1)
    this.setData({
      bankImageFiles: _this.data.bankImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  removeinformationImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.informationImageFiles.splice(index, 1)
    this.setData({
      informationImageFiles: _this.data.informationImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  removeidImageFrontImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.idImageFrontImageFiles.splice(index, 1)
    this.setData({
      idImageFrontImageFiles: _this.data.idImageFrontImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  removeidImageBackImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.idImageBackImageFiles.splice(index, 1)
    this.setData({
      idImageBackImageFiles: _this.data.idImageBackImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  removereceiptImageImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.receiptImageImageFiles.splice(index, 1)
    this.setData({
      receiptImageImageFiles: _this.data.receiptImageImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  chooseInfoImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.informationImageFiles.concat(tempList)
        that.setData({
          informationImageFiles: list
        });
      }
    })
  },
  choosebankImageFiles: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      count: 1,
      success: function (res) {
        let tempFilesSize = res.tempFiles[0].size
        if (tempFilesSize > 10000000) {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '银行卡图片不能大于10M',
            icon: 'none'
          })
          return false
        }
        wx.showLoading({
          mask: true,
          title: '识别中'
        })
        wx.uploadFile({
          url: 'https://aplusprice.xyz/aprice/app/image/uploadBankCard',
          filePath: res.tempFilePaths[0],
          name: `files`,
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token')
          },
          formData: {
            'flowId': that.data.orderId,
            'type': 15
          },
          success:function(e){
            let response = JSON.parse(e.data)
            wx.hideLoading()
            if (response.data == null) {
              wx.showToast({
                mask: true,
                title: '图片无法识别请重新上传',
                icon: 'none',
                duration: 2000
              })
            } else {
              that.setData({
                'taskData.bankName': response.data.name,
                'taskData.bankNum': response.data.cardNumber
              })
            }
          },
          fail:function(e){},
          complete:function(e){}
        })

        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.bankImageFiles.concat(tempList)
        that.setData({
          bankImageFiles: list
        });
      }
    })
  },
  chooseidImageFrontImageFiles: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      count: 1,
      success: function (res) {
        let tempFilesSize = res.tempFiles[0].size
        if (tempFilesSize > 10000000) {    //图片大于2M，弹出一个提示框
          wx.showToast({
            title: '身份证正面图片不能大于10M',
            icon: 'none'
          })
          return false
        }
        wx.showLoading({
          mask: true,
          title: '识别中'
        })
        wx.uploadFile({
          url: 'https://aplusprice.xyz/aprice/app/image/uploadUserCard',
          filePath: res.tempFilePaths[0],
          name: `files`,
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token')
          },
          formData: {
            'flowId': that.data.orderId,
            'type': 10
          },
          success:function(e){
            let response = JSON.parse(e.data)
            wx.hideLoading()
            if (response.data == null) {
              wx.showToast({
                mask: true,
                title: '图片无法识别请重新上传',
                icon: 'none',
                duration: 2000
              })
            } else {
              that.setData({
                'taskData.clientName': response.data.name,
                'taskData.clientIdNum': response.data.cardNumber
              })
            }
          },
          fail:function(e){},
          complete:function(e){}
        })

        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.idImageFrontImageFiles.concat(tempList)
        that.setData({
          idImageFrontImageFiles: list
        });
      }
    })
  },
  chooseidImageBackImageFiles: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      count: 1,
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.idImageBackImageFiles.concat(tempList)
        that.setData({
          idImageBackImageFiles: list
        });
      }
    })
  },
  choosereceiptImageImageFiles: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempList = []
        res.tempFilePaths.forEach(item => {
          tempList.push({
            "path": item, "id": null
          })
        })
        let list = that.data.receiptImageImageFiles.concat(tempList)
        that.setData({
          receiptImageImageFiles: list
        });
      }
    })
  },
  commitSubmit (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      "customerPhone": data.customerPhone,
      "reportNumber": data.reportNumber,
      "customerName": data.customerName,
      "investigatorText": data.investigatorText,
      "country": data.areaCode,
      "city": data.cityCode,
      "province": data.provinceCode,
      "active": isSave ? 'save' : 'submit'
    }
    if (this.data.id) {
      taskData.orderID = this.data.orderId
    }
    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 1})
      }
    })

    if (taskData.investigatorText == '') {
      wx.showToast({
        mask: true,
        title: '请填写查勘员备注',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.customerPhone != '') {
      let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/accidentInsurance/orders',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        let imgPaths = [...informationImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'orderId': res.data.flowId
        })
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
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
        }
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
  servicerCommit () {
    let _this = this
    let active
    if (_this.data.assignMethod === '0') {
      active = 'examine'
    } else if (_this.data.assignMethod === '1') {
      active = 'advice'
    }
    let taskData = {
      orderId: _this.data.id,
      active: active,
      province: _this.data.taskData.provinceId,
      city: _this.data.taskData.cityId,
      country: _this.data.taskData.countryId,
      customerName: _this.data.taskData.customerName,
      customerPhone: _this.data.taskData.customerPhone,
      investigatorText: _this.data.taskData.investigatorText
    }
    if (taskData.customerName == '') {
      wx.showToast({
        mask: true,
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
    console.log(isVaidcustomerPhone, taskData.customerPhone)
    if (!isVaidcustomerPhone) {
      return
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/accidentInsurance/customerservice/orders`,
      method: 'PUT',
      data: taskData
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '提交成功',
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
          title: '提交失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  examineCommit () {
    this.clientCommit('/app/accidentInsurance/examine/improve/orders')
  },
  clientCommit (url) {
    let data = this.data.taskData
    let _this = this
    let taskData = {
      rescueType: _this.data.rescueType,
      payType: _this.data.payType,
      clientName: data.clientName,
      clientIdNum: data.clientIdNum,
      bankName: data.bankName,
      bankNum: data.bankNum,
      rescueAmount: data.rescueAmount,
      insuranceAmount: data.insuranceAmount,
      selfAmount: data.selfAmount,
      city: data.cityCode,
      orderId: _this.data.id
    }

    let idImageBackImageFiles = []
    _this.data.idImageBackImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        idImageBackImageFiles.push({path: item.path, type: 12})
      }
    })
    let receiptImageImageFiles = []
    _this.data.receiptImageImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        receiptImageImageFiles.push({path: item.path, type: 13})
      }
    })

    if (data.clientIdNum == '' || data.clientIdNum == null) {
      wx.showToast({
        mask: true,
        title: '请上传身份证正面',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (data.bankNum == '' || data.bankNum == null) {
      wx.showToast({
        mask: true,
        title: '请上传银行卡',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (idImageBackImageFiles.length == 0) {
      wx.showToast({
        mask: true,
        title: '请上传身份证反面',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (receiptImageImageFiles.length == 0) {
      wx.showToast({
        mask: true,
        title: '请上传医疗单证',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (_this.data.rescueType.length == 0) {
      wx.showToast({
        mask: true,
        title: '请填写救治方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (_this.data.payType == '' || _this.data.payType == null) {
      wx.showToast({
        mask: true,
        title: '请填写结费方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (data.rescueAmount == '' || data.rescueAmount == null) {
      wx.showToast({
        mask: true,
        title: '请填写门急诊合计',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (data.insuranceAmount == '' || data.insuranceAmount == null) {
      wx.showToast({
        mask: true,
        title: '请填写住院医疗合计',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (data.selfAmount == '' || data.selfAmount == null) {
      wx.showToast({
        mask: true,
        title: '请填写医疗费合计',
        icon: 'none',
        duration: 2000
      })
      return
    }


    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: url.type ? '/app/accidentInsurance/customer/orders' : url ,
      method: 'PUT',
      data: taskData
    }, function (err, res) {
      console.log('工单新建：', res)
      if (res.code == 0) {
        let imgPaths = [...idImageBackImageFiles, ...receiptImageImageFiles]
        console.log('Upload Files:', imgPaths)
        _this.setData({
          'orderId': _this.data.id
        })
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: '创建成功',
            icon: 'success',
            duration: 1000,
            success () {
              setTimeout(() => {
                if (url) {
                  _this.goToAudit()
                } else {
                  _this.goToList()
                }
              }, 1000)
            }
          })
        }
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
  // chooseVideo: function (e) {
  //   var that = this;
  //   wx.chooseVideo({
  //     sourceType: ['album', 'camera'],
  //     compressed: true,
  //     // maxDuration: 10,
  //     camera: 'back',
  //     success: res => {
  //       console.log(res);
  //       const video = res.tempFilePath;
  //       this.setData({video})
  //     }
  //   })
  // },
  // uploadVideo () {
  //   var that = this
  //   console.log(that.data.video, '???')
  //   wx.uploadFile({
  //     url: 'https://aplusprice.xyz/aprice/app/attachments/upload',
  //     filePath: that.data.video,
  //     name: `files`,
  //     header: {
  //       "Content-Type": "multipart/form-data",
  //       'token': wx.getStorageSync('token')
  //     },
  //     formData: {
  //       'flowId': that.data.orderId
  //     },
  //     success:function(e){},
  //     fail:function(e){},
  //     complete:function(e){}
  //   })
  // },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.data.orderId,
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
            mask: true,
            title: length == successUp ? '提交成功' : `图片上传失败:${failUp}`,
            icon: length == successUp ? 'success' : 'none',
            duration: 1000,
            success () {
              if (length == successUp) {
                setTimeout(() => {
                  that.goToList()
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
  onAssignMethodChange (event) {
    this.setData({
      'assignMethod': event.detail
    });
  },
  onRescueTypeChange (event) {
    this.setData({
      'rescueType': event.detail
    });
  },
  onPayTypeChange (event) {
    this.setData({
      'payType': event.detail,
      "taskData.rescueAmount": "",
      "taskData.insuranceAmount": "",
      "taskData.selfAmount": ""
    });
  },
  checkPhone (str, msg){
    if(!(/^1[345789]\d{9}$/.test(str))){
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
  goToAudit () {
    wx.redirectTo({
      url: '../accident-audit-form/accident-audit-form?id=' + this.data.orderId
    })
  },
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-accident/my-list-accident'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-accident/my-list-accident'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-accident/my-list-accident'
      })
    }
  },
  downloadImages () {
    let urls = this.sourceImage.map(item => {
      if (!((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4 )) {
        return item.path
      }
    })
    common.downloadImages({
      urls: urls
    })
  }
})
