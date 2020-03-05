/**
 * 账户管理－充值状态
 *
 * @url account/depositState.action?orderNo=1232434123
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "orderState|1": 1
  };
};
