/**
 * 代理中心-交易明细
 *
 * @url agent/recordBill.action?startDate={2019-09-30}&endDate={2019-10-01}&userName={使用者帳號}&type={摘要種類}&current={目前頁數}&size={每頁筆數}
 * 
 */

module.exports = (query) => {
  return {
    code: 0,
    msg: "",
    list: [
      {
        id: 2034887268,
        userName: "kufish1", //帳號
        typeName: "奖金派送", //摘要
        addTime: "2018-05-10 19:10:57", //時間(移除秒數)
        inMoney: "7.680", //收入金額
        outMoney: "---", //支出金額
        balance: "499011.28", //餘額
        remarks: "奖金派送", //備註
        status: 0 //狀態 (0:成功,1失敗)
      },
      {
        id: 2046308828,
        userName: "kufish1",
        typeName: "投注扣款",
        addTime: "2018-05-10 19:09:09",
        inMoney: "---",
        outMoney: "2.000",
        balance: "499003.60",
        remarks: "普通投注扣款",
        status: 1
      },
      {
        id: 2034862468,
        userName: "kufish1",
        typeName: "奖金派送",
        addTime: "2018-05-10 19:08:11",
        inMoney: "9.600",
        outMoney: "---",
        balance: "499005.60",
        remarks: "奖金派送",
        status: 1
      },
      {
        id: 2046293698,
        userName: "kufish1",
        typeName: "投注扣款",
        addTime: "2018-05-10 19:07:43",
        inMoney: "---",
        outMoney: "14.000",
        balance: "498996.00",
        remarks: "普通投注扣款",
        status: 0
      }
    ],
    total: 30, //資料總筆數
  };
};
