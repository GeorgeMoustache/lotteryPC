import VueCookie from 'vue-cookie';

const KEY = 'quickBet';

const state = {
  quickBet_list: JSON.parse(decodeURIComponent(VueCookie.get(KEY))) || {}
};

// 不可以有相同key的getters
const getters = {
  quickBet_list: state => state.quickBet_list
};

const mutations = {
  quickBet_add(state, { category, selectedList, mode, multiple }) {
    let ss = state.quickBet_list;
    ss[category] = {
      selectedList: selectedList,
      multiple: multiple,
      mode: mode
    };
    VueCookie.set(KEY, encodeURIComponent(JSON.stringify(ss)));
  },
  quickBet_remove(state, { category }) {
    let ss = state.quickBet_list;
    delete ss[category];
    VueCookie.set(KEY, encodeURIComponent(JSON.stringify(ss)));
  }
};

export default {
  state,
  getters,
  mutations
};
