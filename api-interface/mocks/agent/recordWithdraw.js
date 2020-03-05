/**
 * 代理中心-提现记录
 *
 * @url agent/recordWithdraw.action?userName=''&type=0&betweenDays=0&current=1&size=20
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
        bankName: "建设银行",
        bankCardNo: 6236623662366236,
        ownerName: "@cname",
        withdrawMoney: "1000.00",
        addTime: "2018-05-10 19:10:57",
        "state|1": ["处理中", "提现成功", "提现失败"] // 状态
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
