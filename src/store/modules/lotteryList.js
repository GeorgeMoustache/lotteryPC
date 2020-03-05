import { lotteryApi } from 'api';

const TYPE = {
  LOTTERY_LIST_REQUEST: 'LOTTERY_LIST_REQUEST',
  LOTTERY_LIST_SUCCESS: 'LOTTERY_LIST_SUCCESS',
  LOTTERY_LIST_FAILURE: 'LOTTERY_LIST_FAILURE'
}

const state = {
  lotteryList: []
}

const getters = {
  lotteryList: state => state.lotteryList
}

const actions = {
  lotteryList({
    commit,
    state,
    rootState
  }) {
    rootState.requesting = true
    commit(TYPE.LOTTERY_LIST_REQUEST)
    return lotteryApi.list().then(data => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_LIST_SUCCESS, data)
      return data
    }, error => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_LIST_FAILURE)
    })
  },
  refreshIssue({
    commit,
    state,
    rootState
  }, payload) {
    rootState.requesting = true
    commit(TYPE.LOTTERY_LIST_REQUEST)
    const params = {
      params: {
        category: payload.alias
      }
    }
    return lotteryApi.issue(params).then(data => {
      rootState.requesting = false
      payload.curIssue = data.curIssue
      payload.openIssue = data.openIssue
      payload.openNum = data.openNum
      return data
    }, error => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_LIST_FAILURE)
    })
  }
}

const mutations = {
  [TYPE.LOTTERY_LIST_REQUEST](state) {

  },
  [TYPE.LOTTERY_LIST_SUCCESS](state, lotteryList) {
    state.lotteryList = lotteryList.list
  },
  [TYPE.LOTTERY_LIST_FAILURE](state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
