/**
 * 代理中心-下级报表
 *
 * @url agent/lowerReport.action?type=0
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "list|5-10": [
      {
        userId: 3830828,
        userName: "kufish1", // 账号
        userType: "1级代理", // 用户类型
        betMoney: "2000.00", // 投注金额
        winMoney: "0.00", // 中奖金额
        rebateMoney: "10.00", // 返点金额
        discountMoney: "0.00", // 活动礼金
        betNum: "2", // 投注人数
        profitMoney: "-1990.00", // 盈利
        isAgent: true,
        totalLoseMoney: 123 //扣款统计金额
      }
    ],
    total: 30, // 数据总数
    current: function() {
      try {
        return +JSON.parse(query).current;
      } catch (e) {
        return 1;
      }
    }, // 当前页码
    size: function() {
      try {
        return +JSON.parse(query).size;
      } catch (e) {
        return 10;
      }
    } // 每页条数
  };
};
