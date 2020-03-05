/**
 * 账户管理－登录
 *
 * @url account/login.action
 *
 */

module.exports = ({ method, query, body }) => {
  switch (method) {
    case "POST":
      let rand = Math.random() * 10;
      rand = 2;
      if (rand > 1) {
        return {
          code: 0,
          msg: "登录成功!",
          info: {
            username: "@cname",
            wealth: 16.637
          }
        };
      } else {
        return {
          code: -1,
          msg: "登录失败!"
        };
      }
      break;
  }
};
