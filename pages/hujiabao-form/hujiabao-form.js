import util from "../../utils/util";
import common from "../../utils/common";
import MetaData from './metadata.js'
const computedBehavior = require('miniprogram-computed')
const plugin = requirePlugin('WechatSI')
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
    delayReportReasonSelectedIndex: '',
    delayReportReasonValue: '',
    delayReportReasonList: Object.values(MetaData.delayReportReason),
    delayReportReasonLabel: ''
  },
  pickerChange (e) {
    let name = e.currentTarget.dataset.name;
    let source = MetaData[name]
    let key = Object.keys(source)[e.detail.value]
    this.setData({
      [`${name}SelectedIndex`]: e.detail.value,
      [`${name}Value`]: key,
      [`${name}Label`]: source[key] ? source[key] : ''
    })
  },
  async onLoad (routeParams) {

  },
})
