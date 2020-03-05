<template lang="pug">
.profile_bindBank
  .profile_bindBank-head
    h4 使用提示
    p.text-warning 为保护您的资金安全，绑定银行卡后，如需修改请联系客服，以免造成不必要的损失，谢谢。
  .profile_bindBank-body
    Form(ref="form" :model="form" :rules="rules" :label-width="120")
      FormItem(label="开户人姓名：" prop="username")
        Input.form-width(v-model="form.username" placeholder="请输入真实姓名20字符内" clearable)
      FormItem(label="开户银行：" :prop="propName")
        Select.form-width(v-model="form.bankName")
          Option(v-for="(item, index) in bankList" :value="item" :key="index")
        Input.form-width.ml10(
          v-if="propName == 'bankNameOther'"
          v-model="form.bankNameOther"
          placeholder="其他银行请输入")
      FormItem(label="银行账号：" prop="bankCardNo")
        Poptip(trigger="focus" placement="top-start")
          b.text-primary(slot="content" v-html="cardNo")
          Input.form-width(
            v-model="form.bankCardNo"
            @on-keyup="keyupNumber($event.target)"
            placeholder="请输入银行卡号")
        span.text-gray.ml10 一经确认，再次修改请联系客服
      FormItem(label="手机：" prop="tel")
        Input.form-width(v-model="form.tel" placeholder="请输入手机号码" @on-keyup="keyupTel($event.target)")
      FormItem(label="开户行地址：" prop="bankAddress")
        Input.form-width(v-model="form.bankAddress" placeholder="请输入开户行地址")
      FormItem(label="设置提款密码：" prop="password")
        template(v-for="n in 6")
          Select.form-width-xs(v-model="password[n-1]" @on-change="passwordChange" placeholder="-")
            Option(v-for="i in 10" :value="i-1" :key="n-1 + i")
        p.text-primary 提款密码为平台的提款密码，不是银行卡密码
      FormItem
        Button(type="primary", :disabled="disabled", :loading="loading" @click="handleSubmit('form')") 确定
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

const BANKLIST = [
  // '中国人民银行',
  '中国工商银行',
  '中国银行',
  '中国建设银行',
  '中国农业银行',
  '中国邮政储蓄银行',
  '中国光大银行',
  '中国民生银行',
  '交通银行',
  '招商银行',
  '中信银行',
  '华夏银行',
  '浦发银行',
  '平安银行',
  '广发银行',
  '兴业银行',
  '浙商银行',
  '渤海银行',
  '恒丰银行',
  '其他银行'
];

export default {
  name: 'Profile_BindBank',
  data() {
    return {
      bankList: BANKLIST,
      form: {
        username: '',
        bankName: '',
        bankNameOther: '',
        bankCardNo: '',
        tel: '',
        bankAddress: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '限制20字符内支援中英数符号', trigger: 'blur' },
          { pattern: /^.{1,20}$/, message: '限制20字符内支援中英数符号', trigger: 'blur' }
        ],
        bankName: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
        bankNameOther: [{ required: true, message: '其他银行请输入', trigger: 'blur' }],
        bankCardNo: [{ required: true, pattern: /^\d{16,19}$/, message: '请填写正确的银行卡号', trigger: 'blur' }],
        bankAddress: [{ required: true, message: '请输入开户行地址', trigger: 'blur' }],
        tel: [{ required: true, pattern: /^1\d{10}$/, message: '请填写正确的手机号码', trigger: 'blur' }],
        password: [{ required: true, message: '请设置提款密码', trigger: 'change' }]
      },
      cardNo: '',
      password: [],
      loading: false,
      disabled: false,
    };
  },
  computed: {
    ...mapGetters({
      info: ACCOUNT.ACCOUNTINFO
    }),
    propName() {
      let bankName = this.form.bankName;
      return bankName == '其他银行' ? 'bankNameOther' : 'bankName';
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    notice(msg, type) {
      this.$Message[type](msg);
    },
    keyupNumber(target) {
      let value = target.value;
      let formatVal = String(value).replace(/[^\d]/g, '');
      if (isNaN(+formatVal) || formatVal == 0) formatVal = '';
      if (value != formatVal) this.form.bankCardNo = formatVal;
      this.cardNo = String(formatVal).replace(/(\d{4})/g, '$1&nbsp;&nbsp;');
    },
    keyupTel(target) {
      let value = target.value;
      let formatVal = String(value)
        .replace(/[^\d]/g, '')
        .substr(0, 11);
      if (value != formatVal) this.form.tel = formatVal;
    },
    passwordChange() {
      let value = this.password.reduce((pre, n) => {
        if (n != null) {
          return pre + n;
        }
      }, '');
      if (value.length != 6) value = '';
      this.form.password = value;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.handleAjax();
      });
    },
    handleAjax() {
      this.loading = true;
      this.disabled = true;
      accountApi.bindBank(this.form).then(data => {
        this.loading = false;
        this.disabled = false;
        if (data.code != 0) return this.notice(data.msg, 'warning');
        this.notice(data.msg, 'success');
        this.$emit('bindend');
      });
    }
  },
  watch: {
    info: {
      handler: function (newVal, oldVal) {
        const { tel, realname, realnme } = newVal;
        const username = realname || realnme;
        if (tel) {
          this.form.tel = tel;
        }
        if (username) {
          this.form.username = username;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.profile_bindBank {
  padding: 40px 40px 100px;
  background: #fff;
  &-head {
    padding-bottom: 20px;
    h4 {
      margin-bottom: 5px;
      font-size: 18px;
      color: #248ce6;
    }
    p {
      font-size: 14px;
    }
  }
  &-body {
    padding: 20px 0;
    border-top: 1px solid #ddd;
  }
}
</style>
