/**
 * 账户管理－今日盈亏(第三方)
 *
 * @url game/todayProfit.action?thirdPartyId={thirdPartyId}
 *
 */

module.exports = (query) => {
  let { thirdPartyId } = query.query;
  console.log('todayProfit thirdPartyId', thirdPartyId);
  //棋牌
  if (thirdPartyId == 1) {
    return {
      code: '0',
      msg: '',
      data: {
        totalBalance: '5192428.09', //余额
        amountProfit: '-1.00', //盈亏总额
        platform: [{
          platName: '開元棋牌', //各平台名稱
          betMoney: '1.00', //有效投注
          profit: '2.00', //輸贏金額
          transIn: '3.00', //轉入金額
          transOut: '4.00', //轉出金額
          balance: '5.00' //餘額
        },{
          platName: '神來也棋牌', //各平台名稱
          betMoney: '5.00', //有效投注
          profit: '4.00', //輸贏金額
          transIn: '3.00', //轉入金額
          transOut: '2.00', //轉出金額
          balance: '1.00' //餘額
        }]
      }
    };
  }
  //真人
  if (thirdPartyId == 2) {
    return {
      code: '0',
      msg: '',
      data: {
        totalBalance: '23057489.09', //余额
        amountProfit: '-1.00', //盈亏总额
        platform: [{
          platName: 'AG真人', //各平台名稱
          betMoney: '1.00', //有效投注
          profit: '2.00', //輸贏金額
          transIn: '3.00', //轉入金額
          transOut: '4.00', //轉出金額
          balance: '5.00' //餘額
        },{
          platName: 'DG真人', //各平台名稱
          betMoney: '5.00', //有效投注
          profit: '4.00', //輸贏金額
          transIn: '3.00', //轉入金額
          transOut: '2.00', //轉出金額
          balance: '1.00' //餘額
        }]
      }
    };
  }
};
