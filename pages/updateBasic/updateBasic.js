//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
const app = getApp()
const statusMap = {
  1: {
    '11': '已办结',
    '12': '暂存',
    '13': '处理中',
    '20': '已派送',
    '41': '待报价',
    '43': '驳回',
    '50': '已报价'
  },
  2: {
    '13': '待客户完善',
    '29': '暂存',
    '20': '待客服人员处理',
    '30': '待指派测漏',
    '31': '待测漏人员处理',
    '32': '已测漏,待合作商处理',
    '40': '待合作商完善',
    '41': '待报价中心报价',
    '42': '合作商已驳回',
    '44': '待合作商联系客户',
    '51': '待定损员处理',
    '52': '定损员已驳回',
    '54': '待定损员联系客户',
    '61': '已报价,待财务处理',
    '62': '报价中心驳回',
    '11': '已办结'
  },
  statusListSource: [],
  workType: ''
}
Page({
  data: {
    id: '',
    type: '1',
    statusListSource: Object.values(statusMap[1]),
    statusValue: '',
    statusLabel: '',
    workType: '',
    handlingType: ''
  },
  onLoad: function (routeParams) {

  },
  inputgetName(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail.value
    this.setData(nameMap)
  },
  onRadioChange (event) {
    let key = `${event.currentTarget.dataset.name}`
    let data = {
      [key]: event.detail
    }
    if (key == 'type') {
      data.statusValue = ''
      data.statusLabel = ''
      data.statusListSource = Object.values(statusMap[event.detail])
    }
    this.setData(data);
  },
  pickerChange (event) {
    this.setData({
      'statusValue': event.detail.value,
      'statusLabel': this.data.statusListSource[event.detail.value]
    })
  },
  submitRequest () {
    let params = {}
    let url = this.data.type == '1' ? '/app/businessdamagenew/updateBasic' : '/app/businessinsurancefamilynew/updateBasic'
    wx.showLoading({
      mask: true,
      title: '提交中'
    })
    let status = Object.keys(statusMap[this.data.type])[this.data.statusValue]
    if (this.data.type == '1') {
      params.orderId = this.data.id
      params.status = status
      params.workType = this.data.workType
      params.handlingType = this.data.handlingType
    } else {
      params.flowId = this.data.id
      params.status = status
    }
    util.request({
      path: url,
      method: 'PUT',
      data: params
    }, function (err, res) {
      if (res.code == 0) {
        wx.showToast({
          mask: true,
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showToast({
          mask: true,
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})
