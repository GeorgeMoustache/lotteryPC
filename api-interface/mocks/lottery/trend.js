/**
 * 彩票-走势
 *
 * @url lottery/trend.action?category=SSC&limit=30
 * HKSIX字段只需list{issue,openNum}
 */

module.exports = ({ method, query, body }) => {
  var { category } = query;
  return {
    code: 0,
    msg: '',
    'list|200': [
      {
        'issue|+1': 20180208060, // String
        openNum: function() {
          var rand = Math.floor(Math.random() * 3);
          if (/[^P]K3/.test(category)) {
            return ['1,5,6', '2,2,6', '1,1,3'][rand];
          } else if (/HKSIX$/.test(category)) {
            var ary = [];
            for (var i = 0; i < 7; i++) {
              ary.push(padLeftZero(randNum(49, 1)));
            }
            return ary.join(',');
          } else if (/FT$/.test(category)) {
            var ary = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            return _poker
              .apply(null, ary)
              .shuffle()
              .join(',');
          } else if (/28$/.test(category)) {
            var ary = [];
            for (var i = 0; i < 3; i++) {
              ary.push(randNum(9, 0));
            }
            return ary.join(',');
          }
          return ['2,7,7,8,8', '8,7,6,3,5', '3,3,6,1,4'][rand];
        }, // String
        'omits|1': [
          ['3,7,0,6,10,21,27,2,28,5', '56,2,10,1,8,5,7,0,11,28', '4,3,33,1,15,2,25,0,24,8', '43,5,4,15,2,14,3,20,0,1', '3,4,73,9,1,16,10,2,0,8'],
          ['4,8,1,7,11,22,28,3,0,6', '57,3,11,2,9,6,8,0,12,29', '5,4,34,2,16,3,0,1,25,9', '44,6,5,0,3,15,4,21,1,2', '4,5,74,10,2,0,11,3,1,9'],
          ['5,9,2,0,12,23,29,4,1,7', '58,4,12,0,10,7,9,1,13,30', '6,5,35,3,17,4,0,2,26,10', '45,01,6,1,4,16,5,22,2,3', '5,6,75,11,0,1,12,4,2,10'],
        ], // Array
        year: function() {
          const isHK6 = /HKSIX$/.test(category);
          if (!isHK6) return undefined;
          return new Date().getFullYear();
        }, // HKSIX增加阴历字段
      },
    ],
    // Array 出现次数
    appearTime: [
      4,
      1,
      4,
      3,
      3,
      3,
      2,
      3,
      5,
      2,
      2,
      1,
      4,
      1,
      1,
      5,
      6,
      5,
      4,
      1,
      2,
      3,
      4,
      3,
      2,
      3,
      6,
      3,
      4,
      0,
      1,
      2,
      6,
      5,
      1,
      2,
      6,
      1,
      3,
      3,
      3,
      3,
      2,
      2,
      6,
      5,
      3,
      5,
      1,
      0,
    ],
    // Array 平均遗漏
    meanOmit: [
      6,
      15,
      6,
      7,
      7,
      7,
      10,
      7,
      5,
      10,
      10,
      15,
      6,
      15,
      15,
      5,
      4,
      5,
      6,
      15,
      10,
      7,
      6,
      7,
      10,
      7,
      4,
      7,
      6,
      30,
      15,
      10,
      4,
      5,
      15,
      10,
      4,
      15,
      7,
      7,
      7,
      7,
      10,
      10,
      4,
      5,
      7,
      5,
      15,
      30,
    ],
    // Array 最大遗漏
    maxOmit: [
      13,
      29,
      15,
      12,
      19,
      42,
      30,
      12,
      28,
      28,
      75,
      20,
      21,
      27,
      34,
      10,
      10,
      15,
      20,
      42,
      23,
      13,
      44,
      14,
      21,
      13,
      25,
      17,
      27,
      37,
      54,
      24,
      11,
      15,
      26,
      21,
      9,
      42,
      19,
      11,
      14,
      19,
      90,
      16,
      9,
      16,
      24,
      10,
      29,
      37,
    ],
    // Array 最大连出
    maxTime: [
      2,
      1,
      1,
      1,
      2,
      1,
      1,
      1,
      2,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      1,
      1,
      1,
      1,
      1,
      2,
      1,
      1,
      2,
      1,
      1,
      0,
      1,
      1,
      2,
      2,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      1,
      1,
      3,
      1,
      1,
      1,
      1,
      0,
    ],
  };
};

function padLeftZero(str) {
  return ('0' + str).substr(-2);
}

function randNum(max = 9, min = 0) {
  let { floor, random } = Math;
  return floor(random() * (max - min + 1)) + min;
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
