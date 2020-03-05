/**
 * 账户管理－修改取款密码
 *
 * @url account/resetWithdrawPasswd.action
 *
 */

module.exports = ({ method, query, body }) => {
  let rand = Math.random() * 10;
  rand = 10;
  if (rand > 9) {
    return {
      code: 0,
      msg: "重置密码成功"
    };
  } else {
    return {
      code: -1,
      msg: "密码错误",
      errorTime: 3
    };
  }
};
