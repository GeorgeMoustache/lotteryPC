<template lang="pug">
.bind-bank
  .note 为保护您的资金安全，绑定银行卡后，如需修改请联系客服，以免造成不必要的损失，谢谢。
  Form(ref="form" :model="form" :rules="rules")
    FormItem(prop="username")
      Input(v-model="form.username" placeholder="请输入真实姓名20字符内" clearable)
    FormItem(:prop="propName")
      Select(v-model="form.bankName")
        Option(v-for="(item, index) in bankList" :value="item" :key="index")
    FormItem(v-if="propName == 'bankNameOther'")
      Input(v-model="form.bankNameOther" placeholder="其他银行请输入")
    FormItem(prop="bankCardNo")
      Input(v-model="form.bankCardNo" @on-keyup="keyupNumber($event.target)" placeholder="请输入银行账号，必填")
      .tip 一经确认，再次修改请联系客服
    FormItem(prop="bankAddress")
      Input(v-model="form.bankAddress" placeholder="请输入开户行地址，必填")
    FormItem(prop="tel")
      Input(v-model="form.tel" placeholder="请输入手机号码，必填" @on-keyup="keyupTel($event.target)")
    FormItem(prop="password")
      template(v-for="n in 6")
        Select(v-model="password[n-1]" @on-change="passwordChange" placeholder="-")
          Option(v-for="i in 10" :value="i-1" :key="n-1 + i")
      .tip 提款密码为平台的提款密码，不是银行卡密码
    FormItem
      .buttons
        Button.submit(:disabled="disabled" :loading="loading" @click="handleSubmit('form')") 提交
        Button.reset(@click="resetForm('form')") 重置
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

export default {
  name: 'ProfileBindBank',
  inject: ['ivNotice'],
  data() {
    return {
      bankList: ['中国工商银行', '中国银行', '中国建设银行', '中国农业银行', '中国邮政储蓄银行', '中国光大银行', '中国民生银行', '交通银行', '招商银行', '中信银行', '华夏银行', '浦发银行', '平安银行', '广发银行', '兴业银行', '浙商银行', '渤海银行', '恒丰银行', '其他银行'],
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
  },
  methods: {
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
        if (data.code != 0) return this.ivNotice('warning', data.msg);
        this.ivNotice('success', data.msg);
        this.$parent.fetchInfo();
      });
    },
    resetForm(name) {
      this.$refs[name].resetFields();
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
      deep: true,
    }
  }
};
</script>