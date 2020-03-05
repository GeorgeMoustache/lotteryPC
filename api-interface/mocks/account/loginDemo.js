/**
 * 账户管理－免费试玩登录
 *
 * @url account/loginDemo.action
 *
 */

module.exports = ({ method, query, body }) => {
  let rand = Math.random() * 10;
  if (rand > 5) {
    return {
      code: 0,
      msg: "超过限制"
    };
  } else {
    return {
      code: -1,
      msg: "超过限制"
    };
  }
};
