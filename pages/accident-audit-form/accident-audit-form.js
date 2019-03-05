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
    activeNames: ['1']
  },
  onLoad: function (routeParams ) {

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
