// pages/user/user.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTapLogin(res){
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        console.log('app.data.locationAuthType is:' + app.data.locationAuthType)
      },
      error: () => {
        console.log('login failed in trolley!')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  // login({ success, error }) {
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo'] === false) {
  //         // 已拒绝授权
  //         wx.showModal({
  //           title: '提示',
  //           content: '请授权我们获取您的用户信息',
  //           showCancel: false
  //         })
  //       } else {
  //         this.doQcloudLogin({ success, error })
  //       }
  //     }
  //   })
  // },
  // doQcloudLogin({success, error}){
  //   qcloud.setLoginUrl(config.service.loginUrl)
  //   qcloud.login({
  //     success: result => {
  //       //首次登录 直接获取用户数据
  //       if (result) {
  //         userInfo = result 
  //         console.log(' login success')
  //         success &&success({
  //           userInfo
  //         })

  //       } else {
  //         //不是首次登录
  //         console.log('not first login')
  //         //通过/user获取用户数据
  //         this.getUserData({ success, error })
  //       }
  //     },
  //     fail: result => {
  //       console.log('fail')
  //       console.log(result)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('check session in  user')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})