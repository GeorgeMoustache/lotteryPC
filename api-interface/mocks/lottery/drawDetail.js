/**
 * 彩票-开奖详情
 *
 * @url lottery/drawDetail.action?category=SSC&datetime=2018-03-14
 *
 */

module.exports = ({ method, query, body }) => {
  var category = query.category;
  if(/HKSIX$/.test(category)) {
    return {
      code: 0,
      msg: "",
      list: [{
        issue: "20190821001",
        openNum: "03,08,02,06,01,07,09"
      },
      {
        issue: "20190821002",
        openNum: "03,08,02,06,01,07,09"
      },
      {
        issue: "20190821003",
        openNum: "03,08,02,06,01,07,09"
      },
      {
        issue: "20190821004",
        openNum: "03,08,02,06,01,07,09"
      },
      {
        issue: "20190821007",
        openNum: "03,08,02,06,01,07,09"
      }],
      openIssue: "20190821171",
      openNum: "04,18,28,43,13,03,47"
    }
  }
  if (/FT$/.test(category)) {
    return {
      code: 0,
      msg: "",
      list: [{
        issue: "20190821001",
        openNum: "03,08,02,06,01,07,09,04,10,05"
      },
      {
        issue: "20190821002",
        openNum: "03,08,02,06,01,07,09,04,10,05"
      },
      {
        issue: "20190821003",
        openNum: "03,08,02,06,01,07,09,04,10,05"
      },
      {
        issue: "20190821004",
        openNum: "03,08,02,06,01,07,09,04,10,05"
      },
      {
        issue: "20190821007",
        openNum: "03,08,02,06,01,07,09,04,10,05"
      }],
      'meanOmit': [6, 15, 6, 7, 7, 7, 10, 7, 5, 10, 10, 15, 6, 15, 15, 5, 4, 5, 6, 15, 10, 7, 6, 7, 10, 7, 4, 7, 6, 30, 15, 10, 4, 5, 15, 10, 4, 15, 7, 7, 7, 7, 10, 10, 4, 5, 7, 5, 15, 30],
      // Array 最大遗漏
      'maxOmit': [13, 29, 15, 12, 19, 42, 30, 12, 28, 28, 75, 20, 21, 27, 34, 10, 10, 15, 20, 42, 23, 13, 44, 14, 21, 13, 25, 17, 27, 37, 54, 24, 11, 15, 26, 21, 9, 42, 19, 11, 14, 19, 90, 16, 9, 16, 24, 10, 29, 37],
      // Array 最大连出
      'maxTime': [2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 0]
    }
  }
  if (/(SF|CQ)SSC/.test(category)) {
    return {
      code: 0,
      msg: "",
      openIssue: 20180320261,
      openNum: "8,4,2,7,1",
      curIssue: 20180320262, // 当前倒计时的期号
      "list|420": [
        {
          "issue|+1": 20180320001,
          openNum: function() {
            if (this.issue < 20180320261) {
              var ary = [];
              for (var i = 0; i < 5; i++) {
                ary.push(rand());
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  if (category == "TJSSC") {
    return {
      code: 0,
      msg: "",
      openIssue: 20180320043,
      openNum: "8,4,2,7,1",
      curIssue: 20180320044, // 当前倒计时的期号
      "list|84": [
        {
          "issue|+1": 20180320001,
          openNum: function() {
            if (this.issue < 20180320043) {
              var ary = [];
              for (var i = 0; i < 5; i++) {
                ary.push(rand());
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  if (/PK10$/.test(category)) {
    return {
      code: 0,
      msg: "",
      openIssue: 672026,
      openNum: "03,02,01,07,06,08,09,10,05,04",
      curIssue: 672027, // 当前倒计时的期号
      "list|179": [
        {
          "issue|+1": 671933,
          openNum: function() {
            if (this.issue < 672026) {
              var ary = [];
              for (var i = 0; i < 10; i++) {
                ary.push(padLeftZero(rand()));
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  if (/11X5$/.test(category)) {
    return {
      code: 0,
      msg: "",
      openIssue: 20180320052,
      openNum: "01,10,09,08,11",
      curIssue: 20180320053, // 当前倒计时的期号
      "list|84": [
        {
          "issue|+1": 20180320001,
          openNum: function() {
            if (this.issue < 20180320052) {
              var ary = [];
              for (var i = 0; i < 5; i++) {
                ary.push(padLeftZero(rand(11, 1)));
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  if (/K3$/.test(category)) {
    return {
      code: 0,
      msg: "",
      openIssue: 20180320054,
      openNum: "2,5,6",
      curIssue: 20180320055, // 当前倒计时的期号
      "list|80": [
        {
          "issue|+1": 20180320001,
          openNum: function() {
            if (this.issue < 20180320055) {
              var ary = [];
              for (var i = 0; i < 3; i++) {
                ary.push(rand(6, 1));
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  if (/28$/.test(category)) {
    return {
      code: 0,
      msg: "",
      openIssue: 878018,
      openNum: "2,5,6",
      curIssue: 878019, // 当前倒计时的期号
      "list|179": [
        {
          "issue|+1": 877911,
          openNum: function() {
            if (this.issue < 878018) {
              var ary = [];
              for (var i = 0; i < 3; i++) {
                ary.push(rand(9, 1));
              }
              return ary.join(",");
            } else {
              return "";
            }
          }
        }
      ]
    };
  }
  return {
    code: 0,
    msg: "",
    list: []
  };
};

function rand(max = 9, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 北京PK拾
function padLeftZero(str) {
  return ("0" + str).substr(-2);
}