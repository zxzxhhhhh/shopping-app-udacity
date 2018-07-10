// pages/order/order.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    orderList: [], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  getOrderList() {
    wx.showLoading({
      title: '订单数据加载中',
    })
    qcloud.request({
      url: config.service.orderList,
      login: true,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            orderList: result.data.data
          })
        }
        else {
          wx.showToast({
            title: '加载失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
        console.log('error!');
      }
    });

  },
  onTapLogin(res) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        console.log('app.data.locationAuthType is:' + app.data.locationAuthType)
        this.getOrderList()
      },
      error: () => {
        console.log('login failed in trolley!')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('check session in order')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
    this.getOrderList()
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