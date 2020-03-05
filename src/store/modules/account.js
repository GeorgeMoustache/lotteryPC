import { accountApi } from 'api';
import { ACCOUNT } from '../mutation-types';

const TYPE = {
  ACCOUNT_REQUEST: 'ACCOUNT_REQUEST',
  ACCOUNT_SUCCESS: 'ACCOUNT_SUCCESS',
  ACCOUNT_FAILURE: 'ACCOUNT_FAILURE',
};


const state = {
  clientID: (() => {
    let value = localStorage.getItem('clientID');
    if (value == null) {
      value = guid();
      localStorage.setItem('clientID', value);
      return value;
    } else {
      return value + '-' + new Date().getTime();
    }
  })(),
  accountList: JSON.parse(localStorage.getItem('accountList')) || [],
  accountInfo: {},
  betState: false,
  role: '',
};

// 不可以有相同key的getters
const getters = {
  [ACCOUNT.CLIENTID]: state => state.clientID,
  [ACCOUNT.ACCOUNTLIST]: state => state.accountList,
  [ACCOUNT.ACCOUNTINFO]: state => state.accountInfo,
  [ACCOUNT.BETSTATE]: state => state.betState,
  role: state => state.role,
};

const actions = {
  // 登录
  login({ commit, state, rootState }, payload) {
    rootState.requesting = true;
    commit(TYPE.ACCOUNT_REQUEST);
    return accountApi.login(payload).then(
      data => {
        rootState.requesting = false;
        if (data.code == 0) {
          commit(ACCOUNT.ACCOUNTINFO, data.info);
          commit(ACCOUNT.SET_ROLES, data.info);
        }
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);
      }
    );
  },
  // 登出
  logout({ commit, state, rootState }, payload = {}) {
    rootState.requesting = true;
    commit(TYPE.ACCOUNT_REQUEST);
    accountApi.logout().then(
      response => {
        rootState.requesting = false;
        commit(ACCOUNT.LOGOUT, payload);
        commit(ACCOUNT.SET_ROLES, '');
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);
      }
    );
  },
  // 注册
  register({ commit, state, rootState }, payload) {
    rootState.requesting = true;
    commit(TYPE.ACCOUNT_REQUEST);
    return accountApi.register(payload).then(
      data => {
        rootState.requesting = false;
        localStorage.removeItem('agentRebate'); // fix
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);
      }
    );
  },
  // 更新账户信息
  accountInfo({ commit, state, rootState }) {
    return accountApi
      .autologin()
      .then(data => {
        return Promise[data.code == 0 ? 'resolve' : 'reject'](data);
      })
      .then(() => {
        rootState.requesting = true;
        commit(TYPE.ACCOUNT_REQUEST);

        return accountApi.info().then(data => {
          rootState.requesting = false;
          if (data.code == 0) {
            commit(ACCOUNT.ACCOUNTINFO, data.info);
            commit(ACCOUNT.SET_ROLES, data.info);
          }
          return state.role;
        });
      })
      .catch(() => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);

        commit(ACCOUNT.SET_ROLES, {});
        return state.role;
      });
  },
  // 投注
  submitBet({ commit, state, rootState }, payload) {
    rootState.requesting = true;
    commit(TYPE.ACCOUNT_REQUEST);
    return accountApi.submitBet(payload).then(
      data => {
        rootState.requesting = false;
        if (data.code == 0) commit(ACCOUNT.BETSTATE);
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);
        return error;
      }
    );
  },
  // 撤单
  cancelBet({ commit, state, rootState }, payload) {
    rootState.requesting = true;
    commit(TYPE.ACCOUNT_REQUEST);
    return accountApi.cancelBet(payload).then(
      data => {
        rootState.requesting = false;
        if (data.code == 0) commit(ACCOUNT.BETSTATE);
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.ACCOUNT_FAILURE);
        return error;
      }
    );
  },
};

const mutations = {
  [TYPE.ACCOUNT_REQUEST](state) {},
  [TYPE.ACCOUNT_FAILURE](state) {},
  [ACCOUNT.LOGOUT](state, payload) {
    state.accountInfo = {};
    localStorage.removeItem('clientID');
    localStorage.removeItem('agentRebate');

    state.role = '';

    if (payload && payload.isReload) location.reload();
  },
  [ACCOUNT.SET_ROLES](state, data) {
    // 清除
    if (data == '') return (state.role = '');

    let { username, userType } = data;
    // 用户角色
    let role = '';
    if (username == null) {
      role = 'visitor'; // 未登录
    } else {
      if (username.substring(0, 5) == 'Guest') {
        role = 'guest'; // 试玩账号
      } else if (userType && ~userType.indexOf('代理')) {
        role = 'agent'; // 代理
      } else {
        role = 'admin'; // 玩家
      }
    }
    state.role = role;
  },
  [ACCOUNT.ACCOUNTINFO](state, info) {
    let { username, userType } = info;
    state.accountInfo = Object.assign({}, info);

    // update accountList
    if (state.accountList.find(item => item == username)) return;
    state.accountList.unshift(username);
    state.accountList.splice(5);
    localStorage.setItem('accountList', JSON.stringify(state.accountList));
  },
  [ACCOUNT.BETSTATE](state) {
    state.betState = !state.betState;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replace(/-/g, '')
    .toUpperCase();
}
