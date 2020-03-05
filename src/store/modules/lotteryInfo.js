import { lotteryInfoApi } from 'api';

const TYPE = {
  LOTTERY_INFO_REQUEST: 'LOTTERY_INFO_REQUEST',
  LOTTERY_INFO_SUCCESS: 'LOTTERY_INFO_SUCCESS',
  LOTTERY_INFO_FAILURE: 'LOTTERY_INFO_FAILURE'
}

const state = {
  lotteryInfo: {},
  cacheInfo: {}
}

const getters = {
  lotteryInfo: state => state.lotteryInfo
}

const actions = {
  lotteryInfo({
    commit,
    state,
    rootState
  }, payload) {
    const category = payload.category
    let info = state.cacheInfo[category]
    if (info) {
      state.lotteryInfo = {
        alias: info.alias,
        icon: info.icon,
        label: info.label,
        totalIssue: info.totalIssue
      }
    }

    rootState.requesting = true
    commit(TYPE.LOTTERY_INFO_REQUEST)

    const params = {
      params: {
        category: category
      }
    }
    return fetch(params).then(response => {
      rootState.requesting = false
      let code = response.some(el => el.code != 0)
      if (code) {
        rootState.error = '数据获取失败'
        return {
          code: -1
        }
      }
      let data = response.reduce((pre, el) => {
        return Object.assign(pre, el.info)
      }, {})
      commit(TYPE.LOTTERY_INFO_SUCCESS, {
        key: category,
        value: data
      })
      return data
    }, error => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_INFO_FAILURE)
    })
  },
  refreshInfo({
    commit,
    state,
    rootState
  }, payload) {

    rootState.requesting = true
    commit(TYPE.LOTTERY_INFO_REQUEST)

    const category = payload.category
    const params = {
      params: {
        category: category
      }
    }
    return lotteryInfoApi.recently(params).then(data => {
      rootState.requesting = false
      if (data.code != 0) {
        rootState.error = '数据获取失败'
        return data
      }
      commit(TYPE.LOTTERY_INFO_SUCCESS, {
        key: category,
        value: data,
        update: true
      })
    }, error => {
      rootState.requesting = false
      commit(TYPE.LOTTERY_INFO_FAILURE)
    })
  }
}

// axios.all
function fetch(params) {
  return Promise.all([lotteryInfoApi.main(params), lotteryInfoApi.recently(params)])
}

const mutations = {
  [TYPE.LOTTERY_INFO_REQUEST](state) {

  },
  [TYPE.LOTTERY_INFO_SUCCESS](state, {
    key,
    value,
    update
  }) {
    let result = value
    if (update) result = Object.assign(state.lotteryInfo, value.info)
    state.lotteryInfo = result
    state.cacheInfo[key] = result
  },
  [TYPE.LOTTERY_INFO_FAILURE](state) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
