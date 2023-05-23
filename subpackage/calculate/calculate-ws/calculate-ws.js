// subpackage/calculate/calculate-ws/calculate-ws.js
const computedBehavior = require("miniprogram-computed");

Page({
  behaviors: [computedBehavior.behavior],
  computed: {
    regionList: (data) => {
      return data.regionSourceList.map(i => {
        return i.label
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    regionSourceList: [{
      value: 0,
      label: '西南西北',
    },{
      value: 1,
      label: '华南',
    },{
      value: 2,
      label: '华东',
    },{
      value: 3,
      label: '华中'
    },{
      value: 4,
      label: '华北',
    },{
      value: 5,
      label: '东北~内蒙',
    }],
    regionValue: '',
    regionLabel: '',
    calculateResultList: [
      {
        'id': 1,
        'title': '2K以下',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 2,
        'title': '2K-5K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 3,
        'title': '5K-10K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 4,
        'title': '10K-20K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 5,
        'title': '20K-30K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 6,
        'title': '30K-40K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 7,
        'title': '40K-50K',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 8,
        'title': '50K上',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      },
      {
        'id': 9,
        'title': '总数',
        'sumDistribution': 1, //金额分布(万元)
        'sumProportion': 1, //金额占比
        'insuranceProportion': 1, //金额保费占比
        'averagePay': 1, //案均赔款(万元)
        'caseNum': 1, //案件数（件）
        'caseProportion': 1, //件数占比
        'caseInsuranceProportion': 1, //案件保费占比
      }
    ]
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [`${name}Value`]: e.detail.value,
      [`${name}Label`]: this.data[`${name}SourceList`][e.detail.value] ? this.data[`${name}SourceList`][e.detail.value].label : ''
    }, () => {
      // if (name === 'model') {
      //   this.setData({
      //     'thicknessValue': '',
      //     'thicknessLabel': ''
      //   })
      // }
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
