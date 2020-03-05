/**
 * 代理中心-下级开户
 *
 * @url agent/setInviteUrl.action
 * userType：[1:代理, 0:玩家]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: "邀请码已生成，请点击邀请码管理进行查询·"
  };
};
