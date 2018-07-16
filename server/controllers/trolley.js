const DB = require('../utils/db.js')

module.exports = {
  add: async ctx => {

    let user = ctx.state.$wxInfo.userinfo.openId
    // 从request 的 body中获取data{product：product：}
    let product = ctx.request.body

    let list = await DB.query("select * from trolley_user where trolley_user.user = ? and trolley_user.id = ?", [user, product.id])

    if (list.length){
      // 已经存在该商品，修改商品数目加一
      let count = list[0].count + 1
      await DB.query('UPDATE trolley_user SET count = ? WHERE trolley_user.id = ? AND trolley_user.user = ?', [count, product.id, user])
    }else{
    // 不存在该商品，插入项目，数量为1
      await DB.query("insert into trolley_user(id, user, count) values (?, ?, ?)", [product.id, user, 1])
    }
  },

  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])
  },

  update: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    // list need to be updated
    let productList = ctx.request.body.list || []

    await DB.query('delete from trolley_user where trolley_user.user = ?', [user])

    let sql = 'insert into trolley_user(id, count, user) values'
    let query = []
    let param = []

    productList.forEach(product=>{

      query.push('(?, ?, ?)')

      param.push(product.id)
      param.push(product.count || 1)
      param.push(product.user)
    })
    await DB.query(sql + query.join(','), param)

    ctx.state.data = {}

  }



}