/**
 * 模版
 * @param  {Number} options.time   遍历次数
 * @param  {Number} options.min    最小值
 * @param  {Number} options.max    最大值
 * @param  {Function} options.formatFn 格式方法
 * @return {Array}                [description]
 */
function createTemplate({ time = 1, min = 0, max = 9, formatFn }) {
  let result = [];
  while (time > 0) {
    let ary = [];
    for (let i = min; i <= max; i++) {
      ary.push(formatFn ? formatFn(i, time) : i);
    }
    result.push({
      empty: true,
      nums: ary,
    });
    time--;
  }
  return result;
}

// 北京PK拾
function padLeftZero(str) {
  return ('0' + str).substr(-2);
}

/**
 * 获取制定长度的乱序的数组
 * @param  {Number} min [description]
 * @param  {Number} max [description]
 * @param  {Number} len [description]
 * @return {[type]}     [description]
 */
function pokerSplice(min = 0, max = 9, len = 2) {
  let ary = [];
  while (min <= max) {
    ary.push(min++);
  }
  return _poker
    .apply(null, ary)
    .shuffle()
    .splice(0, len);
}

/**
 * 指定范围内的随机数
 * @param  {Number} max 最大值
 * @param  {Number} min 最小值
 * @return {Number}
 */
function rand(max = 9, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 洗牌
function _poker() {
  let arr = new Array();
  arr.push.apply(arr, arguments);

  arr.shuffle = function() {
    let that = this;
    for (let i = that.length - 1; i > 0; i--) {
      const rand = ~~(Math.random() * (i + 1));
      // 将其值与任意元素交换
      let temp = that[rand];
      that[rand] = that[i];
      that[i] = temp;
    }
    return that;
  };

  return arr;
}

// 去重
function unique(arr) {
  let ret = [];
  let hash = {};

  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i];
    const key = typeof item + item;
    if (hash[key] !== 1) {
      ret.push(item);
      hash[key] = 1;
    }
  }
  return ret;
}

/**
 * 排列组合
 * @param {Number} c length
 * @param {Number} b
 */
function Combination(c, b) {
  b = parseInt(b);
  c = parseInt(c);
  if (b < 0 || c < 0) return false;
  if (b == 0 || c == 0) return 1;
  if (b > c) return 0;
  if (b > c / 2) {
    b = c - b;
  }
  var a = 0;
  for (var i = c; i >= c - b + 1; i--) {
    a += Math.log(i);
  }
  for (var i = b; i >= 1; i--) {
    a -= Math.log(i);
  }
  a = Math.exp(a);
  return Math.round(a);
}

/**
 * 组合算法
 * @param  {Array} arr 数组
 * @param  {Number} num 位数
 * @return {[type]}     [description]
 */
function _combine(arr, num) {
  let r = [];
  (function f(temp, ary, n) {
    if (n == 0) return r.push(temp);
    for (let i = 0, l = ary.length; i <= l - n; i++) {
      f(temp.concat(ary[i]), ary.slice(i + 1), n - 1);
    }
  })([], arr, num);
  return r;
}
/**
 * 热选投注注数
 * @param  {Array} bet   投注内容
 * @param  {Number} digit 位数
 * @return {Number}       [description]
 */
function rxBetCount(bet, digit) {
  let betNumAry = [];
  for (let i = 0; i < bet.length; i++) {
    bet[i].length && betNumAry.push(i);
  }
  let betComAry = _combine(betNumAry, digit);
  let result = 0;
  for (let i = 0; i < betComAry.length; i++) {
    result += betComAry[i].reduce((pre, el) => {
      return pre * bet[el].length;
    }, 1);
  }
  return result;
}

/**
 * 按序列不重复的注数
 * @param  {Array} ary
 * @return {[type]}     [description]
 */
function uniqueSelecteCount(ary) {
  let sum = 0;
  sum = ary.reduce((pre, cur, idx) => {
    return pre * cur.length;
  }, 1);
  if (sum != 0) {
    for (let i = 0; i < ary[0].length; i++) {
      for (let j = 0; j < ary[1].length; j++) {
        for (let k = 0; k < ary[2].length; k++) {
          if (ary[0][i] == ary[1][j] && ary[0][i] == ary[2][k] && ary[1][j] == ary[2][k]) {
            sum += 2;
          }
          if (ary[0][i] == ary[1][j]) {
            --sum;
          }
          if (ary[0][i] == ary[2][k]) {
            --sum;
          }
          if (ary[1][j] == ary[2][k]) {
            --sum;
          }
        }
      }
    }
  }
  return sum;
}

/**
 * 单式验证
 * @param {String} str 输入的字符串
 * @param {Function} filterFn 过滤方法
 * /^\d{5}$/
 */
function singleValidate(str, filterFn) {
  let list = str.split(/[,;\n\s，；]/);
  list = list.filter(item => item); // 排除空值
  let filters = list.filter(item => filterFn(item));
  let result = {
    msg: '',
    list: filters,
  };
  if (filters.length != list.length) {
    result.msg = '号码或金额有误，请重新输入';
  }
  // 已过滤以下重复号码：
  // 已删除以下错误号码：
  return result;
}

/**
 * 随机方法／加入购物车
 */
function pushCart() {}

export {
  createTemplate,
  padLeftZero,
  pokerSplice,
  rand,
  unique,
  Combination,
  rxBetCount,
  uniqueSelecteCount,
  pushCart,
  singleValidate,
};
