// pages/details/detail.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    hasComment : true
  },

  // 评论页面入口函数
  onCommentEntry(){
    if(this.data.hasComment)
    {
      let product = this.data.product
      wx.navigateTo({
        url: `/pages/comment/comment?id=${product.id}&price=${product.price}&name=${product.name}&image=${product.image}`,
      })
    }
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
    wx.showLoading({
      title: '商品购买中。。。',
    })
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product],
        isInstantBuy: true
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

 addToTrolley(){
   wx.showLoading({
     title: '添加至购物车中。。。。',
   })
   qcloud.request({
     url: config.service.addToTrolley,
     login: true,
     method: 'PUT',
     data:  this.data.product,
     success: result => {
       wx.hideLoading()
       console.log(result.data)
       let data = result.data
       if (!data.code) {
         wx.showToast({
           title: '添加购物车成功',
         })
       } else {
         wx.showToast({
           icon: 'none',
           title: '添加购物车失败',
         })
       }
     },
     fail: (result) => {
       wx.hideLoading()
       console.log(result)
       wx.showToast({
         icon: 'none',
         title: '添加购物车失败',
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