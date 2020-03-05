/**
 * 账户管理－登出
 *
 * @url account/logout.action
 *
 */

module.exports = ({ method, query, body }) => {
  switch (method) {
    case "POST":
      return {
        code: 0,
        msg: "登出成功!"
      };
      break;
  }
};
