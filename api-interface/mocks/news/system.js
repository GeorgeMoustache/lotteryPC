/**
 * 系统公告
 *
 * @url news/system.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "",
    notice:
      "尊敬的会员朋友：新增【QQ转账】的充值方式，请您转账给我司QQ账号后，返回【QQ转账】界面选择“我要提单”，在“验证信息”一栏填写正确的会员账号后，1-3分钟内即可到账！"
  };
};
