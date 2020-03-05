/**
 * 聊天室掃雷紅包詳情
 *
 * @url chatRoom/packet/info/29efca5581ac174f4c29e354fdf676e86962
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: '',
    data: {
      title: '恭喜发财', //問候語
      headImg: 'https://i.imgur.com/s9hrGKT.png', //發包者頭像
      hostName: '125***', //發包者 ID
      totalMoney: 270, //紅包總金額
      totalPacks: 7, //紅包總數
      packs: 5, //已領紅包數
      bomb: '9', //雷點
      gradList: [
        //搶紅包清單列表
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png', //頭像
          username: '菜逼八', //user id
          date: '2019-01-01 21:12:13', //日期
          gradMoney: '5.30', //搶到金額 (非本人資料顯示 ***)
          self: true, //是否為自己
          bombStatus: 0, // 0:未中雷 1:中雷 2:預中雷
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: '小菜逼',
          date: '2019-01-01 21:10:30',
          gradMoney: '***',
          self: false,
          bombStatus: 2,
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: '123***',
          date: '2019-01-01 20:12:11',
          gradMoney: '***',
          self: false,
          bombStatus: 1,
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: 'lwl***',
          date: '2019-01-01 18:02:03',
          gradMoney: '***',
          self: false,
          bombStatus: 0,
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: 'w12***',
          date: '2019-01-01 18:01:13',
          gradMoney: '***',
          self: false,
          bombStatus: 0,
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: '賺好多',
          date: '2019-01-01 17:32:10',
          gradMoney: '***',
          self: false,
          bombStatus: 0,
        },
        {
          headImg: 'https://i.imgur.com/s9hrGKT.png',
          username: '213***',
          date: '2019-01-01 17:12:13',
          gradMoney: '***',
          self: false,
          bombStatus: 0,
        },
      ],
    },
  };
};
