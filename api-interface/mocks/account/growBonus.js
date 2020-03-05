/**
 * 账户-领取晋级奖励
 * @url account/growBonus.action
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '晋级奖励已领取', // 成功提示语 必须
  };
};
