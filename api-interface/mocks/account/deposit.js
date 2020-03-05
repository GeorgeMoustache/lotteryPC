/**
 * 账户管理－充值
 *
 * @url account/deposit.action?id=
 *
 */

//主要用於線上支付 + 線下支付銀行轉帳
//線上支付參數 {amount: Number(金額), id: Number(from Api)}
//線下支付銀行轉帳參數 {amount: 1000(金額), id: 34(from Api), note: "111"(備註，非必需), username: "12"(存款人姓名，非必需)}


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
