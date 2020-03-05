/**
 * 账户管理－今日盈亏(彩票)
 *
 * @url account/todayProfit.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    info: {
      balance: '38920.40', // 余额
      amountProfit: '1.00', // 盈亏总额
      betMoney: '2.00', // 投注
      bonusMoney: '3.00', // 中奖金额
      activity: '4.00', // 活动礼金
      rebate: '5.00', // 返点金额
      recharge: '6.00', // 充值金额
      withdraw: '7.00', // 提现金额
      redPacketOut: '15.00', // 红包支出
      redPacketIn: '10.00', // 红包领取
      redPacketBack: '5.00', // 红包退回
    },
  };
};
