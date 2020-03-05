import { lotteryApi } from 'api';

const TYPE = {
  LOTTERY_MODE_REQUEST: 'LOTTERY_MODE_REQUEST',
  LOTTERY_MODE_SUCCESS: 'LOTTERY_MODE_SUCCESS',
  LOTTERY_MODE_FAILURE: 'LOTTERY_MODE_FAILURE'
}

const LOTTERY_MODE_KEY = 'lotteryMode'
const SELECT_MODE_KEY = 'selectMode'

const state = {
  // 更新的问题
  // cacheMode: JSON.parse(localStorage.getItem(LOTTERY_MODE_KEY)) || {},
  cacheMode: {},
  lotteryMode: [],
  selectMode: JSON.parse(localStorage.getItem(SELECT_MODE_KEY)) || {}
}

const getters = {
  lotteryMode: state => state.lotteryMode,
  selectMode: state => state.selectMode
}

const actions = {
	lotteryMode({
		commit,
		state,
		rootState
	}, payload) {
    const category = payload.category
    // TODO:
		// let list = state.cacheMode[category]
		// if (list) {
		// 	return new Promise((resolve, reject) => {
		// 		commit(TYPE.LOTTERY_MODE_SUCCESS, {
		// 			key: category,
		// 			value: list
		// 		})
		// 		resolve(list)
		// 	})
		// }

    // 请求数据
    rootState.requesting = true
    commit(TYPE.LOTTERY_MODE_REQUEST)

		const param = {
      params: payload
		}
		return lotteryApi.mode(param).then(data => {
			rootState.requesting = false
			commit(TYPE.LOTTERY_MODE_SUCCESS, {
				key: category,
				value: data.list
			})
			return data.list
		}, (error) => {
			rootState.requesting = false
			commit(TYPE.LOTTERY_MODE_FAILURE)
		})
	}
}

const mutations = {
  [TYPE.LOTTERY_MODE_REQUEST](state) {

  },
  [TYPE.LOTTERY_MODE_SUCCESS](state, {
    key,
    value
  }) {
    state.lotteryMode = value
    state.cacheMode[key] = value
    // localStorage.setItem(LOTTERY_MODE_KEY, JSON.stringify(state.cacheMode))
  },
  [TYPE.LOTTERY_MODE_FAILURE](state) {

  },
  selectMode(state, {
    category, // 彩种
    mode // 玩法
  }) {
    state.selectMode[category] = mode
    localStorage.setItem(SELECT_MODE_KEY, JSON.stringify(state.selectMode))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
