// pages/add-comment/add-comment.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product : {},
    commentValue: '',
  },

  onInput(event){
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  addComment(){
    let content = this.data.commentValue
    if(!content)
      return
    wx.showLoading({
      title: '评论上传中。。。',
    })
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'PUT',
      data: { 
        product_id: this.data.product.id,
        content: content
       },
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          wx.showToast({
            title: '评论成功',
          })
          setTimeout(()=>{
            wx.navigateBack()
          },1500)
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '评论失败',
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
      name : options.name,
      price : options.price,
      image : options.image
    }

    console.log(product)

    this.setData({
      product
    })
  
  },

})