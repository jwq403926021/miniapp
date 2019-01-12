const app = getApp()
var util = require('./util.js')
function deleteImage(id) {
  util.request({
    path: '/app/image?id='+id,
    method: 'DELETE'
  }, function (err, res) {
    console.log(res, '???')
  })
}

module.exports = {
  deleteImage: deleteImage
}