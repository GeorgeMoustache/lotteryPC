/**
 * 代理中心 - 投注明细 (第三方平台) GET
 * 
 * @url game/recordBet.action?thirdPartyId={thirdPartyId}&startDate={2019-09-30}&endDate={2019-10-01}&userName={使用者帳號}&current={目前頁數}&size={每頁筆數}
 * 
 * 
 */

module.exports = (query) => {
  let thirdPartyId = query.query.thirdPartyId;
  console.log('recordBet:', thirdPartyId);
  //棋牌
  if (thirdPartyId == 1) {
    return {
      code: 0,
      msg: "",
      list: [
        {
          userName: "kyle1", //帳號
          date: '2019-06-03 15:33', //時間
          platform: '开元棋牌', //平台
          game: '炸金花', //遊戲
          betMoney: 200.00, //投注金額 (PC用)
          profit: 312.25 //輸贏
        },
        {
          userName: "kyle2",
          date: '2019-06-03 15:33',
          platform: 'OO棋牌',
          game: '百人牛牛',
          betMoney: 200.00,
          profit: -312.25 
        },
        {
          userName: "kyle3",
          date: '2019-06-03 15:33',
          platform: 'XX棋牌',
          game: '三公',
          betMoney: 200.00,
          profit: 0.00 
        }
      ],
      total: 30, //資料總筆數
      totalProfit: 4735.52 //輸贏統計 (PC用)
    };
  }
  //真人
  if (thirdPartyId == 2) {
    return {
      code: 0,
      msg: "",
      list: [
        {
          userName: "tilly1",
          date: '2019-06-03 15:33',
          platform: 'AG真人',
          game: '炸金花',
          betMoney: 200.00,
          profit: 212.25
        },
        {
          userName: "tilly2",
          date: '2019-06-03 15:33',
          platform: 'DG真人',
          game: '炸金花',
          betMoney: 200.00,
          profit: 0.00
        },
        {
          userName: "tilly3",
          date: '2019-06-03 15:33',
          platform: 'BG真人',
          game: '炸金花',
          betMoney: 200.00,
          profit: -212.25
        }
      ],
      total: 30, //資料總筆數
      totalProfit: -3135.52 //輸贏統計 (PC用)
    };
  }
  return {
    code: 0,
    msg: "",
    list: [
      {
        userName: "rkrs1",
        date: '2019-06-03 15:33',
        platform: 'AG真人',
        game: '炸金花',
        betMoney: 200.00,
        profit: 212.25
      },
      {
        userName: "rkrs2",
        date: '2019-06-03 15:33',
        platform: 'DG真人',
        game: '炸金花',
        betMoney: 200.00,
        profit: 0.00
      },
      {
        userName: "rkrs3",
        date: '2019-06-03 15:33',
        platform: 'BG真人',
        game: '炸金花',
        betMoney: 200.00,
        profit: -212.25
      }
    ],
    total: 30, //資料總筆數
    totalProfit: -3135.52 //輸贏統計 (PC用)
  };
};
