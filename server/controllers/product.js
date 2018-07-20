const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM product;")
  },
  detail: async ctx => {
    let productID = + ctx.params.id
    let product
    if (!isNaN(productID)){
      //这个数组只可能有一个元素 添上 [0]，获取数组的第一个项
      product = (await DB.query("SELECT * FROM product where product.id=?;", [productID]))[0]
    }else{
      product = {}
    }
    product.commentCount = (await DB.query('SELECT COUNT(id) AS comment_count FROM comment WHERE comment.product_id = ?', [productID]))[0].comment_count || 0
    product.firstComment = (await DB.query('SELECT * FROM comment WHERE comment.product_id = ? LIMIT 1 OFFSET 0', [productID]))[0] || null

    ctx.state.data = product
  }
  
}