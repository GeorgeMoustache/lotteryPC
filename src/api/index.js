import * as url from './urlConfig';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15e3;

import Vue from 'vue';
import store from '@/store';
import { Modal, Notice } from 'iview';
import { ACCOUNT } from '@/store/mutation-types';

const md5 = require('md5');
import getjwt from 'utils/buyHelper';

/**
 * poperty {String|Array} 需要md5的属性
 */
function md5Password(payload, poperty = 'password') {
  const params = JSON.parse(JSON.stringify(payload));
  if (typeof poperty == 'string') {
    params[poperty] = md5(params[poperty]);
  } else if (Array.isArray(poperty)) {
    poperty.forEach(p => (params[p] = md5(params[p])));
  }
  return params;
}

// 'recordBet'
// const whiteList = [];
let responseState = '';
let kickAss = false;
let appConfig = JSON.parse(localStorage.getItem('appConfig'));

axios.interceptors.response.use(
  res => {
    const data = res.data;
    const url = res.config.url;

    let curResponse = url + data.code;
    if (curResponse === responseState) return;

    // 多点登录
    if (data.code == 402) {
      responseState = url + data.code;
      logoutHandler(data.msg); //限制多重登入，使用api傳來提示資訊
      kickAss = true;
      return Promise.reject();
    }

    if (kickAss) return;

    // 无权限
    if (data.code == 401) {
      let path = url.match(/\/(\w+)\.action$/);
      path = path && path[1];
      if (path != 'checkUser') {
        responseState = url + data.code;
        logoutHandler();
      }
      return Promise.reject();
    }

    return res;
  },
  err => {
    // Message.destroy();
    if (err.response) {
      const { status } = err.response;
      if (status === 401) {
        logoutHandler();
      } else if (/^50/.test(status)) {
        Notice.warning({ title: '系统提示', desc: '网络开小差～' });
      }
    } else {
      Notice.warning({ title: '系统提示', desc: '网络开小差～' });
    }
    return Promise.reject(err);
  }
);

// 退出登录
function logoutHandler(content) {
  Modal.error({
    title: '系统提示',
    content: content || '您已退出登录或者登录超时,请先登录',
    okText: '重新登录',
    onOk() {
      const role = store.getters.role;
      if (role == '' || role == 'visitor') {
        if (/login/.test(location.href)) return;
        //針對模板 6 被踢特別設定需導向首頁
        if (appConfig.themeName != 'theme6') {
          window.location.replace('/login');
        } else {
          window.location.replace('/');
        }
      }
    },
  });
  store.commit(ACCOUNT.LOGOUT);
}

export const accountApi = {
  //登录
  autologin(params) {
    return axios.post(url.account.autologin, params).then(response => response.data);
  },
  //登录
  login(params) {
    // return axios.post(url.account.login, md5Password(params)).then(response => response.data);
    let form = md5Password(params);
    delete form.passwordCheck;
    return axios.post(url.account.login, form).then(response => response.data);
  },
  // 试玩ID
  loginDemoId() {
    return axios.get(url.account.loginDemoId).then(response => response.data);
  },
  // 试玩登录
  loginDemo(params) {
    return axios.post(url.account.loginDemo, params).then(response => response.data);
  },
  //检测用户
  checkUser() {
    return axios.post(url.account.checkUser).then(response => response.data);
  },
  // 登出
  logout(params) {
    return axios.post(url.account.logout, params).then(response => response.data);
  },
  // 注册
  register(params) {
    let form = md5Password(params);
    delete form.passwordCheck;
    return axios.post(url.account.register, form).then(response => response.data);
  },
  // 可配置注册欄位
  getRegColumnList() {
    return axios.get(url.account.regColumnList).then(response => response.data);
  },
  // 更新账户信息
  info(params) {
    return axios.post(url.account.info, params).then(response => response.data);
  },
  // 更新會員資料
  updateUserInfo(params) {
    return axios.post(url.account.updateUserInfo, params).then(response => response.data);
  },
  // 下注
  submitBet(params) {
    return axios.post(url.account.submitBet, params, getjwt(params, md5)).then(response => response.data);
  },
  // 撤单
  cancelBet(params) {
    return axios.post(url.account.cancelBet, params).then(response => response.data);
  },
  // 付款类型
  payType() {
    return axios.get(url.account.payType).then(response => response.data);
  },
  // 付款类型
  payTypeBoMao() {
    return axios.get(url.account.payTypeBoMao).then(response => response.data);
  },
  // 存款
  deposit(params) {
    return axios.post(url.account.deposit, params).then(response => response.data);
  },
  // 快速存款
  depositQuick(params) {
    return axios.post(url.account.depositQuick, params).then(response => response.data);
  },
  // 存款状态
  depositState(params) {
    return axios.get(url.account.depositState, params).then(response => response.data);
  },
  // 取款
  withdraw(type = 'get', params) {
    let form = params;
    if (type == 'post') {
      form = md5Password(params);
    }
    return axios[type](url.account.withdraw, form).then(response => response.data);
  },
  // 绑定银行卡
  bindBank(params) {
    return axios.post(url.account.bindBank, md5Password(params)).then(response => response.data);
  },
  // 重置登录密码
  resetLoginPasswd(params) {
    const md5Params = md5Password(params, ['old', 'new']);
    return axios.post(url.account.resetLoginPasswd, md5Params).then(response => response.data);
  },
  // 重置取款密码
  resetWithdrawPasswd(params) {
    const md5Params = md5Password(params, ['old', 'new']);
    return axios.post(url.account.resetWithdrawPasswd, md5Params).then(response => response.data);
  },
  // 系统公告／个人消息
  message(params) {
    return axios.post(url.account.message, params).then(response => response.data);
  },
  clearMessage(params) {
    return axios.post(url.account.clearMessage, params).then(response => response.data);
  },
  // 今日盈亏 (彩票)
  todayProfit(params) {
    return axios.post(url.account.todayProfit, params).then(response => response.data);
  },
  // 今日盈亏 (第三方)
  todayProfitGame(params) {
    return axios.post(url.account.todayProfitGame + params).then(response => response.data);
  },
  // 领取晋级奖励
  growBonus() {
    return axios.post(url.account.growBonus).then(response => response.data);
  }, // 用户消息，首页弹窗
  userMsg(params) {
    return axios.post(url.account.userMsg, params).then(response => response.data);
  },
  // 用户消息，保持已读状态
  markRead(params) {
    return axios.post(url.account.markRead, params).then(response => response.data);
  },
  // 提交額度轉換
  transfer(params) {
    return axios.post(url.account.transfer + params).then(response => response.data);
  },
  // 一键归户
  oneClickToPlat(params) {
    return axios.get(url.account.oneClickToPlat, params).then(response => response.data);
  },
  //读取棋牌余额
  getBalance(params) {
    return axios.get(url.account.getBalance, params).then(response => response.data);
  },
  //判斷測試帳號額轉
  chkTestAccount() {
    return axios.get(url.account.chkTestAccount).then(response => response.data);
  },
};

export const agentApi = {
  //代理报表
  agencyReport(params) {
    return axios.get(url.agent.agencyReport, params).then(response => response.data);
  },
  //代理報表(第三方)
  agencyReportThirdParty(params) {
    return axios.get(url.agent.agencyReportThirdParty, params).then(response => response.data);
  },
  //代理报表-彈窗详情
  teamReport(params) {
    return axios.get(url.agent.teamReport, params).then(response => response.data);
  },
  //下级报表
  lowerReport(params) {
    return axios.get(url.agent.lowerReport, params).then(response => response.data);
  },
  //下级报表(第三方)
  lowerReportThirdParty(params) {
    return axios.get(url.agent.lowerReportThirdParty, params).then(response => response.data);
  },
  // 返点
  rebate(params) {
    return axios.get(url.agent.rebate, params).then(response => response.data);
  },
  // 返点
  rebateDes(params) {
    return axios.get(url.agent.rebateDes, params).then(response => response.data);
  },
  // 下级开户
  setInviteUrl(params) {
    return axios.post(url.agent.setInviteUrl, params).then(response => response.data);
  },
  // 邀请码管理
  getInviteUrl(params) {
    return axios.get(url.agent.getInviteUrl, params).then(response => response.data);
  },
  // 删除邀请码
  delInviteUrl(params) {
    return axios.delete(url.agent.delInviteUrl, params).then(response => response.data);
  },
  // 邀请码返点详情
  rebateInfo(params) {
    return axios.get(url.agent.rebateInfo, params).then(response => response.data);
  },
  // 设置备注
  inviteUrlRemark(params) {
    return axios.post(url.agent.inviteUrlRemark, params).then(response => response.data);
  },
  // 会员列表
  memberList(params) {
    return axios.get(url.agent.memberList, params).then(response => response.data);
  },
  // 投注明細
  recordBet(params) {
    return axios.get(url.agent.recordBet, params).then(response => response.data);
  },
  // 投注明細(第三方)
  recordBetThirdParty(params) {
    return axios.get(url.agent.recordBetThirdParty, params).then(response => response.data);
  },
  // 账户明细-类型
  billTypes(params) {
    return axios.get(url.agent.billTypes, params).then(response => response.data);
  },
  // 账户明细
  recordBill(params) {
    return axios.get(url.agent.recordBill, params).then(response => response.data);
  },
  // 充值记录
  recordRecharge(params) {
    return axios.get(url.agent.recordRecharge, params).then(response => response.data);
  },
  // 提现记录
  recordWithdraw(params) {
    return axios.get(url.agent.recordWithdraw, params).then(response => response.data);
  },
};

export const recordApi = {
  // 注單记录 (彩票)
  betList(params) {
    return axios.get(url.record.betList, params).then(response => response.data);
  },
  // 注單记录
  betRecord(params, thirdPartyId) {
    return axios.get(url.record.betRecord + thirdPartyId, params).then(response => response.data);
  },
  // 今日详情
  todayDetail(params) {
    return axios.get(url.record.todayDetail, params).then(response => response.data);
  },
  // 充值记录
  depositList(params) {
    return axios.get(url.record.depositList, params).then(response => response.data);
  },
  // 提款记录
  withdrawList(params) {
    return axios.get(url.record.withdrawList, params).then(response => response.data);
  },
  // 交易明细[全部: 0, 投注消费: 1, 奖金派送: 2]
  dealList(params) {
    return axios.get(url.record.dealList, params).then(response => response.data);
  },
  // 额转记录
  transList(params) {
    return axios.get(url.record.transList, params).then(response => response.data);
  },
  // 紅包記錄 (發包:type=1, 領包:type=2)
  recordRedpack(params) {
    return axios.get(url.record.recordRedpack, params).then(response => response.data);
  },
};

export const lotteryInfoApi = {
  // 获取该彩种信息
  main(params) {
    return axios.get(url.lotteryInfo.main, params).then(response => response.data);
  },
  // 获取最近5期数据
  recently(params) {
    return axios.get(url.lotteryInfo.recently, params).then(response => response.data);
  },
};

export const lotteryApi = {
  // 获取配置文件
  config() {
    return axios.get(url.lottery.config).then(response => response.data);
  },
  // 获取服务器时间
  serverDate() {
    return axios.get(url.lottery.serverDate).then(response => response.data);
  },
  // 获取侧边栏
  sideNav() {
    return axios.get(url.lottery.sideNav).then(response => response.data);
  },
  // 获取所有彩种信息
  list() {
    return axios.get(url.lottery.list).then(response => response.data);
  },
  // 获取彩种的玩法
  mode(params) {
    return axios.get(url.lottery.mode, params).then(response => response.data);
  },
  // 获取彩种追号期数
  chaseIssue(params) {
    return axios.get(url.lottery.chaseIssue, params).then(response => response.data);
  },
  // 获取彩种期数
  issue(params) {
    return axios.get(url.lottery.issue, params).then(response => response.data);
  },
  // 获取彩种走势
  trend(params) {
    return axios.get(url.lottery.trend, params).then(response => response.data);
  },
  // 开奖公告
  drawNotice(params) {
    return axios.get(url.lottery.drawNotice, params).then(response => response.data);
  },
  // 开奖详情
  drawDetail(params) {
    return axios.get(url.lottery.drawDetail, params).then(response => response.data);
  },
  // 晋级奖励说明
  gradeList(params) {
    return axios.get(url.lottery.gradeList, params).then(response => response.data);
  },
  // 注册配置
  registerConfig(params) {
    return axios.get(url.lottery.registerConfig, params).then(response => response.data);
  },
  // 所有包括CT
  allLottery(params) {
    return axios.get(url.lottery.allLottery, params).then(response => response.data);
  },
  // 彩種分類列表
  groupList(params) {
    return axios.get(url.lottery.lotteryGroupList, params).then(response => response.data);
  },
  // 设置的前8个热门推荐彩种
  hots(params) {
    return axios.get(url.lottery.hots, params).then(response => response.data);
  },
};

export const newsApi = {
  // 获取banner
  banner() {
    return axios.get(url.news.banner).then(response => response.data);
  },
  // 网站公告
  notice() {
    return axios.get(url.news.notice).then(response => response.data);
  },
  // 网站公告
  noticeDetail(params) {
    return axios.get(url.news.noticeDetail, params).then(response => response.data);
  },
  // 系统公告
  system() {
    return axios.get(url.news.system).then(response => response.data);
  },
  // 新手帮助
  help() {
    return axios.get(url.news.help).then(response => response.data);
  },
  // 中奖排行榜
  prizeList() {
    return axios.get(url.news.prizeList).then(response => response.data);
  },
  // 新闻列表
  list(params) {
    return axios.get(url.news.list, params).then(response => response.data);
  },
  // 新闻详情
  detail(params) {
    return axios.get(url.news.detail, params).then(response => response.data);
  },
  // 宣传
  promotion() {
    return axios.get(url.news.promotion).then(response => response.data);
  },
};

export const sysApi = {
  // 优惠活动
  promotion() {
    return axios.get(url.sys.promotion).then(response => response.data);
  },
};

export const redRainApi = {
  // 基本信息
  info() {
    return axios.get(url.redRain.info).then(response => response.data);
  },
  // 中奖列表
  userRedRain() {
    return axios.post(url.redRain.userRedRain).then(response => response.data);
  },
  // 获取红包次数
  getRedRain() {
    return axios.post(url.redRain.getRedRain).then(response => response.data);
  },
  // 抢红包
  grabRedRain() {
    return axios.post(url.redRain.grabRedRain).then(response => response.data);
  },
};

// 第三方平台获取数据顺序：thirdPartyList > allGame > gameList
export const gameBoyApi = {
  // 获取游戏大类
  thirdPartyList(params) {
    return axios.get(url.gameBoy.thirdPartyList, params).then(response => response.data);
  },
  // 获取某游戏大类下的平台列表
  allGame(params) {
    return axios.get(url.gameBoy.allGame, params).then(response => response.data);
  },
  // 获取某平台下的所有游戏
  gameList(params) {
    return axios.get(url.gameBoy.gameList, params).then(response => response.data);
  },
  // 取得进入游戏链接
  play(params) {
    return axios.get(url.gameBoy.play, params).then(response => response.data);
  },
};

//聊天室
export const chatApi = {
  //驗證身份
  identityCheck() {
    return axios.post(url.chat.identityCheck).then(response => response.data);
  },
  //歷史記錄
  history(params) {
    return axios.post(url.chat.history, params).then(response => response.data);
  },
  //送出訊息
  sendMessage(params) {
    return axios.post(url.chat.sendMessage, params).then(response => response.data);
  },
  //送出紅包
  sendRedpack(params) {
    return axios.post(url.chat.sendRedpack, params).then(response => response.data);
  },
  //搶紅包
  getRedpack(id, params) {
    return axios.post(url.chat.getRedpack + id, params).then(response => response.data);
  },
  viewRedpack(redId, params) {
    return axios.post(url.chat.viewRedpack + redId, params).then(response => response.data);
  },
  //上傳圖片
  upload(params) {
    return axios.post(url.chat.upload, params).then(response => response.data);
  },
  //用戶資訊
  userInfo(params) {
    return axios.get(url.chat.userInfo + params).then(response => response.data);
  },
  //關注用戶
  follow(params) {
    return axios.post(url.chat.follow + params).then(response => response.data);
  },
  //取消關注用戶
  cancelFollow(params) {
    return axios.post(url.chat.cancelFollow + params).then(response => response.data);
  },
  //關注用戶清單
  watchList() {
    return axios.post(url.chat.watchList).then(response => response.data);
  },
  //禁言
  banned(uid, params) {
    return axios.post(url.chat.banned + uid, params).then(response => response.data);
  },
  //刪除訊息
  deleteMessage(msgId, params) {
    return axios.post(url.chat.deleteMessage + msgId, params).then(response => response.data);
  },
  //分享戰績
  shareProfit(params) {
    return axios.post(url.chat.shareProfit, params).then(response => response.data);
  },
  //分享注單
  shareBet(params) {
    return axios.post(url.chat.shareBet, params).then(response => response.data);
  },
  //分享計劃
  sharePlan(params) {
    return axios.post(url.chat.sharePlan, params).then(response => response.data);
  },
  //跟投
  followBet(params) {
    return axios.post(url.chat.followBet, params, getjwt(params, md5)).then(response => response.data);
  },
};
