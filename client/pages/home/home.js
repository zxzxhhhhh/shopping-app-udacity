// pages/home/home.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表
  },
  getProductList(){
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productList,
      success: (result) => {
        wx.hideLoading()
        if(!result.data.code){
          this.setData({
            productList: result.data.data
          })}
          else{
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

  addToTrolley(event){
    let idx = event.currentTarget.dataset.idx;
    // //console.log(idx)
    // let productList = this.data.productList
    // let product
    // //循环遍历 找到id对应的product 然后传入 api
    // for (let i = 0; i < productList.length; i++)
    //   if (productList[i].id == idx){
    //     product = productList[i]
    //     break;
    //   }
    //console.log(product.id)
    if(idx){
        wx.showLoading({
          title: '添加至购物车中。。。。',
        })
        qcloud.request({
          url: config.service.addToTrolley,
          login: true,
          method: 'PUT',
          data: {id:idx},
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()

  },

})