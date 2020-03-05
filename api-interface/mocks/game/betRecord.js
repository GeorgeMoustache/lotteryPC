/**
 * 账号管理-注單記錄
 *
 * @url game/betRecord.action?current={current}&size={size}&constomDate={startDate,endDate}&thirdPartyId={thirdPartyId}&platId={platId}
 * 
 */

module.exports = (query) => {
  const {thirdPartyId, platId} = query.query
  console.log('betRecord thirdPartyId', thirdPartyId)
  console.log('betRecord platId', platId)
  //棋牌
  if (thirdPartyId == '1') {
    return {
      code: '0',
      msg: '',
      data: {
        amountProfit: -1000.00,
        list: [{
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '炸金花',
            betMoney: '200.00',
            profit: 1200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '百人牛牛',
            betMoney: '55.55',
            profit: -200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '德州扑克',
            betMoney: '1450.50',
            profit: 0.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '炸金花',
            betMoney: '200.00',
            profit: 1200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '百人牛牛',
            betMoney: '55.55',
            profit: -200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '德州扑克',
            betMoney: '1450.50',
            profit: 0.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '炸金花',
            betMoney: '200.00',
            profit: 1200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '百人牛牛',
            betMoney: '55.55',
            profit: -200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '德州扑克',
            betMoney: '1450.50',
            profit: 0.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '炸金花',
            betMoney: '200.00',
            profit: 1200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '百人牛牛',
            betMoney: '55.55',
            profit: -200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '德州扑克',
            betMoney: '1450.50',
            profit: 0.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '炸金花',
            betMoney: '200.00',
            profit: 1200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '百人牛牛',
            betMoney: '55.55',
            profit: -200.00
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: '开元棋牌',
            gameName: '德州扑克',
            betMoney: '1450.50',
            profit: 0.00
          },
        ],
        totalCount: 2,
        'totalPage|1-5': 3, // 总共页数
      }
    };
  }
  //真人
  if (thirdPartyId == '2') {
    //AG
    if (platId == '5') {
      return {
        code: '0',
        msg: '',
        data: {
          amountProfit: -1000.00,
          list: [{
              date: '@date("yyyy-MM-dd hh:mm")',
              platName: 'AG真人',
              gameName: '百家乐',
              profit: 75.02
            },
            {
              date: '@date("yyyy-MM-dd hh:mm")',
              platName: 'AG真人',
              gameName: '百家乐',
              profit: -6.03
            },
          ],
          totalCount: 3,
          totalPage: 1, // 总共页数
        }
      };
    }
    //DG
    if (platId == '6') {
      return {
        code: '0',
        msg: '',
        data: {
          amountProfit: -1000.00,
          list: [
            {
              date: '@date("yyyy-MM-dd hh:mm")',
              platName: 'DG真人',
              gameName: '百家乐',
              profit: -36.02
            },
          ],
          totalCount: 3,
          totalPage: 1, // 总共页数
        }
      };
    }
    return {
      code: '0',
      msg: '',
      data: {
        amountProfit: -1000.00,
        list: [{
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: 'AG真人',
            gameName: '百家乐',
            profit: 75.02
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: 'AG真人',
            gameName: '百家乐',
            profit: -6.03
          },
          {
            date: '@date("yyyy-MM-dd hh:mm")',
            platName: 'DG真人',
            gameName: '百家乐',
            profit: -36.02
          },
        ],
        totalCount: 3,
        totalPage: 1, // 总共页数
      }
    };
  }
};
