/**
 * 額度轉換 + 平台列表
 *
 * @url game/allGame.action?thirdPartyId={thirdPartyId}
 *
 */

//for themeMix
// module.exports = (query) => {
//   let { thirdPartyId } = query.query;
//   console.log('allGame thirdPartyId', thirdPartyId)
//   //棋牌平台列表
//   if(thirdPartyId == '1') {
//     return {
//       code: '0',
//       msg: 'success',
//       wallet: [
//         {
//           accountId: '888888',
//           balance: '0',
//           linkEname: "KYGame",
//           platId: '1',
//           platform: '開元余额',
//           status: '1',
//           showName: '開元棋牌',
//         },
//         {
//           accountId: '888888',
//           balance: '666.43',
//           linkEname: "KLGame",
//           platId: '2',
//           platform: '凱爾余额',
//           status: '1',
//           showName: '凱爾棋牌',
//         },
//         {
//           accountId: '888888',
//           balance: '666.43',
//           linkEname: "ooGame",
//           platId: '3',
//           platform: '圈圈余额',
//           status: '0',
//           showName: '圈圈棋牌',
//         },
//         {
//           accountId: '888888',
//           balance: '666.43',
//           linkEname: "xxGame",
//           platId: '4',
//           platform: '叉叉余额',
//           status: '0',
//           showName: '叉叉棋牌',
//         },
//       ],
//     };
//   }
//   //真人平台列表
//   if(thirdPartyId == '2') {
//     return {
//       code: '0',
//       msg: 'success',
//       wallet: [
//         {
//           accountId: '888888',
//           balance: '666.43',
//           linkEname: "AGLiveCasino",
//           platId: '5',
//           platform: 'AG视讯',
//           status: '1',
//           showName: 'AG视讯',
//         },
//         {
//           accountId: '888888',
//           balance: '666.43',
//           linkEname: "DGLiveCasino",
//           platId: '6',
//           platform: 'DG视讯',
//           status: '1',
//           showName: 'DG视讯',
//         },
//       ],
//     };
//   }
//   //沒傳參數全帶
//   return {
//     code: '0',
//     msg: 'success',
//     wallet: [{
//         accountId: '888888',
//         balance: '7770987025.43',
//         linkEname: "GFGame",
//         platId: '0',
//         platform: '官方平台',
//         status: '1',
//         showName: '帳號餘額',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "KYGame",
//         platId: '1',
//         platform: '開元余额',
//         status: '1',
//         showName: '開元棋牌',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "KLGame",
//         platId: '2',
//         platform: '凱爾余额',
//         status: '1',
//         showName: '凱爾棋牌',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "ooGame",
//         platId: '3',
//         platform: '圈圈余额',
//         status: '0',
//         showName: '圈圈棋牌',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "xxGame",
//         platId: '4',
//         platform: '叉叉余额',
//         status: '0',
//         showName: '叉叉棋牌',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "AGLiveCasino",
//         platId: '5',
//         platform: 'AG视讯',
//         status: '1',
//         showName: 'AG视讯',
//       },
//       {
//         accountId: '888888',
//         balance: '0',
//         linkEname: "DGLiveCasino",
//         platId: '6',
//         platform: 'DG视讯',
//         status: '1',
//         showName: 'DG视讯',
//       },
//     ],
//   };
// };

//for themeBoMao
module.exports = (query) => {
  let { thirdPartyId } = query.query;
  console.log('allGame thirdPartyId', thirdPartyId)
  //棋牌平台列表
  if(thirdPartyId == '1') {
    return {
      code: '0',
      msg: 'success',
      wallet: [
        {
          accountId: '888888',
          balance: '0',
          linkEname: "KYGame",
          platId: '1',
          platform: '開元余额',
          status: '1',
          showName: '開元棋牌',
          linkEname: 'KYGame',
        },
        {
          accountId: '888888',
          balance: '666.43',
          platId: '2',
          platform: '大話骰余额',
          status: '1',
          showName: '大話骰',
          linkEname: 'GDGDice',
        }
      ],
    };
  }
  //真人平台列表
  if(thirdPartyId == '2') {
    return {
      code: '0',
      msg: 'success',
      wallet: [
        {
          accountId: '888888',
          balance: '666.43',
          linkEname: "AGLiveCasino",
          platId: '5',
          platform: 'AG视讯',
          status: '1',
          showName: 'AG视讯',
        }
      ],
    };
  }
  //沒傳參數全帶
  return {
    code: '0',
    msg: 'success',
    wallet: [{
        accountId: '888888',
        balance: '7770987025.43',
        linkEname: "GFGame",
        platId: '0',
        platform: '官方平台',
        status: '1',
        showName: '帳號餘額',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "KYGame",
        platId: '1',
        platform: '開元余额',
        status: '1',
        showName: '開元棋牌',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "KLGame",
        platId: '2',
        platform: '凱爾余额',
        status: '1',
        showName: '凱爾棋牌',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "ooGame",
        platId: '3',
        platform: '圈圈余额',
        status: '0',
        showName: '圈圈棋牌',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "xxGame",
        platId: '4',
        platform: '叉叉余额',
        status: '0',
        showName: '叉叉棋牌',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "AGLiveCasino",
        platId: '5',
        platform: 'AG视讯',
        status: '1',
        showName: 'AG视讯',
      },
      {
        accountId: '888888',
        balance: '0',
        linkEname: "DGLiveCasino",
        platId: '6',
        platform: 'DG视讯',
        status: '1',
        showName: 'DG视讯',
      },
    ],
  };
};
