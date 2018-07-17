// pages/add-comment/add-comment.js
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