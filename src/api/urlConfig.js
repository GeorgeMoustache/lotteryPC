const serverRoot = '/api';

export const vcode = '/api/account/vcode.action';

export const account = {
  autologin: serverRoot + '/account/autologin.action',
  login: serverRoot + '/account/login.action',
  loginDemoId: serverRoot + '/account/loginDemoId.action',
  loginDemo: serverRoot + '/account/loginDemo.action',
  checkUser: serverRoot + '/account/checkUser.action',
  logout: serverRoot + '/account/logout.action',
  register: serverRoot + '/account/register.action',
  info: serverRoot + '/account/info.action',
  updateUserInfo: serverRoot + '/account/updInfo.action',
  submitBet: serverRoot + '/account/submitBet.action',
  cancelBet: serverRoot + '/account/cancelBet.action',
  payType: serverRoot + '/account/payType.action',
  payTypeBoMao: serverRoot + '/account/payTypeBoMao.action', //博貓暫時使用 api
  deposit: serverRoot + '/account/deposit.action',
  depositQuick: serverRoot + '/account/depositQuick.action',
  depositState: serverRoot + '/account/depositState.action',
  withdraw: serverRoot + '/account/withdraw.action',
  bindBank: serverRoot + '/account/bindBank.action',
  resetLoginPasswd: serverRoot + '/account/resetLoginPasswd.action',
  resetWithdrawPasswd: serverRoot + '/account/resetWithdrawPasswd.action',
  message: serverRoot + '/account/message.action',
  clearMessage: serverRoot + '/account/clearMsgNoRead.action',
  todayProfit: serverRoot + '/account/todayProfit.action', //今日盈虧(彩票)
  todayProfitGame: serverRoot + '/game/todayProfit.action?thirdPartyId=', //今日盈虧(第三方)
  growBonus: serverRoot + '/account/growBonus.action',
  userMsg: serverRoot + '/account/userMsg.action',
  markRead: serverRoot + '/account/markRead.action',

  // -------------- 第三方平台相关
  transfer: serverRoot + '/gameBoy/transfer.action', //额度转换
  oneClickToPlat: serverRoot + '/game/oneClickToPlat.action', //一键返回账户
  getBalance: serverRoot + '/gameBoy/getBalance.action', //讀取餘額
  chkTestAccount: serverRoot + '/game/status.action', //確認是否測試帳戶，並取得配置信息

  // -------------- 博貓版
  regColumnList: serverRoot + '/account/RegColumnList.action', //註冊配置欄位
};

export const agent = {
  agencyReport: serverRoot + '/agent/agencyReport.action',
  agencyReportThirdParty: serverRoot + '/game/agencyReport.action', //第三方
  teamReport: serverRoot + '/agent/teamReport.action',
  lowerReport: serverRoot + '/agent/lowerReport.action',
  lowerReportThirdParty: serverRoot + '/game/lowerReport.action', //第三方
  rebate: serverRoot + '/agent/rebate.action',
  setInviteUrl: serverRoot + '/agent/setInviteUrl.action',
  getInviteUrl: serverRoot + '/agent/getInviteUrl.action',
  delInviteUrl: serverRoot + '/agent/delInviteUrl.action',
  rebateInfo: serverRoot + '/agent/rebateInfo.action',
  inviteUrlRemark: serverRoot + '/agent/inviteUrlRemark.action',
  memberList: serverRoot + '/agent/memberList.action',
  recordBet: serverRoot + '/agent/recordBet.action',
  recordBetThirdParty: serverRoot + '/game/recordBet.action', //第三方
  billTypes: serverRoot + '/agent/billTypes.action',
  recordBill: serverRoot + '/agent/recordBill.action',
  recordRecharge: serverRoot + '/agent/recordRecharge.action',
  recordWithdraw: serverRoot + '/agent/recordWithdraw.action',
  rebateDes: serverRoot + '/agent/rebateDes.action',
};

export const record = {
  betList: serverRoot + '/account/recordBet.action',
  todayDetail: serverRoot + '/account/todayDetail.action',
  depositList: serverRoot + '/account/recordDeposit.action',
  withdrawList: serverRoot + '/account/recordWithdraw.action',
  betCostList: serverRoot + '/account/recordBetCost.action',
  dealList: serverRoot + '/account/recordDeal.action',
  transList: serverRoot + '/account/recordTrans.action',
  betRecord: serverRoot + '/game/betRecord.action?thirdPartyId=', //注單記錄
  recordRedpack: serverRoot + '/account/recordRedpack.action', //紅包記錄(領包發包)
};

export const lotteryInfo = {
  main: serverRoot + '/lottery/lotteryInfo.action',
  recently: serverRoot + '/lottery/lotteryRecently.action',
};

export const lottery = {
  config: serverRoot + '/lottery/config.action',
  serverDate: serverRoot + '/lottery/serverDate.action',
  sideNav: serverRoot + '/lottery/sideNav.action',
  list: serverRoot + '/lottery/lotteryList.action',
  mode: serverRoot + '/lottery/lotteryMode.action',
  issue: serverRoot + '/lottery/issue.action',
  chaseIssue: serverRoot + '/lottery/chaseIssue.action',
  trend: serverRoot + '/lottery/trend.action',
  drawNotice: serverRoot + '/lottery/drawNotice.action',
  drawDetail: serverRoot + '/lottery/drawDetail.action',
  gradeList: serverRoot + '/lottery/gradeList.action',
  gradeList: serverRoot + '/lottery/gradeList.action',
  registerConfig: serverRoot + '/lottery/registerConfig.action',
  allLottery: serverRoot + '/lottery/allLottery.action',
  lotteryGroupList: serverRoot + '/lottery/lotteryGroupList.action',
  hots: serverRoot + '/lottery/hotLotteryList.action',
};

export const news = {
  banner: serverRoot + '/news/banner.action',
  notice: serverRoot + '/news/notice.action',
  noticeDetail: serverRoot + '/news/noticeDetail.action',
  system: serverRoot + '/news/system.action',
  help: serverRoot + '/news/help.action',
  prizeList: serverRoot + '/news/prizeList.action',
  list: serverRoot + '/news/list.action',
  detail: serverRoot + '/news/detail.action',
  copy: serverRoot + '/news/copy.action',
  promotion: serverRoot + '/news/promotion.action',
};

export const sys = {
  promotion: serverRoot + '/sys/promotion.action',
};

export const redRain = {
  // 基本信息
  info: serverRoot + '/redrain/info.action',
  // 中奖列表
  userRedRain: serverRoot + '/redrain/userRedRain.action',
  // 获取红包次数
  getRedRain: serverRoot + '/redrain/getRedRain.action',
  // 抢红包
  grabRedRain: serverRoot + '/redrain/grabRedRain.action',
};

export const gameBoy = {
  thirdPartyList: serverRoot + '/game/thirdPartyList.action',
  allGame: serverRoot + '/game/allGame.action',
  gameList: serverRoot + '/game/list.action',
  play: serverRoot + '/gameBoy/play.action',
};

export const chat = {
  history: '/webchat/api/chat/history',
  sendMessage: '/webchat/api/message/send',
  sendRedpack: '/webchat/api/packet/send',
  getRedpack: '/webchat/api/packet/grad/',
  viewRedpack: '/webchat/api/packet/info/',
  upload: '/webchat/api/image/upload',
  identityCheck: '/webchat/api/user/identity/check',
  userInfo: '/webchat/api/user/info/',
  follow: '/webchat/api/attention/follow/',
  cancelFollow: '/webchat/api/attention/cancel/',
  watchList: '/webchat/api/attention/watchlist',
  banned: '/webchat/api/talk/banned/',
  deleteMessage: '/webchat/api/message/retract/',
  shareProfit: serverRoot + '/share/todayRecord.action',
  shareBet: serverRoot + '/share/betOrder.action',
  sharePlan: serverRoot + '/share/publishPlan.action',
  followBet: serverRoot + '/share/followBet.action',
};

//聊天室本地測試用
// export const chat = {
//   history: serverRoot + '/chatRoom/history',
//   sendRedpack: serverRoot + '/chatRoom/packet/send',
//   getRedpack: serverRoot + '/chatRoom/packet/grad/',
//   viewRedpack: serverRoot + '/chatRoom/packet/info/',
//   identityCheck: serverRoot + '/chatRoom/check',
// };
