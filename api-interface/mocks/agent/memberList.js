/**
 * 代理中心-会员列表
 *
 * @url agent/memberList.action?userName=''&userType=''&current=1&size=20
 * userType: [-1: 全部, 1: 代理, 0: 玩家]
 * sort: [0: 帳號, 1: 餘額, 2: 註冊時間, 3: 最後登錄]
 */

module.exports = ({ method, query, body }) => {
  let { current, size, userName } = query;
  let list = [];
  switch (userName) {
    case '':
      if (current == 1) {
        list = [
          {
            userId: 3830821,
            userName: 'kufish1', // 账号
            userType: '1级代理', // 用户类型
            lowerCount: 2, // 下级人数
            balance: '499010.00', // 余额
            loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
          },
          {
            userId: 3830822,
            userName: 'kufish2', // 账号
            userType: '1级玩家', // 用户类型
            lowerCount: 2, // 下级人数
            balance: '499010.00', // 余额
            loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
          },
        ];
      } else {
        list = [
          {
            userId: 38308212,
            userName: 'kufish3', // 账号
            userType: '1级代理', // 用户类型
            lowerCount: 1, // 下级人数
            balance: '499010.00', // 余额
            loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
          },
          {
            userId: 38308222,
            userName: 'kufish4', // 账号
            userType: '1级玩家', // 用户类型
            lowerCount: 2, // 下级人数
            balance: '499010.00', // 余额
            loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
          },
        ];
      }
      break;
    case 'kufish1':
      list = [
        {
          userId: 3830823,
          userName: 'kufish1_1', // 账号
          userType: '2级代理', // 用户类型
          lowerCount: 1, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
        {
          userId: 3830824,
          userName: 'kufish1_2', // 账号
          userType: '2级代理', // 用户类型
          lowerCount: 1, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
      ];
      break;
    case 'kufish3':
      list = [
        {
          userId: 3830823,
          userName: 'kufish3_1', // 账号
          userType: '2级玩家', // 用户类型
          lowerCount: 0, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
      ];
      break;
    case 'kufish1_1':
      list = [
        {
          userId: 3830825,
          userName: 'kufish1_1_1', // 账号
          userType: '3级代理', // 用户类型
          lowerCount: 0, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
        {
          userId: 3830826,
          userName: 'kufish1_1_2', // 账号
          userType: '3级玩家', // 用户类型
          lowerCount: 1, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
      ];
      break;
    case 'kufish1_2':
      list = [
        {
          userId: 3830827,
          userName: 'kufish1_2_1', // 账号
          userType: '3级代理', // 用户类型
          lowerCount: 0, // 下级人数
          balance: '499010.00', // 余额
          loginTime: '2005-06-19 16:56:25', // 最后登录 2005-06-19 16:56:25
        },
      ];
      break;
    default:
      return {
        code: -1,
        msg: '没有找到该用户',
      };
      break;
  }
  return {
    code: 0,
    msg: '',
    list: list,
    total: 30, // 数据总数
    current: current, // 当前页码
    size: size, // 每页条数
  };
};
