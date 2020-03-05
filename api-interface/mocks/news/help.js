/**
 * 新闻资讯-新手帮助
 *
 * @url news/help.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    list: [
      {
        id: 1,
        title: "如何注册成为彩票会员？"
      },
      {
        id: 2,
        title: "忘记登录密码了怎么办？"
      },
      {
        id: 3,
        title: "在彩宝彩票充值要手续费吗？"
      }
    ]
  };
};
