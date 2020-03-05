/**
 * 彩票-近5期彩票信息
 *
 * @url lottery/lotteryRecently.action?category=SFSSC
 *
 */

module.exports = ({ method, query, body }) => {
  let { category } = query;
  return {
    code: 0,
    msg: '',
    info: function() {
      if (/SSC$/.test(category)) {
        return {
          curIssue: 20180125231,
          openIssue: 20180125230,
          recently: [
            {
              openNum: '5,6,6,9,9',
              issue: 20180125229,
            },
            {
              openNum: '8,0,6,9,6',
              issue: 20180125228,
            },
            {
              openNum: '8,0,6,9,6',
              issue: 20180124201,
            },
            {
              openNum: '8,0,6,9,6',
              issue: 20180124201,
            },
            {
              openNum: '9,2,3,8,2',
              issue: 20180124201,
            },
          ],
        };
      }
      if (/(PK10|FT)$/.test(category)) {
        return {
          curIssue: 20180726252,
          openIssue: 20180726251,
          recently: [
            {
              openNum: '08,01,04,05,10,06,07,03,09,02',
              issue: 20180726251,
            },
            {
              openNum: '08,01,04,05,10,06,07,03,09,02',
              issue: 20180726250,
            },
            {
              openNum: '08,01,04,05,10,06,07,03,09,02',
              issue: 20180726249,
            },
            {
              openNum: '08,01,04,05,10,06,07,03,09,02',
              issue: 20180726248,
            },
            {
              openNum: '01,07,02,10,06,05,09,03,04,08',
              issue: 20180726247,
            },
          ],
        };
      }
      if (/[^P]K3$/.test(category)) {
        return {
          curIssue: 11111111111,
          openIssue: 20180125061,
          recently: [
            {
              openNum: '1,5,5',
              issue: 20180125060,
            },
            {
              openNum: '6,6,6',
              issue: 20180125059,
            },
            {
              openNum: '2,4,4',
              issue: 20180125058,
            },
            {
              openNum: '1,3,3',
              issue: 20180125057,
            },
            {
              openNum: '4,4,4',
              issue: 20180125056,
            },
          ],
        };
      }
      if (/11X5$/.test(category)) {
        return {
          curIssue: 20180125065,
          openIssue: 20180125064,
          recently: [
            {
              openNum: '01,03,02,09,08',
              issue: 20180125063,
            },
            {
              openNum: '01,03,02,09,08',
              issue: 20180125062,
            },
            {
              openNum: '01,03,02,09,08',
              issue: 20180125061,
            },
            {
              openNum: '01,03,02,09,08',
              issue: 20180125060,
            },
            {
              openNum: '01,03,02,09,08',
              issue: 20180125059,
            },
          ],
        };
      }
      if (/28$/.test(category)) {
        return {
          curIssue: 869682,
          openIssue: 869683,
          recently: [
            {
              openNum: '3,7,1',
              issue: 869682,
            },
            {
              openNum: '9,2,2',
              issue: 869681,
            },
            {
              openNum: '5,3,6',
              issue: 869680,
            },
            {
              openNum: '4,0,3',
              issue: 869679,
            },
            {
              openNum: '0,6,3',
              issue: 869678,
            },
          ],
        };
      }
      if (/HKSIX$/.test(category)) {
        return {
          curIssue: '2018044',
          openIssue: '2018043',
          // 'endTime': '2018-04-28 21:30:00',
          recently: [
            {
              openNum: '33,21,41,20,12,28,09',
              issue: '2018043',
            },
            {
              openNum: '44,28,10,14,30,42,35',
              issue: '2018042',
            },
            {
              openNum: '49,33,20,40,45,21,43',
              issue: '2018041',
            },
            {
              openNum: '8,3,16,22,32,28,24',
              issue: '2018040',
            },
            {
              openNum: '40,12,14,36,38,15,42',
              issue: '2018039',
            },
          ],
        };
      }
    },
  };
};
