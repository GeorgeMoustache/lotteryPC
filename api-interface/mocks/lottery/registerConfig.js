/**
 * 账户管理－注册配置
 *
 * @url lottery/registerConfig.action
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: '',
    isNeedInvite: true, // 是否显示邀请码输入框
    'sysInviteCode|10000-99999': 10000, // 系统邀请码 String
  };
};
