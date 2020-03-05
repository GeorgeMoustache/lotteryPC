/**
 * 彩票-彩票信息
 *
 * @url lottery/lotteryInfo.action?category=SFSSC
 *
 */

//for themeMix
// module.exports = ({ method, query, body }) => {
//   return {
//     code: 0,
//     msg: '',
//     info: function() {
//       const { category } = query;
//       let result = {
//         alias: category,
//         label: getLabel(category),
//       };
//       if (/SSC$/.test(category)) {
//         return Object.assign(result, {
//           icon: 'https://jllcp1.com/images/pic/icon-SFSSC.png',
//           totalIssue: 420,
//           openNum: Math.random() * 10 > 5 ? '3,4,3,2,1' : '',
//         });
//       }
//       if (/(PK10|FT)$/.test(category)) {
//         return Object.assign(result, {
//           icon: 'https://www.jllcp1.com/images/pic/20170927172854.png',
//           totalIssue: 179,
//           openNum: Math.random() * 10 > 5 ? '01,04,02,05,09,06,03,10,07,08' : '',
//         });
//       }
//       if (/[^P]K3$/.test(category)) {
//         return Object.assign(result, {
//           icon: 'https://jllcp1.com/images/pic/ahk3-icon.png',
//           totalIssue: 80,
//           openNum: Math.random() * 10 > 5 ? '1,5,6' : '',
//         });
//       }
//       if (/11X5$/.test(category)) {
//         return Object.assign(result, {
//           icon: 'https://jllcp1.com/images/pic/20170911170936.png',
//           totalIssue: 84,
//           openNum: Math.random() * 10 > 5 ? '01,03,02,09,08' : '',
//         });
//       }
//       if (/28$/.test(category)) {
//         return Object.assign(result, {
//           icon: 'https://jllcp1.com/images/pic/ico-bj28.png',
//           openNum: Math.random() * 10 > 5 ? '4,8,5' : '',
//         });
//       }
//       if (/HKSIX$/.test(category)) {
//         return Object.assign(result, {
//           totalIssue: 30,
//           icon: 'https://jllcp1.com/images/pic/20171012105245.png',
//           openNum: '33,21,41,20,12,28,09',
//           endTime: endTime(),
//           lastEndTime: '2019-01-18 14:53:30',
//         });
//       }
//     },
//   };
// };

//for themeBoMao
module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    info: function() {
      const { category } = query;
      let result = {
        alias: category,
        label: getLabel(category),
      };
      if (/SSC$/.test(category)) {
        return Object.assign(result, {
          icon: 'https://i.imgur.com/YxLfF9G.png',
          totalIssue: 420,
          openNum: Math.random() * 10 > 5 ? '3,4,3,2,1' : '',
        });
      }
      if (/(PK10|FT)$/.test(category)) {
        return Object.assign(result, {
          icon: 'https://www.jllcp1.com/images/pic/20170927172854.png',
          totalIssue: 179,
          openNum: Math.random() * 10 > 5 ? '01,04,02,05,09,06,03,10,07,08' : '',
        });
      }
      if (/[^P]K3$/.test(category)) {
        return Object.assign(result, {
          icon: 'https://jllcp1.com/images/pic/ahk3-icon.png',
          totalIssue: 80,
          openNum: Math.random() * 10 > 5 ? '1,5,6' : '',
        });
      }
      if (/11X5$/.test(category)) {
        return Object.assign(result, {
          icon: 'https://jllcp1.com/images/pic/20170911170936.png',
          totalIssue: 84,
          openNum: Math.random() * 10 > 5 ? '01,03,02,09,08' : '',
        });
      }
      if (/28$/.test(category)) {
        return Object.assign(result, {
          icon: 'https://jllcp1.com/images/pic/ico-bj28.png',
          openNum: Math.random() * 10 > 5 ? '4,8,5' : '',
        });
      }
      if (/HKSIX$/.test(category)) {
        return Object.assign(result, {
          totalIssue: 30,
          icon: 'https://jllcp1.com/images/pic/20171012105245.png',
          openNum: '33,21,41,20,12,28,09',
          endTime: endTime(),
          lastEndTime: '2019-01-18 14:53:30',
          year: function() {
            return new Date().getFullYear();
          }, // HKSIX增加阴历字段
        });
      }
    },
  };
};

function getLabel(category) {
  let obj = {
    // SSC
    CQSSC: '重庆时时彩',
    YFSSC: '一分时时彩',
    EFSSC: '二分时时彩',
    SFSSC: '三分时时彩',
    TJSSC: '天津时时彩',
    XJSSC: '新疆时时彩',

    // PK10
    BJPK10: '北京PK10',
    YFPK10: '一分PK10',
    EFPK10: '二分PK10',
    SFPK10: '三分PK10',

    // K3
    AHK3: '安徽快三',
    JXK3: '江西快三',
    JSK3: '江苏快三',

    // 11X5
    GD11X5: '广东11选5',

    // 28
    BJ28: '北京28',
    JND28: '加拿大28',

    // HK6
    HKSIX: '香港六合彩',
    WFHKSIX: '五分六合彩',

    // FT
    WFFT: '幸运飞艇',
  };
  return obj[category];
}

function endTime() {
  // return '2018-08-03 21:30:00';
  var d = new Date();
  d.setSeconds(d.getSeconds() + 5, 0);
  // return '2017-10-26 21:30:00'
  return d.toJSON().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
}
