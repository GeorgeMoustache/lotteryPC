import { agentApi } from 'api';

const TYPE = {
  REBATE_REQUEST: 'REBATE_REQUEST',
  REBATE_SUCCESS: 'REBATE_SUCCESS',
  REBATE_FAILURE: 'REBATE_FAILURE'
};
const KEY = 'agentRebate';

const state = {
  agentRebate: JSON.parse(localStorage.getItem(KEY)) || []
};

const getters = {
  agentRebate: state => state.agentRebate
};

// async
const actions = {
  fetchAgentRebate({ commit, state, rootState }) {
    rootState.requesting = true;
    commit(TYPE.REBATE_REQUEST);
    // agentApi
    agentApi.rebate().then(
      data => {
        rootState.requesting = false;
        commit(TYPE.REBATE_SUCCESS, data);
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.REBATE_FAILURE);
      }
    );
  }
};

const mutations = {
  [TYPE.REBATE_REQUEST](state) {},
  [TYPE.REBATE_SUCCESS](state, data) {
    state.agentRebate = data.list;
    localStorage.setItem(KEY, JSON.stringify(data.list));
  },
  [TYPE.REBATE_FAILURE](state) {}
};

export default {
  state,
  getters,
  actions,
  mutations
};
