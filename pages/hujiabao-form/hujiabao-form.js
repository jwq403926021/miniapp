import util from "../../utils/util";
import common from "../../utils/common";
import MetaData from './metadata.js'
const computedBehavior = require('miniprogram-computed')
const app = getApp()
Page({
  behaviors: [computedBehavior.behavior],
  computed: {
    isEditable (data) {
      let isEditable = true
      return isEditable
    }
  },
  data: {
    role: 1, // 理算 施工人员
    orderId: null,
    statusMap: {
      '1': '待查勘',
      '2': '线下已提交',
      '3': '已查勘',
      '4': '待理算',
      '5': '待核损',
      '6': '核损通过',
      '7': '已关闭',
    },
    delayReportReason: { index: '', value: '', label: '' },
    delayReportReasonList: Object.values(MetaData.delayReportReason),
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    let source = MetaData[name]
    let key = Object.keys(source)[e.detail.value]
    this.setData({
      [name]: {
        index: e.detail.value,
        value: key,
        label: source[key] ? source[key] : '',
      }
    })
  },
  submit () {
    console.log('submit')
  },
  async onLoad (routeParams) {

  }
})
