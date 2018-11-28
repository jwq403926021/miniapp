var util = require('./utils/util.js')
//app.js
App({
    onLaunch: function () {
        let _this = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.showLoading({title: '登录中'})
                    util.request({
                        authorization: false,
                        path: '/app/login',
                        method: 'POST',
                        data: {
                            code: res.code
                        }
                    }, function (err, res) {
                        wx.hideLoading()
                        if (res.code == 0) {
                            wx.setStorageSync('state', res.state)
                            wx.setStorageSync('token', res.token)
                            _this.globalData.state = res.state
                            _this.globalData.token = res.token
                            if(res.state == 0) {
                                console.log('未注册 跳转登录', res)
                            } else {
                                console.log('已登录 跳转登录', res)
                            }
                        } else {
                            wx.showToast({title: '登录出错请重试', icon: 'none', duration: 3000});
                        }
                    })
                } else {
                    wx.showToast({title: '登录失败', icon: 'none', duration: 3000});
                }
            }
        })

// if (wx.getStorageSync('token')) {
//   console.log('登陆过了')
// } else {
//   wx.login({
//     success: function (res) {
//       if (res.code) {
//         wx.showLoading({title: '登录中'})
//         // setTimeout(()=>{
//         //   wx.hideLoading()
//         //   wx.setStorageSync('token', '123')
//         // },3000)
//         util.request({
//             authorization: false,
//             path: '/app/login',
//             method: 'POST',
//             data: {
//               code: res.code
//             }
//         }, function (err, res) {
//           console.log(res)
//           // if (res.code == 1) {
//           //   let data = res.data
//           //   wx.showLoading({
//           //     title: '登陆中',
//           //   })
//           //   wx.setStorageSync('openid', data.openid)
//           //   wx.setStorageSync('token', data.token)
//           //   wx.setStorageSync('user_type', data.user_type)
//           //   setTimeout(function () {
//           //     wx.hideLoading()
//           //     // wx.redirectTo({
//           //     //   url: '../index/index',
//           //     // })
//           //   }, 1000)
//           // } else {
//           //   wx.showToast({ title: '登录出错请重试', icon: 'none', duration: 3000 });
//           // }
//         })
//       } else {
//         wx.showToast({ title: '登录失败', icon: 'none', duration: 3000 });
//       }
//     }
//   })
// }

// 获取用户信息
// wx.getSetting({
//   success: res => {
//     if (res.authSetting['scope.userInfo']) {
//       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//       wx.getUserInfo({
//         success: res => {
//           // 可以将 res 发送给后台解码出 unionId
//           this.globalData.userInfo = res.userInfo
//
//           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//           // 所以此处加入 callback 以防止这种情况
//           if (this.userInfoReadyCallback) {
//             this.userInfoReadyCallback(res)
//           }
//         }
//       })
//     }
//   }
// })
    },
    globalData: {
        userInfo: null,
        state: 0,
        token: ''
    }
})