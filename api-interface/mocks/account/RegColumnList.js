/**
 * 註冊欄位列表
 *
 * @url /account/RegColumnList.action
 *
 * code: 唯一值
 * title: 中文顯示名稱
 * isRequired： 是否必填
 * isUnique： 是否驗證唯一
 *
 */

module.exports = query => {
  return {
    code: 0,
    msg: '我好像成功了！！',
    list: [
      {
        code: 'inviteCode',
        title: '邀請碼',
        isRequired: true,
        isUnique: false,
      },
      {
        code: 'realName',
        title: '姓名',
        isRequired: true,
        isUnique: true,
      },
      {
        code: 'mPhoneNum',
        title: '手機號',
        isRequired: true,
        isUnique: true,
      },
      {
        code: 'eMail',
        title: 'Email',
        isRequired: true,
        isUnique: true,
      },
      {
        code: 'qqAcc',
        title: 'qq號',
        isRequired: true,
        isUnique: false,
      },
      {
        code: 'wechatAcc',
        title: '微信號',
        isRequired: true,
        isUnique: false,
      },
      {
        code: 'nickName',
        title: '暱稱',
        isRequired: false,
        isUnique: true,
      },
    ],
  };
};
