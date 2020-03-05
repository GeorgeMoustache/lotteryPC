/**
 * 聊天室使用者權限資料
 *
 * @url chatRoom/check
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: 'ok',
    data: {
      wid: '9dc4246e240965426a98b398243ac0b699d4', //websocket 連線ID
      roomId: 0, //聊天室房間 ID
      roomName: '我是聊天室標題', //聊天室房間標題
      //普通紅包參數
      redPacketConfig: {
        id: 1,
        minmoney: 1,
        maxmoney: 1000,
        numble: 2,
        content: '恭喜發財',
      },
      //單雷紅包參數
      singleBombConfig: {
        minmoney: 5,
        maxmoney: 200000,
        content: '恭喜發財',
        packConfig: [
          {
            packs: 7,
            odds: 1.6,
          },
          {
            packs: 9,
            odds: 1.2,
          },
        ],
      },
      //多雷紅包參數
      multiBombConfig: {
        packs: 9,
        minmoney: 5,
        maxmoney: 200000,
        content: '恭喜發財',
        bombConfig: [
          {
            numbers: 2,
            odds: 1.05,
          },
          {
            numbers: 3,
            odds: 1.28,
          },
          {
            numbers: 4,
            odds: 1.8,
          },
          {
            numbers: 5,
            odds: 2.5,
          },
        ],
      },
      //聊天室說明
      chatDescConfig: {
        redPackDesc:
          '<p>1.聊天室红包类型</p><p>（1）普通红包：符合聊天室发言条件且馀额大于发包金额即可发送。</p><p>（2）炫耀红包： 用于炫耀彩票中奖，可于中奖的彩票注单详情，点击发送炫耀红包，并符合聊天室发言条件且馀额大于发包金额即可发送。</p><p>（3）单雷红包： 设置单一雷点的红包，0-9任选一数字为雷点，抢到的红包金额尾數同雷点即为中雷，领红包者要依照所领到的红包金额x賠率 赔钱给发包者。</p><p>（4）多雷红包：设置多雷点红包，抢到的红包金额尾數中任一雷点为『预中雷』冻结赔付金额，领红包金额全数中雷点为视为『中雷』，赔率依照中雷者人数决定，一人中赔单雷，两人中赔双雷，三人中赔三雷，四雷中赔四雷，五雷含五雷以上视为扫雷赔扫雷赔率。</p><p>&nbsp;</p><p>2.领红包限制</p><p>（1）单雷红包：领包者馀额需大于赔付金额方可领红包。</p><p>（2）多雷红包：领包者馀额需大于扫雷赔付金额方可领红包。</p><p><p>&nbsp;</p>3.红包赔付倍率</p><p>（1）单雷红包：7包赔付发包金额倍率1.6倍，9包赔付发包金额倍率1.2倍。</p><p>（2）多雷红包：以发包金额计算，单雷1.2倍，双雷1.05倍，三雷1.28倍，四雷1.8倍，五雷含以上扫雷2.5倍。</p>', //說明內容
        singleBombPacks: '7,9', //單雷紅包發包數
        multiBombPacks: '9', //多雷紅包發包數
      },
      //權限相關
      permission: {
        userRoomAccess: true, //訪問權限
        isCommissioner: true, //是否為計劃專員
        isRoomManager: true, //是否為房管
        allowTalk: true, //是否可發言
        allowGradRed: true, //是否可領紅包
      },
      //使用者基本資訊
      user: {
        uid: 139,
        password: null,
        nickname: '老曹',
        groupId: 1,
        headImg: null,
        username: null,
        status: null,
        levelId: 6,
        label: null,
        accountType: 1,
        balance: 14200.23, //用戶錢包餘額
      },
    },
  };
};
