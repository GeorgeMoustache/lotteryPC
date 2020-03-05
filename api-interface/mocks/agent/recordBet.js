/**
 * 代理中心 - 投注明细
 *
 * @url agent/recordBet.action?current=1&size=20&userName=1111&category=all&betweenDays=0&state=0
 * state: [1:待开奖, 2:未中奖, 3:中奖, 4:进行中, 5:已结束, 6:已停止, 7:已取消]
 * betweenDays: [0: 今天, 1: 昨天, 7: 七天]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "list|10": [
      {
        "id|+1": 1,
        no: 2018013189265557, // 注单号
        username: "kufish",
        date: "2018-01-31 13:37:36",
        category: "BJPK10",
        categoryLabel: "三分时时彩",
        "issue|1": [201804200321, 20180420107, 107160],
        modeLabel: "五星直选/直选复式",
        openNum: "03,01,06,09,10,04,08,02,07,05", // 开奖号码
        "state|1": [1, 2, 3], // 状态
        betNum:
          "01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910",
        price: 0.01,
        count: 1, // 投注注数
        cost: 0.03, // 投注总额
        win: 0.01, // 中奖金额
        profit: -0.02 // 盈亏
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
