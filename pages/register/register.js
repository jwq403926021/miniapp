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
        console.log('routeParams->', routeParams)

        let abc = util.request({authorization: true, path: '/aprice/sys/area/list', method: 'GET'}, (data) => {
            console.log("144444", data)
        })

        wx.hideLoading()

        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    this.setData({
                        userInfo: app.globalData.userInfo,
                        hasUserInfoAuth: true
                    })
                } else {
                    this.setData({
                        userInfo: null,
                        hasUserInfoAuth: false
                    })
                }
            }
        })
    },
    bindGetUserInfo(data) {
        app.globalData.userInfo = data.detail.userInfo
        this.setData({
            hasUserInfoAuth: true,
            userInfo: app.globalData.userInfo
        })
    },
    onChange3(e) {
        console.log("onChange3", e)
    },
    formSubmit(data) {
        console.log("formSubmit::", data)
    },
    openLocation() {
        this.setData({
            show: !this.show
        })
    },
    onConfirm() {
        console.log('!!!!!!!!!')
        this.setData({
            show: false
        })
    },
    onCancel() {
        console.log('!!!!!!333!!!')
        this.setData({
            show: false
        })
    }
})
