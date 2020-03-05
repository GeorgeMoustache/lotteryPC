/**
 * 代理中心-代理报表
 *
 * @url agent/agencyReport.action?dateType=0&userName=''
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: '0',
    msg: '',
    info: {
      betMoney: '26308458.19', // 投注金额
      bonus: '23804410.29', // 中奖金额
      rechargeMoney: '6579764.85', // 充值金额
      withdrawMoney: '4324469.00', // 提现金额
      activityMoney: '203353.59', // 活动礼金
      teamFanDian: '60322.92', // 团队返点
      teamProfit: '2264845.66', // 团队盈利
      teamBalance: '91938.25', // 团队余额
      betNum: 263850, // 投注人数
      firstChargeNum: 1021, // 首充人数
      registerNum: 4139, // 注册人数
      childUserNum: 15864, // 下级人数
      totalLoseMoney: 123 //扣款统计金额
    },
  };
};
