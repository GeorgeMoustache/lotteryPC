/**
 * 代理中心-充值记录
 *
 * @url agent/recordRecharge.action?userName=''&type=0&betweenDays=0&current=1&size=20
 * betweenDays: [0: 今天, 1: 昨天, 7: 七天]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "list|5-20": [
      {
        "id|+1": 2034887268,
        userName: "kufish1",
        addTime: "2018-05-10 19:10:57",
        payMoney: "7.680", // 充值金额
        intoMoney: "7.680", // 到账金额
        payWay: "支付宝", // 充值方式
        "state|1": ["充值中", "充值成功", "充值失败"] // 状态
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
