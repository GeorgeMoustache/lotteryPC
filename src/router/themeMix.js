/**
 * 主题特点：
 * 默认的主题
 */
export const constantRouterMap = [
  {
    path: '/',
    component: resolve => require(['@/views/themeMix/Layout'], resolve),
    children: [
      //首頁
      {
        path: '(index)?',
        name: 'home',
        meta: {
          showNav: true, // 首页是否直接显示导航
        },
        component: resolve => require(['@/views/themeMix/Index'], resolve),
      },
      //棋牌遊戲
      {
        path: 'Game/cardGame',
        meta: {
          roles: ['guest', 'admin', 'agent'],
        },
        component: resolve => require(['@/views/themeMix/Game/cardGame'], resolve),
      },
      //真人娛樂
      {
        path: 'Game/liveCasino',
        meta: {
          roles: ['guest', 'admin', 'agent'],
        },
        component: resolve => require(['@/views/themeMix/Game/liveCasino'], resolve),
      },
      //手機購彩
      {
        path: 'mobile',
        component: resolve => require(['@/views/themeMix/Mobile'], resolve),
      },
      //優惠活動
      {
        path: 'promotion/:id?',
        component: resolve => require(['@/views/themeMix/Promotion'], resolve),
      },
      {
        path: 'helpInfo',
        component: resolve => require(['@/views/themeMix/HelpInfo'], resolve),
      },
      //開獎公告
      {
        path: 'drawNotice/:category?',
        component: resolve => require(['@/views/themeMix/DrawNotice'], resolve),
      },
      {
        path: 'rules/:category?',
        component: resolve => require(['@/views/themeMix/Rules'], resolve),
      },
      {
        path: '(news|notice)/:id',
        component: resolve => require(['@/views/themeMix/NewsDetail'], resolve),
      },
      {
        path: '(login|register)/:inviteCode?',
        component: resolve => require(['@/views/themeMix/RegLogin'], resolve),
      },
      {
        path: 'redRain',
        component: resolve => require(['@/views/RedRain'], resolve),
      },
      //走勢圖表
      {
        path: '/trend/:alias?',
        component: resolve => require(['@/views/themeMix/Lottery/Trend'], resolve),
      },
    ],
  },
  {
    path: '/registerAgreement',
    component: resolve => require(['@/views/themeMix/RegisterAgreement'], resolve),
  },
  {
    path: '/404',
    component: resolve => require(['@/views/NotFound'], resolve),
  },
];

//彩票相關
export const asyncRouterMap = [
  {
    path: '/lottery',
    meta: {
      roles: ['guest', 'admin', 'agent'],
    },
    component: resolve => require(['@/views/themeMix/Lottery/Layout'], resolve),
    children: [
      {
        path: '/',
        component: resolve => require(['@/views/themeMix/Lottery/Index'], resolve),
      },
      {
        path: '(\\w+)([^P]K3|11X5)',
        component: resolve => require(['@/views/themeMix/Lottery/TplBothGF'], resolve),
      },
      {
        path: '(\\w+)28',
        component: resolve => require(['@/views/themeMix/Lottery/TplPCDD'], resolve),
      },
      {
        path: '(\\w*?)(HKSIX)',
        component: resolve => require(['@/views/themeMix/Lottery/TplBothKQ'], resolve),
      },
      {
        // 两面盘
        path: '(\\w+)(PK10|FT|SSC)',
        component: resolve => require(['@/views/themeMix/Lottery/TplBothLayout'], resolve),
        children: [
          {
            // 官方
            path: '1',
            component: resolve => require(['@/views/themeMix/Lottery/TplBothGF'], resolve),
          },
          {
            // 传统
            path: '',
            component: resolve => require(['@/views/themeMix/Lottery/TplBothCT'], resolve),
          },
        ],
      },
      {
        path: 'history/:alias',
        component: resolve => require(['@/views/themeMix/Lottery/History'], resolve),
      },
    ],
  },

  //會員中心
  {
    path: '/profile',
    meta: {
      roles: ['guest', 'admin', 'agent'],
    },
    component: resolve => require(['@/views/themeMix/Layout'], resolve),
    children: [
      {
        path: '/profile',
        component: resolve => require(['@/views/themeMix/Profile/Layout'], resolve),
        children: [
          {
            path: '(index)?',
            name: 'profileIndex',
            component: resolve => require(['@/views/themeMix/Profile/Index'], resolve),
          },
          //修改個人資料
          {
            path: 'Information',
            name: 'profileInformation',
            component: resolve => require(['@/views/themeMix/Profile/Information'], resolve),
          },
          //今日盈虧
          {
            path: 'todayProfit',
            component: resolve => require(['@/views/themeMix/Profile/TodayProfit'], resolve),
          },
          //在線存款
          {
            path: 'deposit',
            meta: {
              roles: ['admin', 'agent'],
            },
            component: resolve => require(['@/views/themeMix/Profile/Deposit'], resolve),
          },
          //額度轉換
          {
            path: 'moneyTrans',
            name: 'moneyTrans',
            meta: {
              roles: ['admin', 'agent'],
            },
            component: resolve => require(['@/views/themeMix/Profile/MoneyTrans'], resolve),
          },
          //在線取款
          {
            path: 'withdraw',
            meta: {
              roles: ['admin', 'agent'],
            },
            component: resolve => require(['@/views/themeMix/Profile/Withdraw'], resolve),
          },
          //帳戶信息
          {
            path: 'info',
            component: resolve => require(['@/views/themeMix/Profile/Info'], resolve),
          },
          //交易記錄
          {
            path: 'record',
            component: resolve => require(['@/views/themeMix/Profile/Record'], resolve),
          },
          //注單記錄
          {
            path: 'BetRecord',
            component: resolve => require(['@/views/themeMix/Profile/BetRecord'], resolve),
          },
          //代理中心
          //代理說明
          {
            path: 'agent/intro',
            component: resolve => require(['@/views/themeMix/Profile/Agent/Intro'], resolve),
          },
          //代理報表
          {
            path: 'agent/agencyReport',
            component: resolve => require(['@/views/themeMix/Profile/Agent/AgencyReport'], resolve),
          },
          //下級報表
          {
            path: 'agent/lowerReport',
            component: resolve => require(['@/views/themeMix/Profile/Agent/LowerReport'], resolve),
          },
          //下級開戶
          {
            path: '',
            component: resolve => require(['@/views/themeMix/Profile/Agent/InviteLayout'], resolve),
            children: [
              {
                path: '/profile/agent/manageInvite',
                component: resolve => require(['@/views/themeMix/Profile/Agent/ManageInvite'], resolve),
              },
              {
                path: '/profile/agent/manageIcode',
                component: resolve => require(['@/views/themeMix/Profile/Agent/ManageIcode'], resolve),
              },
            ],
          },
          //會員管理
          {
            path: 'agent/member',
            component: resolve => require(['@/views/themeMix/Profile/Agent/Member'], resolve),
          },
          //投注明細
          {
            path: 'agent/recordBet',
            component: resolve => require(['@/views/themeMix/Profile/Agent/RecordBet'], resolve),
          },
          //交易明細
          {
            path: 'agent/recordBill',
            component: resolve => require(['@/views/themeMix/Profile/Agent/RecordBill'], resolve),
          },
          {
            path: '/rebateDes/:index',
            meta: {
              roles: ['agent'],
            },
            component: resolve => require(['@/views/themeMix/Profile/Agent/RebateDes'], resolve),
          },
          //消息中心
          {
            path: 'message',
            component: resolve => require(['@/views/themeMix/Profile/Message'], resolve),
          },
          //未定義路徑跳轉回會員中心首頁
          {
            path: '*',
            redirect: '/profile',
          },
        ],
      },
    ],
  },

  //未定義路徑導向 404 頁面
  {
    path: '*',
    redirect: '/404',
  },
];

export const routerMap = constantRouterMap.concat(asyncRouterMap);
