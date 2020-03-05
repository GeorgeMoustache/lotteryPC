/**
 * 账号管理-今日详情
 *
 * @url account/todayDetail.action
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    info: {
      total: 1000,
      win: 100,
      profit: -100
    }
  };
};
