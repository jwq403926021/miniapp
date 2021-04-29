//获取应用实例
import util from "../../utils/util";
import common from "../../utils/common";
import SignaturePad from '../../utils/signature_pad.js'
const app = getApp()
let signaturePad = {};
let pix = 7;
let penColor = 'black';
let lineWidth = 0.6;
Page({
  data: {
    penColor: 'black',
    lineWidth: 0.6,
    isEmpty: true,
    height: '',
    resultCanvasHeight: '',
    orderId: '',
    surveyCompanyName: '',
    insuranceNumber: '',
    createDate: '',
    address: '',
    troubleReason: '',
    workerCompanyName: '',
    proName: '',
    workMoney: ''
  },
  uploadScaleStart(e) {
    const item = {
      penColor: penColor,
      lineWidth: lineWidth
    };
    signaturePad._handleTouchStart(e, item);
  },
  uploadScaleMove(e) {
    signaturePad._handleTouchMove(e);
  },
  uploadScaleEnd: function(e) {
    signaturePad._handleTouchEnd(e);
    const isEmpty = signaturePad.isEmpty();
    this.setData({
      isEmpty: isEmpty
    })
  },
  retDraw: function() {
    signaturePad.clear();
    const isEmpty = signaturePad.isEmpty();
    this.setData({
      isEmpty: isEmpty
    })
  },
  onLoad: function(options) {
    let that = this
    this.setData({
      orderId: options.id
    })
    var ctx = wx.createCanvasContext('handWriting');
    const data = {
      devicePixelRatio: pix,
    };
    signaturePad = new SignaturePad(ctx, data);

    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    util.request({
      path: `/app/businessinsuranceidi/idiPriceDetail`,
      method: 'GET',
      data: {
        flowId: options.id
      }
    }, function (err, res) {
      if (res.code == 0) {
        let idiList = res.idiList.find(item => {
          return item.type === 0
        })
        let offerList = res.offerList.find(item => {
          return item.offerType === '0'
        })
        that.setData({
          surveyCompanyName: res.data.surveyCompanyName || '??',
          insuranceNumber: res.data.insuranceNumber || '??',
          createDate: res.data.createDate || '??',
          address: res.data.address || '??',
          troubleReason: res.data.troubleReason || '??',
          workerCompanyName: res.data.workerCompanyName || '??',
          proName: offerList.proName || '??',
          workMoney: idiList.workMoney || '??'
        }, () => {
          that.drawTextCanvas()
        })
      }
      wx.hideLoading()
    })

  },
  drawTextCanvas () {
    this.canvas = wx.createCanvasContext('myCanvas');
    this.canvas.setFontSize(24)
    this.canvas.setTextAlign('center')
    this.canvas.fillText('维修确认书', 200, 40)

    this.canvas.setFontSize(14)
    this.canvas.setTextAlign('left')
    this.canvas.setFillStyle('red')
    this.canvas.fillText(`${this.data.surveyCompanyName}:`, 10, 80)
    this.canvas.setTextAlign('left')
    this.canvas.setFillStyle('black')
    let rowNum = this.drawText(`
      贵司签发的工程质量潜在缺陷保险第 ${this.data.insuranceNumber} 号保单，承保的保险标的于 ${this.data.createDate} 在 ${this.data.address}  发生 ${this.data.troubleReason} 保险事故。我司确认已经委托 ${this.data.workerCompanyName}对 ${this.data.proName} 进行维修 ，且修理完毕。贵司将维修款项 ${this.data.workMoney} 元支付给维修单位后，贵司就前述保险事故应承担的赔偿责任依法解除。我司就本案不再对贵司提出任何理赔要求。
    `, 10, 120, 28, 400)
    let height = (120 + rowNum * 28) + 10
    this.canvas.fillText('签名:', 10, height)
    this.setData({
      height: height + 15,
      resultCanvasHeight: height + 15 + 260
    }, () => {
      this.canvas.draw()
    })
  },
  drawText (text, startX, startY, lineHeight, MAX_WIDTH) {
    let allAtr = text.split('');
    let rowArr = []; // 拆分出来的每一行
    let rowStrArr = []; // 每一行的文字数组
    for (let i = 0; i < allAtr.length; i++) {
      const currentStr = allAtr[i];
      rowStrArr.push(currentStr);
      const rowStr = rowStrArr.join('');
      if (this.canvas.measureText(rowStr).width > MAX_WIDTH) {
        rowStrArr.pop(); // 删除最后一个
        rowArr.push(rowStrArr.join('')); // 完成一行
        rowStrArr = [currentStr];
        continue;
      }
      // 最后一个字母 直接添加到一行
      if (i === allAtr.length - 1) {
        rowArr.push(rowStr); // 完成一行
      }
    }

    for (let i = 0; i < rowArr.length; i++) {
      this.canvas.fillText(rowArr[i], startX, startY + i * lineHeight);
    }
    return rowArr.length;
  },
  getSysInfo: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        pix = res.pixelRatio
        that.setData({
          width: res.windowWidth * pix,
          height: res.windowHeight * pix
        })
      }
    })
  },
  subCanvas: function() {
    if (this.data.isEmpty) {
      return false
    }
    this.onConfirm()
  },
  onConfirm: function() {
    let that = this
    // if (this.data.isEmpty) {
    //   return false
    // }
    let content = null
    that.resultCanvas = wx.createCanvasContext('resultCanvas');
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function(res) {
        content = res.tempFilePath
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      }
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'handWriting',
        success: function(res) {
          that.resultCanvas.drawImage(content, 0, 0, 400, that.data.height)
          that.resultCanvas.drawImage(res.tempFilePath, 0, that.data.height, 400, 260)
          that.resultCanvas.draw()
          setTimeout(() => {
            that.exportImage()
          }, 100)
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {
          console.log(res)
        }
      })
    }, 100)
  },
  exportImage () {
    let that = this
    wx.canvasToTempFilePath({
      fileType: 'jpg',
      canvasId: 'resultCanvas',
      success: function(res) {
        wx.uploadFile({
          url: 'https://aplusprice.xyz/aprice/app/image/upload',
          filePath: res.tempFilePath,
          name: `files`,
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token')
          },
          formData: {
            'flowId': that.data.orderId,
            'type': 3
          },
          success:function(e){
            wx.showToast({
              mask: true,
              title: '提交成功',
              icon: 'success',
              duration: 1000,
              success () {
                wx.navigateTo({
                  url: '../idi-form/idi-form?id=' + that.data.orderId
                })
              }
            })
          }
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      }
    })
  }
})