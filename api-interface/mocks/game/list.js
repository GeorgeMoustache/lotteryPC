/**
 * 遊戲列表
 * @url game/list.action?platId={platId}
 *
 */
module.exports = (query) => {
  let { platId } = query.query;
  console.log('platId:', platId)
  if(platId == '1') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/OHHi7GY.png',
          id: '1000',
          label: '德州扑克',
          isPopularShow: '0',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/QrsRfpP.png',
          id: '1001',
          isPopularShow: '0',
          label: '二八杠',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/AawJnyn',
          id: '1002',
          isPopularShow: '1',
          label: '抢庄牛牛',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/gYco5kE',
        },
        {
          iconSrc: 'https://i.imgur.com/dT63WLk.png',
          id: '1003',
          isPopularShow: '1',
          label: '炸金花',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/vRySugO.png',
        },
        {
          iconSrc: 'https://i.imgur.com/4K6A0eU.png',
          id: '1004',
          isPopularShow: '0',
          label: '三公',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/gAI7QdU.png',
          id: '1005',
          isPopularShow: '1',
          label: '押庄龙虎',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/lrKCPja.png',
        },
        {
          iconSrc: 'https://i.imgur.com/2kevdvw.png',
          id: '1006',
          isPopularShow: '1',
          label: '二十一点',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/AKUWoSE.png',
        },
        {
          iconSrc: 'https://i.imgur.com/5UzeQx9.png',
          id: '1007',
          isPopularShow: '0',
          label: '通比牛牛',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/RhozvoW.png',
          id: '1008',
          isPopularShow: '0',
          label: '极速炸金花',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/XGau83F.png',
          id: '1009',
          isPopularShow: '1',
          label: '抢庄牌九',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/xYcgXAy.png',
        },
        {
          iconSrc: 'https://i.imgur.com/2VFUSlU.png',
          id: '10010',
          isPopularShow: '1',
          label: '十三水',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/qZVfg26.png',
        },
        {
          iconSrc: 'https://i.imgur.com/c0xxPnI.png',
          id: '10011',
          isPopularShow: '0',
          label: '斗地主',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/eSMkn0O.png',
          id: '10012',
          isPopularShow: '0',
          label: '百家乐',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/pBfdyDp.png',
          id: '10013',
          isPopularShow: '0',
          label: '森林舞会',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/6wHk0Fj.png',
          id: '10014',
          isPopularShow: '0',
          label: '百人牛牛',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/PpikA7B.png',
          id: '10015',
          isPopularShow: '0',
          label: '万人炸金花',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/eljVfMg.png',
          id: '10016',
          isPopularShow: '0',
          label: '血流成河',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/vAesN0r.png',
          id: '10017',
          isPopularShow: '1',
          label: '射龙门',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: 'https://i.imgur.com/tO36hLn.png',
        },
      ],
      code: '0',
      msg: '',
    };
  }
  //凱爾棋牌
  if(platId == '2') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/OHHi7GY.png',
          id: '201',
          label: '吹牛067',
          isPopularShow: '0',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
        {
          iconSrc: 'https://i.imgur.com/QrsRfpP.png',
          id: '202',
          isPopularShow: '0',
          label: '吹牛068',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
      ],
      code: '0',
      msg: '',
    };
  }
  //圈圈棋牌
  if(platId == '3') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/QrsRfpP.png',
          id: '1001',
          isPopularShow: '0',
          label: '二八杠',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        },
      ],
      code: '0',
      msg: '',
    };
  }
  //叉叉棋牌
  if(platId == '4') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/OHHi7GY.png',
          id: '1000',
          label: '德州扑克',
          isPopularShow: '0',
          platId: 1,
          recommend: '@ctitle(8)',
          hotGameSrc: '',
        }
      ],
      code: '0',
      msg: '',
    };
  }
  //AG視訊
  if(platId == '5') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/6ArBCmZ.png',
          // iconSrc: 'https://i.imgur.com/nGGIDQZ.png', //單一寬版圖片
          id: '1000',
          label: 'AG视讯',
          isPopularShow: '0',
          platId: 1,
          recommend: '亚洲顶尖实力赌场',
          hotGameSrc: '',
        }
      ],
      code: '0',
      msg: '',
    };
  }
  //DG視訊
  if(platId == '6') {
    return {
      chess: [
        {
          iconSrc: 'https://i.imgur.com/kJmBiJe.png',
          id: '1000',
          label: 'DG视讯',
          isPopularShow: '0',
          platId: 1,
          recommend: '推荐语最多八个字',
          hotGameSrc: '',
        },
      ],
      code: '0',
      msg: '',
    };
  }
};
