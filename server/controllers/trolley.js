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
  }



}