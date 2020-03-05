/**
 * 代理中心-邀请码管理
 *
 * @url agent/getInviteUrl.action?userType=1&current=1&size=20
 * userType：[1:代理, 0:玩家]
 */

module.exports = ({ method, query, body }) => {
  return {
    code: 0,
    msg: '',
    list: [
      {
        inviteCode: '69863258', // 邀请码
        inviteUrl: 'jllcp1.com/?id=69863258', // 注册链接
        qrCodeLink: 'jllcp3.com', // qrcode 連結
        remark: ' ', // 备注
        addTime: '2018-05-09 15:55:02', // 生成时间
        state: '注册(0)', // 状态
      },
      {
        inviteCode: '35196850',
        inviteUrl: 'jllcp1.com/?id=35196850',
        qrCodeLink: 'jllcp3.com',
        remark: ' ',
        addTime: '2018-05-08 17:12:27',
        state: '注册(0)',
      },
      {
        inviteCode: '94960031',
        inviteUrl: 'jllcp1.com/?id=94960031',
        qrCodeLink: 'jllcp3.com',
        remark: '代理11111',
        addTime: '2018-05-03 10:41:10',
        state: '注册(1)',
      },
    ],
    total: 30, // 数据总数
    current: function() {
      try {
        return +JSON.parse(query).current;
      } catch (e) {
        return 1;
      }
    }, // 当前页码
    size: function() {
      try {
        return +JSON.parse(query).size;
      } catch (e) {
        return 10;
      }
    }, // 每页条数
  };
};
