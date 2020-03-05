/**
 * 账号管理-取款纪录
 *
 * @url account/recordWithdraw.action?status=1&size=10&current=1
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "list|10": [
      {
        No: 12018022756645039,
        date: "2018-02-27 10:22:56",
        amount: 333.0,
        "bankName|1": ["中国银行", "中国建设银行"],
        cost: 100,
        "status|1": ["成功", "等待审核", "审核未通过"],
        note: ""
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
