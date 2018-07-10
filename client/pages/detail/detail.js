// pages/details/detail.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {
    },
  },
  getProduct(productID) {
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productDetail + productID,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            product: result.data.data
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack(),
              2000
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        setTimeout(()=>{
          wx.navigateBack(),
          2000
        })
        console.log('error!');
      }
    });

  },
  buyNow(){
    console.log('buy now!')
    // product 中包含this.data.product 所有属性以及count属性
    let product = Object.assign({
      count: 1
    }, this.data.product)

    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product]
      },
      success: result => {
        console.log(result.data)
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '商品购买成功',
          })
       } else {
          wx.showToast({
            icon: 'none',
            title: '商品购买失败',
          })
        }
      },
      fail: (result) => {
        wx.hideLoading()
        console.log(result)
        wx.showToast({
          icon: 'none',
          title: '商品购买失败',
        })
      }
    })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productID = options.id
    this.getProduct(productID)
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