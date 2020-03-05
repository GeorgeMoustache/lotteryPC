/**
 * 账户管理－取消投注
 * post
 * @url account/cancelBet.action?id=[1,2,3]
 *
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    "code|1": [0, -1],
    msg: function() {
      if (this.code == -1) {
        return "已关盘，无法取消";
      } else {
        return "操作成功";
      }
    }
  };
};
