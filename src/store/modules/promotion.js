import { sysApi } from 'api';

const KEY = 'gradeData';

const state = {
  gradeData: JSON.parse(localStorage.getItem(KEY)) || {},
};

const getters = {
  gradeData: state => state.gradeData,
};

const actions = {
  fetchSysPromotion({ commit, state }) {
    return sysApi.promotion().then(res => {
      if (res.code != 0) return;
      commit('storeGradeData', res.data);
      return res.data;
    });
  },
};

const mutations = {
  storeGradeData(state, data) {
    // 计算用户的等级
    const { gradeData } = data;
    const { type = 1 } = gradeData;

    gradeData.type = type || 1;

    // 存储
    localStorage.setItem(KEY, JSON.stringify(gradeData));
    state.gradeData = gradeData;
  },
  changeCanDraw(state, payload) {
    // 存储
    const { gradeData } = state;
    Object.assign(gradeData, payload);

    localStorage.setItem(KEY, JSON.stringify(gradeData));
    state.gradeData = gradeData;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
