// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.action) {
    case 'getUrlScheme': {
      return getUrlScheme(event.id)
    }
  }
  return event
}

async function getUrlScheme(id) {
  return cloud.openapi.urlscheme.generate({
    jumpWxa: {
      path: '/pages/new-ws-form/new-ws-form', // <!-- replace -->
      query: `id=${id}`
    },
    // 如果想不过期则置为 false，并可以存到数据库
    isExpire: false,
    // 一分钟有效期
    expireTime: parseInt(Date.now() / 1000 + 60),
  })
}
