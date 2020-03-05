import { lotteryApi } from 'api';

const TYPE = {
  SIDE_NAV_REQUEST: 'SIDE_NAV_REQUEST',
  SIDE_NAV_SUCCESS: 'SIDE_NAV_SUCCESS',
  SIDE_NAV_FAILURE: 'SIDE_NAV_FAILURE'
}

const state = {
  sideNav: []
}

const getters = {
  sideNav: state => state.sideNav
}

const actions = {
  sideNav({
    commit,
    state,
    rootState
  }) {
    if (!Array.isArray(state.sideNav)) return
    rootState.requesting = true
    commit(TYPE.SIDE_NAV_REQUEST)
    lotteryApi.sideNav().then(response => {
      rootState.requesting = false
      commit(TYPE.SIDE_NAV_SUCCESS, response)
    }, error => {
      rootState.requesting = false
      commit(TYPE.SIDE_NAV_FAILURE)
    })
  }
}

const mutations = {
  [TYPE.SIDE_NAV_REQUEST](state) {

  },
  [TYPE.SIDE_NAV_SUCCESS](state, sideNav) {
    state.sideNav = sideNav
  },
  [TYPE.SIDE_NAV_FAILURE](state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
