import { lotteryApi } from 'api';

const state = {};

const LIST = {
  CQSSC: {
    timestamp: [],
    getTimestamp: function() {
      let a = createPoint('00:28:00', 9, 20);
      let b = createPoint('07:28:00', 50, 20);
      return a.concat(b);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:48:00');
    },
  },
  YFSSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:00:50', 24 * 60, 1);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:50');
    },
  },
  // 谷歌 90s
  GGSSC: {
    timestamp: [],
    getTimestamp: function() {
      // (24 * 60) / 1.5
      return createPoint('00:01:20', 960, 1.5);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:50');
    },
  },
  EFSSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:00:50', 24 * 30, 2);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:50');
    },
  },
  SFSSC: {
    timestamp: [],
    getTimestamp: function() {
      let a = createPoint('00:02:30', (6 * 60) / 3, 3);
      let b = createPoint('09:02:30', (15 * 60) / 3, 3);
      return a.concat(b);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:30');
    },
  },
  WFSSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:04:30', 24 * 12, 5);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:30');
    },
  },
  // 179 5分时时彩
  WF179SSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:04:30', 179, 5);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:54:30');
    },
  },
  XJSSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('10:18:00', 48, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:00');
    },
  },
  TJSSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:18:00', 42, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:58:00');
    },
  },
  // 河内分分彩（整点封盘）
  HENEISSC: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:00:59', 24 * 60, 1);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:59');
    },
  },
  BJPK10: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:28:00', 44, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:48:00');
    },
  },
  GD11X5: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:28:00', 42, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:08:00');
    },
  },
  HKSIX: {
    timestamp: null,
    getEndTime: function() {
      let dataStr = this.timestamp;
      const startTime = new Date().setMilliseconds(window.diffTime);
      if (dataStr != null && new Date(dataStr).getTime() >= startTime) return dataStr;
      return lotteryApi.issue({ params: { category: 'HKSIX' } }).then(data => {
        if (data.code != 0) return;
        this.timestamp = data.endTime.replace(/-/g, '/');
        return data;
      });
    },
  },
  BJ28: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:03:50', 179, 5);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:53:50');
    },
  },
  JND28: {
    timestamp: null,
    getEndTime: function() {
      let dataStr = this.timestamp;
      const startTime = new Date().setMilliseconds(window.diffTime);
      if (dataStr != null && new Date(dataStr).getTime() >= startTime) return dataStr;
      return lotteryApi.issue({ params: { category: 'JND28' } }).then(data => {
        const { code, endTime } = data;
        if (code != 0 || endTime == null) return;
        this.timestamp = endTime.replace(/-/g, '/');
        return data;
      });
    },
  },
  AHK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:58:00', 40, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '21:58:00');
    },
  },
  JXK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:13:00', 42, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:53:00');
    },
  },
  JSK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:48:00', 41, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:08:00');
    },
  },
  BJK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:18:00', 44, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:38:00');
    },
  },
  GXK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:28:00', 40, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:28:00');
    },
  },
  HEBK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:55:00', 41, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:15:00');
    },
  },
  HBK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:18:00', 39, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '21:58:00');
    },
  },
  GSK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('10:18:00', 36, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '21:58:00');
    },
  },
  SHK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:56:00', 41, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:16:00');
    },
  },
  JLK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:27:00', 87, 10);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:47:00');
    },
  },
  WFK3: {
    timestamp: [],
    getTimestamp: function() {
      let a = createPoint('00:04:30', 72, 5);
      let b = createPoint('09:04:30', 180, 5);
      return a.concat(b);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:30');
    },
  },
  YFK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:29:50', 1051, 1);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:50');
    },
  },
  // 三分快3
  SFK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:02:30', 480, 3);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:59:30');
    },
  },
  // 十分快3(SH=>10)
  SHFK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:08:30', 144, 10);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:30');
    },
  },
  // 天津快3
  TJK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:56:00', 46, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:56:00');
    },
  },
  // 福建
  FJK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('08:49:00', 42, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:29:00');
    },
  },
  // 贵州
  GZK3: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('09:29:00', 39, 20);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '22:09:00');
    },
  },
  // 五分快艇
  WFFT: {
    timestamp: [],
    getTimestamp: function() {
      let a = createPoint('13:08:20', 11 * 12 - 1, 5);
      let b = createPoint('00:03:20', 49, 5);
      return a.concat(b);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:20');
    },
  },
  // 五分快艇
  XTWFFT: {
    timestamp: [],
    getTimestamp: function() {
      let a = createPoint('13:08:50', 11 * 12 - 1, 5);
      let b = createPoint('00:03:50', 49, 5);
      return a.concat(b);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:50');
    },
  },
  // 澳洲幸运PK10
  AZXYPK10: {
    timestamp: [],
    getTimestamp: function() {
      return createPoint('00:03:35', 24 * 12, 5);
    },
    getEndTime: function() {
      return endTimeHelper.call(this, '23:58:35');
    },
  },
};

// 不同赔率的HK
LIST.BHKSIX = Object.assign({}, LIST.HKSIX);

// 新疆、海南、山西、辽宁、四川
LIST.XJK3 = Object.assign({}, LIST.TJK3);
LIST.HNK3 = Object.assign({}, LIST.TJK3);
LIST.SXK3 = Object.assign({}, LIST.TJK3);
LIST.LNK3 = Object.assign({}, LIST.TJK3);
LIST.SCK3 = Object.assign({}, LIST.TJK3);

// 一分／极速飞艇(PK10)
LIST.JSPK10 = Object.assign({}, LIST.YFSSC);
LIST.YFPK10 = Object.assign({}, LIST.YFSSC);
LIST.YFHKSIX = Object.assign({}, LIST.YFSSC);
LIST.QQSSC = Object.assign({}, LIST.YFSSC); // QQ分分彩
LIST.QIQUSSC = Object.assign({}, LIST.YFSSC); // 奇趣分分彩
// 一分／28
LIST.YF28 = Object.assign({}, LIST.YFK3);

// 1.5分／
LIST.JNDSSC = Object.assign({}, LIST.GGSSC); // 加拿大
LIST.ELSSSC = Object.assign({}, LIST.GGSSC); // 俄罗斯
LIST.BHDSSC = Object.assign({}, LIST.GGSSC); // 北海道

// 二分／
LIST.GXSSC = Object.assign({}, LIST.EFSSC); // 高雄
LIST.EFPK10 = Object.assign({}, LIST.EFSSC);

// 三分／
LIST.SFPK10 = Object.assign({}, LIST.SFSSC);
LIST.XY28 = Object.assign({}, LIST.SFSSC);

// 五分／福彩、天天、飞艇(PK10)、六合彩、幸运28
LIST.FCSSC = Object.assign({}, LIST.WFSSC);
LIST.TTSSC = Object.assign({}, LIST.WFSSC);
LIST.WFPK10 = Object.assign({}, LIST.WFSSC);
LIST.WFHKSIX = Object.assign({}, LIST.WFSSC);
// 五分(澳洲幸運5)
LIST.AZXY5SSC = Object.assign({}, LIST.AZXYPK10);

// 十分（时时彩、PK10）
LIST.SHFSSC = Object.assign({}, LIST.SHFK3);
LIST.SHFPK10 = Object.assign({}, LIST.SHFK3);

/**
 * 时间节点
 * @param  {String} timeStr     日期('HH:mm:ss')
 * @param  {Number} total    总共期数
 * @param  {Number} interval 时间间隔
 * @return {[Array]}          [description]
 */
function createPoint(timeStr, total, interval) {
  return Array.apply(null, {
    length: total,
  }).map((n, i) => {
    let start = new Date('2018/01/01 ' + timeStr);
    return start.addMinutes4Seconds(interval * i).Format('HH:mm:ss');
  });
}

/**
 * 获取倒计时
 * @param {String} endStr “当天最后一期”的时间戳 !!!
 */
function endTimeHelper(endStr) {
  if (typeof this !== 'object') throw 'use `call` this function';

  const startTime = new Date().setMilliseconds(window.diffTime);
  let serverDay = new Date(startTime).Format('yyyy/MM/dd');
  const endTime = new Date(`${serverDay} ${endStr}`);
  if (startTime > endTime) serverDay = endTime.addDays(1).Format('yyyy/MM/dd');

  if (!this.timestamp.length) this.timestamp = this.getTimestamp();
  let min = {
    diff: 7 * 24 * 60 * 60 * 1000,
    time: '',
  };
  this.timestamp.map(cur => {
    let time = new Date(`${serverDay} ${cur}`).getTime();
    let diff = time - startTime;
    if (0 < diff && diff < min.diff) {
      min = {
        diff: diff,
        time: cur,
      };
    }
  });
  return new Date(`${serverDay} ${min.time}`).Format('yyyy-MM-dd HH:mm:ss');
}

const getters = {};

const mutations = {
  getEndTime(state, payload) {
    let category = payload.alias;
    if (LIST[category] && LIST[category].getEndTime) {
      let obj = LIST[category].getEndTime();
      isPromise(obj)
        ? obj.then(data => {
            if (typeof data == 'object') {
              payload.endTime = data.endTime;
              payload.openNum = data.openNum;
            } else {
              payload.endTime = data;
            }
          })
        : (payload.endTime = obj);
    }
    if (payload.endTime == null) payload.endTime = '2019-01-01 11:00:00';
  },
};

function isPromise(e) {
  return !!e && typeof e.then == 'function';
}

// async
const actions = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
