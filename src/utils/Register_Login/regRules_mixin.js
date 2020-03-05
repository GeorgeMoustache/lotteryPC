const mixin = {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登录密码'));
      } else {
        if (this.form.passwordCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.form.validateField('passwordCheck');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      let errors = [];
      if (value === '') {
        errors.push(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        errors.push(new Error('两次输入的密码不一致'));
      }
      callback(errors);
    };

    return {
      rules: {
        inviteCode: [
          { required: true, message: '邀请码不能为空', trigger: 'blur' },
          { pattern: /^\d{5,}$/, message: '您输入的邀请码错误或者已过期', trigger: 'blur' },
        ],
        userName: [
          { required: true, message: '请输入会员帐号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '会员帐号须为6-16个字母或数字', trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '限制20字符内支援中英数符号', trigger: 'blur' },
          { pattern: /^.{1,20}$/, message: '限制20字符内支援中英数符号', trigger: 'blur' },
        ],
        mPhoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确格式手机号限1开头共11码数字', trigger: 'blur' },
        ],
        eMail: [
          { required: true, message: '请输入Email', trigger: 'blur' },
          { type: 'email', message: '格式不正确', trigger: 'blur' },
        ],
        qqAcc: [
          { required: true, message: '请输入QQ', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{5,10}$/, message: '请输入正确QQ，限5-10字元', trigger: 'blur' },
        ],
        wechatAcc: [
          { required: true, message: '请输入微信帐号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '请输入正确微信帐号，限6-20字元', trigger: 'blur' },
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '请输入2-5字汉字', trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{4,20}$/, message: '登录密码须为6-16个包含字母或数字的组合', trigger: 'blur' },
        ],
        passwordCheck: [{ required: true, validator: validatePassCheck, trigger: 'blur' }],
        vcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
      holder: {
        inviteCode: {
          holderReg: '请输入邀請碼',
          holderLog: '请输入邀請碼',
        },
        userName: {
          holderReg: '请输入会员帐号，必填，须为6-16个字母或数字',
          holderLog: '请输入会员帐号',
        },
        realName: {
          holderReg: '请输入真实姓名{isRequired}，请输入真实姓名20字符内',
          holderLog: '请输入真实姓名',
        },
        mPhoneNum: {
          holderReg: '请输入手机号{isRequired}',
          holderLog: '请输入手机号',
        },
        eMail: {
          holderReg: '请输入Email{isRequired}',
          holderLog: '请输入Email',
        },
        qqAcc: {
          holderReg: '请输入QQ{isRequired}',
          holderLog: '请输入QQ',
        },
        wechatAcc: {
          holderReg: '请输入微信{isRequired}',
          holderLog: '请输入微信',
        },
        nickName: {
          holderReg: '请输入昵称{isRequired}，限制2-5字汉字',
          holderLog: '请输入昵称',
        },
        password: {
          holderReg: '请输入登录密码，必填，须为6-16个同时包含字母或数字的组合',
          holderLog: '请输入登录密码',
          maxLength: 16,
        },
        passwordCheck: {
          holderReg: '请输入确认密码，必填',
          holderLog: '请输入确认密码',
          maxLength: 16,
        },
        vcode: {
          holderReg: '请输入验证码，必填',
          holderLog: '请输入验证码',
          maxLength: 4,
        },
      },
    };
  },
};

export default mixin;
