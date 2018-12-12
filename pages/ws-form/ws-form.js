//获取应用实例
import util from "../../utils/util";

const app = getApp()

Page({
  data: {
    id: null,
    role: 0, // 0 查勘员 | 1 施工人员 | 2 区域负责人 | 3 合作商负责人 |
    status: 0, // 0 新建 | 1 施工人员画面 | 2 施工人员提交 押金页面
    informationImageFiles: [],
    liveImageFiles: [],
    show: false,
    areaList: {},
    region: '',
    regionLabel: '',
    taskData: {
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
      informationImage: [],
      live: '',
      liveImage: []
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../register/register?id=' + 123
    })
  },
  onLoad: function (routeParams) {
    console.log('工单号：->', routeParams)
    this.initArea()
    if (routeParams.id) {
      this.setData({
        id: routeParams.id
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
            informationImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
          case 2:
            liveImageFiles.push(`https://aplusprice.xyz/file/${item.path}`)
            break
        }
      })
      _this.setData({
        region: data.area,
        status: data.status,
        informationImageFiles: informationImageFiles,
        liveImageFiles: liveImageFiles,
        'taskData.area': data.area,
        'taskData.insuranceType': data.insuranceType,
        'taskData.damagedUser': data.damagedUser,
        'taskData.damagedPhone': data.damagedPhone,
        'taskData.customerUser': data.customerUser,
        'taskData.customerPhone': data.customerPhone,
        'taskData.plateNumber': data.plateNumber,
        'taskData.information': data.information,
        'taskData.live': data.live,
        // 'taskData.informationImage': data.informationImage, //todo
        // 'taskData.liveImage': data.liveImage // todo
      })

      _this.getRegionLabel()
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
    let arr = []
    if (this.data.region && this.data.areaList.hasOwnProperty('province_list')) {
      let provinceCode = this.data.region.slice(0,2) + '0000'
      let cityCode = this.data.region.slice(0,4) + '00'
      let townCode = this.data.region
      console.log(this.data.region, this.data.areaList, '##')
      arr.push(this.data.areaList['province_list'][provinceCode])
      arr.push(this.data.areaList['city_list'][cityCode])
      arr.push(this.data.areaList['county_list'][townCode])
    }
    this.setData({
      regionLabel: arr.length ? arr.join(',') : ''
    })
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let list = that.data.informationImageFiles.concat(res.tempFilePaths)
        if (list.length >= 9) {
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
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.informationImageFiles // 需要预览的图片http链接列表
    })
  },
  chooseImageForliveImageFiles: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let list = that.data.liveImageFiles.concat(res.tempFilePaths)
        if (list.length >= 9) {
          wx.showToast({
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
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.liveImageFiles // 需要预览的图片http链接列表
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
  removeliveImageFiles (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this
    _this.data.liveImageFiles.splice(index, 1)
    this.setData({
      liveImageFiles: _this.data.liveImageFiles
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
  submitWS (data) {
    let taskData = this.data.taskData
    let _this = this
    if (taskData.damagedUser == '' || taskData.customerUser == '') {
      wx.showToast({
        title: '请填写受损人姓名以及客户姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let isVaidcustomerPhone = this.checkPhone(taskData.customerPhone, '请输入正确的客户手机号')
    if (!isVaidcustomerPhone) {
      return
    }

    if (taskData.damagedPhone !== ''){
      let isVaiddamagedPhone = this.checkPhone(taskData.damagedPhone, '请输入正确的受损人手机号')
      if (!isVaiddamagedPhone) {
        return
      }
    }

    if (taskData.insuranceType == '1') {
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
      if (res.code == 0) {
        _this.id = res.data
        /*
        1 报案信息
        2 现场信息
        3 现场信息施工人员
        4 损失清单
        5 押金、授权
        6 施工完成
        7 保险计算书
        */
        let informationImageFiles = _this.data.informationImageFiles.map(item => {
          return {file: item, type: 1}
        })
        let liveImageFiles = _this.data.liveImageFiles.map(item => {
          return {file: item, type: 2}
        })
        let imgPaths = [...informationImageFiles, ...liveImageFiles]
        let count = 0
        let successUp = 0
        let failUp = 0
        if (imgPaths.length) {
          _this.uploadOneByOne(imgPaths,successUp,failUp,count,imgPaths.length)
        } else {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000,
            success () {
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index'
                })
              }, 1000)
            }
          })

        }
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  uploadOneByOne (imgPaths,successUp, failUp, count, length) {
    var that = this
    console.log(this.id)

    wx.showLoading({
      title: `上传图片中`,
    })

    wx.uploadFile({
      url: 'https://aplusprice.xyz/aprice/app/image/upload', //仅为示例，非真实的接口地址
      filePath: imgPaths[count].file,
      name: `files`,
      header: {
        "Content-Type": "multipart/form-data",
        'token': wx.getStorageSync('token')
      },
      formData: {
        'flowId': that.id,
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
            title: length == successUp ? '上传成功' : `上传成功${successUp},失败${failUp}`,
            icon: length == successUp ? 'success' : 'none',
            duration: 1000,
            success () {
              if (length == successUp) {
                setTimeout(() => {
                  wx.switchTab({
                    url: '../index/index'
                  })
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
  }
})
