//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    id: null,
    role: 1, // 1 查勘员 | 12 合作商施工人员 | 6 公司市级负责人 | 11 合作商市级负责人 |
    informationImageFiles: [],
    liveImageFiles: [],
    workLiveImageFiles: [],
    damageImageFiles: [],
    authorityImageFiles: [],
    caleImageFiles: [],
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    modifyId: null,
    workerList: [],
    workerValue: '',
    workerLabel: '',
    statusMap: {
      '1': '查勘员已派送',
      '2': '待查勘员完善',
      '3': '查勘员已完善',
      '4': '待区域负责人线下报价',
      '5': '待报价中心报价',
      '6': '施工人员去现场',
      '7': '施工中',
      '8': '计算书已上传',
      '9': '报价中心驳回',
      '10': '已报价',
      '11': '已办结',
      '12': '暂存'
    },
    taskData: {
      status: null, // 0 新建 | 1 施工人员画面 | 2 施工人员提交 押金页面
      provinceCode: '',
      cityCode: '',
      townCode: '',
      area: '',
      insuranceType: '1',
      damagedUser: '',
      damagedPhone: '',
      customerUser: '',
      customerPhone: '',
      plateNumber: '',
      information: '',
      live: '',
      surveyUser: '',
      surveyPhone: '',
      workerUser: '',
      workerPhone: '',
      workType: 0,
      budgetPreliminary: '', // 初步估损金额
      handlingType: 0,
      deposit: '',
      trasactionId: '',
      offer: '',
      bidder: '',
      offerRemark: ''
    }
  },
  onLoad: function (routeParams) {
    console.log('工单号：->', routeParams)
    console.log('????', app.globalData.currentRegisterInfo)
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role //app.globalData.currentRegisterInfo.role// 1 查勘员 | 12 施工人员 | 6 公司市级负责人 | 11 合作商市级负责人 | TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
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
      _this.sourceImage = res.Image
      let informationImageFiles = []
      let liveImageFiles = []
      let workLiveImageFiles = []
      let damageImageFiles = []
      let authorityImageFiles = []
      let caleImageFiles = []
      /*
        1 报案信息
        2 现场信息
        3 现场信息施工人员
        4 损失清单
        5 押金、授权
        6 施工完成
        7 保险计算书
        */
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
            break
          case 2:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            liveImageFiles.push(item)
            break
          case 3:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            workLiveImageFiles.push(item)
            break
          case 4:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            damageImageFiles.push(item)
            break
          case 5:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            authorityImageFiles.push(item)
            break
          case 7:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            caleImageFiles.push(item)
            break
        }
      })
      _this.setData({
        modifyId: data.id,
        region: data.area,
        informationImageFiles: informationImageFiles,
        liveImageFiles: liveImageFiles,
        workLiveImageFiles: workLiveImageFiles,
        damageImageFiles: damageImageFiles,
        authorityImageFiles: authorityImageFiles,
        caleImageFiles: caleImageFiles,
        'taskData.status': data.status,
        'taskData.area': data.area,
        'taskData.insuranceType': data.insuranceType,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone || '',
        'taskData.customerUser': data.customerUser,
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        'taskData.live': data.live,
        "taskData.surveyUser": data.surveyUser,
        "taskData.surveyPhone": data.surveyPhone,
        "taskData.workerUser": data.workerUser,
        "taskData.workerPhone": data.workerPhone,
        "taskData.workType": data.workType,
        "taskData.budgetPreliminary": data.budgetPreliminary,
        'taskData.handlingType': data.handlingType,
        'taskData.deposit': data.deposit,
        'taskData.trasactionId': data.trasactionId,
        'taskData.offer': data.offer,
        'taskData.bidder': data.bidder,
        'taskData.offerRemark': data.offerRemark
      })
      _this.initReassignList()
      _this.getRegionLabel()
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
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.area': app.globalData.currentRegisterInfo.townCode,
      'taskData.townCode': app.globalData.currentRegisterInfo.townCode,
      'taskData.cityCode': app.globalData.currentRegisterInfo.cityCode,
      'taskData.provinceCode': app.globalData.currentRegisterInfo.provinceCode
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
  initReassignList () {
    let _this = this
    util.request({
      path: '/app/damage/getPersonList',
      method: 'GET',
      data: {
        role: 12,
        townCode: (this.data.region.slice(0,4) + '00')
      }
    }, function (err, res) {
      _this.workListSource = res.data
      let workerList = res.data ? res.data.map(item => {
        return item.name
      }) : []
      _this.setData({
        'workerList': workerList
      })
    })
  },
  workerChange (event) {
    this.setData({
      'workerValue': event.detail.value,
      'workerLabel': this.workListSource[event.detail.value].name
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
  oninsuranceTypeChange (event) {
    if (event.detail != '1') {
      this.setData({
        'taskData.plateNumber': ''
      })
    }
    this.setData({
      'taskData.insuranceType': event.detail
    });
  },
  onhandlingTypeChange (event) {
    this.setData({
      'taskData.handlingType': event.detail
    });
  },
  onworkTypeChange (event) {
    this.setData({
      'taskData.workType': event.detail
    });
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
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
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
  previewInfoImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.informationImageFiles.map(item => {return item.path})
    })
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
  chooseImageForliveImageFiles: function (e) {
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
        let list = that.data.liveImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '现场图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            liveImageFiles: list
          });
        }
      }
    })
  },
  previewImageForliveImageFiles: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.liveImageFiles.map(item => {return item.path})
    })
  },
  removeliveImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.liveImageFiles.splice(index, 1)
    this.setData({
      liveImageFiles: _this.data.liveImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  chooseWorkLiveImage: function (e) {
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
        let list = that.data.workLiveImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '施工人员现场图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            workLiveImageFiles: list
          });
        }
      }
    })
  },
  removeWorkLiveImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.workLiveImageFiles.splice(index, 1)
    this.setData({
      liveImageFiles: _this.data.workLiveImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  previewWorkLiveImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.workLiveImageFiles.map(item => {return item.path})
    })
  },
  previewDamageImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.damageImageFiles.map(item => {return item.path})
    })
  },
  chooseDamageImage: function (e) {
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
        let list = that.data.damageImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '损失清单图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            damageImageFiles: list
          });
        }
      }
    })
  },
  removeDamageImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.damageImageFiles.splice(index, 1)
    this.setData({
      damageImageFiles: _this.data.damageImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  previewAuthorityImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.authorityImageFiles.map(item => {return item.path})
    })
  },
  chooseAuthorityImage: function (e) {
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
        let list = that.data.authorityImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '授权图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            authorityImageFiles: list
          });
        }
      }
    })
  },
  removeCaleImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.caleImageFiles.splice(index, 1)
    this.setData({
      caleImageFiles: _this.data.caleImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  previewCaleImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.caleImageFiles.map(item => {return item.path})
    })
  },
  chooseCaleImage: function (e) {
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
        let list = that.data.caleImageFiles.concat(tempList)
        if (res.tempFilePaths.length > 9) {
          wx.showToast({
            mask: true,
            title: '保险计算书图片不能超过9个',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            caleImageFiles: list
          });
        }
      }
    })
  },
  removeAuthorityImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.authorityImageFiles.splice(index, 1)
    this.setData({
      authorityImageFiles: _this.data.authorityImageFiles
    })
    let id = e.currentTarget.dataset.id;
    if (id) {
      common.deleteImage(id)
    }
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.id, '????',this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.id || that.data.id,
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
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  submitWS (e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      townCode: data.townCode,
      area: data.area,
      insuranceType: data.insuranceType,
      damagedUser: data.damagedUser,
      damagedPhone: data.damagedPhone,
      customerUser: data.customerUser,
      customerPhone: data.customerPhone,
      plateNumber: data.plateNumber,
      information: data.information,
      live: data.live
    }

    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 1})
      }
    })
    let liveImageFiles = []
    _this.data.liveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        liveImageFiles.push({path: item.path, type: 2})
      }
    })

    if (this.data.modifyId) {
      taskData.id = _this.data.modifyId
      taskData.liveImage = liveImageFiles.length > 0 ? 1 : 0
      taskData.damageId = _this.data.id
    }

    // if (taskData.damagedUser == '' || taskData.customerUser == '') {
    //   wx.showToast({
    //     mask: true,
    //     title: '请填写受损人姓名以及客户姓名',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }

    if (taskData.customerPhone != ''){
      let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
      if (!isVaidcustomerPhone) {
        return
      }
    }

    if(taskData.damagedPhone != '') {
      let isVaiddamagedPhone = this.checkPhone(taskData.damagedPhone, '请输入正确的受损人手机号')
      if (!isVaiddamagedPhone) {
        return
      }
    }

    // && informationImageFiles.length == 0 、报案图片任选一项
    if (taskData.damagedPhone == '' && taskData.customerPhone == ''){
      wx.showToast({
        mask: true,
        title: '请填写客户手机、受损人手机',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (taskData.insuranceType == '1') {
      let flag = this.isLicenseNo(taskData.plateNumber)
      if (!flag) {
        return
      }
    }
    // if (taskData.information == '') {
    //   wx.showToast({
    //     mask: true,
    //     title: '请填写报案信息',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    console.log('工单新建 改善参数：', taskData)
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: isSave ? '/app/damage/saveBySurvey' : '/app/damage/addBySurvey',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建 改善结果：', res)
      if (res.code == 0) {
        _this.id = res.data || _this.data.id

        let imgPaths = [...informationImageFiles, ...liveImageFiles]
        console.log('Upload Files:', imgPaths)
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: isSave ? '暂存成功' : '创建成功',
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
          title: isSave ? '暂存失败' : '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  goToList () {
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-ws/my-list-ws'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-ws/my-list-ws'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-ws/my-list-ws'
      })
    }
  },
  workHandleWS () {
    let _this = this
    let data = this.data.taskData
    if (data.workType == '' || data.workType == null) {
      wx.showToast({
        mask: true,
        title: '请选择处理方式',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let params = {
      id: this.data.modifyId,
      damageId: this.data.id,
      surveyUser: data.surveyUser,
      surveyPhone: data.surveyPhone,
      workerUser: data.workerUser,
      workerPhone: data.workerPhone,
      workType: data.workType,
      budgetPreliminary: data.budgetPreliminary, // 初步估损金额
      handlingType: data.handlingType,
      deposit: data.deposit,
      trasactionId: data.trasactionId,
      offer: data.offer,
      bidder: data.bidder,
      offerRemark: data.offerRemark
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/addByWorker',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  modifyWS () {
    this.submitWS()
  },
  workImproveWS () {
    let _this = this
    let data = this.data.taskData
    if(_this.data.workLiveImageFiles.length == 0){
      wx.showToast({
        mask: true,
        title: '请上传现场信息图片（施工方）',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (data.handlingType == '0') {
      if (data.deposit == '' || data.deposit == null){
        wx.showToast({
          mask: true,
          title: '请填写押金金额',
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (data.trasactionId == '' || data.trasactionId == null){
        wx.showToast({
          mask: true,
          title: '请填写银行交易单号',
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (this.data.authorityImageFiles.length == 0){
        wx.showToast({
          mask: true,
          title: '请上传押金/授权图片',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    if (data.handlingType == '1') {
      if (this.data.authorityImageFiles.length == 0){
        wx.showToast({
          mask: true,
          title: '请上传押金/授权图片',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }

    let workLiveImageFiles = []
    _this.data.workLiveImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        workLiveImageFiles.push({path: item.path, type: 3})
      }
    })
    let damageImageFiles = []
    _this.data.damageImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        damageImageFiles.push({path: item.path, type: 4})
      }
    })
    let authorityImageFiles = []
    _this.data.authorityImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        authorityImageFiles.push({path: item.path, type: 5})
      }
    })
    let caleImageFiles = []
    _this.data.caleImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        caleImageFiles.push({path: item.path, type: 7})
      }
    })

    let params = {
      id: this.data.modifyId,
      damageId: this.data.id,
      surveyUser: data.surveyUser,
      surveyPhone: data.surveyPhone,
      workerUser: data.workerUser,
      workerPhone: data.workerPhone,
      workType: data.workType,
      budgetPreliminary: data.budgetPreliminary, // 初步估损金额
      handlingType: data.handlingType,
      deposit: data.deposit,
      trasactionId: data.trasactionId,
      offer: data.offer,
      bidder: data.bidder,
      offerRemark: data.offerRemark
    }

    if (_this.data.workLiveImageFiles.length) {
      params.workerLiveImage = 1
    }
    if (_this.data.damageImageFiles.length) {
      params.lossImage = 1
    }
    if (_this.data.authorityImageFiles.length) {
      params.depositImage = 1
    }
    if (_this.data.caleImageFiles.length) {
      params.insuranceImage = 1
    }
    console.log('workImproveWS:', params)
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/addByWorker',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        let imgPaths = [...workLiveImageFiles, ...damageImageFiles, ...authorityImageFiles, ...caleImageFiles]
        console.log('Upload Files:', imgPaths)
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
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
        }
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
  workHandleNoImageAsk () {
    let _this = this
    let data = this.data.taskData
    if (data.budgetPreliminary == '' || data.budgetPreliminary == null){
      wx.showToast({
        mask: true,
        title: '请填写初步估损金额',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let params = {
      id: this.data.modifyId,
      damageId: this.data.id,
      surveyUser: data.surveyUser,
      surveyPhone: data.surveyPhone,
      workerUser: data.workerUser,
      workerPhone: data.workerPhone,
      workType: data.workType,
      budgetPreliminary: data.budgetPreliminary, // 初步估损金额
      handlingType: data.handlingType,
      deposit: data.deposit,
      trasactionId: data.trasactionId,
      offer: data.offer,
      bidder: data.bidder,
      offerRemark: data.offerRemark
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/addByWorker',
      method: 'POST',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  cooperaterManagerAssign () {
    let _this = this
    if (this.data.workerValue == null || this.data.workerValue == undefined || this.data.workerValue == ''){
      wx.showToast({
        mask: true,
        title: '请选择改派人员',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/reassignment',
      method: 'POST',
      data: {
        damageId: this.data.id,
        workerId: this.workListSource[this.data.workerValue].userId,
        workerPhone: this.workListSource[this.data.workerValue].mobile
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  companyManagerChangeStatusToLive () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/toSpot',
      method: 'POST',
      data: {
        damageId: this.data.id
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  companyManagerChangeStatusToOffed () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/damage/toSpot',
      method: 'POST',
      data: {
        damageId: this.data.id
      }
    }, function (err, res) {
      if (res.code == 0) {
        _this.goToList()
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
  downloadImages () {
    let urls = []
    this.sourceImage.map(item => {
      if (!((this.data.role == 1 || this.data.role == 2 || this.data.role == 3 || this.data.role == 4) && item.type == 4 )) {
        urls.push(item.path)
      }
    })
    console.log(urls, '?')
    common.downloadImages({
      urls: urls
    })
  },
  goToOffer (event) {
    wx.navigateTo({
      url: '../ws-offer/ws-offer?id=' + event.currentTarget.dataset.id
    })
  }
})

/*
1 报案信息
2 现场信息
3 现场信息施工人员
4 损失清单
5 押金、授权
6 施工完成
7 保险计算书
*/
