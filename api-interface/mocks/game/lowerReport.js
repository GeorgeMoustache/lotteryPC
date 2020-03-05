/**
 * 代理中心-下级报表 (第三方平台) GET
 *
 * @url game/lowerReport.action?thirdPartyId={thirdPartyId}&startDate={2019-09-30}&endDate={2019-10-01}&current={目前頁數}&size={每頁筆數}
 *
 */

module.exports = (query) => {
  let thirdPartyId = query.query.thirdPartyId;
  console.log('lowerReport:', thirdPartyId);
  //棋牌
  if (thirdPartyId == 1) {
    return {
      code: 0,
      msg: "",
      list: [
        { 
          userId: 3830828, //用戶id
          userName: "kyle1", //帳號
          userType: "代理", //用戶類型
          betMoney: 5000.00, //有效投注 (PC用)
          people: 2, //投注人數
          profit: 180.00, //輸贏金額
        },
        {
          userId: 3830828,
          userName: "kyle2",
          userType: "代理",
          betMoney: 5000.00,
          people: 2,
          profit: 0.00,
        },
        {
          userId: 3830828,
          userName: "kyle3",
          userType: "代理",
          betMoney: 5000.00,
          people: 2,
          profit: -180.00,
        }
      ],
      total: 30 //資料總筆數
    };
  }
  //真人
  if (thirdPartyId == 2) {
    return {
      code: 0,
      msg: "",
      list: [
        { 
          userId: 3830828,
          userName: "tilly1",
          userType: "代理",
          betMoney: 5000.00,
          people: 3,
          profit: 0.00,
        },
        {
          userId: 3830828,
          userName: "tilly2",
          userType: "代理",
          betMoney: 5000.00,
          people: 3,
          profit: 280.00,
        },
        {
          userId: 3830828,
          userName: "tilly3",
          userType: "代理",
          betMoney: 5000.00,
          people: 3,
          profit: -280.00,
        }
      ],
      total: 30
    };
  }
  //預設
  return {
    code: 0,
    msg: "",
    list: [
      { 
        userId: 3830828,
        userName: "rkr1",
        userType: "代理",
        betMoney: 5000.00,
        people: 1,
        profit: 0.00,
      },
      {
        userId: 3830828,
        userName: "rkr2",
        userType: "代理",
        betMoney: 5000.00,
        people: 1,
        profit: 500.00,
      },
      {
        userId: 3830828,
        userName: "rkr3",
        userType: "代理",
        betMoney: 5000.00,
        people: 1,
        profit: -500.00,
      }
    ],
    total: 30
  };
};
