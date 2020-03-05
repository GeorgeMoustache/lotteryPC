<template lang="pug">
.profile_withdraw
  .profile_withdraw-head
    span 账号：
      em(v-text="info.username")
    span.wealth 余额：
      em.text-warning(v-text="info.wealth")
      | &nbsp;CNY
    Button(type="info" size="small" @click="viewRecord") 交易记录
  .profile_withdraw-body
    Form(ref="form" :model="form" :rules="rules" :label-width="120")
      FormItem(label="银行卡：")
        p.form-info.text-info
          span 银行名称：
          b(v-text="account.bankName")
          span 卡号：
          b(v-text="account.cardNo")
          span 姓名：
          b(v-text="account.userName")
      FormItem(label="消费比例：")
        p.form-info.text-info
          span 提款需达投注量：
          b(v-text="account.mustCount")
          span 已达投注量：
          b(v-text="account.betCount")
          span 是否可提款：
          b(v-text="'否是'.charAt(account.isAction)")
          template(v-if="account.hasCharge")
            span 免手续费额度：
            b(v-text="`${account.freeQuota}元`")
      FormItem(label="提款金额：" prop="amount")
        input(type="text" autocomplete="off" style="display: none;")
        Input(name="withdrawAmount" pattern="[0-9]*" number v-model="form.amount" @on-keyup="keyupPrice($event.target.value)" @on-blur="blurPrice($event.target.value)" style="width: 200px" autocomplete="off")
          span(slot="元")
        span.text-gray.ml10 最小金额为{{account.minCost}}元，请正确填写
        p.text-gray(v-if="account.hasCharge") 提款手续费：
          span(v-text="cost")
          | 元
      FormItem(label="取款密码：" prop="password")
        input(type="password" style="display: none;")
        input(input type="text" style="display: none;" autocomplete="off")
        Input(name="withdrawPass" v-model="form.password" type="password" style="width: 150px" autocomplete="off")
      FormItem
        template(v-if="account.isAction")
          Button(type="primary", :disabled="disabled", :loading="loading" @click="handleSubmit('form')") 确认
        template(v-else)
          Button(type="primary" disabled) 不可提现
        p
          b.text-error(v-if="errorTime == 3") 提款密码连续输错3次，提款功能已被冻结！
  .profile_withdraw-foot
    h4.text-info 使用提示
    p 1、每日可提现
      b.text-error(v-text="account.limitDepositNum")
      | 次，今日尚可提现
      b.text-error(v-text="account.remainderNum")
      | 次
    p 2、为确保您的资金安全，请填写您的出款银行资料，以免有心人士窃取，谢谢。
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'Profile_Withdraw',
  props: ['info'],
  inject: ['reload'],
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
    this.init();
  },
  methods: {
    init() {
      this.fetchAccount();
    },
    fetchAccount() {
      accountApi.withdraw().then(data => {
        let { code, msg, info } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg
          })
          return
        }
        this.account = info;
      });
    },
    viewRecord() {
      this.$router.push({ path: '/profile/record' });
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
      if (this.account.remainderNum == 0) {
        this.$Notice.error({
          title: '系统提示',
          desc: '您的提取次数已达今日上限'
        })
        return
      }
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
          this.$Notice.error({
            title: '系统提示',
            desc: msg
          })
        } else {
          this.$Notice.success({
            title: '系统提示',
            desc: msg
          })
          this.reload();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.profile_withdraw {
  padding: 40px;
  background: #fff;
  .text-info {
    color: #248ce6;
  }
  em {
    font-style: normal;
  }
  &-head {
    padding: 0 20px 20px;
    .wealth {
      margin: 0 20px 0 40px;
    }
  }
  &-body {
    padding: 15px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    .form-info {
      padding: 0 5px;
      border: 1px solid #dddee1;
      line-height: 32px;
      font-size: 13px;
      b {
        margin-right: 20px;
      }
    }
  }
  &-foot {
    padding: 20px 0;
    h4 {
      margin-bottom: 15px;
      font-size: 16px;
    }
    p {
      font-size: 13px;
    }
  }
}
</style>
