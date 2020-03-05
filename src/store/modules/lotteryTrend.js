import { lotteryApi } from 'api';

const TYPE = {
  LOTTERY_TREND_REQUEST: 'LOTTERY_TREND_REQUEST',
  LOTTERY_TREND_SUCCESS: 'LOTTERY_TREND_SUCCESS',
  LOTTERY_TREND_FAILURE: 'LOTTERY_TREND_FAILURE'
}

const state = {
  trendData: {}
}

const getters = {
  trendData: state => state.trendData
}

const actions = {
  trendData({
    commit,
    state,
    rootState
  }, payload) {
    rootState.requesting = true
    commit(TYPE.LOTTERY_TREND_REQUEST)
    const params = {
      params: {
        category: payload.category,
        limit: payload.limit
      }
    }
    return lotteryApi.trend(params).then(data => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_TREND_SUCCESS, data)
      return data
    }, error => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_TREND_FAILURE)
    })
  }
}

const mutations = {
  [TYPE.LOTTERY_TREND_REQUEST](state) {

  },
  [TYPE.LOTTERY_TREND_SUCCESS](state, data) {
    state.trendData = data
  },
  [TYPE.LOTTERY_TREND_FAILURE](state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
