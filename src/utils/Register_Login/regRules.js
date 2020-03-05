
export const ruleBase = {
  inviteCode: [
    { required: true, message: '邀请码不能为空', trigger: 'blur' },
    { pattern: /^\d{5,}$/, message: '您输入的邀请码错误或者已过期', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '用户名须为6-16个字母或数字', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入2-5字汉字', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '请输入2-5字汉字', trigger: 'blur' }
  ],
  mPhoneNum: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确格式手机号限1开头共11码数字', trigger: 'blur' }
  ],  
  eMail: [
    { required: true, message: '请输入Email', trigger: 'blur' },
    { type: 'email', message: '格式不正确', trigger: 'blur' }
  ],
  qqAcc: [
    { required: true, message: '请输入QQ', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{5,10}$/, message: '请输入正确QQ，限5-10字元', trigger: 'blur' }
  ],
  weChatAcc: [
    { required: true, message: '请输入微信帐号', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '请输入正确微信帐号，限6-20字元', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入暱称', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '请输入2-5字汉字', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: null, trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{4,20}$/, message: '密码须为4-20个同时包含字母或数字的组合', trigger: 'blur' }
  ],
  passwordCheck: [
    { required: true, validator: null, trigger: 'blur' }
  ],
  vCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
};

export const holderBase = {
  inviteCode: {
    holderReg: '请输入邀請碼',
    holderLog: '请输入邀請碼',
  },
  userName: {
    holderReg:'请输入用户名，必填，须为6-16个字母或数字',
    holderLog: '请输入用户名',
  },
  realName: {
    holderReg:'请输入姓名{isRequired}，须为2-5字汉字',
    holderLog: '请输入姓名',
  },
  mPhoneNum: {
    holderReg:'请输入手机号{isRequired}',
    holderLog: '请输入手机号',
  },
  eMail: {
    holderReg:'请输入Email{isRequired}',
    holderLog: '请输入Email',
  },
  qqAcc: {
    holderReg:'请输入QQ{isRequired}',
    holderLog: '请输入QQ',
  },
  weChatAcc: {
    holderReg:'请输入微信{isRequired}',
    holderLog: '请输入微信',
  },
  nickName: {
    holderReg:'请输入昵称{isRequired}，限制2-5字汉字',
    holderLog: '请输入昵称',
  },
  password: {
    holderReg:'请输入密码，必填，须为6-16个同时包含字母或数字的组合',
    holderLog: '请输入密码',
    maxLength: 16,
  },
  passwordCheck: {
    holderReg:'请输入确认密码，必填',
    holderLog: '请输入确认密码',
    maxLength: 16,
  },
  vcode: {
    holderReg:'请输入验证码，必填',
    holderLog: '请输入验证码',
    maxLength: 4,
  },
}

