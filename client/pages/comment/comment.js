// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    comments:[
      {
        username: "zx1",
        avatar:"../../images/home.png",
        content:"test1",
        create_time:"2011-10"
      },
      {
        username: "zx2",
        avatar: "../../images/home.png",
        content: "test2",
        create_time: "2011-11"
      },

    ]
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
  },

})