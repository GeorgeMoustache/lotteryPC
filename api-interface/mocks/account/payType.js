/**
 * 账户管理－存款类型
 *
 * @url account/payType.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    tabs: [
      { id: 1, label: '微信/QQ' },
      { id: 2, label: '支付宝' },
      { id: 3, label: '汇款提交' },
      { id: 4, label: '支付宝转账' },
      { id: 6, label: '微信转账' },
      { id: 7, label: '云闪付转账' },
    ],
    template: [
      [{ id: 30, title: '微信扫码.xf', desc: '', ish5: 1, isQQ: false, range: [1, 10000] }],
      [
        { id: 18, title: '新大陆-扫码', desc: '', range: [50, 3000] },
        { id: 43, title: 'jutong', desc: '', range: [1, 10000] },
        { id: 51, title: '虎虎-SM', desc: '', range: [1, 10000] },
      ],
      [
        {
          id: 41,
          bankName: '邮政',
          accountName: 'test1',
          bankCardNo: 'test1',
          bankAddress: 'test1',
          range: [1, 1000000],
        },
        { id: 3, bankName: '1', accountName: '1', bankCardNo: '1', bankAddress: '1', range: [100, 1000] },
        {
          id: 34,
          bankName: '招商',
          accountName: '6666',
          bankCardNo: '7777',
          bankAddress: '888',
          range: [500, 1000000],
        },
      ],
      [
        {
          accountId: 38,
          accountNo: 'miru',
          accountName: 'test01',
          src: '/uploadFile/20190515/20190515172014.jpg',
          needProve: true,
          range: [1, 600],
        },
        { accountId: 42, accountNo: 'miru01', accountName: '6666', needProve: true, range: [1, 10000] },
      ],
      [
        {
          accountId: 2,
          accountNo: '1',
          accountName: '1',
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [1, 10000],
        },
        {
          accountId: 53,
          accountNo: '1',
          accountName: '2',
          src: '/uploadFile/20190808/20190808202818.jpg',
          needProve: true,
          range: [1, 10000],
        },
        {
          accountId: 63,
          accountNo: '1',
          accountName: '1',
          src: '/uploadFile/20190808/20190808202750.png',
          needProve: true,
          range: [1, 10000],
        },
      ],
      [
        {
          accountId: 62,
          accountNo: '1',
          accountName: '1',
          src: '/uploadFile/20190808/20190808202315.png',
          needProve: true,
          range: [1, 10000],
        },
        {
          accountId: 56,
          accountNo: 'cloudAccount',
          accountName: 'cloudName',
          src: '/uploadFile/20190624/20190624095437.jpg',
          needProve: true,
          range: [1, 10000],
        },
      ],
    ],
    code: 0,
    msg: '',
  };
  // return {
  //   code: 0,
  //   msg: '',
  //   tabs: [
  //     {
  //       id: 1,
  //       label: '微信/QQ',
  //     },
  //     {
  //       id: 2,
  //       label: '支付宝',
  //     },
  //     {
  //       id: 4,
  //       label: '在线支付',
  //     },
  //     {
  //       id: 3,
  //       label: '银行转账',
  //     },
  //     {
  //       id: 10,
  //       label: '支付宝转账',
  //     },
  //     {
  //       id: 11,
  //       label: 'QQ转账',
  //     },
  //     {
  //       id: 12,
  //       label: '微信转账',
  //     },
  //     {
  //       id: 7,
  //       label: '云闪付',
  //     },
  //   ],
  //   template: [
  //     [
  //       {
  //         id: 10,
  //         title: 'QQ（扫一扫直接到账）1',
  //         desc: '金额范围：10-100元，支付后立即到账',
  //         range: [10, 100],
  //         isQQ: true,
  //         ish5: 1,
  //       },
  //       {
  //         id: 1,
  //         title: '微信（扫一扫直接到账）1',
  //         desc: '金额范围：20-200元，支付后立即到账',
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //         range: [20, 200],
  //       },
  //       {
  //         id: 2,
  //         title: '微信（扫一扫直接到账）2',
  //         desc: '金额范围：30-300元，支付后立即到账',
  //         range: [30, 300],
  //       },
  //     ],
  //     [
  //       {
  //         id: 3,
  //         title: '支付宝（扫一扫直接到账）1',
  //         desc: '金额范围：40-400元，支付后立即到账',
  //         range: [40, 400],
  //       },
  //       {
  //         id: 4,
  //         title: '支付宝（扫一扫直接到账）2',
  //         desc: '金额范围：50-500元，支付后立即到账',
  //         range: [50, 500],
  //       },
  //     ],
  //     [
  //       {
  //         id: 11,
  //         bankName: '工商银行',
  //         alias: 'ICBC',
  //         ish5: 1,
  //         range: [60, 600],
  //       },
  //       {
  //         id: 12,
  //         bankName: '招商银行',
  //         alias: 'CMB',
  //         ish5: 1,
  //         range: [70, 700],
  //       },
  //     ],
  //     [
  //       {
  //         id: 5,
  //         bankName: '工商银行',
  //         icon: 'http://v.icbc.com.cn/userfiles/Resources/ICBC/shouye/images/2017/logo.png',
  //         accountName: '@cname', // 收款人
  //         bankCardNo: 666666743982740129, // 账号
  //         bankAddress: '@city', // 开户网点
  //         range: [80, 800], // 金额范围
  //       },
  //       {
  //         id: 6,
  //         bankName: '建设银行',
  //         icon: '/cn/home/company/v3/images/img/20150828_1440745919/20151201084052927594.png',
  //         accountName: '@cname', // 收款人
  //         bankCardNo: 625666743982740129, // 账号
  //         bankAddress: '@city', // 开户网点
  //         range: [90, 900], // 金额范围
  //       },
  //     ],
  //     [
  //       {
  //         accountId: 1,
  //         accountNo: 15245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: true, // 是否需要凭证
  //         range: [100, 10], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //       {
  //         accountId: 2,
  //         accountNo: 20245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [20, 200], // 范围
  //         src: ' ',
  //       },
  //       {
  //         accountId: 3,
  //         accountNo: 30245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [30, 300], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //     ],
  //     [
  //       {
  //         accountId: 1,
  //         accountNo: 15245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: true, // 是否需要凭证
  //         range: [100, 10], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //       {
  //         accountId: 2,
  //         accountNo: 20245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [20, 200], // 范围
  //         src: ' ',
  //       },
  //       {
  //         accountId: 3,
  //         accountNo: 30245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [30, 300], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //     ],
  //     [
  //       {
  //         accountId: 1,
  //         accountNo: 15245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: true, // 是否需要凭证
  //         range: [100, 10], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //       {
  //         accountId: 2,
  //         accountNo: 20245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [20, 200], // 范围
  //         src: ' ',
  //       },
  //       {
  //         accountId: 3,
  //         accountNo: 30245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [30, 300], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //     ],
  //     [
  //       {
  //         accountId: 1,
  //         accountNo: 15245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: true, // 是否需要凭证
  //         range: [100, 10], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //       {
  //         accountId: 2,
  //         accountNo: 20245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [20, 200], // 范围
  //         src: ' ',
  //       },
  //       {
  //         accountId: 3,
  //         accountNo: 30245839563,
  //         accountName: '@cname', // 收款人
  //         needProve: false, // 是否需要凭证
  //         range: [30, 300], // 范围
  //         src: 'https://www.baidu.com/img/bd_logo1.png',
  //       },
  //     ],
  //   ],
  // };
};
