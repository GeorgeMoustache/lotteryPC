/**
 * 額度轉換-读取棋牌余额
 *
 * @url /gameBoy/getBalance.action?platId={platId}
 *
 */

module.exports = query => {
  let { platId } = query.query;
  console.log('getBalance platId', platId);
  if (platId == 0) {
    return {
      balance: '7770987025.43',
      code: '0',
      msg: '',
      transferOverQuantity: 10000000,
    };
  }
  if (platId == 1) {
    return {
      balance: '100.01',
      code: '0',
      msg: '',
      transferOverQuantity: 10,
    };
  }
  if (platId == 2) {
    return {
      balance: '200.02',
      code: '0',
      msg: '',
      transferOverQuantity: 20,
    };
  }
  if (platId == 3) {
    return {
      balance: '300.03',
      code: '0',
      msg: '',
      transferOverQuantity: 30,
    };
  }
  if (platId == 4) {
    return {
      balance: '400.04',
      code: '0',
      msg: '',
      transferOverQuantity: 40,
    };
  }
  if (platId == 5) {
    return {
      balance: '500.05',
      code: '0',
      msg: '',
      transferOverQuantity: 50,
    };
  }
  if (platId == 6) {
    return {
      balance: '600.06',
      code: '0',
      msg: '',
      transferOverQuantity: 60,
    };
  }
};
