import { createTemplate, padLeftZero } from './helper';

const _11X5 = {
  KQD5Q: {
    help: {
      desc: '开出号码“投注号码”相同视为中奖；号码大于等于6为大，反之为小；开出11不计算输赢。',
    },
    tplData: createTemplate({
      min: 1,
      max: 15,
      formatFn: i => {
        return i <= 11 ? padLeftZero(i) : '大小单双'.charAt(i - 12);
      },
    }),
    randomSelect: function() {},
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  KQ1Z1: {
    help: {
      desc: '投注1个号码与当期开奖的5个号码中任1个号码相同，视为中奖。',
    },
    tplData: createTemplate({
      min: 1,
      max: 11,
      formatFn: i => {
        return padLeftZero(i);
      },
    }),
    randomSelect: function() {},
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  KQZH: {
    help: {
      desc:
        ' 总和大于30为大，反之为小，等于30不计算输赢；总和尾数大于等于5尾大，反之尾小；第一球大于第五球为龙，反之为虎。',
    },
    tplData: createTemplate({
      max: 7,
      formatFn: i => {
        return ['总和大', '总和小', '总和单', '总和双', '总和尾大', '总和尾小', '龙', '虎'][i];
      },
    }),
    randomSelect: function() {},
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
};
_11X5.KQD1Q = _11X5.KQD2Q = _11X5.KQD3Q = _11X5.KQD4Q = _11X5.KQD5Q;

export default _11X5;
