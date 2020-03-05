import { createTemplate, pokerSplice, rand, Combination, rxBetCount, pushCart, singleValidate } from './helper';

// 重庆时时彩
const CQSSC = {
  /********************************************************************************
   * 定位胆
   *******************************************************************************/
  DWD: {
    help: {
      desc: '在万位、千位、百位、十位、个位任意位置上任意选择1个或1个以上号码。',
      example: '投注方案：万位 1 开奖号码：万位 1，即中定位胆万位。',
      explain: '从万、千、百、十、个位任意位置上至少选择1个以上号码，每注由1个号码组成，所选号码与相同位置上的开奖号码一致，即为中奖。',
    },
    tplData: createTemplate({
      time: 5,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        this.selectedList[rand(4)].push(rand());
        return;
      }
      while (time > 0) {
        let result = ['', '', '', '', ''];
        result.splice(rand(4), 1, rand());
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre + cur.length;
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 五星-直选复式
   *******************************************************************************/
  WXZX: {
    help: {
      desc: '从万位、千位、百位、十位、个位各选一个号码组成一注。',
      example: '投注方案：13456 开奖号码：13456，即中五星直选。',
      explain: '从万、千、百、十、个位中至少各选择1个号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。',
    },
    tplData: createTemplate({
      time: 5,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 五星-直选单式
  WXZX_MDS: {
    help: {
      desc: '手动输入号码，至少输入1个五位数号码组成一注。',
      example: '投注方案：23456 开奖号码：23456，即中五星直选。',
      explain: '手动输入一个5位数号码组成一注，所选号码的万、千、百、十、个位与开奖号码相同，且顺序一致，即为中奖。',
    },
    validate(str) {
      return singleValidate(str, item => /^\d{5}$/.test(item));
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.length;
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 四星-直选复式
   *******************************************************************************/
  SXZX: {
    help: {
      desc: '从千位、百位、十位、个位各选一个号码组成一注。',
      explain: '从千、百、十、个位中至少各选择1个号码组成一注，所选号码与开奖号码后4位相同，且顺序一致，即为中奖。',
      example: '投注方案：3456 开奖号码后四位：3456，即中四星直选。',
    },
    tplData: createTemplate({
      time: 4,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 四星-直选单式
  SXZX_MDS: {
    help: {
      desc: '手动输入号码，至少输入1个四位数号码组成一注。',
      example: '投注方案：3456 开奖号码后四位：3456，即中四星直选。',
      explain: '手动输入一个4位数号码组成一注，所选号码的千、百、十、个位与开奖号码相同，且顺序一致，即为中奖。',
    },
    validate(str) {
      return singleValidate(str, item => /^\d{4}$/.test(item));
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 4 ? Combination(n, 4) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 后三
   *******************************************************************************/
  // 直选复式
  // ------------------------------------------------------------------------------
  H3ZX: {
    help: {
      desc: '从百位、十位、个位各选一个号码组成一注。',
      explain: '从百、十、个位中至少各选择1个号码组成一注，所选号码与开奖号码后3位相同，且顺序一致，即为中奖。',
      example: '投注方案：345 开奖号码后三位：345，即中后三直选。',
    },
    tplData: createTemplate({
      time: 3,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 后三-直选单式
  H3ZX_MDS: {
    help: {
      desc: '手动输入号码，至少输入1个三位数号码组成一注。',
      example: '投注方案：345 开奖号码：后三位 345，即中后三直选',
      explain: '手动输入一个3位数号码组成一注，所选号码与开奖号码的百、十、个位相同，且顺序一致，即为中奖。',
    },
    validate(str) {
      return singleValidate(str, item => /^\d{3}$/.test(item));
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 直选和值
  // ------------------------------------------------------------------------------
  H3ZHXHZ: {
    help: {
      desc: '从0-27中任意选择1个或1个以上号码。',
      explain: '所选数值等于开奖号码的百、十、个三个数字相加之和，即为中奖。',
      example: '投注方案：和值1 开奖号码：后三位001，010，100，即中后三直选。',
    },
    tplData: createTemplate({
      max: 27,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(27));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(27));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 直选跨度
  // ------------------------------------------------------------------------------
  H3ZXKD: {
    help: {
      desc: '从0-9中选择1个以上号码。',
      explain: '所选数值等于开奖号码的后3位最大与最小数字相减之差，即为中奖。',
      example: '投注方案：跨度8 开奖号码：* * 1 2 9 ，最大9与最小1相减相等于8，所选号与跨度号码相同即中奖。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let counts = [10, 54, 96, 126, 144, 150, 144, 126, 96, 54];
      let sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 后三组合
  // ------------------------------------------------------------------------------
  H3H3ZH: {
    help: {
      desc: '从百位、十位、个位各选一个号码组成三注。',
      explain:
        '从百、十、个位中至少各选择一个号码组成1-3星的组合共三注，当个位号码与开奖号码相同，则中1个3等奖；如果个位与十位号码与开奖号码相同，则中1个3等奖以及1个2等奖，依此类推，最高可中3个奖。',
      example: '投注方案：购买：6+7+8，该票共6元，由以下3注：678(三星)、78(二星)、8(一星)构成 开奖号码：678，即可中三星、二星、一星各1注。',
    },
    tplData: createTemplate({
      time: 3,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 3);
      this.count = sum;
      return sum;
    },
  },
  // 组三复式 (后三组三)
  // ------------------------------------------------------------------------------
  H3Z3: {
    help: {
      desc: '从0-9中任意选择2个或2个以上号码。',
      explain: '从0-9中至少选择2个号码组成两注，所选号码与开奖号码的百、十、个位相同，且顺序不限，即为中奖。',
      example: '投注方案：588 开奖号码：后三位588（顺序不限），即可中后三组选三。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        return pre + n * (n - 1);
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 组三单式
  H3Z3_DS: {
    help: {
      desc: '手动输入号码，至少输入1个三位数号码（三个数字中必须有二个数字相同）。',
      example: '投注方案：001 开奖号码：后三位 010（顺序不限），即中后三组选三。',
      explain: '手动输入一个3位数号码组成一注，三个数字中必须有二个数字相同，输入号码与开奖号码的百、十、个位相同，顺序不限，即为中奖。',
    },
    validate(str) {
      // 需要重复的号码
      return singleValidate(str, item => /^\d{3}$/.test(item) && new Set(item.split('')).size === 2);
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 组六复式 (后三组六)
  // ------------------------------------------------------------------------------
  H3Z6: {
    help: {
      desc: '从0-9中任意选择3个或3个以上号码。',
      explain: '从0-9中至少选择3个号码组成一注，所选号码与开奖号码的百、十、个位相同，顺序不限，即为中奖。',
      example: '投注方案：258 开奖号码：后三位 852（顺序不限），即中后三组选六。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 3);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 3)];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 3);
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 组六单式
  H3Z6_DS: {
    help: {
      desc: '手动输入号码，至少输入1个三位数号码（三个数字完全不相同）。',
      example: '投注方案：588 开奖号码：后三位858（顺序不限），即可中后三组选六。',
      explain: '手动输入一个3位数号码组成一注，三个数字完全不相同，所选号码与开奖号码的百、十、个位相同，且顺序不限，即为中奖。',
    },
    validate(str) {
      // 三个数字完全不相同
      return singleValidate(str, item => /^\d{3}$/.test(item) && new Set(item.split('')).size === 3);
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 混合组选
  H3HHZX_DS: {
    help: {
      desc: '手动至少输入三个号码构成一注(不包含豹子号)。',
      example: '投注方案：001 和 123 开奖号码：后三位 010（顺序不限）即中后三组选三，或者后三位 312（顺序不限）即中后三组选六。',
      explain: '手动输入一个3位数号码为一注(不含豹子号)，开奖号码后3位为组三或组六形态，投注号码与开奖号码后3位相同，顺序不限，即为中奖。',
    },
    validate(str) {
      // 不包含豹子号
      return singleValidate(str, item => /^\d{3}$/.test(item) && new Set(item.split('')).size !== 1);
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 组选和值
  // ------------------------------------------------------------------------------
  H3ZUXHZ: {
    help: {
      desc: '从1-26中选择1个号码。',
      explain: '开奖号码后3位为组三或组六形态(不含豹子号)，所选数值等于开奖号码百、十、个位三个数字相加之和，即为中奖。',
      example: '投注方案：和值3 开奖号码：后三位 003（顺序不限）即中后三组选三，或者后三位 012（顺序不限）即中后三组选六。',
    },
    tplData: createTemplate({
      min: 1,
      max: 26,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(26, 1));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(26, 1));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur - 1];
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 组选包胆
  // ------------------------------------------------------------------------------
  H3ZXBD: {
    help: {
      desc: '从0-9中选择1个号码。',
      explain: '从0-9中任意选择1个胆码，开奖号码后3位为组三或组六形态(不含豹子号)，投注号码与开奖号码后3位中任意1位相同，即为中奖。',
      example: '投注方案：包胆3 开奖号码：后三位 3XX 或者 33X，即中后三组选三，后三位 3XY，即中后三组选六。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        // 此处不再调用 this.empty()
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList.splice(0, 1, rand());
          index++;
        }
        return;
      }
      // todo
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      if (this.selectedList[0].length == 1) {
        sum = 54;
      }
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 3 ? Combination(n, 3) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 和值尾数
  // ------------------------------------------------------------------------------
  H3HZWS: {
    help: {
      desc: '从0-9中选择1个号码。',
      explain: '所选数值等于开奖号码的百、十、个位三个数字相加之和的尾数，即为中奖。',
      example: '投注方案：和值尾数 8 开奖号码：后三位 936，和值尾数为8，即中和值尾数。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 特殊号
  // ------------------------------------------------------------------------------
  H3TSH: {
    help: {
      desc: '选择一个号码形态。',
      explain:
        '所选的号码特殊属性和开奖号码后3位的属性一致，即为中奖。其中：1.顺子号的百、十、个位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的后三位当中，任意2位数字相同的三位数号码。',
      example: '投注方案：豹子顺子对子 开奖号码：后三位 888，即中豹子；后三位 678，即中顺子；后三位 558，即中对子。',
    },
    tplData: createTemplate({
      max: 2,
      formatFn: i =>
        [
          ['bz', '豹子'],
          ['sz', '顺子'],
          ['dz', '对子'],
        ][i],
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(['bz', 'sz', 'dz'][rand(2)]);
          index++;
        }
        return;
      }
      while (time > 0) {
        let result = [['bz', 'sz', 'dz'][rand(2)]];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 后二
   *******************************************************************************/
  // 直选复式
  // ------------------------------------------------------------------------------
  EXZX: {
    help: {
      desc: '从十位、个位中至少各选1个号码组成一注。',
      explain: '从十位、个位中选择一个2位数号码组成一注，所选号码与开奖号码的后2位相同，且顺序一致，即为中奖。',
      example: '投注方案：58 开奖号码：后二位 58，即中后二直选。',
    },
    tplData: createTemplate({
      time: 2,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 后二-直选单式
  // ------------------------------------------------------------------------------
  EXZX_MDS: {
    help: {
      desc: '手动输入号码，至少输入1个二位数号码组成一注。',
      explain: '手动输入一个2位数号码组成一注，输入号码的十、个位与开奖号码相同，且顺序一致，即为中奖。',
      example: '投注方案：58 开奖号码：后二位 58，即中后二直选。',
    },
    validate(str) {
      return singleValidate(str, item => /^\d{2}$/.test(item));
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 2 ? Combination(n, 2) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 直选和值
  // ------------------------------------------------------------------------------
  H2ZHXHZ: {
    help: {
      desc: '从0-18中任意选择1个或1个以上的和值号码。',
      explain: '所选数值等于开奖号码的十位、个位二个数字相加之和，即为中奖。',
      example: '投注方案：和值1 开奖号码：后二位 01，10，即中后二直选。',
    },
    tplData: createTemplate({
      max: 18,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(18));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(18));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 直选跨度
  // ------------------------------------------------------------------------------
  H2ZXKD: {
    help: {
      desc: '从0-9中任意选择1个号码组成一注。',
      explain: '所选数值等于开奖号码的后2位最大与最小数字相减之差，即为中奖。',
      example: '投注方案：跨度9 开奖号码：后二位 90或09，即中后二直选。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let counts = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2];
      let sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 2 ? Combination(n, 2) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 组选复式
  // ------------------------------------------------------------------------------
  H2ZX: {
    help: {
      desc: '从0-9中任意选择2个或2个以上号码。',
      explain: '从0-9中选2个号码组成一注，所选号码与开奖号码的十位、个位相同（不含对子号），顺序不限，即中奖。',
      example: '投注方案：58 开奖号码：后二位 85 或者 58（顺序不限，不含对子号），即中后二组选。。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 2);
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 后二-组选单式
  // ------------------------------------------------------------------------------
  H2ZX_DS: {
    help: {
      desc: '手动输入号码，至少输入1个二位数号码组成一注。（两个号码不相同）',
      explain: '手动输入一个2位数号码组成一注，输入号码的十、个位与开奖号码相同，顺序不限，即为中奖。',
      example: '投注方案：58 开奖号码：前二位 85 或者 58（顺序不限，不含对子号），即中后二组选。',
    },
    validate(str) {
      return singleValidate(str, item => /^\d{2}$/.test(item) && new Set(item.split('')).size === 2);
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.length;
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 2 ? Combination(n, 2) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  // 组选和值
  // ------------------------------------------------------------------------------
  H2ZUXHZ: {
    help: {
      desc: '从1-17中任意选择1个或者1个以上号码。',
      explain: '所选数值等于开奖号码的十位、个位二个数字相加之和（不含对子号），即为中奖。',
      example: '投注方案：和值 1 开奖号码：后二位 10 或者 01（顺序不限，不含对子号），即中后二组选。',
    },
    tplData: createTemplate({
      min: 1,
      max: 17,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(17, 1));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(17, 1));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 组选包胆
  // ------------------------------------------------------------------------------
  H2ZXBD: {
    help: {
      desc: '从0-9中任意选择1个包胆号码。',
      explain: '从0-9中任意选择1个包胆号码，开奖号码的十位，个位中任意1位包含所选的包胆号码相同（不含对子号），即为中奖。',
      example: '投注方案：包胆 8 开奖号码：后二位 8X，且X不等于8，即中后二组选。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        // 此处不再调用 this.empty()
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList.splice(0, 1, rand());
          index++;
        }
        return;
      }
      // todo
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      if (this.selectedList[0].length == 1) {
        sum = 9;
      }
      if (/^RX/.test(this.mode)) {
        let n = this.filterDigits.length;
        sum *= n >= 2 ? Combination(n, 2) : 0;
      }
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 不定位
   *******************************************************************************/
  // 前三一码
  // ------------------------------------------------------------------------------
  BDWQ31M: {
    help: {
      desc: '从0-9中任意选择1个以上号码。',
      explain: '从0-9中至少选择1个号码，每注由1个号码组成，只要开奖号码的万、千、百位中包含所选号码，即为中奖。（同个号码出现多次时只计一次中奖）',
      example: '投注方案：1 开奖号码：前三位，至少出现1个1，即中前三一码不定位。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand());
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 前三二码
  // ------------------------------------------------------------------------------
  BDWQ32M: {
    help: {
      desc: '从0-9中任意选择2个以上号码。',
      explain: '从0-9中至少选择2个号码，每注由2个不同的号码组成，开奖号码的万、千、百位中同时包含所选的2个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
      example: '投注方案：12 开奖号码：前三位，至少出现1和2各1个，即中前三二码不定位。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 2);
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  // 五星三码
  // ------------------------------------------------------------------------------
  BDWWX3M: {
    help: {
      desc: '从0-9中任意选择3个以上号码。',
      explain:
        '从0-9中至少选择3个号码，每注由3个不同的号码组成，开奖号码的万、千、百、十、个位中同时包含所选的3个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
      example: '投注方案：123 开奖号码：至少出现1、2、3各1个，即中五星三码不定位。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 3);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 3)];
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 3);
      }, 0);
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 大小单双
   *******************************************************************************/
  // 后二大小单双
  // ------------------------------------------------------------------------------
  H2DXDS: {
    help: {
      desc: '从十位、个位中的“大、小、单、双”中至少各选一个组成一注。',
      explain: '对十位和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
      example: '投注方案：大单 开奖号码：十、个位“大单”，即中后二大小单双。',
    },
    tplData: createTemplate({
      time: 2,
      max: 3,
      formatFn: i => '大小单双'.charAt(i),
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          let idx = rand(3);
          this.selectedList[index] = this.selectedList[index] || [];
          this.selectedList[index].push('大小单双'.charAt(idx));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          let idx = rand(3);
          result.push('大小单双'.charAt(idx));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  // 后三大小单双
  // ------------------------------------------------------------------------------
  H3DXDS: {
    help: {
      desc: '从百位、十位、个位中的“大、小、单、双”中至少各选一个组成一注。',
      explain: '对百、十和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
      example: '投注方案：大单大 开奖号码：百、十、个位“大单大”，即中后三大小单双。',
    },
    tplData: createTemplate({
      time: 3,
      max: 3,
      formatFn: i => '大小单双'.charAt(i),
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          let idx = rand(3);
          this.selectedList[index] = this.selectedList[index] || [];
          this.selectedList[index].push('大小单双'.charAt(idx));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          let idx = rand(3);
          result.push('大小单双'.charAt(idx));
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      sum = this.selectedList.reduce((pre, cur, idx) => {
        return pre * cur.length;
      }, 1);
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 任选二
   *******************************************************************************/
  // 直选复式
  // ------------------------------------------------------------------------------
  RX2ZHX: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少两位上各选1个号码组成一注。',
      explain: '从万、千、百、十、个位中至少选择两个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。',
      example: '投注方案：万位5，百位8 开奖号码：51812，即中任二直选。',
    },
    tplData: createTemplate({
      time: 5,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let digits = pokerSplice(0, 4, 2);
        let index = 0;
        while (index < 2) {
          this.selectedList[digits[index]].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let length = this.template.length;
        let result = new Array(length);
        let digits = pokerSplice(0, 4, 2);
        let index = 0;
        while (index < 2) {
          result[digits[index]] = rand();
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = rxBetCount(this.selectedList, 2);
      this.count = sum;
      return sum;
    },
  },
  // 直选和值
  // ------------------------------------------------------------------------------
  RX2ZHXHZ: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择两个位置,至少选择一个和值号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择两个位置,至少选择一个和值号码构成一注，所选两个位置的开奖号码相加之和与所选和值一致，即为中奖。',
      example: '投注方案：位置选择万、百位，选择和值号码13 开奖号码：51812，即中任二直选和值。',
    },
    tplData: createTemplate({
      max: 18,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(18));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(18));
          index++;
        }
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选复式
  // ------------------------------------------------------------------------------
  RX2ZUXFS: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择两个位置,号码区至少选择两个号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择两个位置,至少选择两个号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。',
      example: '投注方案：位置选择万、百位，选择号码85 开奖号码：51812或者81512，即中任二组选。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 2);
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选和值
  // ------------------------------------------------------------------------------
  RX2ZUXHZ: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择两个位置,至少选择一个和值号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择两个位置,至少选择一个和值号码构成一注，所选两个位置的开奖号码相加之和与所选和值一致(不含对子号)，即为中奖。',
      example: '投注方案：位置选择万、百位，选择和值号码13 开奖号码：51812，即中任二组选和值。',
    },
    tplData: createTemplate({
      min: 1,
      max: 17,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(17, 1));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(17, 1));
          index++;
        }
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur - 1];
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 任选三
   *******************************************************************************/
  // 直选复式
  // ------------------------------------------------------------------------------
  RX3ZHX: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少三位上各选1个号码组成一注。',
      explain: '从万、千、百、十、个位中至少选择三个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。',
      example: '投注方案：万位5，百位8,个位2 开奖号码：51812，即中任三直选。',
    },
    tplData: createTemplate({
      time: 5,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let digits = pokerSplice(0, 4, 3);
        let index = 0;
        while (index < 3) {
          this.selectedList[digits[index]].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let length = this.template.length;
        let result = new Array(length);
        let digits = pokerSplice(0, 4, 3);
        let index = 0;
        while (index < 3) {
          result[digits[index]] = rand();
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = rxBetCount(this.selectedList, 3);
      this.count = sum;
      return sum;
    },
  },
  // 直选和值
  // ------------------------------------------------------------------------------
  RX3ZHXHZ: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择三个位置,至少选择一个和值号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择三个位置,至少选择一个和值号码构成一注，所选三个位置的开奖号码相加之和与所选和值一致，即为中奖。',
      example: '投注方案：位置选择万、百、个位，选择和值号码15 开奖号码：51812，即中任三直选和值。',
    },
    tplData: createTemplate({
      max: 27,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(27));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(27));
          index++;
        }
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur];
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 4,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组三复式
  // ------------------------------------------------------------------------------
  RX3ZU3FS: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择三个位置,号码区至少选择两个号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择三个位置,至少选择两个号码构成两注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。',
      example: '投注方案：位置选择万、十、个位,选择号码12 开奖号码：11812，即中任三组三。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        return pre + n * (n - 1);
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 4,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组六复式
  // ------------------------------------------------------------------------------
  RX3ZU6FS: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择三个位置,号码区至少选择三个号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择三个位置,至少选择三个号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。',
      example: '投注方案：位置选择万、十、个位,选择号码512 开奖号码：51812，即中任三组六。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 3);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 3)];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 3);
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 4,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选和值
  // ------------------------------------------------------------------------------
  RX3ZUXHZ: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择三个位置,至少选择一个和值号码构成一注。',
      explain: '从万、千、百、十、个位中至少选择三个位置,至少选择一个和值号码构成一注，所选三个位置的开奖号码相加之和与所选和值一致(不包含豹子号)，即为中奖。',
      example: '投注方案：位置选择万、十、个位,选择和值号码8 开奖号码：51812，即中任三组选和值。',
    },
    tplData: createTemplate({
      min: 1,
      max: 26,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        const len = this.template.length;
        let index = 0;
        while (index < len) {
          this.selectedList[index].push(rand(26, 1));
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let index = 0;
        let result = [];
        while (index < len) {
          result.push(rand(26, 1));
          index++;
        }
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let counts = [1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1];
      sum = this.selectedList[0].reduce((pre, cur, idx) => {
        return pre + counts[cur - 1];
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 1,
        4: 4,
        5: 10,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  /********************************************************************************
   * 任四选
   *******************************************************************************/
  // 直选复式
  // ------------------------------------------------------------------------------
  RX4ZHX: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少四位上各选1个号码组成一注。',
      explain: '从万、千、百、十、个位中至少选择四个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。',
      example: '投注方案：万位5，千位1,百位8,十位1 开奖号码：51812，即中任四直选。',
    },
    tplData: createTemplate({
      time: 5,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let digits = pokerSplice(0, 4, 4);
        let index = 0;
        while (index < 4) {
          this.selectedList[digits[index]].push(rand());
          index++;
        }
        return;
      }
      while (time > 0) {
        let len = this.template.length;
        let result = new Array(len);
        let digits = pokerSplice(0, 4, 4);
        let index = 0;
        while (index < 4) {
          result[digits[index]] = rand();
          index++;
        }
        pushCart.call(this, {
          result: result,
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = rxBetCount(this.selectedList, 4);
      this.count = sum;
      return sum;
    },
  },
  // 组选24
  // ------------------------------------------------------------------------------
  RX4ZUX24: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择四个位置,号码区至少选择四个号码构成一注。',
      explain:
        '从万、千、百、十、个位中至少选择四个位置,号码区至少选择四个号码构成一注，所选号码与开奖号码指定位置上的号码相同，顺序不限，且开奖号码没有重复，即为中奖。',
      example: '投注方案：位置选择千、百、十、个位,号码选择0568 开奖号码：10568(指定位置号码顺序不限且没有重复)，即可中任四组选24。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 4);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 4)];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 4);
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 5,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选12
  // ------------------------------------------------------------------------------
  RX4ZUX12: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择四个位置,从“二重号”选择一个号码，“单号”中选择两个号码组成一注。',
      explain:
        '从万、千、百、十、个位中至少选择四个位置,从“二重号”中至少选择一个号码，“单号”中至少选择两个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选的二重号码在开奖号码指定位置中出现2次，顺序不限，即为中奖。',
      example: '投注方案：位置选择千、百、十、个位,二重号：8；单号：06 开奖号码：10688(指定位置号码顺序不限)，即可中任四组选12。',
    },
    tplData: createTemplate({
      time: 2,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let ary = pokerSplice(0, 9, 3);
        this.selectedList[0].push(ary.shift());
        this.selectedList[1].push(...ary);
        return;
      }
      while (time > 0) {
        let ary = pokerSplice(0, 9, 3);
        let result = [ary.shift(), ary];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let ary1 = this.selectedList[0];
      let ary2 = this.selectedList[1];
      let len = ary2.length;
      if (ary1.length > 0 && len > 1) {
        ary1.forEach(el1 => {
          if (ary2.find(el2 => el1 == el2) != null) {
            if (len > 2) {
              sum += Combination(len - 1, 2);
            }
          } else {
            sum += Combination(len, 2);
          }
        });
      }
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 5,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选6
  // ------------------------------------------------------------------------------
  RX4ZUX6: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择四个位置,从“二重号”中选择两个号码组成一注。',
      explain:
        '从万、千、百、十、个位中至少选择四个位置,从“二重号”中至少选择两个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选的2个二重号码在开奖号码指定位置中分别出现了2次，顺序不限，即为中奖。',
      example: '投注方案：位置选择千、百、十、个位,二重号：28 开奖号码：12288(指定位置号码顺序不限)，即可中任四组选6。',
    },
    tplData: createTemplate({}),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let result = pokerSplice(0, 9, 2);
        this.selectedList.splice(0, 1, result);
        return;
      }
      while (time > 0) {
        let result = [pokerSplice(0, 9, 2)];
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = this.selectedList.reduce((pre, cur, idx) => {
        let n = cur.length;
        if (!n) return 0;
        return pre + Combination(n, 2);
      }, 0);
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 5,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
  // 组选4
  // ------------------------------------------------------------------------------
  RX4ZUX4: {
    help: {
      desc: '从万位、千位、百位、十位、个位中至少选择四个位置,从“三重号”中选择一个号码，“单号”中选择一个号码组成一注。',
      explain:
        '从万、千、百、十、个位中至少选择四个位置,从“三重号”中至少选择一个号码，“单号”中至少选择一个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选三重号码在在开奖号码指定位置中出现3次，顺序不限，即为中奖。',
      example: '投注方案：位置选择千、百、十、个位,三重号：8；单号：2 开奖号码：18828(指定位置号码顺序不限)，即可中任四组选4。',
    },
    tplData: createTemplate({
      time: 2,
    }),
    // 随机
    randomSelect: function(time = 0) {
      if (time == 0) {
        this.empty();
        let len = this.template.length;
        let index = 0;
        let ary = pokerSplice(0, 9, 2);
        while (index < len) {
          this.selectedList[index].push(ary[index]);
          index++;
        }
        return;
      }
      while (time > 0) {
        let result = pokerSplice(0, 9, 2);
        pushCart.call(this, {
          result: result,
          props: {
            digits: this.filterDigits,
          },
        });
        time--;
      }
    },
    // 计算 注
    selectedCount() {
      let sum = 0;
      let ary1 = this.selectedList[0];
      let ary2 = this.selectedList[1];
      let len = ary2.length;
      if (ary1.length > 0 && len > 0) {
        ary1.forEach(el1 => {
          if (ary2.find(el2 => el1 == el2) != null) {
            if (len > 1) {
              sum += len - 1;
            }
          } else {
            sum += len;
          }
        });
      }
      let obj = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 5,
      };
      sum *= obj[this.filterDigits.length];
      this.count = sum;
      return sum;
    },
  },
};
/********************************************************************************
 * 前四、后四、任选四
 *******************************************************************************/
//#region 前四、后四、任选四
CQSSC.Q4ZX = Object.assign({}, CQSSC.SXZX); // 直选复式
CQSSC.Q4ZX.help = {
  desc: '从万位、千位、百位、十位各选一个号码组成一注。',
};
CQSSC.Q4ZX_MDS = Object.assign({}, CQSSC.SXZX_MDS); // 直选单式
CQSSC.Q4ZX_MDS.help = {
  desc: '手动输入号码，至少输入1个四位数号码组成一注。',
};
CQSSC.RX4ZX_MDS = Object.assign({}, CQSSC.SXZX_MDS); // 直选单式
CQSSC.RX4ZX_MDS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择四个位置,至少手动输入一个四位数的号码构成一注。',
};
// 组选
CQSSC.Q4ZUX24 = Object.assign({}, CQSSC.RX4ZUX24); // 组选24
CQSSC.Q4ZUX24.help = {
  desc: '至少选择4个号码投注，竞猜开奖号码的前4位，号码一致顺序不限即中奖。',
};
CQSSC.Q4ZUX12 = Object.assign({}, CQSSC.RX4ZUX12); // 组选12
CQSSC.Q4ZUX12.help = {
  desc: '至少选择1个二重号码和2个单号号码，竞猜开奖号码的前四位，号码一致顺序不限即中奖。',
};
CQSSC.Q4ZUX6 = Object.assign({}, CQSSC.RX4ZUX6); // 组选6
CQSSC.Q4ZUX6.help = {
  desc: '至少选择2个二重号码，竞猜开奖号码的前四位，号码一致顺序不限即中奖。',
};
CQSSC.Q4ZUX4 = Object.assign({}, CQSSC.RX4ZUX4); // 组选4
CQSSC.Q4ZUX4.help = {
  desc: '至少选择1个三重号码和1个单号号码，竞猜开奖号码的前四位，号码一致顺序不限即中奖。',
};
// 组选
CQSSC.H4ZUX24 = Object.assign({}, CQSSC.RX4ZUX24); // 组选24
CQSSC.H4ZUX24.help = {
  desc: '至少选择4个号码投注，竞猜开奖号码的后4位，号码一致顺序不限即中奖。',
};
CQSSC.H4ZUX12 = Object.assign({}, CQSSC.RX4ZUX12); // 组选12
CQSSC.H4ZUX12.help = {
  desc: '至少选择1个二重号码和2个单号号码，竞猜开奖号码的后四位，号码一致顺序不限即中奖。',
};
CQSSC.H4ZUX6 = Object.assign({}, CQSSC.RX4ZUX6); // 组选6
CQSSC.H4ZUX6.help = {
  desc: '至少选择2个二重号码，竞猜开奖号码的后四位，号码一致顺序不限即中奖。',
};
CQSSC.H4ZUX4 = Object.assign({}, CQSSC.RX4ZUX4); // 组选4
CQSSC.H4ZUX4.help = {
  desc: '至少选择1个三重号码和1个单号号码，竞猜开奖号码的后四位，号码一致顺序不限即中奖。',
};
//#endregion

/********************************************************************************
 * 前三
 *******************************************************************************/
//#region 前三
CQSSC.Q3ZX = Object.assign({}, CQSSC.H3ZX); // 直选复式
CQSSC.Q3ZHXHZ = Object.assign({}, CQSSC.H3ZHXHZ); // 直选和值
CQSSC.Q3ZXKD = Object.assign({}, CQSSC.H3ZXKD); // 直选跨度
CQSSC.Q3Q3ZH = Object.assign({}, CQSSC.H3H3ZH); // 前三组合
CQSSC.Q3Z3 = Object.assign({}, CQSSC.H3Z3); // 组三复式
CQSSC.Q3Z6 = Object.assign({}, CQSSC.H3Z6); // 组六复式
CQSSC.Q3ZUXHZ = Object.assign({}, CQSSC.H3ZUXHZ); // 组选和值
CQSSC.Q3ZXBD = Object.assign({}, CQSSC.H3ZXBD); // 组选包胆
CQSSC.Q3HZWS = Object.assign({}, CQSSC.H3HZWS); // 和值尾数
CQSSC.Q3TSH = Object.assign({}, CQSSC.H3TSH); // 特殊号
CQSSC.Q3ZX.help = {
  desc: '从万位、千位、百位各选一个号码组成一注。',
  explain: '从万、千、百位中至少各选择一个号码组成一注，所选号码与开奖号码前3位相同，且顺序一致，即为中奖。',
  example: '投注方案：345 开奖号码：前三位 345，即中前三直选。',
};
CQSSC.Q3ZHXHZ.help = {
  desc: '从0-27中任意选择1个或1个以上号码。',
  explain: '所选数值等于开奖号码的万、千、百位三个数字相加之和，即为中奖。',
  example: '投注方案：和值 1 开奖号码：前三位 001、010、100，即中前三直选。',
};
CQSSC.Q3ZXKD.help = {
  desc: '从0-9中选择1个号码。',
  explain: '所选数值等于开奖号码的前3位最大与最小数字相减之差，即为中奖。',
  example: '投注方案：跨度8 开奖号码：1 2 9 * * ，最大9与最小1相减相等于8，所选号与跨度号码相同即中奖。',
};
CQSSC.Q3Q3ZH.help = {
  desc: '从万位、千位、百位各选一个号码组成三注。',
  explain:
    '从万、千、百位中至少各选择一个号码组成1-3星的组合共三注，当百位号码与开奖号码相同，则中1个3等奖； 如果百位与千位号码与开奖号码相同，则中1个3等奖以及1个2等奖，依此类推，最高可中3个奖。',
  example: '投注方案：购买：6+7+8，该票共6元，由以上3注：678(三星)、78(二星)、8(一星)构成 开奖号码：前三位 678，即可中三星、二星、一星各1注。',
};
CQSSC.Q3Z3.help = {
  desc: '从0-9中任意选择2个或2个以上号码。',
  explain: '从0-9中至少选择2个号码组成两注，所选号码与开奖号码的万、千、百位相同，且顺序不限，即为中奖。',
  example: '投注方案：588 开奖号码：前三位588（顺序不限），即可中前三组选三。',
};
CQSSC.Q3Z6.help = {
  desc: '从0-9中任意选择3个或3个以上号码。',
  explain: '从0-9中至少选择3个号码组成一注，所选号码与开奖号码的万、千、百位相同，顺序不限，即为中奖。',
  example: '投注方案：258 开奖号码：前三位 852（顺序不限），即中前三组选六。',
};
CQSSC.Q3ZUXHZ.help = {
  desc: '从1-26中任意选择1个以上号码。',
  explain: '开奖号码前3位为组三或组六形态(不含豹子号)，所选数值等于开奖号码万、千、百位三个数字相加之和，即为中奖。',
  example: '投注方案：和值3 开奖号码：前三位 003（顺序不限）即中前三组选三，或者前三位 012（顺序不限）即中前三组选六。',
};
CQSSC.Q3ZXBD.help = {
  desc: '从0-9中任选1个号码。',
  explain: '从0-9中任意选择1个胆码，开奖号码前3位为组三或组六形态(不含豹子号)，投注号码与开奖号码前3位中任意1位相同，即为中奖。',
  example: '投注方案：包胆3 开奖号码：前三位 3XX 或者 33X，即中前三组选三，或者前三位 3XY，即中前三组选六。',
};
CQSSC.Q3HZWS.help = {
  desc: '从0-9中选择1个号码。',
  explain: '所选数值等于开奖号码的万、千、百位三个数字相加之和的尾数，即为中奖。',
  example: '投注方案：和值尾数 8开奖号码：前三位 936，和值尾数为8，即中和值尾数。',
};
CQSSC.Q3TSH.help = {
  desc: '选择一个号码形态。',
  explain:
    '所选的号码特殊属性和开奖号码前3位的属性一致，即为中奖。其中：1.顺子号的万、千、百位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的前三位当中，任意2位数字相同的三位数号码。',
  example: '投注方案：豹子顺子对子 开奖号码：前三位 888，即中豹子；前三位 678，即中顺子；前三位 558，即中对子。',
};
//#endregion

/********************************************************************************
 * 中三
 *******************************************************************************/
//#region 中三
CQSSC.Z3ZX = Object.assign({}, CQSSC.H3ZX); // 直选复式
CQSSC.Z3ZHXHZ = Object.assign({}, CQSSC.H3ZHXHZ); // 直选和值
CQSSC.Z3ZXKD = Object.assign({}, CQSSC.H3ZXKD); // 直选跨度
CQSSC.Z3Z3ZH = Object.assign({}, CQSSC.H3H3ZH); // 中三组合
CQSSC.Z3Z3 = Object.assign({}, CQSSC.H3Z3); // 组三复式
CQSSC.Z3Z6 = Object.assign({}, CQSSC.H3Z6); // 组六复式
CQSSC.Z3ZUXHZ = Object.assign({}, CQSSC.H3ZUXHZ); // 组选和值
CQSSC.Z3ZXBD = Object.assign({}, CQSSC.H3ZXBD); // 组选包胆
CQSSC.Z3HZWS = Object.assign({}, CQSSC.H3HZWS); // 和值尾数
CQSSC.Z3TSH = Object.assign({}, CQSSC.H3TSH); // 特殊号
CQSSC.Z3ZX.help = {
  desc: '从千位、百位、十位各选一个号码组成一注。',
  explain: '从千、百、十位中至少各选择1个号码组成一注，所选号码与开奖号码中3位相同，且顺序一致，即为中奖。',
  example: '投注方案：345 开奖号码中三位：345，即中中三直选。',
};
CQSSC.Z3ZHXHZ.help = {
  desc: '从0-27中任意选择1个或1个以上号码。',
  explain: '所选数值等于开奖号码的千、百、十三个数字相加之和，即为中奖。',
  example: '投注方案：和值1 开奖号码：中三位001，010，100，即中中三和值。',
};
CQSSC.Z3ZXKD.help = {
  desc: '从0-9中选择1个号码。',
  explain: '所选数值等于开奖号码的中3位最大与最小数字相减之差，即为中奖。',
  example: '投注方案：跨度8 开奖号码： * 1 2 9  * ，最大9与最小1相减相等于8，所选号与跨度号码相同即中奖。',
};
CQSSC.Z3Z3ZH.help = {
  desc: '从千位、百位、十位各选一个号码组成三注。',
  explain:
    '从千、百、十位中至少各选择一个号码组成1-3星的组合共三注，当十位号码与开奖号码相同，则中1个3等奖； 如果百位与十位号码与开奖号码相同，则中1个3等奖以及1个2等奖，依此类推，最高可中3个奖。',
  example: '投注方案：购买：6+7+8，该票共6元，由以上3注：678(三星)、78(二星)、8(一星)构成 开奖号码：中三位 678，即可中三星、二星、一星各1注。',
};
CQSSC.Z3Z3.help = {
  desc: '从0-9中任意选择2个或2个以上号码。',
  explain: '从0-9中至少选择2个号码组成两注，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。',
  example: '投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。',
};
CQSSC.Z3Z6.help = {
  desc: '从0-9中任意选择3个或3个以上号码。',
  explain: '从0-9中至少选择3个号码组成一注，所选号码与开奖号码的千、百、十位相同，顺序不限，即为中奖。',
  example: '投注方案：258 开奖号码：中三位 852（顺序不限），即中三组选六',
};
CQSSC.Z3ZUXHZ.help = {
  desc: '从1-26中任意选择1个以上号码。',
  explain: '开奖号码中3位为组三或组六形态(不含豹子号)，所选数值等于开奖号码千、百、十位三个数字相加之和，即为中奖。',
  example: '投注方案：和值3 开奖号码：中三位 003（顺序不限）即中中三组选三，或者中三位 012（顺序不限）即中中三组选六。',
};
CQSSC.Z3ZXBD.help = {
  desc: '从0-9中任选1个号码。',
  explain: '从0-9中任意选择1个胆码，开奖号码中3位为组三或组六形态(不含豹子号)，投注号码与开奖号码中3位中任意1位相同，即为中奖。',
  example: '投注方案：包胆3 开奖号码：中三位 3XX 或者 33X，即中中三组选三，或者中三位 3XY，即中中三组选六。',
};
CQSSC.Z3HZWS.help = {
  desc: '从0-9中选择1个号码。',
  explain: '所选数值等于开奖号码的千、百、十位三个数字相加之和的尾数，即为中奖。',
  example: '投注方案：和值尾数 8开奖号码：中三位 936，和值尾数为8，即中和值尾数。',
};
CQSSC.Z3TSH.help = {
  desc: '选择一个号码形态。',
  explain:
    '所选的号码特殊属性和开奖号码中3位的属性一致，即为中奖。其中：1.顺子号的千、百、十位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的中三位当中，任意2位数字相同的三位数号码。',
  example: '投注方案：豹子顺子对子 开奖号码：中三位 888，即中豹子；中三位 678，即中顺子；中三位 558，即中对子。',
};
//#endregion

// #region 任选三
// 直选跨度
CQSSC.RX3ZXKD = Object.assign({}, CQSSC.H3ZXKD);
CQSSC.RX3ZXKD.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置，从0-9中选择1个以上号码。',
};
// 组选包胆
CQSSC.RX3ZXBD = Object.assign({}, CQSSC.H3ZXBD);
CQSSC.RX3ZXBD.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置，从0-9中任意选择1个包胆号码。',
};
// #endregion

/********************************************************************************
 * 前二
 *******************************************************************************/
//#region 前二
CQSSC.Q2ZXFS = Object.assign({}, CQSSC.EXZX); // 直选复式
CQSSC.Q2ZHXHZ = Object.assign({}, CQSSC.H2ZHXHZ); // 直选和值
CQSSC.Q2ZXKD = Object.assign({}, CQSSC.H2ZXKD); // 直选跨度
CQSSC.Q2ZX = Object.assign({}, CQSSC.H2ZX); // 组选复式
CQSSC.Q2ZUXHZ = Object.assign({}, CQSSC.H2ZUXHZ); // 组选和值
CQSSC.Q2ZXBD = Object.assign({}, CQSSC.H2ZXBD); // 组选包胆
CQSSC.Q2ZXFS.help = {
  desc: '从万位、千位中至少各选1个号码组成一注。',
  explain: '从万、千位中至少各选择一个号码组成一注，所选号码与开奖号码的前2位相同，且顺序一致，即为中奖。',
  example: '投注方案：58 开奖号码：前二位 58，即中前二直选。',
};
CQSSC.Q2ZHXHZ.help = {
  desc: '从0-18中任意选择1个或1个以上的和值号码。',
  explain: '所选数值等于开奖号码的万、千位二个数字相加之和，即为中奖。',
  example: '投注方案：和值1 开奖号码：前二位 01，10，即中前二直选。',
};
CQSSC.Q2ZXKD.help = {
  desc: '从0-9中任意选择1个号码组成一注。',
  explain: '所选数值等于开奖号码的前2位最大与最小数字相减之差，即为中奖。',
  example: '投注方案：跨度9 开奖号码：9 0 * * * ，最大9与最小0相减相等于9，所选号与跨度号码相同即中奖。',
};
CQSSC.Q2ZX.help = {
  desc: '从0-9中任意选择2个或2个以上号码。',
  explain: '从0-9中选2个号码组成一注，所选号码与开奖号码的万、千位相同，顺序不限，即中奖。',
  example: '投注方案：58 开奖号码：前二位 85 或者 58（顺序不限，不含对子号），即中前二组选。',
};
CQSSC.Q2ZUXHZ.help = {
  desc: '从1-17中任意选择1个或者1个以上号码。',
  explain: '所选数值等于开奖号码的万、千位二个数字相加之和（不含对子号），即为中奖。',
  example: '投注方案：和值 1 开奖号码：前二位 10 或者 01（顺序不限，不含对子号），即中前二组选。',
};
CQSSC.Q2ZXBD.help = {
  desc: '从0-9中任意选择1个包胆号码。',
  explain: '从0-9中任意选择1个胆码，开奖号码前2位各不相同(不含对子号)，投注号码与开奖号码前2位中任意1位相同，即为中奖。',
  example: '投注方案：包胆 8 开奖号码：前二位 8X，且X不等于8，即中前二组选。',
};
//#endregion
//#region  任选二
// 直选跨度
CQSSC.RX2ZXKD = Object.assign({}, CQSSC.H2ZXKD);
CQSSC.RX2ZXKD.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择两个位置,从0-9中选择1个以上号码。',
};
// 组选包胆
CQSSC.RX2ZXBD = Object.assign({}, CQSSC.H2ZXBD);
CQSSC.RX2ZXBD.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择两个位置，从0-9中任意选择1个包胆号码。',
};
//#endregion

/********************************************************************************
 * 不定位
 *******************************************************************************/
//#region 不定位
// 一码
CQSSC.BDWH31M = Object.assign({}, CQSSC.BDWQ31M);
CQSSC.BDWQ41M = Object.assign({}, CQSSC.BDWQ31M);
CQSSC.BDWH41M = Object.assign({}, CQSSC.BDWQ31M);
CQSSC.BDWWX1M = Object.assign({}, CQSSC.BDWQ31M);
CQSSC.BDWH31M.help = {
  desc: '从0-9中任意选择1个以上号码。',
  explain: '从0-9中至少选择1个号码，每注由1个号码组成，只要开奖号码的百、十、个位中包含所选号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：1 开奖号码：后三位至少出现1个1，即中后三一码不定位。',
};
CQSSC.BDWQ41M.help = {
  desc: '从0-9中任意选择1个以上号码。',
  explain: '从0-9中至少选择1个号码，每注由1个号码组成，只要开奖号码的万、千、百、十位中包含所选号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：1 开奖号码：前四位，至少出现1个1，即中前四一码不定位。',
};
CQSSC.BDWH41M.help = {
  desc: '从0-9中任意选择1个以上号码。',
  explain: '从0-9中至少选择1个号码，每注由1个号码组成，只要开奖号码的千、百、十、个位中包含所选号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：1 开奖号码：后四位，至少出现1个1，即中后四一码不定位。',
};
CQSSC.BDWWX1M.help = {
  desc: '从0-9中任意选择1个号码。',
  explain: '从0-9中至少选择1个号码，每注由1个号码组成，开奖号码中含所选号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：1 开奖号码：至少出现1个1，即中五星一码不定位。',
};
// 二码
CQSSC.BDWH32M = Object.assign({}, CQSSC.BDWQ32M);
CQSSC.BDWQ42M = Object.assign({}, CQSSC.BDWQ32M);
CQSSC.BDWH42M = Object.assign({}, CQSSC.BDWQ32M);
CQSSC.BDWWX2M = Object.assign({}, CQSSC.BDWQ32M);
CQSSC.BDWH32M.help = {
  desc: '从0-9中任意选择2个以上号码。',
  explain: '从0-9中至少选择2个号码，每注由2个不同的号码组成，开奖号码的百、十、个位中同时包含所选的2个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：12 开奖号码：后三位，至少出现1和2各1个，即中后三二码不定位。',
};
CQSSC.BDWQ42M.help = {
  desc: '从0-9中任意选择2个以上号码。',
  explain: '从0-9中至少选择2个号码，每注由2个不同的号码组成，开奖号码的万、千、百、十位中同时包含所选的2个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：12 开奖号码：前四位，至少出现1和2各一个，即中前四二码不定位。',
};
CQSSC.BDWH42M.help = {
  desc: '从0-9中任意选择2个以上号码。',
  explain: '从0-9中至少选择2个号码，每注由2个不同的号码组成，开奖号码的千、百、十、个位中同时包含所选的2个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：12 开奖号码：后四位，至少出现1和2各一个，即中后四二码不定位。',
};
CQSSC.BDWWX2M.help = {
  desc: '从0-9中任意选择2个以上号码。',
  explain:
    '从0-9中至少选择2个号码，每注由2个不同的号码组成，开奖号码的万、千、百、十、个位中同时包含所选的2个号码，即为中奖。（同个号码出现多次时只计一次中奖）',
  example: '投注方案：12 开奖号码：至少出现1和2各一个，即中五星二码不定位。',
};
//#endregion

/********************************************************************************
 * 大小单双
 *******************************************************************************/
//#region 大小单双
CQSSC.Q2DXDS = Object.assign({}, CQSSC.H2DXDS); // 前二大小单双
CQSSC.Q3DXDS = Object.assign({}, CQSSC.H3DXDS); // 前三大小单双
CQSSC.Q2DXDS.help = {
  desc: '从万位、千位中的“大、小、单、双”中至少各选一个组成一注。',
  explain: '对万、千位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
  example: '投注方案：小双 开奖号码：万、千位“小双”，即中前二大小单双。',
};
CQSSC.Q3DXDS.help = {
  desc: '从万位、千位、百位中的“大、小、单、双”中至少各选一个组成一注。',
  explain: '对万、千和百位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。',
  example: '投注方案：小双小 开奖号码：万、千、百位“小双小”，即中前三大小单双。',
};
//#endregion

/********************************************************************************
 * 单式
 *******************************************************************************/
// 前三
// ------------------------------------------------------------------------------
// 前三直选单式
CQSSC.Q3ZX_MDS = Object.assign({}, CQSSC.H3ZX_MDS);
CQSSC.Q3ZX_MDS.help = Object.assign({}, CQSSC.H3ZX_MDS.help);
CQSSC.Q3ZX_MDS.help.explain = '手动输入一个3位数号码组成一注，所选号码与开奖号码的万、千、百位相同，且顺序一致，即为中奖。';
CQSSC.Q3ZX_MDS.help.example = '投注方案：345 开奖号码：前三位 345，即中前三直选。';
// 中三直选单式
CQSSC.Z3ZX_MDS = Object.assign({}, CQSSC.H3ZX_MDS);
CQSSC.Z3ZX_MDS.help = Object.assign({}, CQSSC.H3ZX_MDS.help);
CQSSC.Z3ZX_MDS.help.explain = '手动输入一个3位数号码组成一注，所选号码与开奖号码的千、百、十位相同，且顺序一致，即为中奖。';
CQSSC.Z3ZX_MDS.help.example = '投注方案：345 开奖号码：中三位 345，即中中三直选。';
// 前三组三单式
CQSSC.Q3Z3_DS = Object.assign({}, CQSSC.H3Z3_DS);
CQSSC.Q3Z3_DS.help = Object.assign({}, CQSSC.H3Z3_DS.help);
CQSSC.Q3Z3_DS.help.explain = '手动输入一个3位数号码组成一注，三个数字当中必须有二个数字相同，所选号码与开奖号码的万、千、百位相同，且顺序不限，即为中奖。';
CQSSC.Q3Z3_DS.help.example = '投注方案：588 开奖号码：前三位588（顺序不限），即可中前三组选三。';
// 中三组三单式
CQSSC.Z3Z3_DS = Object.assign({}, CQSSC.H3Z3_DS);
CQSSC.Z3Z3_DS.help = Object.assign({}, CQSSC.H3Z3_DS.help);
CQSSC.Z3Z3_DS.help.explain = '手动输入一个3位数号码组成一注，三个数字当中必须有二个数字相同，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。';
CQSSC.Z3Z3_DS.help.example = '投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。';
// 前三组六单式
CQSSC.Q3Z6_DS = Object.assign({}, CQSSC.H3Z6_DS);
CQSSC.Q3Z6_DS.help = Object.assign({}, CQSSC.H3Z6_DS.help);
CQSSC.Q3Z6_DS.help.explain = '手动输入一个3位数号码组成一注，三个数字无需相同，所选号码与开奖号码的万、千、百位相同，且顺序不限，即为中奖。';
CQSSC.Q3Z6_DS.help.example = '投注方案：158 开奖号码：前三位581（顺序不限），即可中前三组选六。';
// 中三组六单式
CQSSC.Z3Z6_DS = Object.assign({}, CQSSC.H3Z6_DS);
CQSSC.Z3Z6_DS.help = Object.assign({}, CQSSC.H3Z6_DS.help);
CQSSC.Z3Z6_DS.help.explain = '手动输入一个3位数号码组成一注，三个数字无需相同，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。';
CQSSC.Z3Z6_DS.help.example = '投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选六。';
// 前三混合组选
CQSSC.Q3HHZX_DS = Object.assign({}, CQSSC.H3HHZX_DS);
CQSSC.Q3HHZX_DS.help = Object.assign({}, CQSSC.H3HHZX_DS.help);
CQSSC.Q3HHZX_DS.help.explain = '手动输入一个3位数号码为一注(不含豹子号)，开奖号码前3位为组三或组六形态，投注号码与开奖号码前3位相同，顺序不限，即为中奖。';
CQSSC.Q3HHZX_DS.help.example = '投注方案：001 和 123 开奖号码：前三位 010（顺序不限）即中前三组选三，或者前三位 312（顺序不限）即中前三组选六。';
// 中三混合组选
CQSSC.Z3HHZX_DS = Object.assign({}, CQSSC.H3HHZX_DS);
CQSSC.Z3HHZX_DS.help = Object.assign({}, CQSSC.H3HHZX_DS.help);
CQSSC.Z3HHZX_DS.help.explain = '手动输入一个3位数号码为一注(不含豹子号)，开奖号码中3位为组三或组六形态，投注号码与开奖号码中3位相同，顺序不限，即为中奖。';
CQSSC.Z3HHZX_DS.help.example = '投注方案：001 和 123 开奖号码：中三位 010（顺序不限）即中中三组选三，或者中三位 312（顺序不限）即中中三组选六。';
// 任选三
// ------------------------------------------------------------------------------
// 直选单式
CQSSC.RX3ZX_MDS = Object.assign({}, CQSSC.H3ZX_MDS);
CQSSC.RX3ZX_MDS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置,至少手动输入一个三位数的号码构成一注。',
};
// 混合组选
CQSSC.RX3HHZX_DS = Object.assign({}, CQSSC.H3HHZX_DS);
CQSSC.RX3HHZX_DS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置,手动至少输入三个号码构成一注(不包含豹子号)。',
};
// 组六单式
CQSSC.RX3Z6_DS = Object.assign({}, CQSSC.H3Z6_DS);
CQSSC.RX3Z6_DS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置,手动至少输入三个号码构成一注。',
};
// 组三单式
CQSSC.RX3Z3_DS = Object.assign({}, CQSSC.H3Z3_DS);
CQSSC.RX3Z3_DS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择三个位置,手动至少输入三个号码构成一注。',
};

// 前二
// ------------------------------------------------------------------------------
// 直选单式
CQSSC.Q2ZXFS_MDS = Object.assign({}, CQSSC.EXZX_MDS);
CQSSC.Q2ZXFS_MDS.help = Object.assign({}, CQSSC.EXZX_MDS.help);
CQSSC.Q2ZXFS_MDS.help.explain = '手动输入一个2位数号码组成一注，输入号码的万、千位与开奖号码相同，且顺序一致，即为中奖。';
CQSSC.Q2ZXFS_MDS.help.example = '投注方案：58 开奖号码：前二位 58，即中前二直选。';
// 组选单式
CQSSC.Q2ZX_DS = Object.assign({}, CQSSC.H2ZX_DS);
CQSSC.Q2ZX_DS.help = Object.assign({}, CQSSC.H2ZX_DS.help);
CQSSC.Q2ZX_DS.help.explain = '手动输入一个2位数号码组成一注，输入号码的万、千位与开奖号码相同，顺序不限，即为中奖。';
CQSSC.Q2ZX_DS.help.example = '投注方案：58 开奖号码：前二位 85 或者 58（顺序不限，不含对子号），即中前二组选。';
// 任选二
// ------------------------------------------------------------------------------
// 直选单式
CQSSC.RX2ZXFS_MDS = Object.assign({}, CQSSC.EXZX_MDS);
CQSSC.RX2ZXFS_MDS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择两个位置,至少手动输入一个两位数的号码构成一注。',
};
// 组选单式
CQSSC.RX2ZX_DS = Object.assign({}, CQSSC.H2ZX_DS);
CQSSC.RX2ZX_DS.help = {
  desc: '从万位、千位、百位、十位、个位中至少选择两个位置,至少手动输入一个两位数的号码构成一注。',
};
export default CQSSC;
