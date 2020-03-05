/**
 * 账号管理-紅包記錄
 *
 * @url account/recordRedpack.action?&current={current}&size={size}&constomDate={startDate, endData}&type={type}&redpackType={redpackType}
 *
 */

module.exports = ({ query }) => {
  let type = query.type;
  if (type == 1) {
    return {
      code: '0',
      msg: '',
      'list|25': [
        {
          date: '2019-06-13 15:41:02',
          room: '官方大厅',
          redpack: '普通红包',
          money: 200.01,
          returnMoney: 0.01,
          compensateMoney: 0.01,
        },
      ],
      total: 30,
      totalMoney: 12345678.12,
    };
  }
  if (type == 2) {
    return {
      code: '0',
      msg: '',
      'list|25': [
        {
          date: '2019-06-13 15:41:02',
          room: '官方大厅',
          redpack: '普通红包',
          money: 11.02,
          compensateMoney: 0.01,
        },
      ],
      total: 30,
      totalMoney: 87654321.12,
    };
  }
};
