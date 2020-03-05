/**
 * 账号管理-系统公告／个人消息
 *
 * @url account/message.action?&size=10&current=1&type=1
 * type: [系统公告: 0, 个人消息: 1]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    "list|10": [
      {
        "id|+1": 1,
        date: "@datetime",
        "title|1": [
          "【新增QQ转账充值方式】",
          "新增QQ转账充值方式",
          "【银行转账】",
          "【系统公告】",
          "新增【QQ转账】充值方式！"
        ],
        content:
          "尊敬的会员朋友：新增【QQ转账】的充值方式，请您转账给我司QQ账号后，返回【QQ转账】界面选择“我要提单”，在“验证信息”一栏填写正确的会员账号后，1-3分钟内即可到账！"
      }
    ],
    total: 100, // 数据总数
    current: function () {
      try {
        return +JSON.parse(query).current;
      } catch (e) {
        return 1;
      }
    }, // 当前页码
    size: function () {
      try {
        return +JSON.parse(query).size;
      } catch (e) {
        return 10;
      }
    }, // 每页条数
    noRead: 87
  };
};
