const app = getApp()
var util = require('./util.js')
function deleteImage(id) {
  util.request({
    path: '/app/image?id='+id,
    method: 'DELETE'
  }, function (err, res) {
  })
}

function downloadSaveFile(obj) {
  let that = this;
  let success = obj.success;
  let fail = obj.fail;
  let id = "";
  let url = obj.url;
  if (obj.id){
    id = obj.id;
  }else{
    id = url;
  }

  if (obj.url) {
    wx.downloadFile({
      url: obj.url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (result) {
            result.id = id;
            if (success) {
              success(result);
            }
          },
          fail: function (e) {
            if (fail) {
              fail(e);
            }
          }
        })

      },
      fail: function (e) {
        if (fail) {
          fail(e);
        }
      }
    })
  }
}

function downloadSaveFiles(obj) {
  wx.showLoading({
    mask: true,
    title: '下载中'
  })
  let urls = obj.urls;
  let successNum = 0;
  let failNum = 0;
  let urlsLength = urls.length;

  if (urlsLength == 0) {
    wx.showLoading({
      mask: true,
      title: '没有图片可下载',
      icon: 'success',
      duration: 1000
    });
    return
  }

  for (let i = 0; i < urlsLength; i++) {
    console.log(app.globalData.currentRegisterInfo.role, '??', urls[i])
    downloadSaveFile({
      url: urls[i],
      success: function (res) {
        successNum+=1

        if ((successNum + failNum) == urlsLength) {
          wx.showLoading({
            mask: true,
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
        }
      },
      fail: function (e) {
        failNum+=1
        if ((successNum + failNum) == urlsLength) {
          wx.showLoading({
            mask: true,
            title: '保存成功',
            icon: 'success',
            duration: 1000
          });
        }
      }
    })
  }
}

module.exports = {
  downloadImages: downloadSaveFiles,
  deleteImage: deleteImage
}