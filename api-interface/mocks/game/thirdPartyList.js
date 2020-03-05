/**
 * 第三方平台列表
 *
 * @url /game/thirdPartyList.action
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: '',
    data: {
      list: [
        {
          id: 1,
          name: '棋牌',
          showName: '棋牌大廳',
          status: 1,
          linkEname: 'cardGame',
          hasData: true,
        },
        {
          id: 2,
          name: '真人',
          showName: '真人大廳',
          status: 1,
          linkEname: 'liveCasino',
          hasData: true,
        },
      ],
      thirdPartyEnabled: true,
    },
  };
};
