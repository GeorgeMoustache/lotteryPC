<template lang="pug">
.withdraw
  .head
    dl
      dt
        p 会员账号：{{info.username}}
        p 余额：￥{{info.wealth}}
        p 是否可提款：{{'否是'.charAt(account.isAction)}} (提款需达投注量：{{account.mustCount}} 已达投注量：{{account.betCount}})
      dd
        p 银行名称：{{account.bankName}}
        p 银行卡号：{{account.cardNo}}
        p 开户人姓名：{{account.userName}}
    .note 修改银行卡资讯，请联系客服
  Form(ref="form" :model="form" :rules="rules")
    FormItem(prop="amount")
      input(type="text" autocomplete="off" style="display: none;")
      Input(name="withdrawAmount" pattern="[0-9]*" number v-model="form.amount" @on-keyup="keyupPrice($event.target.value)" @on-blur="blurPrice($event.target.value)" autocomplete="off" placeholder="请输入提款金额，必填")
      .tip 最小金额为{{account.minCost}}元，请正确填写
    FormItem(prop="password")
      input(type="password" style="display: none;")
      input(input type="text" style="display: none;" autocomplete="off")
      Input(name="withdrawPass" v-model="form.password" type="password" autocomplete="off" placeholder="取款密码，必填")
    FormItem
      .buttons
        template(v-if="account.isAction")
          Button.submit(:disabled="disabled" :loading="loading" @click="handleSubmit('form')") 提交
          Button.reset(@click="resetForm('form')") 重置
        template(v-else)
          Button(disabled) 不可提现
      .error(v-if="errorTime == 3") 提款密码连续输错3次，提款功能已被冻结！
  .daily-count 每日可提现
    span(v-text="account.limitDepositNum")
    | 次，今日尚可提现
    span(v-text="account.remainderNum")
    | 次
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'ProfileWithdraw',
  inject: ['ivNotice', 'reload'],
  props: ['info'],
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入金额'));
      } else {
        let { minCost } = this.account;
        let { wealth } = this.info;
        if (value < minCost) {
          callback(new Error(`输入最小金额不能低于${minCost}`));
        } else if (value > wealth) {
          callback(new Error(`输入金额超过余额${wealth}`));
        }
        callback();
      }
    };
    return {
      account: {},
      form: {
        amount: '',
        password: ''
      },
      rules: {
        amount: [{ validator: validateAmount }],
        password: [{ required: true, message: '请输入取款密码', trigger: 'blur' }]
      },
      loading: false,
      disabled: false,
      errorTime: 0,
    };
  },
  computed: {
    cost() {
      const money = parseFloat(this.form.amount);
      if (isNaN(money)) return '0.00';
      const diff = money - parseFloat(this.account.freeQuota);
      if (diff > 0) return (this.account.rate * diff).toFixed(2);
      return '0.00';
    }
  },
  created() {
    this.fetchAccount();
  },
  methods: {
    fetchAccount() {
      accountApi.withdraw().then(data => {
        let { code, msg, info } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.account = info;
      });
    },
    keyupPrice(value) {
      let formatVal = +String(value).replace(/[^\d]/g, '');
      if (value != formatVal) this.form.amount = formatVal;
    },
    blurPrice(value) {
      let formatVal = +String(value).replace(/[^\d]/g, '');
      if (value != formatVal) this.form.amount = formatVal;
    },
    handleSubmit(name) {
      //提取次數達上限
      if (this.account.remainderNum == 0) return this.ivNotice('error', '您的提取次数已达今日上限');
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.handleAjax();
      });
    },
    handleAjax() {
      this.loading = true;
      this.disabled = true;
      accountApi.withdraw('post', this.form).then(data => {
        let { code, msg, errorTime } = data;
        this.loading = false;
        this.disabled = false;
        if (code != 0) {
          if (errorTime == 3) {
            this.info.isAction = 0;
            this.errorTime = 3;
          }
          this.ivNotice('error', msg)
        } else {
          this.ivNotice('success', msg)
          this.reload();
        }
      });
    },
    //重置表單
    resetForm(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>