/**
 * ws
 */
import { WS } from '../mutation-types';

const ATTENTION_KEY = 'attention_state';

const state = {
  msg: {},
  chatMsg: {},
  lotteryInfo: {}, //接收開獎結果 2019-10-08 George
};

const getters = {
  [WS.MESSAGE]: state => state.msg,
  [WS.CHAT_MESSAGE]: state => state.chatMsg,
  [WS.LOTTERY_INFO]: state => state.lotteryInfo, //接收開獎結果 2019-10-08 George
};

const mutations = {
  [WS.MESSAGE](state, msg) {
    state.msg = msg;
  },
  [WS.CHAT_MESSAGE](state, msg) {
    state.chatMsg = msg;
  },
  //接收開獎結果 2019-10-08 George
  [WS.LOTTERY_INFO](state, msg) {
    state.lotteryInfo = msg;
  },
};

// async
const actions = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
