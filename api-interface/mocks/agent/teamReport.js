/**
 * 代理中心-代理报表彈窗詳情
 *
 * @url agent/teamReport.action?startDate={開始日期}&endDate={結束日期}&current={目前頁數}&size={每頁筆數}&itself={是否包含自身}&userName={查詢使用者ID}&type={彩票詳情種類}&thirdPartyId={第三方平台ID}
 *
 * type: (1:我的团队＋团队成绩, 2:充值提现＋活动优惠)
 *
 */

module.exports = ({ query }) => {
  if (query.thirdPartyId) {
    return {
      code: 0,
      msg: '',
      'list|20': [
        {
          username: '@cname', //帳號
          betMoney: 100, //投注金額
          profit: 150, //輸贏金額
        },
      ],
      total: 30, //資料總筆數
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
  } else if (query.type) {
    if (query.type == 1) {
      if (query.peopleType == 2) {
        return {
          code: 0,
          msg: '',
          'list|20': [
            {
              username: '@cname', //帳號
              'firstChargeMoney|1-100': 1, //首充金額
              chargeTime: '@date', //首充時間
            },
          ],
          total: 30, //資料總筆數
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
      } else {
        return {
          code: 0,
          msg: '',
          'list|20': [
            {
              username: '@cname', //帳號
              'betNums|1-100': 1, //投注次數
              betMoney: 500, //投注金額
              winMoney: 100, //中獎金額
              'balance|1-1000': 1, //餘額
              registerDate: '@date', //註冊時間
              lastLoginDate: '@date', //最後登入時間
            },
          ],
          total: 30, //資料總筆數
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
      }
    } else {
      return {
        code: 0,
        msg: '',
        'list|20': [
          {
            username: '@cname', //帳號
            depositMoney: 100, //充值金額
            withdrawMoney: 100, //提現金額
            debitMoney: 100, //扣款金額
            activityMoney: 100, //活動禮金
            returnPoint: 100, //團隊返點
            teamProfit: 100, //團隊盈利
          },
        ],
        total: 30, //資料總筆數
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
    }
  }
};
