/**
 * 账户管理－绑定银行卡
 *
 * @url account/bindBank.action
 *
 */

module.exports = ({ method, query, body }) => {
  switch (method) {
    case "POST":
      return {
        code: 0,
        msg: "绑定成功"
      };
  }
};
