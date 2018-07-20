// pages/comment/comment.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    comments:[]
  },
  //获取评论详情
  getCommentList(id){
    wx.showLoading({
      title: '评论数据加载中',
    })
    qcloud.request({
      url: config.service.comment,
      login: true,
      method: 'GET',
      data:{
        product_id: id
      },
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            comments: result.data.data
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
    let product = {
      id: options.id,
      name: options.name,
      price: options.price,
      image: options.image
    }

    console.log(product)

    this.setData({
      product
    })

    this.getCommentList(this.data.product.id)
  },

})