import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)


import appConfigStore from './modules/appConfig';
import accountStore from './modules/account';
import wsStore from './modules/ws';

import sideNavStore from './modules/sideNav';
import lotteryListStore from './modules/lotteryList';
import lotteryInfoStore from './modules/lotteryInfo';
import lotteryModeStore from './modules/lotteryMode';
import chaseIssueStore from './modules/chaseIssue';
import countdownStore from './modules/countdown';
import lotteryTrendStore from './modules/lotteryTrend';
import quickBetStore from './modules/quickBet';

import agentRebateStore from './modules/agentRebate';
import promotion from './modules/promotion';
import gapTimeStore from './modules/gapTime';

import chessGamesStore from './modules/chessGames';

const state = {
  requesting: false,
  error: {}
}

const getters = {
  requesting: state => state.requesting,
  error: state => state.error
}

export default new Vuex.Store({
  state,
  getters,
  modules: {
    appConfigStore,
    accountStore,
    wsStore,
    sideNavStore,
    lotteryListStore,
    lotteryInfoStore,
    lotteryModeStore,
    chaseIssueStore,
    countdownStore,
    lotteryTrendStore,
    quickBetStore,
    agentRebateStore,
    promotion,
    gapTimeStore,
    chessGamesStore,
  },
});
