/**
 * 账户管理－存款类型
 *
 * @url account/payTypeBoMao.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    //線上支付
    online: [
      {
        id: 1,
        type: 1, //支付種類[1:微信, 2:支付宝, 3:银行, 4:無資料, 5:QQ, 6:云闪付]
        title: '新大陆微信扫码', //顯示名稱
        range: [20, 100], //金額範圍[min, max]
        note: '1',
      },
      {
        id: 2,
        type: 2,
        title: '支付宝扫码',
        range: [100, 1000],
        note: '2',
      },
      {
        id: 3,
        type: 2,
        title: '支付宝扫码',
        range: [1, 10000],
        note: '3',
      },
      {
        id: 4,
        type: 5,
        title: 'QQ扫码',
        range: [50, 3000],
        note: '4',
      },
      {
        id: 5,
        type: 5,
        title: 'QQ扫码',
        range: [100, 1000],
        note: '5',
      },
    ],
    //線下支付
    offline: {
      //銀行入款
      bank: [
        {
          id: 6,
          type: 3, //銀行類別 [1:中国人民银行, 2:中国工商银行, 3:中国银行, 4:中国建设银行, 5:中国农业银行, 6:中国邮政储蓄银行, 7:中国光大银行, 8:中国民生银行, 9:交通银行, 10:招商银行, 11:中信银行, 12:华夏银行, 13:浦发银行, 14:平安银行, 15:广发银行, 16:兴业银行, 17:浙商银行, 18:渤海银行, 0:其他银行]
          bankName: '中国银行', //銀行名稱
          accountName: '王大明', //收款姓名
          bankCardNo: '12345678910001234', //收款帳號
          bankAddress: '漳州分行', //開戶分行
          range: [1, 1000000], //金額範圍[min, max]
        },
        {
          id: 7,
          type: 8,
          bankName: '中国民生银行',
          accountName: '孫小美',
          bankCardNo: '12345678910001234',
          bankAddress: '漳州分行',
          range: [100, 1000000],
        },
      ],
      //掃碼支付
      qrcode: [
        {
          accountId: 8,
          accountNo: '12345678910001234', //收款帳號
          accountName: '王大明', //收款人
          title: '微信转银行①', //展示名稱
          type: 1, //支付種類[1:微信, 2:支付宝, 3:银行, 4:無資料, 5:QQ, 6:云闪付]
          src: '/uploadFile/20190515/20190515171733.jpg', //QrCode 圖片
          needProve: true,
          range: [1, 10000], //金額範圍[min, max]
          note: '6',
        },
        {
          accountId: 9,
          accountNo: '12345678910001234',
          accountName: '王大明',
          title: 'QQ转银行①', //展示名稱
          type: 5,
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [5, 20000],
          note: '7',
        },
        {
          accountId: 10,
          accountNo: '12345678910001234',
          accountName: '王大明',
          title: 'QQ转银行①', //展示名稱
          type: 5,
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [1, 50000],
          note: '8',
        },
        {
          accountId: 11,
          accountNo: '12345678910001234',
          accountName: '王大明',
          title: '支付宝转银行①', //展示名稱
          type: 2,
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [30, 40000],
          note: '9',
        },
        {
          accountId: 12,
          accountNo: '微信转银行①',
          accountName: '王大明',
          title: '支付宝转银行⑥', //展示名稱
          type: 2,
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [20, 30000],
          note: '10',
        },
        {
          accountId: 13,
          accountNo: '微信转银行①',
          accountName: '王大明',
          title: '云闪付转银行①', //展示名稱
          type: 6,
          src: '/uploadFile/20190515/20190515171733.jpg',
          needProve: true,
          range: [10, 20000],
          note: '11',
        },
      ],
    },
    //優惠
    discount: {
      money: 12345678.12, //滿額金額
      percent: 99, //優惠比例
    },
  };
};
