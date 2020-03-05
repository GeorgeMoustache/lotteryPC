/**
 * 账号管理-額轉記錄
 *
 * @url account/recordTrans.action?&current={current}&size={size}&constomDate{startDate, endData}&transOutId={platNo}&transInId={platId}
 * 
 */

module.exports = ({method, query, body}) => {
  return {
    code: '0',
    msg: '',
    data: {
      list: [{
        date: '2019-06-13 15:41',
        type: '額度轉換',
        money: '200.00',
        transout: '開元餘額',
        transin: '帳戶餘額',
        status: '成功'
      },
      {
        date: '2019-06-13 15:41',
        type: '人工額轉',
        money: '510.00',
        transout: '開元餘額',
        transin: '帳戶餘額',
        status: '失敗'
      },
      {
        date: '2019-06-13 15:41',
        type: '人工額轉',
        money: '510.00',
        transout: 'AG真人',
        transin: '帳戶餘額',
        status: '失敗'
      },
      {
        date: '2019-06-13 15:41',
        type: '人工額轉',
        money: '510.00',
        transout: 'DG真人',
        transin: '帳戶餘額',
        status: '成功'
      },
      ],
      total: 4
    }
  };
};
