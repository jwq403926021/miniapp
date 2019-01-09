//获取应用实例
import util from "../../utils/util";
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
    statusMap: {
      '12': '暂存',
      '20': '待客服人员处理',
      '30': '待被保险人完善', // 也是驳回状态
      '31': '被保险人已完善,待报价中心报价',
      '32': '已报价,待被保险人审阅',
      '33': '被保险人不满意，待沟通',
      '40': '待合作商完善', // 也是驳回状态
      '41': '合作商已完善,待报价中心报价',
      '42': '已报价,需协商',
      '50': '已报价,待财务处理'
      // '11': '已办结',
      // '99': '处理中'
    },
    taskData: {
      "cityId": '',
      "countryId": '',
      "provinceId": '',
      "customerName": '',
      "customerPhone": '',
      "investigatorName": '',
      "investigatorPhone": '',
      "investigatorText": '',
      "bankTransactionId": '',
      "constructionMethod": '',
      "deposit": ''
    },
    caleImageFiles: [],
    authorityImageFiles: [],
    informationImageFiles: [],
    familyImages: {
      house: [],// 房屋及装修
      electrical: [],// 家电及文体用品
      cloths: [],// 衣物床品
      furniture: [],// 家具及其他生活用品
      overall : [],// 全景
      certificate: [],// 房产证
      identification: [],// 省份证
      bank: [],// 银行卡
      register: [],// 户口本
      source: []// 事故源
    }
  },
  onLoad: function (routeParams) {
    this.initArea()
    if (routeParams && routeParams.id) {
      this.setData({
        id: routeParams.id,
        flowId: routeParams.id,
        role: app.globalData.currentRegisterInfo.role// app.globalData.currentRegisterInfo.role//  TODO::: app.globalData.currentRegisterInfo.role
      })
      this.initDataById(routeParams.id)
    }
  },
  onConstructionMethodChange (event) {
    this.setData({
      'taskData.constructionMethod': event.detail
    });
  },
  initDataById (id) {
    let _this = this
    util.request({
      path: '/app/lock/info',
      method: 'GET',
      data: {
        id: id
      }
    }, function (err, res) {
      let data = res.data
      console.log('##', data)
      _this.sourceData = data
      _this.sourceImage = res.image
      let informationImageFiles = []
      let authorityImageFiles = []
      let caleImageFiles = []
      _this.sourceImage.forEach(item => {
        switch (item.type) {
          case 1:
            informationImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
          case 5:
            authorityImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
          case 7:
            caleImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
        }
      })
      _this.setData({
        'status': data.status,
        'taskData.countryId': data.areaCode,
        'taskData.cityId': data.cityCode,
        'taskData.provinceId': data.provinceCode,
        "taskData.customerPhone": data.customMobile,
        "taskData.customerName": data.customName,
        "taskData.investigatorName": data.investigatorName,
        "taskData.investigatorPhone": data.investigatorPhone,
        "taskData.investigatorText": data.investigatorText,
        "taskData.bankTransactionId": data.bankTransactionId,
        "taskData.constructionMethod": data.constructionMethod,
        "taskData.deposit": data.deposit,
        informationImageFiles: informationImageFiles,
        caleImageFiles: caleImageFiles,
        authorityImageFiles: authorityImageFiles
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
    let phone = e.currentTarget.dataset.phone;
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
        let list = that.data.informationImageFiles.concat(res.tempFilePaths)
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
  previewAuthorityImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.authorityImageFiles
    })
  },
  chooseAuthorityImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let list = that.data.authorityImageFiles.concat(res.tempFilePaths)
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
  },
  previewCaleImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.caleImageFiles
    })
  },
  chooseCaleImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let list = that.data.caleImageFiles.concat(res.tempFilePaths)
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
  },
  commitOrder(e) {
    let data = this.data.taskData
    let _this = this
    let isSave = e.currentTarget.dataset.save
    let taskData = {
      "cityId": data.cityId,
      "countryId": data.countryId,
      "provinceId": data.provinceId,
      "customerName": data.customerName,
      "customerPhone": data.customerPhone,
      "investigatorText": data.investigatorText
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

    if (taskData.investigatorText == '') {
      wx.showToast({
        mask: true,
        title: '请填写查勘员备注',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let informationImageFiles = []
    _this.data.informationImageFiles.map(item => {
      if (item.indexOf('https://') == -1){
        informationImageFiles.push({file: item, type: 1})
      }
    })

    console.log('工单新建 改善参数：', taskData)
    wx.showLoading({
      mask: true,
      title: '提交中',
      duration: 1000
    })
    util.request({
      path: isSave ? '/app/family/saveBySurvey' : '/app/family/orders',
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
            title: '创建成功',
            icon: 'success',
            duration: 1000,
            success () {
              setTimeout(() => {
                if (_this.data.flowId){
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
          mask: true,
          title: '创建失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log('upload flowID:', this.id, '????',this.data.id)
    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].file,
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
                  if (that.data.flowId){
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
      url: '../my-jc-lock/my-jc-lock',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  bindTapToClient (event) {
    wx.setStorageSync('familyImages', this.data.familyImages)
    wx.navigateTo({
      url: '../jc-form-client/jc-form-client?flowId=' + event.currentTarget.dataset.id
    })
  }
})
