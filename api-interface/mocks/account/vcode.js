/**
 * 账户管理－验证码
 *
 * @url account/vcode.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    vcode: "https://www.baidu.com/img/bd_logo1.png"
  };
};
