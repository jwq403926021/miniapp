const computedBehavior = require('miniprogram-computed')
const util = require("../../../utils/util");
const app = getApp()
Page({
  behaviors: [computedBehavior.behavior],
  computed: {
    regionSourceList: (data) => {
      return data.region.map(i => {
        return {
          label: `${i.split(',')[0]} - ${i.split(',')[1]}`,
          value: i.split(',')[2]
        }
      })
    },
    regionList: (data) => {
      return data.region.map(i => {
        return `${i.split(',')[0]} - ${i.split(',')[1]}`
      })
    },
    levelList: (data) => {
      return data.levelSourceList.map(i => i.label)
    },
    productLocationList: (data) => {
      return data.productLocationSourceList.map(i => i.label)
    },
    modelList: (data) => {
      return data.modelSourceList.map(i => i.label)
    },
    thicknessSourceList: (data) => {
      if (data.modelSourceList[data.modelValue]) {
        if (data.area >= 4) {
          return data.modelSourceList[data.modelValue].thicknessForBig.map(i => {
            return {
              label: i.label,
              value: i.value,
            }
          })
        } else {
          return data.modelSourceList[data.modelValue].thickness.map(i => {
            return {
              label: i.label,
              value: i.value,
            }
          })
        }
      }
      return []
    },
    thicknessList: (data) => {
      if (data.modelSourceList[data.modelValue]) {
        return data.modelSourceList[data.modelValue].thickness.map(i => i.label)
      }
      return []
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    area: '',
    regionValue: '',
    regionLabel: '',
    region: [
      "北京市,北京,1",
      "河北省,石家庄,0.9",
      "内蒙古,呼和浩特,0.9",
      "吉林省,长春,0.85",
      "上海市,上海,1",
      "浙江省,杭州,1",
      "福建省,福州,0.9",
      "山东省,济南,0.9",
      "湖北省,武汉,0.9",
      "广东省,广州,1",
      "海南省,海口,0.9",
      "四川省,成都,0.9",
      "云南省,昆明,0.8",
      "陕西省,西安,0.9",
      "青海省,西宁,0.8",
      "新疆,乌鲁木齐,0.8",
      "深圳市,深圳,1",
      "大连市,大连,0.8",
      "天津市,天津,0.9",
      "山西省,太原,0.85",
      "辽宁省,沈阳,0.85",
      "黑龙江省,哈尔滨,0.85",
      "江苏省,南京,1",
      "安徽省,合肥,0.9",
      "江西省,南昌,0.85",
      "河南省,郑州,0.9",
      "湖南省,长沙,0.9",
      "广西,南宁,0.8",
      "重庆市,重庆,0.9",
      "贵州省,贵阳,0.8",
      "西藏,拉萨,0.8",
      "甘肃省,兰州,0.8",
      "宁夏,银川,0.8",
      "宁波市,宁波,0.9",
      "厦门市,厦门,0.9",
      "青岛市,青岛,0.9"
    ],
    levelValue: '',
    levelLabel: '',
    levelSourceList: [{
      label: '21层以上',
      value: 2000
    }, {
      label: '11-20层',
      value: 3000
    }, {
      label: '4-10层',
      value: 2000
    }, {
      label: '1-3层',
      value: 1000
    }],
    levelSourceListForBig: [{
      label: '21层以上',
      value: 2300
    }, {
      label: '11-20层',
      value: 3450
    }, {
      label: '4-10层',
      value: 2300
    }, {
      label: '1-3层',
      value: 1150
    }],
    productLocationValue: '',
    productLocationLabel: '',
    productLocationSourceList: [{
      label: '国产',
      value: 1
    }, {
      label: '进口',
      value: 10
    }],
    modelValue: '',
    modelLabel: '',
    modelSourceList: [{
      label: '单片',
      value: 1,
      thickness: [{
        label: '8毫米',
        value: 172.5
      },{
        label: '10毫米',
        value: 218.5
      },{
        label: '12毫米',
        value: 253
      },{
        label: '15毫米',
        value: 310.5
      },{
        label: '19毫米',
        value: 483
      },{
        label: '10毫米超白',
        value: 207
      },{
        label: '12毫米超白',
        value: 299
      },{
        label: '15毫米超白',
        value: 379.5
      },{
        label: '19毫米超白',
        value: 517.5
      }],
      thicknessForBig: [{
        label: '8毫米',
        value: 370.3
      },{
        label: '10毫米',
        value: 423.2
      },{
        label: '12毫米',
        value: 449.65
      },{
        label: '15毫米',
        value: 502.55
      },{
        label: '19毫米',
        value: 714.15
      },{
        label: '10毫米超白',
        value: 357.075
      },{
        label: '12毫米超白',
        value: 423.2
      },{
        label: '15毫米超白',
        value: 515.775
      },{
        label: '19毫米超白',
        value: 740.6
      }]
    }, {
      label: '双层夹胶',
      value: 2,
      thickness: [{
        label: '6+0.76pvb+6',
        value: 333.5
      },{
        label: '8+1.52pvb+8',
        value: 368
      },{
        label: '10+1.52+10',
        value: 517.5
      },{
        label: '12+1.90pvb+12',
        value: 575
      },{
        label: '10+1.52+10超白彩釉',
        value: 800
      }],
      thicknessForBig: [{
        label: '6+0.76pvb+6',
        value: 462.875
      },{
        label: '8+1.52pvb+8',
        value: 515.775
      },{
        label: '10+1.52+10',
        value: 700.925
      },{
        label: '12+1.90pvb+12',
        value: 767.05
      },{
        label: '10+1.52+10超白彩釉',
        value: 0
      }]
    }, {
      label: '双层中空',
      value: 3,
      thickness: [{
        label: '6Low-E+12A+6',
        value: 345
      },{
        label: '8Low-E+12A+8',
        value: 368
      },{
        label: '10Low-E+12A+10',
        value: 448.5
      },{
        label: '6Low-E+12A+6', // fixme: 两个一样的?
        value: 299
      },{
        label: '8Low-E+12A+8超白',
        value: 437
      },{
        label: '10Low-E+12A+10超白',
        value: 540.5
      },{
        label: '6Low-E+12A+6超白',
        value: 414
      },{
        label: '6+12A+6超白',
        value: 494.5
      },{
        label: '8+12A+8超白',
        value: 517.5
      },{
        label: '10+12A+10超白',
        value: 575
      }],
      thicknessForBig: [{
        label: '6Low-E+12A+6',
        value: 581.9
      },{
        label: '8Low-E+12A+8',
        value: 595.125
      },{
        label: '10Low-E+12A+10',
        value: 608.35
      },{
        label: '6Low-E+12A+6', // fixme: 两个一样的?
        value: 449.65
      },{
        label: '8Low-E+12A+8超白',
        value: 595.125
      },{
        label: '10Low-E+12A+10超白',
        value: 700.925
      },{
        label: '6Low-E+12A+6超白',
        value: 555.45
      },{
        label: '6+12A+6超白',
        value: 648.025
      },{
        label: '8+12A+8超白',
        value: 687.7
      },{
        label: '10+12A+10超白',
        value: 767.05
      }]
    }, {
      label: '夹胶中空(三层)',
      value: 4,
      thickness: [{
        label: '(6+0.76pvb+6)+12A+8',
        value: 483
      },{
        label: '(8+1.52pvb+8)+12A+10',
        value: 552
      }],
      thicknessForBig: [{
        label: '(6+0.76pvb+6)+12A+8',
        value: 0
      },{
        label: '(8+1.52pvb+8)+12A+10',
        value: 0
      }]
    }],
    thicknessValue: '',
    thicknessLabel: '',
    amount1: '',
    amount2: '',
    total: ''
  },
  calculate () {
    if (
      this.data.area === '' ||
      this.data.regionValue === '' ||
      this.data.levelValue === '' ||
      this.data.productLocationValue === '' ||
      this.data.modelValue === '' ||
      this.data.thicknessValue === ''
    ) {
      wx.showToast({
        mask: true,
        title: '请输入必要信息',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    const area = Number(this.data.area)
    const region = Number(this.data.regionSourceList[this.data.regionValue].value)
    let level = 0
    if (area >= 4) {
      level = this.data.levelSourceListForBig[this.data.levelValue].value
    } else {
      level = this.data.levelSourceList[this.data.levelValue].value
    }
    const productLocation = this.data.productLocationSourceList[this.data.productLocationValue].value
    const mode = this.data.modelValue
    let thickness = this.data.thicknessSourceList[this.data.thicknessValue].value
    console.log('calculate!!!')
    console.log('area:', area)
    console.log('region:', region)
    console.log('level:', level)
    console.log('productLocation:', productLocation)
    console.log('mode:', mode, this.data.modelLabel)
    console.log('thickness:', thickness)
    if (thickness === 0) {
      wx.showToast({
        mask: true,
        title: '输入错误',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    const amount1 = thickness * area * region
    const amount2 = mode === '0' ? (4280 * region - 1400) * region : 4280 * region
    let total = mode === '0' ? amount1 + 4280 * region - 1400 * region : amount1 + 4280 * region + level
    console.log('amount1:', amount1)
    console.log('amount2:', amount2)
    console.log('total:', total)
    this.setData({
      amount1: Math.round(amount1 * 100) / 100,
      amount2: Math.round(amount2 * 100) / 100,
      total: Math.round(total * 100) / 100
    })
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}SourceList`][e.detail.value] ? this.data[`${name}SourceList`][e.detail.value].label : ''
    }, () => {
      if (name === 'model') {
        this.setData({
          'thicknessValue': '',
          'thicknessLabel': ''
        })
      }
    })
  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let nameMap = {}
    if (index !== undefined) {
      nameMap[`${name}[${index}]`] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    this.setData(nameMap)
  },
  commitSubmit: function () {
    let that = this
    wx.showLoading({
      title: '提交订单中',
      mask: true
    })
    util.request({
      authorization: false,
      path: '/app/wxPay/miniAppPay',
      method: 'POST',
      data: {
        openId:  app.globalData.openId,
        orderId: Math.ceil(Math.random() * 1000),
        money: 0.01 // that.data.money
      }
    }, function (err, res) {
      wx.hideLoading()
      wx.requestPayment({
        ...res,
        "success":function(res){
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          // that.backDetail()
        },
        "fail":function(res){
          console.log('pay fail:', res)
          wx.showToast({
            title: '支付失败',
            icon: 'error',
            duration: 2000
          })
        },
        "complete":function(res){

        }
      })
    })
  }
})
