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
      // 1 查勘员、业主、物业、施工人员、平台处理人、报价人员、财务人员、tis人员、市级负责人、省级负责人
      // data.role data.status
      let isEditable = true
      return isEditable
    }
  },
  data: {
    role: 1,
    orderId: null,
    statusMap: {
      '20': '已派送',
      '13': '已确认',
      '42': '已中标',
      '37': '待处理人指派比价人员',
      '38': '申请退单',
      '52': '待查勘员审核',
      '53': '查勘员驳回',
      '39': '比价中',
      '51': '待处理人确认',
      '33': '处理人驳回',
      '41': '待报价',
      '43': '报价驳回',
      '36': '待查勘员处理',
      '35': '待施工',
      '50': '已完工待财务处理',
      '11': '已办结'
    }
  },
  async onLoad (routeParams) {

  },
})
