/**
 * 账户管理－快速转账
 *
 * @url account/depositQuick.action?id=
 *
 */

//主要用於線下支付 qrcode 快速付款
//參數 {
  // accountId: 38, (from Api)
  // accountName: "test01", (from Api)
  // accountNo: "miru", (from Api)
  // amount: 111, (充值金額)
  // datetime: "2019-12-04T06:59:07.649Z", (存款時間，非必需)
  // prove: "111" (真實姓名)
// }

module.exports = () => {
  return {
    code: 0,
    msg: '',
    info: {
      orderNo: 17254901237491793, // 订单号
      'amount|1-9999': 1, // 充值金额
      url: 'weixin://wxpay/bizpayurl?pr=k6y7H1b',
      h5url: 'http://www.baidu.com',
      qrcodeSrc: 'https://www.baidu.com/img/bd_logo1.png', // 付款二维码
    },
  };
};
