/**
 * 账户管理－提现
 *
 * @url account/withdraw.action
 *
 */

module.exports = ({ method, query, body }) => {
  switch (method) {
    case "GET":
      return {
        code: 0,
        msg: "",
        info: {
          bankName: "平安银行",
          cardNo: "622*********859",
          userName: "陈",
          mustCount: 18, // 需达到
          betCount: 6.63, // 已投注量
          isAction: 0, // 是否可以提款
          freeCount: 99999, // 免手续费次数
          freeQuota: 1000, // 免手续费额度
          hasCharge: 0, // 是否收取手续费
          rate: 0.001, // 手续费率
          minCost: 100, // 最小提现金额
          limitDepositNum: 3, // 每日提现次数
          remainderNum: 0 //今日剩餘提現次數
        }
      };
    case "POST":
      const rand = Math.random() * 10;
      if (rand > 9) {
        return {
          code: 0,
          msg: "提现成功"
        };
      } else {
        return {
          code: -1,
          msg: "密码错误",
          errorTime: 3
        };
      }
  }
};
