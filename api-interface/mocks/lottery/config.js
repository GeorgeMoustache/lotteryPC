/**
 * 彩票配置
 *
 * @url lottery/config.action
 * 代理模式的配置修改：KFQQ，DLQQ => QQLeft,QQRight
 *
 */
module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    wsHost: 'jllcp1.com:443',
    serviceUrl: 'https://www.baidu.com',
    wechat2code: '',
    AppName: 'PC-WEB',
    h5Name: 'h5-app', //對應手機購彩頁面之 app 名稱
    logo: 'https://www.jllcp6.com/uploadFile/20190410/20190410144217.png',
    serverDate: new Date().Format('yyyy-MM-dd HH:mm:ss'), // 服务器时间
    AppIcon: 'https://www.jllcp6.com/uploadFile/20190905/20190905162319.jpg',
    // 因405首頁改為新版浮動視窗故棄用
    Ios2code: 'https://www.jllcp6.com/uploadFile/20190411/20190411181225.png',
    Android2code: 'https://www.jllcp6.com/uploadFile/20190411/20190411181225.png',
    IosUrl: '',
    AndroidUrl: '',

    // 405新版浮動視窗對應參數 (type)
    // type:2 (phone); type:3 (wechat); type:4 (qq);
    sideBar: {
      qrcode: {
        imgSrc: 'https://www.jllcp3.com/uploadFile/20190812/20190812154503.png',
        content: '下载苹果安卓 彩票APP手机投注 随时随地',
      },
      list: [
        {
          type: 2,
          content: '023345678',
          link: 'https://www.jllcp3.com',
        },
        {
          type: 3,
          content: 'wechatCode',
          link: 'https://www.jllcp3.com',
        },
        {
          type: 4,
          content: 'QQCode',
          link: 'https://www.jllcp3.com',
        },
      ],
    },
    units: '1,0.1,0.01',
    defaultCost: 2,
    domainImg: '',
    QQLeft: '836522777',
    QQRight: '836522555,836522666',
    themeName: 'theme5',
    hasChat: 1,
    hasRedRain: 0,
    costRange: [1, 5000], // 金额范围
    upgradeType: '充值', // 投注, 充值
    register_tel: '1', // 电话必填
    register_realname: '1', // 姓名必填
    webChat: {
      labels: ['高手', '房管'],
      ranks: ['农民', '地主', '知县', '通判', '知府', '总督', '巡抚', '丞相', '帝王', '外星人'],
    },
    defaultPlayType: 'GF',
    showDeving: 0, //是否開啟"顯示開發中"功能，1:開啟，0:關閉
    pc_show_curtain: '1', //是否開啟浮動視窗 (0:關, 1:開)
    multiple_raise: '1', // 是否为倍数模式
    hasBetDrawBar: '1', //是否開啟近20期懸浮視窗
    buildVersion: '4.0.5', //版本號
    bet_history_analysis: 1, //路單開關 (0:關, 1:開)
    ipBlock: false, //IP黑名單
  };
};
