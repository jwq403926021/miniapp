const app = getApp()
import util from '../../utils/util'
Page({
    data: {
        show: false,
        areaList: {},
        region: '',
        role: '',
        companyCategory: 0,
        companyName: 0,
        companyCategoryList: ['Type 1', 'Type 2', 'Type 3'],
        companyNameList: ['Name 1', 'Name 2', 'Name 3'],
        hasUserInfoAuth: false,
        userInfo: null
    },
    onChange(event) {
        this.setData({role: event.detail});
    },
    onLoad: function (routeParams) {
        let _this = this
        wx.hideLoading()
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            app.globalData.userInfo = res.userInfo
                            _this.setData({
                                userInfo: app.globalData.userInfo,
                                hasUserInfoAuth: true
                            })
                        }
                    })
                }
            }
        })
    },
    bindGetUserInfo(data) {
        if (data.detail.errMsg == "getUserInfo:fail auth deny") {
            return false
        }
        app.globalData.userInfo = data.detail.userInfo
        this.setData({
            hasUserInfoAuth: true,
            userInfo: app.globalData.userInfo
        })
    },
    openLocation() {
        this.setData({
            show: !this.show
        })
    },
    onConfirm() {
        this.setData({
            show: false
        })
    },
    onCancel() {
        this.setData({
            show: false
        })
    }
})
