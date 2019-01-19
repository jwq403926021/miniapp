//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()

Page({
  data: {
    flowId: null,
    id: null,
    role: 1,
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    status: '',
    assignMethod: '0',
    statusMap: {
      '29': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善', // 也是驳回状态
      '31': '被保险人已完善,待报价中心报价',
      '32': '已报价,待被保险人审阅',
      '33': '被保险人不满意，待沟通',
      '40': '待合作商完善', // 也是驳回状态
      '41': '合作商已完善,待报价中心报价',
      '42': '已报价',
      '50': '已报价,待财务处理',
      '11': '已办结',
      '99': '处理中'
    },
    taskData: {
      "cityId": '',
      "countryId": '',
      "provinceId": '',
      "customerName": '',
      "customerPhone": '',
      "investigatorName": '',
      "investigatorPhone": '',
      "workerName": '',
      "workerPhone": '',
      "investigatorText": '',
      "bankTransactionId": '',
      "constructionMethod": '',
      "deposit": '',
      "offerText": '',
      "offerPrice": ''
    },
    damageImageFiles: [],
    caleImageFiles: [],
    authorityImageFiles: [],
    informationImageFiles: []
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        flowId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role//app.globalData.currentRegisterInfo.role // TODO: app.globalData.currentRegisterInfo.role 12合作商 15游客（被保险人）
      })
      this.initDataById(routeParams.id)
    }
  },
  onAssignMethodChange (event) {
    this.setData({
      'assignMethod': event.detail
    });
  },
  onConstructionMethodChange (event) {
    this.setData({
      'taskData.constructionMethod': event.detail
    });
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: `/app/family/orders/${id}`,
      method: 'GET'
    }, function (err, res) {
      let data = res.data
      _this.sourceData = data
      _this.sourceImage = res.image
      let informationImageFiles = []
      let authorityImageFiles = []
      let damageImageFiles = []
      let caleImageFiles = []
      let familyImages = {
        house: [],// 房屋及装修 2001
        electrical: [],// 家电及文体用品 2002
        cloths: [],// 衣物床品 2003
        furniture: [],// 家具及其他生活用品 2004
        overall : [],// 全景 2005
        certificate: [],// 房产证、楼号、门牌号 2006
        identification: [],// 省份证 2007
        bank: [],// 银行卡 2008
        register: [],// 户口本、关系证明 2009
        source: []// 事故源 2010
      }
      console.log('##', res)
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            informationImageFiles.push(item)
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
          case 2001:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.house.push(item)
            break
          case 2002:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.electrical.push(item)
            break
          case 2003:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.cloths.push(item)
            break
          case 2004:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.furniture.push(item)
            break
          case 2005:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.overall.push(item)
            break
          case 2006:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.certificate.push(item)
            break
          case 2007:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.identification.push(item)
            break
          case 2008:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.bank.push(item)
            break
          case 2009:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.register.push(item)
            break
          case 2010:
            item.path = `https://aplusprice.xyz/file/${item.path}`
            familyImages.source.push(item)
            break
        }
      })
      wx.setStorageSync('familyImages', familyImages)
      _this.setData({
        'id': data.flowId,
        'flowId': data.flowId,
        'status': data.status,
        'taskData.countryId': data.areaCountryId,
        'taskData.cityId': data.areaCityId,
        'taskData.provinceId': data.areaProvinceId,
        "taskData.customerPhone": data.customerPhone,
        "taskData.customerName": data.customerName,
        "taskData.investigatorName": data.investigatorName,
        "taskData.investigatorPhone": data.investigatorPhone,
        "taskData.workerName": data.workerName,
        "taskData.workerPhone": data.workerPhone,
        "taskData.investigatorText": data.investigatorText,
        "taskData.bankTransactionId": data.bankTransactionId,
        "taskData.constructionMethod": data.constructionMethod,
        "taskData.deposit": data.deposit || '',
        "taskData.offerText": data.offerText || '',
        "taskData.offerPrice": data.offerPrice || '',
        informationImageFiles: informationImageFiles,
        caleImageFiles: caleImageFiles,
        authorityImageFiles: authorityImageFiles,
        damageImageFiles: damageImageFiles,
        region: data.areaCountryId + ''
      })
      _this.getRegionLabel()
    })
  },
  initArea () {
    let _this = this
    _this.setData({
      region: app.globalData.currentRegisterInfo.townCode,
      'taskData.countryId': app.globalData.currentRegisterInfo.townCode,
      'taskData.cityId': app.globalData.currentRegisterInfo.cityCode,
      'taskData.provinceId': app.globalData.currentRegisterInfo.provinceCode
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
      'taskData.countryId': data.detail.values[2].code,
      'taskData.cityId': data.detail.values[1].code,
      'taskData.provinceId': data.detail.values[0].code,
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
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
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
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.id, '????',this.data.id)
    let formData = {
      'flowId': that.id || that.data.id,
      'type': imgPaths[count].type
    }
    if (imgPaths[count].hasOwnProperty('clientIndex') && imgPaths[count].clientIndex != null) {
      formData.clientIndex = imgPaths[count].clientIndex
    }
    console.log('---->>', formData)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].path,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: formData,
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
    let pages = getCurrentPages()
    let length = pages.filter((item) => {
      return item.route == 'pages/my-list-jc/my-list-jc'
    }).length
    if (length) {
      wx.navigateBack({
        url: '../my-list-jc/my-list-jc'
      })
    } else {
      wx.redirectTo({
        url: '../my-list-jc/my-list-jc'
      })
    }
  },
  bindTapToClient (event) {
    wx.navigateTo({
      url: `../jc-form-client/jc-form-client?flowId=${event.currentTarget.dataset.id}&status=${this.data.status}`
    })
  },
  insuredAgree () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/insured/orders`,
      method: 'PUT',
      data: {
        "active": 'access',
        flowId: _this.data.flowId
      }
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
  servicerCommit () {
    let _this = this
    let taskData = {
      flowId: _this.data.flowId,
      active: _this.data.assignMethod === '0' ? 'advice' : 'site',
      provinceId: _this.data.taskData.provinceId,
      cityId: _this.data.taskData.cityId,
      countryId: _this.data.taskData.countryId,
      customerName: _this.data.taskData.customerName,
      customerPhone: _this.data.taskData.customerPhone
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
    if (!isVaidcustomerPhone) {
      return
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/customerservice/orders`,
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
  insuredReject () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/insured/orders`,
      method: 'PUT',
      data: {
        "active": 'refuse',
        flowId: _this.data.flowId
      }
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
  partnerConsultAgree () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/partner/orders`,
      method: 'PUT',
      data: {
        "active": 'consult_site',
        flowId: _this.data.flowId
      }
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
  partnerConsultReject () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/partner/orders`,
      method: 'PUT',
      data: {
        "active": 'consult_refuse',
        flowId: _this.data.flowId
      }
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
  partnerCommit (e) {
    let _this = this
    let taskData = this.data.taskData
    let familyImagesList = []
    let isSave = e.currentTarget.dataset.save
    console.log('合作商 完善参数：', taskData)

    let familyImages = wx.getStorageSync('familyImages')
    let result

    if (isSave) {
      result = this.checkUploadImages(familyImages, true)
      result.data.map(item => {
        if (item.path.indexOf('https://') == -1){
          familyImagesList.push(item)
        }
      })
    } else {
      result = this.checkUploadImages(familyImages)
      if (result.flag) {
        result.data.map(item => {
          if (item.path.indexOf('https://') == -1){
            familyImagesList.push(item)
          }
        })
      } else {
        wx.showToast({
          mask: true,
          title: result.data,
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }

    let authorityImageFiles = []
    let caleImageFiles = []
    let damageImageFiles = []
    _this.data.authorityImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        authorityImageFiles.push({path: item.path, type: 5})
      }
    })
    _this.data.caleImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        caleImageFiles.push({path: item.path, type: 7})
      }
    })
    _this.data.damageImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        damageImageFiles.push({path: item.path, type: 4})
      }
    })

    // if (damageImageFiles.length == 0) {
    //   wx.showToast({
    //     mask: true,
    //     title: '损失清单不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }

    if (!isSave) {
      if (_this.data.taskData.constructionMethod == '' || _this.data.taskData.constructionMethod == null) {
        wx.showToast({
          mask: true,
          title: '施工方式不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }

      if (_this.data.taskData.constructionMethod == 1) {
        if (_this.data.taskData.deposit == '' || _this.data.taskData.deposit == null) {
          wx.showToast({
            mask: true,
            title: '押金金额不能为空',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        if (_this.data.taskData.bankTransactionId == '' || _this.data.taskData.bankTransactionId == null) {
          wx.showToast({
            mask: true,
            title: '银行交易单号不能为空',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        if (_this.data.authorityImageFiles.length == 0) {
          wx.showToast({
            mask: true,
            title: '押金图片不能为空',
            icon: 'none',
            duration: 1000
          })
          return false
        }
      }
    }

    // if (caleImageFiles.length == 0) {
    //   wx.showToast({
    //     mask: true,
    //     title: '保险计算书不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/partner/orders`,
      method: 'PUT',
      data: {
        "active": isSave ? 'save' : 'site_perfect',
        "bankTransactionId": _this.data.taskData.bankTransactionId,
        "constructionMethod": _this.data.taskData.constructionMethod,
        "deposit": _this.data.taskData.deposit,
        flowId: _this.data.flowId
      }
    }, function (err, res) {
      console.log('被保险人完善 结果：', res)
      if (res.code == 0) {
        let imgPaths = [...familyImagesList, ...authorityImageFiles, ...caleImageFiles, ...damageImageFiles]
        console.log('Upload Files:', imgPaths)
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            mask: true,
            title: isSave ? '暂存成功' : '提交成功',
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
          title: isSave ? '暂存失败' : '提交失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  consultAgree () {
    let _this = this
    let taskData = this.data.taskData
    let familyImagesList = []
    console.log('合作商 协商 完善参数：', taskData)

    let familyImages = wx.getStorageSync('familyImages')
    let result = this.checkUploadImages(familyImages)
    console.log('familyImages::', familyImages)
    if (result.flag) {
      result.data.map(item => {
        if (item.path.indexOf('https://') == -1){
          familyImagesList.push(item)
        }
      })
    } else {
      wx.showToast({
        mask: true,
        title: result.data,
        icon: 'none',
        duration: 1000
      })
      return false
    }

    let authorityImageFiles = []
    let caleImageFiles = []
    let damageImageFiles = []
    _this.data.authorityImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        authorityImageFiles.push({path: item.path, type: 5})
      }
    })
    _this.data.caleImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        caleImageFiles.push({path: item.path, type: 7})
      }
    })
    _this.data.damageImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        damageImageFiles.push({path: item.path, type: 4})
      }
    })

    // if (damageImageFiles.length == 0) {
    //   wx.showToast({
    //     mask: true,
    //     title: '损失清单不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }

    if (_this.data.taskData.constructionMethod == '' || _this.data.taskData.constructionMethod == null) {
      wx.showToast({
        mask: true,
        title: '施工方式不能为空',
        icon: 'none',
        duration: 1000
      })
      return false
    }

    // if (_this.data.taskData.constructionMethod == 0) {
    //   wx.showToast({
    //     mask: true,
    //     title: '请更改施工方式为施工',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }

    if (_this.data.taskData.constructionMethod == 1) {
      if (_this.data.taskData.deposit == '' || _this.data.taskData.deposit == null) {
        wx.showToast({
          mask: true,
          title: '押金金额不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if (_this.data.taskData.bankTransactionId == '' || _this.data.taskData.bankTransactionId == null) {
        wx.showToast({
          mask: true,
          title: '银行交易单号不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if (authorityImageFiles.length == 0) {
        wx.showToast({
          mask: true,
          title: '押金图片不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    }

    // if (caleImageFiles.length == 0) {
    //   wx.showToast({
    //     mask: true,
    //     title: '保险计算书不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: `/app/family/partner/orders`,
      method: 'PUT',
      data: {
        "active": 'site_finish',
        "bankTransactionId": _this.data.taskData.bankTransactionId,
        "constructionMethod": _this.data.taskData.constructionMethod,
        "deposit": _this.data.taskData.deposit,
        flowId: _this.data.flowId
      }
    }, function (err, res) {
      console.log('被保险人完善 结果：', res)
      if (res.code == 0) {
        let imgPaths = [...familyImagesList, ...authorityImageFiles, ...caleImageFiles, ...damageImageFiles]
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
  insuredCommit () {
    let _this = this
    let taskData = this.data.taskData
    let familyImagesList = []
    console.log('被保险人完善参数：', taskData)

    let familyImages = wx.getStorageSync('familyImages')
    let result = this.checkUploadImages(familyImages)
    console.log('familyImages::', familyImages)
    if (result.flag) {
      result.data.map(item => {
        if (item.path.indexOf('https://') == -1){
          familyImagesList.push(item)
        }
      })
    } else {
      wx.showToast({
        mask: true,
        title: result.data,
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
      path: `/app/family/insured/orders`,
      method: 'PUT',
      data: {
        active: 'perfect',
        flowId: _this.data.flowId
      }
    }, function (err, res) {
      console.log('被保险人完善 结果：', res)
      if (res.code == 0) {
        let imgPaths = familyImagesList
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
  commitOrder(e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      "active": 'submit',
      "cityId": data.cityId,
      "countryId": data.countryId,
      "provinceId": data.provinceId,
      "customerName": data.customerName,
      "customerPhone": data.customerPhone,
      "investigatorText": data.investigatorText
    }
    if (isSave) {
      taskData.active = 'save'
    }

    if (this.data.flowId) {
      taskData.flowId = this.data.flowId
    }

    // if (taskData.customerName == '') {
    //   wx.showToast({
    //     mask: true,
    //     title: '请填写客户姓名',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }

    // let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
    // if (!isVaidcustomerPhone) {
    //   return
    // }

    // if (taskData.investigatorText == '') {
    //   wx.showToast({
    //     mask: true,
    //     title: '请填写查勘员备注',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }

    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.path.indexOf('https://') == -1){
        informationImageFiles.push({path: item.path, type: 1})
      }
    })

    console.log('工单新建 改善参数：', taskData)
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    util.request({
      path: '/app/family/orders',
      method: 'POST',
      data: taskData
    }, function (err, res) {
      console.log('工单新建 改善结果：', res)
      if (res.code == 0) {
        _this.id = res.data.flowId || _this.data.id
        let imgPaths = [...informationImageFiles]
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
  getImageTypeStr (str) {
    let result = ''
    switch (str) {
      case 'house':
        result = '房屋及装修'
        break
      case 'electrical':
        result = '家电及文体用品'
        break
      case 'cloths':
        result = '衣物床品'
        break
      case 'furniture':
        result = '家具及其他生活用品'
        break
      case 'overall':
        result = '全景'
        break
      case 'certificate':
        result = '房产证、楼号、门牌号'
        break
      case 'identification':
        result = '身份证'
        break
      case 'bank':
        result = '银行卡'
        break
      case 'register':
        result = '户口本、关系证明'
        break
      case 'source':
        result = '事故源'
        break
    }
    return result
  },
  checkUploadImages (familyImages, flag) {
    let clientIndexArr = []
    let familyImagesList = []

    for(let key in familyImages) {
      familyImages[key].forEach(item => {
        if (item.hasOwnProperty('clientIndex')) {
          familyImagesList.push(item)
          clientIndexArr.push(parseInt(item.clientIndex))
        }
      })
    }
    if (flag) {
      return {
        flag: true,
        data: familyImagesList
      }
    }
    clientIndexArr = Array.from(new Set(clientIndexArr))
    clientIndexArr.sort()
    let str = ''
    for (let i = 0; i < clientIndexArr.length; i++) {
      if (str != '') {
        break
      }
      for (let key in familyImages) {
        let _arr = familyImages[key].filter(item => {return item.clientIndex == clientIndexArr[i]})
        if (!_arr.length) {
          str = `${clientIndexArr[i] == 0 ? '客户' : ('第三者' + clientIndexArr[i])}未上传${this.getImageTypeStr(key)}`
          break
        }
      }
    }
    if (str == '') {
      if (familyImagesList.length == 0) {
        return {
          flag: false,
          data: '图片信息不能为空'
        }
      }
      return {
        flag: true,
        data: familyImagesList
      }
    } else {
      return {
        flag: false,
        data: str
      }
    }
    // for (let key in familyImages) {
    //   familyImages[key].forEach(item => {
    //     familyImagesList.push(item)
    //   })
    // }
  }
})
