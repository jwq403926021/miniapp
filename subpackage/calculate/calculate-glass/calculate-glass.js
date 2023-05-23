Page({
  /**
   * 页面的初始数据
   */
  data: {
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
