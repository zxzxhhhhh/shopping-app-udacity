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
    commentImages: []
  },

  onInput(event){
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },
  //选择图像并上传
  chooseImage() {
    let currentImages = this.data.commentImages
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        currentImages = currentImages.concat(res.tempFilePaths)
        let end = currentImages.length
        let begin = Math.max(end - 3, 0)
        currentImages = currentImages.slice(begin, end)

        this.setData({
          commentImages: currentImages
        })
      },
    })
  },
  //预览选择的图片
  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src

    wx.previewImage({
      current: src,
      urls: this.data.commentImages
    })
  },
  //上传所有文件，并返回所有图像的链接，用两个分号隔开不同图像之间的链接
  uploadImages(cb){
    let commentImages = this.data.commentImages
    let images = [] //存储上传后的返回的图片链接
    console.log(commentImages)
    if (commentImages.length) {
      let length = commentImages.length
      for (let i = 0; i < length; i++) {
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: commentImages[i],
          name: 'file',
          success: res => {
            let data = JSON.parse(res.data)
            console.log(data)
            length--
/**但其实并没有问题，因为JS中的代码存在异步的机制。因为 wx.uploadFile 这个函数执行的速度很慢，所以在循环执行的过程中，循环会先执行 length 次（这个时候 length 没有发生变化），每次循环将对应的 wx.uploadFile 放入到执行队列中（也就是说 wx.uploadFile 里面的代码还没有开始执行）。在这之后，我们才开始一步步处理执行队列中的 wx.uploadFile 函数，而在这一情况下，我们对 length 进行的处理已经影响不到循环执行次数了。* */
            if (!data.code) {
              images.push(data.data.imgUrl)
              console.log("上传成功,并返回了COS链接")
            }

            if (length <= 0) {
              cb && cb(images)
            }
            
          },
          fail: () => {
            length--
            console.log("上传失败")
          }
        })
      }
    }else{
      cb && cb(images)
    }

  },

  addComment(){
    let content = this.data.commentValue
    if(!content)
      return
    wx.showLoading({
      title: '评论上传中。。。',
    })
    this.uploadImages(images=>{
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'PUT',
        data: {
          product_id: this.data.product.id,
          content,
          images
        },
        success: (result) => {
          wx.hideLoading()
          if (!result.data.code) {
            wx.showToast({
              title: '评论成功',
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
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
            title: '评论失败了',
          })
          console.log('error!' + result);
        }
      });
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