/**
 * 代理中心-代理报表 (第三方平台) GET
 *
 * @url game/agencyReport.action?startDate={2019-09-30}&endDate={2019-10-01}&itself={1 or 0}&userName={使用者帳號}
 *
 */

module.exports = query => {
  return {
    code: '0',
    msg: '',
    list: [
      {
        thirdPartyId: 1, //第三方平台ID
        platform: '棋牌', //第三方平台名稱
        people: 18, //投注人數 (PC用)
        betMoney: 12345678.0, //有效投注
        profit: 123.0, //輸贏金額
        money: 1000.0, //餘額 (APP用)
      },
      {
        thirdPartyId: 2,
        platform: '真人',
        people: 18,
        betMoney: 12345678.0,
        profit: -123.0,
        money: 1000.0,
      },
      {
        thirdPartyId: 3,
        platform: '电子',
        people: 18,
        betMoney: 12345678.0,
        profit: 0.0,
        money: 1000.0,
      },
      {
        thirdPartyId: 4,
        platform: '捕鱼',
        people: 18,
        betMoney: 12345678.0,
        profit: 123.0,
        money: 1000.0,
      },
      {
        thirdPartyId: 5,
        platform: '电竞',
        people: 18,
        betMoney: 12345678.0,
        profit: 123.0,
        money: 1000.0,
      },
      {
        thirdPartyId: 6,
        platform: '体育',
        people: 18,
        betMoney: 12345678.0,
        profit: 123.0,
        money: 1000.0,
      },
    ],
  };
};
