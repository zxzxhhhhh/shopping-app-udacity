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
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },
  //计算总价
  computeTrolleyAccount(trolleyCheckMap, trolleyList){
    let trolleyAccount = 0
    trolleyList.forEach(product=>{
      trolleyAccount = (trolleyCheckMap[product.id]) ? trolleyAccount + product.price * product.count : trolleyAccount
    })
    return trolleyAccount
  },
  // 点击check 单个 相应状态改变
  onTapCheckSingle(event){
    
    let id = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyList = this.data.trolleyList
    let trolleyAccount = this.data.trolleyAccount
    // 此句要放在整个判断数量之前
    trolleyCheckMap[id] = !trolleyCheckMap[id]
    
    //总共商品数量
    let numTotalProduct = trolleyList.length
    //checkmap中 true的数量
    let numCheckedProduct = 0
    trolleyCheckMap.forEach((productChecked)=>{
      numCheckedProduct = productChecked ? numCheckedProduct + 1 : numCheckedProduct
    })

    isTrolleyTotalCheck = (numCheckedProduct === numTotalProduct)? true:false
    console.log(trolleyList, numCheckedProduct)
    trolleyAccount = this.computeTrolleyAccount(trolleyCheckMap, trolleyList )
    this.setData({
      trolleyCheckMap, 
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },

  onTapCheckTotal(){
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let trolleyAccount = this.data.trolleyAccount
    isTrolleyTotalCheck = !isTrolleyTotalCheck

    trolleyList.forEach(product=>{
      trolleyCheckMap[product.id] = isTrolleyTotalCheck
    })
    trolleyAccount = this.computeTrolleyAccount(trolleyCheckMap, trolleyList)
    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },

  // 购物车编辑状态
  onTapTrolleyEdit(){
    let isTrolleyEdit = this.data.isTrolleyEdit

    //  顺序很重要 跟下面语句顺服要是反了 功能就不同乐
    if (isTrolleyEdit)
      this.updateTrolleyList()
   
    this.setData({
      isTrolleyEdit: !isTrolleyEdit
    })

  },

  onTapAdjust(event){
    let dataset = event.currentTarget.dataset
    let adjustType = dataset.type
    let productId = dataset.id

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    let product
    let index

    for (index = 0; index < trolleyList.length; index++) {
      if (trolleyList[index].id == productId){
        product = trolleyList[index]
        break
      }
    }

    if (product)
      if (adjustType == 'add'){
        product.count++
      }
      else if (adjustType == 'minus'){
        if (product.count <= 1) {
          // 商品数量不超过1，点击减号相当于删除
          delete trolleyCheckMap[productId]
          trolleyList.splice(index, 1)
        }else{
          product.count--
        }
      }

    // 调整结算总价
    let trolleyAccount = this.computeTrolleyAccount(trolleyCheckMap, trolleyList)

    this.setData({
      trolleyAccount,
      trolleyList,
      trolleyCheckMap
      
    })

  },

  onTapBuy(){
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    let needToPayProductList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product.id]
    })
    // 请求后台
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: needToPayProductList
      },
      success: result => {
       wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '结算成功',
          })
          //在数据库删除了结算的产品，需要重新获取
          this.getTrolleyList()
          //此处需要同时更新trolleyCheckMap
          needToPayProductList.forEach((product)=>{
            delete trolleyCheckMap[product.id]
          })
          
        } else {
          wx.showToast({
            icon: 'none',
            title: '结算失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '结算失败',
        })
      }
    })
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
  //编辑完购物车后更新数据库数据
  updateTrolleyList(){
    wx.showLoading({
      title: '购物车数据加载中',
    })
    qcloud.request({
      url: config.service.updateTrolleyList,
      login: true,
      method: 'POST',
      data:{ list: this.data.trolleyList},
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          wx.showToast({
            title: '更新购物车成功',
          })
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '更新购物车失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '更新购物车失败',
        })
        console.log('error!');
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onTapLogin(res) {
    app.login({
      success: ({ userInfo})=>{

        this.getTrolleyList()

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
        this.getTrolleyList()
        this.setData({
          userInfo
        })
      }
    })
  },

})