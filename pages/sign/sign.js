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
    isEmpty: true
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
    var ctx = wx.createCanvasContext('handWriting');
    const data = {
      devicePixelRatio: pix,
    };
    signaturePad = new SignaturePad(ctx, data);
    this.drawTextCanvas()
  },
  drawTextCanvas () {
    this.canvas = wx.createCanvasContext('myCanvas');
    this.canvas.setFontSize(24)
    this.canvas.setTextAlign('center')
    this.canvas.fillText('维修确认书', 200, 40)

    this.canvas.setFontSize(14)
    this.canvas.setTextAlign('left')
    this.canvas.setFillStyle('red')
    this.canvas.fillText('中国人民财产保险股份有限公司上海市分公司:', 10, 80)
    this.canvas.setTextAlign('left')
    this.canvas.setFillStyle('black')
    this.drawText(`
      贵司签发的工程质量潜在缺陷保险第 ${'??'} 号保单，承保的保险标的于 ${'??'} 月 ${'??'} 日在 ${'??'}  发生 ${'??'} 保险事故。我司确认已经委托 ${'??'}对 ${'??'} 进行维修 ，且修理完毕。贵司将维修款项 ${'??'} 元支付给维修单位后，贵司就前述保险事故应承担的赔偿责任依法解除。我司就本案不再对贵司提出任何理赔要求。
    `, 10, 120, 28, 400)
    this.canvas.fillText('业主签名:', 10, 270)
    this.canvas.draw()
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
    if (this.data.isEmpty) {
      return false
    }
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      success: function(res) {
        console.log(res.tempFilePath)
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