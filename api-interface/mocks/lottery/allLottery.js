/**
 * 彩票-所有种类（包括传统）
 *
 * @url lottery/allLottery.action
 *
 * type: { 0: '全部彩种', 1: '时时彩', 2: '快三', 3: '11选5', 4: 'PK10', 5: 'PC蛋蛋', 6: '低频', 7: '快乐十分' }
 */

https: module.exports = ({ method, query, body }) => {
  return {
    hots: [
      // {
      //   icon: 'https://jllcp1.com/images/pic/ico-bj28.png',
      //   label: '加拿大28',
      //   alias: 'JND28',
      //   curIssue: '904240',
      //   openNum: '',
      // },
      {
        icon: 'https://jllcp1.com/images/pic/JXK3.png',
        label: 'CT江西快三',
        alias: 'JXK3',
        curIssue: '20180814009',
        openNum: '',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170927172854.png',
        label: '吉利飞艇',
        alias: 'WFFT',
        curIssue: '20180713260',
        openNum: '',
      },
      {
        icon: 'https://jllcp1.com/images/pic/icon-CQSSC.png',
        label: '重庆时时彩',
        alias: 'CQSSC',
        curIssue: '20180814026',
        openNum: '8,8,9,6,0',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170901112555.png',
        label: '北京PK拾',
        alias: 'BJPK10',
        curIssue: '698261',
        openNum: '04,07,01,06,02,08,05,09,10,03',
      },
      {
        icon: 'https://jllcp1.com/images/pic/JSK3.png',
        label: '江苏快三',
        alias: 'JSK3',
        curIssue: '20180814011',
        openNum: '2,5,6',
      },
      // {
      //   icon: 'https://jllcp1.com/images/pic/20171012105245.png',
      //   label: '香港六合彩',
      //   alias: 'HKSIX',
      //   curIssue: '2018090',
      //   openNum: '49,47,11,01,25,38,37',
      // },
      {
        icon: 'https://jllcp1.com/images/pic/ico-bj28.png',
        label: '北京28',
        alias: 'BJ28',
        curIssue: '904240',
        openNum: '',
      },
    ],
    list: [
      // {
      //   icon: 'https://jllcp1.com/images/pic/ico-bj28.png',
      //   label: '加拿大28',
      //   alias: 'JND28',
      //   type: 5,
      //   column: '1',
      // },
      { icon: 'https://jllcp1.com/images/pic/JXK3.png', label: 'CT江西快三', alias: 'JXK3', type: 2, column: '1' },
      {
        icon: 'https://jllcp1.com/images/pic/icon-CQSSC.png',
        label: '重庆时时彩',
        alias: 'CQSSC',
        type: 1,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170901112555.png',
        label: '北京PK拾',
        alias: 'BJPK10',
        type: 4,
        column: '1',
      },
      { icon: 'https://jllcp1.com/images/pic/JSK3.png', label: '江苏快三', alias: 'JSK3', type: 2, column: '1' },
      // {
      //   icon: 'https://jllcp1.com/images/pic/20171012105245.png',
      //   label: '香港六合彩',
      //   alias: 'HKSIX',
      //   type: 6,
      //   column: '1',
      // },
      { icon: 'https://jllcp1.com/images/pic/ico-bj28.png', label: '北京28', alias: 'BJ28', type: 5, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/YFK3.png', label: '极速快三', alias: 'YFK3', type: 2, column: '1' },
      {
        icon: 'https://jllcp1.com/images/pic/EFPK10.png',
        label: '二分PK10',
        alias: 'EFPK10',
        type: 4,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/icon-SFSSC.png',
        label: '三分时时彩',
        alias: 'SFSSC',
        type: 1,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170927172854.png',
        label: '三分PK10',
        alias: 'SFPK10',
        type: 4,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/WFHKSIX.png',
        label: '五分六合彩',
        alias: 'WFHKSIX',
        type: 6,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/icon-EFSSC.png',
        label: '二分时时彩',
        alias: 'EFSSC',
        type: 1,
        column: '1',
      },
      { icon: 'https://jllcp1.com/images/pic/wfk3.png', label: '福彩快三', alias: 'WFK3', type: 2, column: '1' },
      {
        icon: 'https://jllcp1.com/images/pic/icon-FFSSC.png',
        label: '分分时时彩',
        alias: 'YFSSC',
        type: 1,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/FFPK10.png',
        label: '分分PK10',
        alias: 'YFPK10',
        type: 4,
        column: '1',
      },
      { icon: 'https://jllcp1.com/images/pic/bjk3.png', label: '北京快三', alias: 'BJK3', type: 2, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/gxk3.png', label: '广西快三', alias: 'GXK3', type: 2, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/hebk3.png', label: '河北快三', alias: 'HEBK3', type: 2, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/hbk3.png', label: '湖北快三', alias: 'HBK3', type: 2, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/shk3.png', label: '上海快三', alias: 'SHK3', type: 2, column: '1' },
      { icon: 'https://jllcp1.com/images/pic/gsk3.png', label: '甘肃快三', alias: 'GSK3', type: 2, column: '1' },
      {
        icon: 'https://jllcp1.com/images/pic/20170911170936.png',
        label: '广东11选5',
        alias: 'GD11X5',
        type: 3,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/ahk3-icon.png',
        label: '安徽快三',
        alias: 'AHK3',
        type: 2,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170918164841.png',
        label: '新疆时时彩',
        alias: 'XJSSC',
        type: 1,
        column: '1',
      },
      {
        icon: 'https://jllcp1.com/images/pic/20170918164744.png',
        label: '天津时时彩',
        alias: 'TJSSC',
        type: 1,
        column: '1',
      },
      { icon: 'https://jllcp1.com/images/pic/jlk3.png', label: '吉林快三', alias: 'JLK3', type: 2, column: '1' },
      {
        icon: 'https://jllcp1.com/images/pic/20170927172854.png',
        label: '吉利飞艇',
        alias: 'JLFT',
        type: 4,
        column: '1',
      },
    ],
    games: [
      {
        icon: 'https://www.1705r.com/data/kyPicture/brnn.png',
        label: '百人牛牛',
        url: 'https://www.baidu.com',
      },
    ],
    code: '0',
    msg: '',
  };
};
