/**
 * 账号管理-投注纪录
 *
 * @url account/recordBet.action?category=SFSSC&size=10&current=1
 * state: [1:待开奖, 2:未中奖, 3:中奖, 4:进行中, 5:已结束, 6:已停止, 7:已取消]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    'list|10': [
      {
        'id|+1': 1,
        no: 2018013189265557, // 注单号
        username: 'kufish',
        date: '2018-01-31 13:37:36',
        category: 'BJPK10',
        categoryLabel: '三分时时彩',
        'issue|1': [201804200321, 20180420107, 107160],
        modeLabel: '五星直选/直选复式',
        openNum: '03,01,06,09,10,04,08,02,07,05', // 开奖号码
        'state|1': [1, 2, 3], // 状态
        betNum:
          '01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910,01020304050607080910',
        price: 0.01,
        count: 1, // 投注注数
        cost: 0.03, // 投注总额
        win: 0.01, // 中奖金额
        profit: -0.02, // 盈亏
      },
    ],
    total: 30, // 数据总数
    current: function() {
      try {
        return +JSON.parse(query).current;
      } catch (e) {
        return 1;
      }
    }, // 当前页码
    size: function() {
      try {
        return +JSON.parse(query).size;
      } catch (e) {
        return 10;
      }
    }, // 每页条数
  };
};

// AHK3
// {
// 	'category': 'AHK3',
// 	'mode': 'BTH3DT',
// 	'modeLabel': '三不同号/胆拖',
// 	'betNum': '12,3456'
// }, {
// 	'category': 'AHK3',
// 	'mode': 'TH2DX',
// 	'modeLabel': '二同号/单选',
// 	'betNum': '11,22,33,4,5,6'
// }, {
// 	'category': 'AHK3',
// 	'mode': 'BTH2DT',
// 	'modeLabel': '二不同号/胆拖',
// 	'betNum': '2,13456'
// }

// SSC中三，后三测试数据
[
  {
    id: 103,
    betNum: '0123456789,56789,01234',
    tplType: 'Z3ZX',
    count: 250,
    cost: '2.00',
    ratio: '780.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—直选复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '0,1,2,3,4,5,7,11,17,18,19,21,22',
    tplType: 'Z3ZHXHZ',
    count: 373,
    cost: '2.00',
    ratio: '980.000',
    digits: '2,3,4',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—直选和值',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '56789',
    tplType: 'Z3ZXKD',
    count: 570,
    cost: '2.00',
    ratio: '980.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—直选跨度',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '0123456789,01234,02468',
    tplType: 'Z3Z3ZH',
    count: 750,
    cost: '2.00',
    ratio: '980.000|98.000|9.800',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—中三组合',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '356789',
    tplType: 'Z3Z3',
    count: 30,
    cost: '2.00',
    ratio: '280.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组三复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '0123456789',
    tplType: 'Z3Z3',
    count: 90,
    cost: '2.00',
    ratio: '280.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组三复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '01234',
    tplType: 'Z3Z6',
    count: 10,
    cost: '2.00',
    ratio: '140.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组六复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '1,2,3|1,2,3|4,5,6',
    ratio: '990.000',
    tplType: 'Z3ZX_MDS',
    count: 3,
    cost: '2.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—直选单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '1,2,3,4,5,8,9,17,18,19',
    tplType: 'Z3ZUXHZ',
    count: 69,
    cost: '2.00',
    ratio: '326.666|163.333',
    digits: '2,3,4',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组选和值',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '113|455',
    ratio: '326.666',
    tplType: 'Z3Z3_DS',
    count: 2,
    cost: '2.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组三单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '8',
    tplType: 'Z3ZXBD',
    count: 54,
    cost: '2.00',
    ratio: '326.666|163.333',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组选包胆',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '123|123|456',
    ratio: '163.333',
    tplType: 'Z3Z6_DS',
    count: 3,
    cost: '2.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—组六单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: '56789',
    tplType: 'Z3HZWS',
    count: 5,
    cost: '2.00',
    ratio: '9.800',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—和值尾数',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '123|445',
    ratio: '326.666|163.333',
    tplType: 'Z3HHZX_DS',
    count: 2,
    cost: '2.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—混合组选',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 103,
    betNum: 'sz,dz,bz',
    tplType: 'Z3TSH',
    count: 3,
    cost: '2.00',
    ratio: '98.000|16.334|3.629',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '中三—特殊号',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '123|345',
    ratio: '326.666|163.333',
    tplType: 'H3HHZX_DS',
    count: 2,
    cost: '1.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—混合组选',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '123|213',
    ratio: '163.333',
    tplType: 'H3Z6_DS',
    count: 2,
    cost: '1.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组六单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '122|223',
    ratio: '326.666',
    tplType: 'H3Z3_DS',
    count: 2,
    cost: '1.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组三单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    betNum: '1,2,3|2,3,4',
    ratio: '990.000',
    tplType: 'H3ZX_MDS',
    count: 2,
    cost: '1.00',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—直选单式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: 'sz,dz,bz',
    tplType: 'H3TSH',
    count: 3,
    cost: '1.00',
    ratio: '98.000|16.334|3.629',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—特殊号',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '56789',
    tplType: 'H3HZWS',
    count: 5,
    cost: '1.00',
    ratio: '9.800',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—和值尾数',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '7',
    tplType: 'H3ZXBD',
    count: 54,
    cost: '1.00',
    ratio: '326.666|163.333',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组选包胆',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '3,8,13,18,23',
    tplType: 'H3ZUXHZ',
    count: 42,
    cost: '1.00',
    ratio: '326.666|163.333',
    digits: '2,3,4',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组选和值',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '56789',
    tplType: 'H3Z6',
    count: 10,
    cost: '1.00',
    ratio: '140.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组六复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '56789',
    tplType: 'H3Z3',
    count: 20,
    cost: '1.00',
    ratio: '280.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—组三复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '0123456789',
    tplType: 'H3ZXKD',
    count: 1000,
    cost: '1.00',
    ratio: '980.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—直选跨度',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '1,7,13,19',
    tplType: 'H3ZHXHZ',
    count: 159,
    cost: '1.00',
    ratio: '980.000',
    digits: '2,3,4',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—直选和值',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '01234,13579,13579',
    tplType: 'H3H3ZH',
    count: 375,
    cost: '1.00',
    ratio: '980.000|98.000|9.800',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—后三组合',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
  {
    id: 120,
    betNum: '0123456789,01234,13579',
    tplType: 'H3ZX',
    count: 250,
    cost: '1.00',
    ratio: '780.000',
    category: 'CQSSC',
    state: 1,
    no: 2018013189265557,
    username: 'kufish',
    date: '2018-01-31 13:37:36',
    categoryLabel: '三分时时彩',
    issue: '201804200321',
    modeLabel: '后三—直选复式',
    openNum: '03,01,06,09,10,04,08,02,07,05',
  },
];
