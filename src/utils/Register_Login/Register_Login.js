import { mapGetters } from 'vuex';
import { lotteryApi, accountApi } from 'api';
import { vcode as vcodeApi } from 'api/urlConfig';

const mixin = {
  inject: ['reload'],
  data() {
    return {
      isRegister: false, // 註冊模式 or 登入模式
      isNeedInvite: false, // 是否显示邀请码输入框
      inviteCode: '', //真實邀請碼
      form: {
        inviteCode: '', //輸入邀請碼(不管有沒有顯示，都必須帶回去)
        userName: '', //使用者名稱
        password: '', //密碼
        passwordCheck: '', //確認密碼(在送出前會被過濾掉)
        vcode: '', //輸入驗證碼
      },
      vcode: '', // 验证码图片
      columnList: [], // 註冊顯示欄位list
      agreementEnabled: false, //法律聲明視窗開關
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const KEY = 'inviteCode';

      // 決定是註冊 / 登入模式
      this.isRegister = this.$route.path.indexOf('register') < 0 ? false : true;

      // 註冊模式 or 登入模式分別處理
      if (this.isRegister) {
        accountApi.getRegColumnList().then(data => {
          this.columnList = data.list;
          //動態處理欄位
          this.processRules();
        });
        // 取得預設邀請碼
        lotteryApi.registerConfig().then(data => {
          const { code, msg, isNeedInvite, sysInviteCode } = data;
          if (code != 0) return this.ivNotice('', msg);

          this.isNeedInvite = isNeedInvite;

          let { inviteCode } = this.$route.params;

          if (inviteCode) {
            setTimeout(() => {
              this.form.inviteCode = inviteCode + '';
            }, 100);
          } else {
            this.form.inviteCode = sysInviteCode + '';
          }
        });
      } else {
        this.rules.userName.splice(1);
      }
    },
    processRules() {
      //根據api有打到的項目取得validate基本配置
      this.columnList.forEach((item, index) => {
        //處理rules
        const isRequired = item.isRequired;
        this.rules[item.code][0].required = isRequired;

        //處理placeholder說明
        let reg = this.holder[item.code].holderReg;
        this.holder[item.code].holderReg = reg.replace('{isRequired}', isRequired === true ? ',必填' : '');

        //動態處理form欄位，邀請碼預設一定要傳，不做動態處理
        if (item.code !== 'inviteCode') {
          this.$set(this.form, item.code, '');
        }
      });
    },
    switchForm() {
      //模板 6 特別調整，點擊登入要導回首頁
      if (this.appConfig.themeName == 'theme6') return this.$router.push({ path: '/' });

      this.handleReset('form');
      this.$router.push({ path: `${this.isRegister ? '/login' : '/register'}` });
    },
    refreshVcode() {
      this.vcode = vcodeApi + `?v=${Math.random()}`;
    },
    vcodeFocus() {
      this.refreshVcode();
    },
    //過濾特殊字元
    onKeyup(propName, event) {
      let value = typeof event == 'string' ? event : event.target.value;
      this.form[propName] = value.replace(/[^a-zA-Z0-9]/g, '');
    },
    //開啟法律聲明視窗
    openAgree() {
      this.agreementEnabled = true;
    },
    //關閉法律聲明視窗
    closeAgree() {
      this.agreementEnabled = false;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this[this.isRegister ? 'handleRegister' : 'handleLogin']();
      });
    },
    handleRegister() {
      this.$store.dispatch('register', this.form).then(this.success);
    },
    handleLogin() {
      this.$store.dispatch('login', this.form).then(this.success);
    },
    success(data) {
      if (data.code == 2) {
        //code:2, 驗證unique失敗
        let { columnCode, msg } = data.chkUnique;
        this.ivNotice('warning', msg);
        this.refreshVcode();
        return;
      } else if (data.code != 0) {
        this.refreshVcode();
        this.ivNotice('warning', data.msg);
        return;
      }

      //登入成功後，若不是在首頁則轉至首頁
      let nowPath = this.$route.path;
      if (nowPath !== '/') {
        this.$router.replace({ path: '/' });
      } else {
        this.reload();
      }
      this.createWebSocket(null, { isReconnect: true });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
  watch: {
    $route: 'init',
  },
};
export default mixin;
