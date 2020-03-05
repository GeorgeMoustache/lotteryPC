import { lotteryApi } from 'api';

const TYPE = {
  CHASE_ISSUE_REQUEST: 'CHASE_ISSUE_REQUEST',
  CHASE_ISSUE_SUCCESS: 'CHASE_ISSUE_SUCCESS',
  CHASE_ISSUE_FAILURE: 'CHASE_ISSUE_FAILURE'
}

const state = {
  chaseList: [],
  ratio: 1
}

const getters = {
  chaseList: state => state.chaseList,
  ratio: state => state.ratio
}

const actions = {
  chaseIssue({
    commit,
    state,
    rootState
  }, payload) {
    rootState.requesting = true
    commit(TYPE.CHASE_ISSUE_REQUEST)
    const parma = {
      params: {
        category: payload.category
      }
    }
    lotteryApi.chaseIssue(parma).then((response) => {
      rootState.requesting = false
      commit(TYPE.CHASE_ISSUE_SUCCESS, response)
    }, (error) => {
      rootState.requesting = false
      commit(TYPE.CHASE_ISSUE_FAILURE)
    })
  }
}

const mutations = {
  [TYPE.CHASE_ISSUE_REQUEST](state) {

  },
  [TYPE.CHASE_ISSUE_SUCCESS](state, data) {
    state.chaseList = data.list.map((item, idx) => {
      let status = idx < 10
      item.ratio = status ? state.ratio : 0
      item.isSelect = status
      return item
    })
  },
  [TYPE.CHASE_ISSUE_FAILURE](state) {

  },
  updateChaseList(state, {
    issue,
    item,
    index,
    ratio
  }) {
    let _ratio = state.ratio
    if (issue != null) { // change issue
      state.chaseList = state.chaseList.map((item, idx) => {
        let status = idx < issue
        item.ratio = status ? _ratio : 0
        item.isSelect = status
        return item
      })
    } else if (index != null) { // change item checkbox
      let status = item.isSelect
      item.ratio = status ? _ratio : 0
      state.chaseList.splice(index, 1, item)
    } else if (ratio != null) { // change item ratio
      state.ratio = ratio
      state.chaseList = state.chaseList.map((item, idx) => {
        item.ratio = item.isSelect ? ratio : 0
        return item
      })
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
