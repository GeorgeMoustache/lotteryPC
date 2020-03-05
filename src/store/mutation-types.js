// 用户
export const ACCOUNT = {
  // INFO: 'user/info', // 用户信息
  LOGIN: 'login',
  LOGOUT: 'logout',
  CLIENTID: 'clientID', // 用户识别码
  ACCOUNTLIST: 'account/list', // 账号列表
  ACCOUNTINFO: 'account/info', // 账号信息
  BETSTATE: 'betState', // 投注状态
  SET_ROLES: 'set_roles', // 设置角色
  VERSION: 'version',
};

export const WS = {
  MESSAGE: 'websocket/message',
  CHAT_MESSAGE: 'websocket/chat_message',
  LOTTERY_INFO: 'websocket/lottery_info', //接收開獎結果 2019-10-08 George
};
