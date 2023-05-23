const computedBehavior = require('miniprogram-computed')
Page({
  behaviors: [computedBehavior.behavior],
  computed: {},
  /**
   * 页面的初始数据
   */
  data: {
    region: [
      "北京市,北京,1",
      "河北省,石家庄,0.9",
      "内蒙古,呼和浩特,0.9",
      "吉林省,长春,0.8",
      "上海市,上海,1",
      "浙江省,杭州,1",
      "福建省,福州,0.9",
      "山东省,济南,0.9",
      "湖北省,武汉,0.9",
      "广东省,广州,1",
      "海南省,海口,0.9",
      "四川省,成都,0.8",
      "云南省,昆明,0.8",
      "陕西省,西安,0.8",
      "青海省,西宁,0.8",
      "新疆,乌鲁木齐,0.8",
      "深圳市,深圳,1",
      "大连市,大连,0.8",
      "天津市,天津,0.9",
      "山西省,太原,0.8",
      "辽宁省,沈阳,0.8",
      "黑龙江省,哈尔滨,0.8",
      "江苏省,南京,1",
      "安徽省,合肥,0.8",
      "江西省,南昌,0.8",
      "河南省,郑州,0.8",
      "湖南省,长沙,0.8",
      "广西,南宁,0.8",
      "重庆市,重庆,0.8",
      "贵州省,贵阳,0.8",
      "西藏,拉萨,0.8",
      "甘肃省,兰州,0.8",
      "宁夏,银川,0.8",
      "宁波市,宁波,0.9",
      "厦门市,厦门,0.9"
    ],
    level: [{
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
    productLocation: [{
      label: '国产',
      value: 1
    }, {
      label: '进口',
      value: 10
    }],
    model: [{
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
      }]
    }],
    thickness: []
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}SourceList`][e.detail.value] ? this.data[`${name}SourceList`][e.detail.value].name : ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
