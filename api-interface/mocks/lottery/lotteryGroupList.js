/**
 * 彩種分類列表
 *
 * @url lottery/lotteryGroupList.action
 *
 */

module.exports = ({ method, query, body }) => {
  return {
    list: [
      { groupId: 4, groupName: 'PK10', groupSort: 1 },
      { groupId: 5, groupName: 'PC蛋蛋', groupSort: 2 },
      { groupId: 2, groupName: '快3', groupSort: 3 },
      { groupId: 1, groupName: '时时彩', groupSort: 4 },
      { groupId: 3, groupName: '11选5', groupSort: 5 },
      { groupId: 6, groupName: '六合彩', groupSort: 6 },
    ],
    code: 0,
    msg: '',
  };
};
