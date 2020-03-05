import { createTemplate, padLeftZero } from './helper';

// 飞艇
const FT = {
  // 第5名
  // ------------------------------------------------------------------------------
  FTD5M: {
    help: {
      desc: '号码大于5为大；第五名大于第六名为龙，反之为虎。',
    },
    tplData: createTemplate({
      min: 1,
      max: 16,
      formatFn: i => {
        return i <= 10 ? padLeftZero(i) : '大小单双龙虎'.charAt(i - 11);
      },
    }),
    // 随机
    randomSelect: function(time = 0) {
      // if (time == 0) {
      //   this.empty();
      //   console.log('randomSelect', this.template);
      //   // this.selectedList[0].push(FT_F01T10[rand(15)]);
      //   return;
      // }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  FTD10M: {
    help: {
      desc: '号码大于5为大，反之为小。',
    },
    tplData: createTemplate({
      min: 1,
      max: 14,
      formatFn: i => {
        return i <= 10 ? padLeftZero(i) : '大小单双'.charAt(i - 11);
      },
    }),
    // 随机
    randomSelect: function(time = 0) {
      // if (time == 0) {
      //   this.empty();
      //   console.log('randomSelect', this.template);
      //   // this.selectedList[0].push(FT_F01T10[rand(15)]);
      //   return;
      // }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  FTGYH: {
    help: {
      desc: '投“冠亚和值”与开奖号码相同视中奖；和值大于11为大。',
    },
    tplData: createTemplate({
      min: 3,
      max: 23,
      formatFn: i => {
        return i <= 19 ? padLeftZero(i) : `冠亚${'大小单双'.charAt(i - 20)}`;
      },
    }),
    // 随机
    randomSelect: function(time = 0) {
      // if (time == 0) {
      //   this.empty();
      //   console.log('randomSelect', this.template);
      //   // this.selectedList[0].push(FT_F01T10[rand(15)]);
      //   return;
      // }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
};

FT.FTD1M = Object.assign({}, FT.FTD5M);
FT.FTD1M.help = {
  desc: '号码大于5为大；第一名大于第十名为龙，反之为虎。',
};

FT.FTD2M = Object.assign({}, FT.FTD5M);
FT.FTD2M.help = {
  desc: '号码大于5为大；第二名大于第九名为龙，反之为虎。',
};

FT.FTD3M = Object.assign({}, FT.FTD5M);
FT.FTD3M.help = {
  desc: '号码大于5为大；第三名大于第八名为龙，反之为虎。',
};

FT.FTD4M = Object.assign({}, FT.FTD5M);
FT.FTD4M.help = {
  desc: '号码大于5为大；第四名大于第七名为龙，反之为虎。',
};

FT.FTD6M = FT.FTD7M = FT.FTD8M = FT.FTD9M = FT.FTD10M;

export default FT;
