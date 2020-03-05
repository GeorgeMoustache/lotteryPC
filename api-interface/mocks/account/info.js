/**
 * 账户管理－账户信息
 *
 * @url account/info.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    info: {
      username: '@cname',
      realname: '@cname', //真实姓名
      nickname: '',
      'wealth|1-1000': 1, //财富
      isBind: 0, // 是否已绑定银行卡 (0:未綁定 1:已綁定)
      userType: '1级代理',
      type: 1, //是否為測試帳號 (1:一般 3:測試)
      headImg: '/images/pic/avatar.png', //大頭照
      isCommissioner: false, //是否為計劃專員
      list: [
        {
          code: 'realName',
          title: '真實姓名',
          value: '老曹',
          isRequired: true,
          isUnique: true,
        },
        {
          code: 'nickName',
          title: '暱稱',
          value: '老曹',
          isRequired: false,
          isUnique: true,
        },
        {
          code: 'mPhoneNum',
          title: '手機號',
          value: '13345678912',
          isRequired: true,
          isUnique: true,
        },
        {
          code: 'eMail',
          title: 'Email',
          value: '9y@game.cc',
          isRequired: true,
          isUnique: true,
        },
        {
          code: 'qqAcc',
          title: 'qq號',
          value: '1446375931',
          isRequired: true,
          isUnique: false,
        },
        {
          code: 'wechatAcc',
          title: '微信號',
          value: 'wechatttt',
          isRequired: true,
          isUnique: false,
        },
      ],
    },
  };
};
