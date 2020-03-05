import TWELVE from './lottery/hk6_12';
import { lotteryApi, gameBoyApi } from '@/api';

window.diffTime = 0;

const mixin = {
  data() {
    return {
      CATEGORYS: [], // lottery大类
      thirdPartyTab: [], // 所有游戏大类tabs,
      thirdPartyId: '',
      thirdPartyRecord: [], //會員中心記錄的遊戲大類
    };
  },
  created() {
    this.fetchServerDate();
    this.fetchThirdPartyList();
    this.fetchLotteryGroup();
  },
  methods: {
    // -------------------------- 初始化相关
    // 获取服务时间
    async fetchServerDate() {
      try {
        const data = await lotteryApi.serverDate();
        const { code, msg, serverDate } = data;
        if (code != 0) return;
        window.diffTime = new Date(serverDate.replace(/-/g, '/')) - new Date();
      } catch (error) {}
    },
    // 第三方平台列表
    fetchThirdPartyList() {
      gameBoyApi.thirdPartyList().then(data => {
        const { code } = data;
        if (code != 0) return;

        //判斷第三方平台是否關閉
        const { list } = data.data;

        //取得 navBar 第三方列表
        this.thirdPartyTab = list.filter(item => {
          return item.status != 0;
        });

        //取得會員中心記錄遊戲列表
        this.thirdPartyRecord = list.filter(item => {
          return item.hasData == true;
        });
      });
    },
    // 获取彩种分类列表
    async fetchLotteryGroup() {
      try {
        const data = await lotteryApi.groupList();
        const { code, msg, list } = data;
        if (code != 0) return;
        list.unshift({
          groupId: 0,
          groupName: '全部彩种',
          groupSort: 0,
        });
        this.CATEGORYS = list;
      } catch (error) {}
    },

    // ---------------------- 彩种相关
    formatOpenNum(lottery, cls) {
      if (lottery == null) return '';
      let html = '正在开奖...';
      let nums = lottery.openNum,
        category = lottery.alias;
      if (nums == '' || nums == null) return html;

      if (/28$/.test(category)) {
        html = format28(nums);
      } else if (/HKSIX$/.test(category)) {
        const _year = new Date().getFullYear();
        const { year = _year } = lottery;
        html = formatHK6(nums) + getHK6_open12(nums, year);
      } else if (/(PK10|FT)$/.test(category)) {
        html = nums
          .split(',')
          .map(num => {
            return `<li class="lottery-ball ball-${num} ft-num">${num}</li>`;
          })
          .join('');
      } else {
        html = nums
          .split(',')
          .map(num => {
            return `<li class="lottery-ball">${num}</li>`;
          })
          .join('');
      }
      return html;
    },
    format28,
    getHK6Color,
    getHK6_12,
    formatHK6,
    formatToday(value) {
      if (typeof value == 'string') {
        return value.split(' ')[0];
      }
      return new Date().Format('yyyy-MM-dd');
    },
    // bet record
    formatState(obj) {
      let str = '',
        state = obj.state;
      if (state == null) return '';
      switch (state) {
        case 1:
          str = '待开奖';
          break;
        case 2:
          str = '已结算（未中奖)';
          break;
        case 3:
          str = '已结算（中奖)';
          break;
        case 4:
          str = '进行中';
          break;
        case 5:
          str = '已结束';
          break;
        case 6:
          str = '已停止';
          break;
        case 7:
          str = '已取消';
          break;
        case 8:
          str = '后台撤单';
          break;
      }
      return str;
    },
    formatNums(obj, prop) {
      let result = '',
        nums = obj[prop],
        { category, mode } = obj;
      if (nums == null) return '';
      if (prop == 'openNum') {
        return nums == '' ? '尚未开奖' : nums.split(',').join('&nbsp;&nbsp;');
      }
      result = nums;
      if (/[^P]K3$/.test(category)) {
        if (/DT$/.test(mode)) {
          result = nums
            .split(',')
            .map(item => item.split('').join(','))
            .join('&nbsp;|&nbsp;');
        } else if (/TH2DX/.test(mode)) {
          result = nums.replace(/(\d{2}),(\d{1}[^\d+])/, '$1&nbsp;|&nbsp;$2');
        }
      } else if (/SSC$/.test(category)) {
        switch (mode) {
          case 'SXZX': // 四星-直选复式
            result = '-,' + nums;
            break;
          case 'H3ZX': // 后三-直选复式
            result = '-,-,' + nums;
            break;
          case 'EXZX': // 后二直选
            result = '-,-,-,' + nums;
            break;
          case 'Q2ZXFS': // 前二直选
            result = nums + ',-,-,-';
            break;
          case 'H3ZX': // 后三直选
          case 'H3H3ZH': // 后三组合
            result = '-,-,' + nums;
            break;
          case 'Z3ZX': // 中三直选
          case 'Z3Z3ZH': // 中三-中三组合
            result = '-,' + nums + ',-';
            break;
          case 'Q3ZX': // 前三直选
          case 'Q3Q3ZH': // 前三组合
            result = nums + ',-,-';
            break;
          case 'H3TSH': // 特殊号
          case 'Z3TSH': // 特殊号
          case 'Q3TSH': // 特殊号
            var obj = {
              bz: '豹子',
              sz: '顺子',
              dz: '对子',
            };
            result = nums
              .split(',')
              .map(n => obj[n])
              .join(',');
            break;
          default:
            result = nums;
            break;
        }
      } else if (/(PK10|11X5)$/.test(category)) {
        // if (/^CT\w+PK10$/.test(category)) {
        //   return nums;
        // }
        if (nums.indexOf(',') == -1) {
          return nums;
        }
        result = nums
          .split(',')
          .map(n => {
            let match = n.match(/(\d{2})/g);
            return match ? match.join(',') : '*';
          })
          .join('&nbsp;|&nbsp;');
      }
      return result;
    },
    /**
     * 打开新窗口
     * @param {Object} url
     * @param {String} windowName
     */
    openWindow(url, windowName) {
      let routeData = this.$router.resolve(url);
      var left = (document.body.clientWidth ? document.body.clientWidth : document.documentElement.clientWidth) - 1200;
      left = Math.max(0, left);
      let windowFeatures = `
        width=1200,
        height=700,
        left=${left},
        menubar=no,
        location=no,
        resizable=yes,
        scrollbars=yes,
        status=no,
        toolbar=no
      `;
      window.open(routeData.href, windowName, windowFeatures).focus();
    },
    // 获取彩种种类
    $getSpecies(category) {
      let str = 'Null';
      if (/SSC$/.test(category)) str = 'SSC';
      if (/PK10$/.test(category)) str = 'PK10';
      if (/11X5$/.test(category)) str = '11X5';
      if (/[^P]K3$/.test(category)) str = 'K3';
      if (/28$/.test(category)) str = '28';
      if (/HKSIX$/.test(category)) str = 'HK6';
      if (/FT$/.test(category)) str = 'FT';
      return str;
    },
    // 提款的金额验证
    $validateAmount(vm) {
      return function(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入金额'));
        } else {
          let max = 99999999;
          let min = 1;
          const { range } = vm;
          if (range && range.length) {
            max = Math.max(...range);
            min = Math.min(...range);
          }
          if (value < min) {
            callback(new Error(`输入最小金额不能低于${min}`));
          } else if (value > max) {
            callback(new Error(`输入最大金额不能高于${max}`));
          }
          callback();
        }
      };
    },
  },
  watch: {
    $route(to) {
      //router 變換重新獲取 config 設定值
      this.$store.dispatch('appConfig');

      //重新獲取 thirdPartyList
      this.fetchThirdPartyList();

      //取得當前頁面 thirdPartyId
      let route = this.$route.path.split('/');
      let currentRoute = route.pop();
      this.thirdPartyTab.forEach(item => {
        if (item.linkEname == currentRoute) {
          this.thirdPartyId = item.id;
        }
      });
    },
  },
};
export default mixin;

function format28(nums) {
  if (!nums) return '正在开奖...';
  let ary = nums.split(',');
  let result = ary.map(n => `<li class="lottery-ball">${n}</li>`);
  let sum = ary.reduce((pre, n) => +n + pre, 0);
  let cls = findsb(sum) || '';
  if (cls) cls = `ball-${cls.alias}`;
  result = result.join('<li class="lottery-symbol">+</li>') + '<li class="lottery-symbol">=</li>' + `<li  class="lottery-ball ${cls}">${sum}</li>`;
  return result;

  function findsb(value) {
    let sbAry = [
      { alias: 'green', label: '绿', summary: [1, 4, 7, 10, 16, 19, 22, 25, '极大', '极小', '绿波', '豹子'] },
      { alias: 'blue', label: '蓝', summary: [2, 5, 8, 11, 17, 20, 23, 26, '大单', '小单', '大双', '小双', '蓝波'] },
      { alias: 'red', label: '红', summary: [3, 6, 9, 12, 15, 18, 21, 24, '大', '小', '单', '双', '红波'] },
      { alias: 'gray', label: '无', summary: [0, 13, 14, 27] },
    ];
    let sbObj = sbAry.find(obj => {
      let num = obj.summary.find(n => n == value);
      return num != null;
    });
    return sbObj;
  }
}

/**
 * HK6-获取号码波色
 * @param {String|Number} value 号码
 */
function getHK6Color(value) {
  const sbAry = [
    {
      value: '红波',
      summary: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'],
    },
    {
      value: '蓝波',
      summary: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'],
    },
    {
      value: '绿波',
      summary: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'],
    },
  ];
  const i = sbAry.findIndex(ary => {
    return ary.summary.find(num => num == value);
  });
  return {
    sb: i == 0 ? 'red' : i == 1 ? 'blue' : 'green',
    val: value,
  };
}

/**
 * HK6-获取号码生肖
 * @param {String|Number} value 号码
 * @param {Number} lunarYear 阴历年份
 */
function getHK6_12(value, year) {
  if (year) {
    return getAnimal(value, year);
  }

  const obj = TWELVE[0].find(item => {
    return item.summary.find(val => val == value);
  });
  return obj ? obj.value : '';
}

/**
 * 获取生肖
 * @param {String|Number} num 号码
 * @param {Number} lunarYear 阴历年份
 */
function getAnimal(num, lunarYear) {
  lunarYear = lunarYear || new Date().getFullYear();
  let year = lunarYear - num + 1;
  return '鼠牛虎兔龙蛇马羊猴鸡狗猪'.charAt((year - 1900) % 12);
}

/**
 * HK6-获取的开奖号码生肖
 * @param {String} nums 开奖号码
 * @param {Number} lunarYear 阴历年份
 */
function getHK6_open12(nums, year) {
  let ary = nums.split(',').map(n => {
    const value = getHK6_12(n, year);
    return `<span class="twelve-label">${value}</span>`;
  });
  ary.splice(6, 0, '<span class="twelve-space"></span>');
  return `<li class="twelve-labels">${ary.join('')}</li>`;
}

/**
 * HK6-格式化开奖号码
 * @param {String} nums 开奖号码
 */
function formatHK6(nums) {
  if (!nums) return '正在开奖...';
  let ary = nums.split(',');
  ary = ary.map(n => getHK6Color(n));

  let result = ary.map(item => `<li class="lottery-ball ball-${item.sb}">${item.val}</li>`);
  result.splice(6, 0, `<li class="lottery-symbol">+</li>`);
  return result.join('');
}
