import { createTemplate } from './helper';

const SSC = {
  KQD5Q: {
    help: {
      desc: '下注第五球与开奖第五球大小、顺序相同，视为中奖；单球开奖号码大于4为“大”。',
    },
    tplData: createTemplate({
      max: 13,
      formatFn: i => {
        return i <= 9 ? i : '大小单双'.charAt(i - 10);
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
  KQH3: {
    help: {
      desc: '开奖号码前三位相同豹子（222），相连顺子（123），无关联杂六（357）；两位相同对子（224），相连半顺(125)。',
    },
    tplData: createTemplate({
      max: 4,
      formatFn: i => {
        return ['豹子', '顺子', '对子', '半顺', '杂六'][i];
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
  KQZHLHH: {
    help: {
      desc: '总和大于22为大；第一、五球比较，一大五"龙"，反之"虎"；一、五球相同"和"。',
    },
    tplData: createTemplate({
      max: 6,
      formatFn: i => {
        return ['总和大', '总和小', '总和单', '总和双', '龙', '虎', '和'][i];
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

SSC.KQD1Q = Object.assign({}, SSC.KQD5Q);
SSC.KQD1Q.help = {
  desc: '下注第一球与开奖第一球大小、顺序相同，视为中奖；单球开奖号码大于4为“大”。',
};
SSC.KQD2Q = Object.assign({}, SSC.KQD5Q);
SSC.KQD2Q.help = {
  desc: '下注第二球与开奖第二球大小、顺序相同，视为中奖；单球开奖号码大于4为“大”。',
};
SSC.KQD3Q = Object.assign({}, SSC.KQD5Q);
SSC.KQD3Q.help = {
  desc: '下注第三球与开奖第三球大小、顺序相同，视为中奖；单球开奖号码大于4为“大”。',
};
SSC.KQD4Q = Object.assign({}, SSC.KQD5Q);
SSC.KQD4Q.help = {
  desc: '下注第四球与开奖第四球大小、顺序相同，视为中奖；单球开奖号码大于4为“大”。',
};
SSC.KQQ3 = Object.assign({}, SSC.KQH3);
SSC.KQQ3.help = {
  desc: '开奖号码前三位相同豹子（222），相连顺子（123），无关联杂六（357）；两位相同对子（224），相连半顺(125)。',
};
SSC.KQZ3 = Object.assign({}, SSC.KQH3);
SSC.KQZ3.help = {
  desc: '开奖号码中三位相同豹子（222），相连顺子（123），无关联杂六（357）；两位相同对子（224），相连半顺(125)。',
};
export default SSC;
