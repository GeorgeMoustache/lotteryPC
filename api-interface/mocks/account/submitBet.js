/**
 * 购彩-下注
 *
 * @url account/submitBet.action
 *
 */

module.exports = ({ method, query, body }) => {
  const rand = Math.random() * 10;
  if (rand > 5) {
    return {
      code: -1,
      msg: "投注已过期",
      issue: "20170720030"
    };
  } else {
    return {
      code: 0,
      msg: ""
    };
  }
  // else {
  //  return {
  //    'code': -1,
  //    'msg': '余额不足'
  //  }
  // }
};
