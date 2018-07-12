// pages/trolley/trolley.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * {
      id: 1,
      name: '商品1',
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
      price: 45,
      source: '海外·瑞典',
      count: 1,
    },
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [undefined, true, undefined], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: true, // 购物车中商品是否全选
  },

  getTrolleyList(){

    wx.showLoading({
      title: '购物车数据加载中',
    })
    qcloud.request({
      url: config.service.trolleyList,
      login: true,
      method: 'GET',
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            trolleyList: result.data.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTrolleyList()
  },

  onTapLogin(res) {
    app.login({
      success: ({ userInfo})=>{
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        console.log('app.data.locationAuthType is:' + app.data.locationAuthType)
      },
      error:()=>{
        console.log('login failed in trolley!')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('check session in trolley')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },

})