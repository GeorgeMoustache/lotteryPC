/**
 * 主题特点：
 * 默认的主题
 */
export const constantRouterMap = [
  {
    path: '/',
    component: resolve => require(['@/views/themeBoMao/Layout'], resolve),
    children: [
      //首頁
      {
        path: '(index)?',
        name: 'home',
        meta: {
          showNav: true, // 首页是否直接显示导航
        },
        component: resolve => require(['@/views/themeBoMao/Index'], resolve),
      },
      //彩票投注
      {
        path: '/lottery/:alias?',
        meta: {
          roles: ['guest', 'admin', 'agent'],
        },
        component: resolve => require(['@/views/themeBoMao/Lottery'], resolve),
      },
      //優惠活動
      {
        path: 'promotion/:id?',
        component: resolve => require(['@/views/themeBoMao/Promotion'], resolve),
      },
      //玩法說明
      {
        path: 'rules/:category?',
        component: resolve => require(['@/views/themeBoMao/Rules'], resolve),
      },
      //走勢圖表
      {
        path: '/trend/:alias?',
        component: resolve => require(['@/views/themeBoMao/Trend'], resolve),
      },
      //開獎公告
      {
        path: 'drawNotice/:category?',
        component: resolve => require(['@/views/themeBoMao/DrawNotice'], resolve),
      },
      //紅包雨
      {
        path: 'redRain',
        component: resolve => require(['@/views/RedRain'], resolve),
      },
    ],
  },
  //404 錯誤頁面
  {
    path: '/404',
    component: resolve => require(['@/views/NotFound'], resolve),
  },
  {
    path: '/(login|register)/:inviteCode?',
    component: resolve => require(['@/views/themeBoMao/Register_Login'], resolve),
  },

  //會員中心
  {
    path: '/profile',
    meta: {
      roles: ['guest', 'admin', 'agent'],
    },
    component: resolve => require(['@/views/themeBoMao/Layout'], resolve),
    children: [
      {
        path: '/profile',
        component: resolve => require(['@/views/themeBoMao/Profile/Layout'], resolve),
        children: [
          //注單記錄
          {
            path: 'BetRecord/:id?',
            component: resolve => require(['@/views/themeBoMao/Profile/BetRecord'], resolve),
          },
          //在線存款
          {
            path: 'deposit',
            meta: { roles: ['admin', 'agent'] },
            component: resolve => require(['@/views/themeBoMao/Profile/Deposit'], resolve),
          },
          //在線取款
          {
            path: 'withdraw',
            meta: {
              roles: ['admin', 'agent'],
              title: '提款',
            },
            component: resolve => require(['@/views/themeBoMao/Profile/Withdraw'], resolve),
          },
          //額度轉換
          {
            path: 'moneyTrans',
            name: 'moneyTrans',
            meta: {
              roles: ['admin', 'agent'],
              title: '额度转换',
            },
            component: resolve => require(['@/views/themeBoMao/Profile/MoneyTrans'], resolve),
          },
          //交易記錄
          {
            path: 'record/:tabIndex',
            component: resolve => require(['@/views/themeBoMao/Profile/Record'], resolve),
          },
          //個人中心
          {
            path: 'information',
            meta: { title: '个人中心' },
            component: resolve => require(['@/views/themeBoMao/Profile/Infomation'], resolve),
          },
          //安全中心
          {
            path: 'password',
            meta: { title: '安全中心' },
            component: resolve => require(['@/views/themeBoMao/Profile/Password'], resolve),
          },
          //銀行卡管理
          {
            path: 'bankCard',
            meta: { title: '银行卡管理' },
            component: resolve => require(['@/views/themeBoMao/Profile/BankCard'], resolve),
          },
          //代理中心
          //代理說明
          {
            path: 'agent/intro',
            meta: { title: '代理说明' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/Intro'], resolve),
          },
          //代理報表
          {
            path: 'agent/agencyReport',
            meta: { title: '代理报表' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/AgencyReport'], resolve),
          },
          //下級報表
          {
            path: 'agent/lowerReport',
            meta: { title: '下级报表' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/LowerReport'], resolve),
          },
          //下級開戶
          {
            path: '/profile/agent/manageInvite',
            meta: { title: '下级开户' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/ManageInvite'], resolve),
          },
          //下級開戶 (邀請碼管理)
          {
            path: '/profile/agent/manageIcode',
            meta: { title: '邀请码管理' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/ManageIcode'], resolve),
          },
          //會員管理
          {
            path: 'agent/member',
            meta: { title: '会员管理' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/Member'], resolve),
          },
          //投注明細
          {
            path: 'agent/recordBet',
            meta: { title: '投注明细' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/RecordBet'], resolve),
          },
          //交易明細
          {
            path: 'agent/recordBill',
            meta: { title: '交易明细' },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/RecordBill'], resolve),
          },
          {
            path: '/rebateDes/:index',
            meta: {
              roles: ['agent'],
              title: '银行卡管理',
            },
            component: resolve => require(['@/views/themeBoMao/Profile/Agent/RebateDes'], resolve),
          },
          //今日盈虧
          {
            path: '/profile/todayProfit/:id?',
            component: resolve => require(['@/views/themeBoMao/Profile/TodayProfit'], resolve),
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

export const routerMap = constantRouterMap;
