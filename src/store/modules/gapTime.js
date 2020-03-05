// 六合开盘间隔
const KEY = 'audio_play';

const state = {
  audio_play: (() => {
    let value = localStorage.getItem(KEY);
    return value == null ? 1 : +value;
  })(), // 是否开启声音提示
  gapTime: '2019-01-01 00:00:00',
  isHK6Disabled: true,
};

const getters = {
  audio_play: state => state.audio_play,
  gapTime: state => state.gapTime,
  isHK6Disabled: state => state.isHK6Disabled,
};

const actions = {};

const mutations = {
  setPlayState(state, value) {
    state.audio_play = value;
    localStorage.setItem(KEY, value);
  },
  // 获取HK6是否禁用
  getGapTime(state, { category, countdown }) {
    let disabled = true;
    // 前缀单个字母（BHKSIX、HKSIX）
    if (/^\w?HKSIX$/.test(category)) {
      let { lastEndTime, endTime } = countdown;
      lastEndTime = lastEndTime.replace(/-/g, '/');
      endTime = endTime.replace(/-/g, '/');
      const nowTime = new Date().setMilliseconds(window.diffTime);
      let gapDate = null; // 间隔时间
      const GAP = 6e5;
      // 判断距离上一期封盘时间
      const time_last = new Date(lastEndTime).getTime();
      const diff_last = nowTime - time_last;
      // 判断距离当前期封盘时间
      const time_end = new Date(endTime).getTime();
      const diff_cur = nowTime - time_end;
      if (0 <= diff_last && diff_last <= GAP) {
        gapDate = lastEndTime;
      } else if (0 <= diff_cur && diff_cur <= GAP) {
        gapDate = endTime;
      }
      if (gapDate) {
        state.gapTime = new Date(gapDate).addMinutes(10).Format('yyyy-MM-dd HH:mm:ss');
        disabled = true;
      } else {
        disabled = false;
      }
    } else {
      disabled = false;
    }
    state.isHK6Disabled = disabled;
  },
  gapFinish(state) {
    state.isHK6Disabled = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
