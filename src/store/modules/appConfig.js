import { lotteryApi } from 'api';

const TYPE = {
  APPCONFIG_REQUEST: 'APPCONFIG_REQUEST',
  APPCONFIG_SUCCESS: 'APPCONFIG_SUCCESS',
  APPCONFIG_FAILURE: 'APPCONFIG_FAILURE',
};

const state = {
  appConfig: JSON.parse(localStorage.getItem('appConfig')) || {},
};

const getters = {
  appConfig: state => state.appConfig,
};

// async
const actions = {
  appConfig({ commit, state, rootState }) {
    rootState.requesting = true;
    commit(TYPE.APPCONFIG_REQUEST);
    // lotteryApi
    return lotteryApi.config().then(
      data => {
        rootState.requesting = false;
        data.upgradeType = data.upgradeType || '投注';
        commit(TYPE.APPCONFIG_SUCCESS, data);
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.APPCONFIG_FAILURE);
      }
    );
  },
};

const mutations = {
  [TYPE.APPCONFIG_REQUEST](state) {},
  [TYPE.APPCONFIG_SUCCESS](state, data) {
    state.appConfig = data;
    localStorage.setItem('appConfig', JSON.stringify(data));
    data.AppName && (document.title = data.AppName);
  },
  [TYPE.APPCONFIG_FAILURE](state) {},
};

export default {
  state,
  getters,
  actions,
  mutations,
};
