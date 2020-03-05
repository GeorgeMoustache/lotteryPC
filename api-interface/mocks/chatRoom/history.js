/**
 * 聊天室歷史記錄
 *
 * @url chatRoom/history
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: 'ok',
    data: {
      pager: {
        page: 1,
        rows: 50,
        total: 6,
        pages: 1,
        data: null,
      },
      historyList: [
        //一般紅包
        {
          id: '149_0_2020_02_18_15_08_11_5',
          from: '149',
          to: null,
          type: 'red_packet',
          content: {
            number: 10,
            money: 10,
            id: '29efca5581ac174f4c29e354fdf676e86962',
            title: '阿囉哈',
            content: '（ ◔Д◔）',
            expiredTime: 90, //剩餘時間
            status: 0, //紅包狀態 [0:一般, 1:領完, 2:失效],
          },
          time: 1582009691000,
          nickname: '老曹老曹',
          rank: 6,
          self: true,
          userid: '149',
          label: '1',
          attention: 0,
          room: '0',
        },
        //炫耀紅包
        {
          id: '149_0_2020_02_18_15_08_32_16',
          from: '149',
          to: null,
          type: 'flaunt_red_packet',
          content: {
            number: 10,
            betAmount: 19.8,
            money: 10,
            id: '29efca5581ac174f4c29e354fdf676e86962',
            title: '123321',
            betType: 'QQ分分彩',
            expiredTime: 90, //剩餘時間
            status: 0, //紅包狀態 [0:一般, 1:領完, 2:失效],
          },
          time: 1582009712000,
          nickname: '老曹老曹',
          rank: 6,
          self: true,
          userid: '149',
          label: '1',
          attention: 0,
          room: '0',
        },
        //單雷紅包
        {
          id: '1492019123112305',
          from: '149',
          to: null,
          type: 'single_bomb',
          content: {
            id: '29efca5581ac174f4c29e354fdf676e86962',
            money: 168, //紅包金額
            bomb: '2', //雷點
            status: 0, //紅包狀態 [0:一般, 1:領完, 2:失效],
            number: 7, //紅包總數量
            remainPacks: 5, //剩餘可領取紅包數量
            expiredTime: 90, //剩餘時間
            title: '恭喜發財', //問候語
          },
          time: 1577766610000,
          nickname: '老曹老曹',
          rank: 6,
          self: false,
          userid: '149',
          label: '1',
          attention: 0,
        },
        //多雷紅包
        {
          id: '1492019123112305',
          from: '149',
          to: null,
          type: 'multi_bomb',
          content: {
            id: '29efca5581ac174f4c29e354fdf676e86962',
            money: 168, //紅包金額
            bomb: '2', //雷點
            status: 0, //紅包狀態 [0:一般, 1:領完, 2:失效],
            number: 7, //紅包總數量
            remainPacks: 5, //剩餘可領取紅包數量
            expiredTime: 90, //剩餘時間
            title: '恭喜發財', //問候語
          },
          time: 1577766610000,
          nickname: '老曹老曹',
          rank: 6,
          self: false,
          userid: '149',
          label: '1',
          attention: 0,
        },
        //取得紅包(單雷)
        {
          id: '1492020010920266',
          from: '149',
          to: null,
          type: 'receive_packet',
          content: {
            id: '29efca5581ac174f4c29e354fdf676e86962', //紅包 ID
            from: '老曹老曹', //誰發出該紅包
            to: '批零壹', //誰拿到該紅包
            grabType: 1, //0:自己領自己 1:自己領別人 2:別人領自己
            type: 'single_bomb', //取得紅包類型
            hitPoint: '5', //中雷點 (有中帶值沒中空字串)
            grabMoney: 12.01, //獲取金額
            loseMoney: 30.02, //賠付金額
          },
          time: 1578572774000,
          nickname: '老曹老曹',
          rank: 6,
          self: true,
          userid: '149',
          label: '1',
          attention: 0,
          room: null,
        },
        //取得紅包(多雷)
        {
          id: '1492020010920266',
          from: '149',
          to: null,
          type: 'receive_packet',
          content: {
            id: '29efca5581ac174f4c29e354fdf676e86962', //紅包 ID
            from: '老曹老曹', //誰發出該紅包
            to: '批零壹', //誰拿到該紅包
            grabType: 2, //0:自己領自己 1:自己領別人 2:別人領自己
            type: 'multi_bomb', //取得紅包類型
            hitPoint: '1,6,8', //中雷點 (有中帶值沒中空字串)
            grabMoney: 12.01, //獲取金額
            loseMoney: 0, //賠付金額
            candidate: false, //是否預中雷
            gameOver: true, //是否結算
            bombPeople: 3, //中雷人數
            totalLoseMoney: 450, //總賠付金額
          },
          time: 1578572774000,
          nickname: '老曹老曹',
          rank: 6,
          self: true,
          userid: '149',
          label: '1',
          attention: 0,
          room: null,
        },
      ],
    },
  };
};
