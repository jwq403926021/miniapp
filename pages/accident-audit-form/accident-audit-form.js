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
    status: '',
    statusMap: {},
    taskData: {},
    activeNames: [],//['0','1','2']
    detailListArr: [
      // {'name':'1', 'percent': '10', 'price': '20'},
      // {'name':'1', 'percent': '10', 'price': '20'}
    ]
  },
  onLoad: function (routeParams ) {

  },
  addItemSubmit (event) {
    let isCancel = event.currentTarget.dataset.cancel+'';
    if (isCancel) {
      this.setData({ show: false })
      return false
    }
    this.setData({ show: false })
  },
  addNewItem (event) {
    this.setData({
      show: true
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  dialPhone (e) {
    let phone = e.currentTarget.dataset.phone+'';
    wx.makePhoneCall({
      phoneNumber: phone
    })
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
