<template lang="pug">
.pay-model
  template(v-if="!result")
    p.pay-tip
      span.tag 公司入款
      | 注意事件：1、每次存款前，请先至本页面查看最新的收款账户。请勿自行存款至旧账户，若存款至旧账户，本公司将无法查收，恕不负责。2、请尽量选择同行存款，如跨行请进行加急，方便系统加快您的入款速度。
    RadioGroup.bank-select(v-model="bankIndex" @on-change="radioChange")
      Radio(v-for="(item, index) in list" :key="index" :label="index")
        p.select-item
          span.bank-name(v-text="item.bankName")
          img.bank-icon(v-if="item.icon" :src="item.icon")
    .pay-form(v-if="bankIndex > -1")
      p.remind 贴心提醒：充值完成后，请静待3-5分钟重新刷新页面，财务收到款项后会立即为您上分。
      Form(ref="form" :model="form" :rules="rules" :label-width="120")
        FormItem(label="充值银行:")
          span(v-text="selectedBank.bankName")
        FormItem(label="收款姓名:")
          span(v-text="selectedBank.accountName")
          Button(size="small" type="default" @click="copy(selectedBank.accountName)") 复制
        FormItem(label="收款帐号:")
          span(v-text="selectedBank.bankCardNo")
          span （转账后请输入金额提交订单）
          Button(size="small" type="default" @click="copy(selectedBank.bankCardNo)") 复制
        FormItem(label="开户网点:")
          span(v-text="selectedBank.bankAddress")
        FormItem(label="充值金额:" prop="amount")
          Input.form-width-sm(
            number
            v-model="form.amount"
            @on-keyup="formatAmount($event.target.value)"
            @on-blur="formatAmount($event.target.value)"
            )
        FormItem(label="存款人姓名:" prop="username")
          Input.form-width-sm(v-model="form.username")
        FormItem(label="备注:" prop="note")
          Input.form-width-sm(v-model="form.note")
        FormItem
          Button(type="primary", :disabled="disabled", :loading="loading" @click="handleSubmit('form')") 立即充值
  .pay-result(v-else)
    ul
      li
        label 充值银行：
        span.value(v-text="selectedBank.bankName")
      li
        label 收款姓名：
        span.value(v-text="selectedBank.accountName")
        Button(size="small" type="default" @click="copy(selectedBank.accountName)") 复制
      li
        label 收款帐号：
        span.value(v-text="selectedBank.bankCardNo")
        Button(size="small" type="default" @click="copy(selectedBank.bankCardNo)") 复制
      li
        label 开户网点：
        span.value(v-text="selectedBank.bankAddress")
      li
        label 订单号：
        span.value.text-info(v-text="result.orderNo")
        Button(size="small" type="default" @click="copy(result.orderNo)") 复制
      li
        label 充值金额：
        span.value.text-error(v-text="result.amount")
      li
        label 备注：
        span.value.text-error(v-text="result.note")
      li
        p.text-center.text-error 贴心提醒：充值完成后，请静待3-5分钟重新刷新页面，财务收到款项后会立即为您上分。
      li
        Button(type="primary" @click="check") 确定
  button(style="display:none;" ref="copybtn" v-clipboard="copyData" @success="handleSuccess" @error="handleError") 复制
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'PayBank',
  props: ['list'],
  data () {
    return {
      bankIndex: -1,
      selectedBank: {},
      form: {
        id: 0,
        username: '',
        amount: '',
        note: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入存款人姓名', trigger: 'blur' }
        ],
        amount: [
          { validator: this.$root.$validateAmount(this) }
        ]
      },
      range: [],
      copyData: ' ',
      loading: false,
      disabled: false,
      result: null
    }
  },
  methods: {
    radioChange (index) {
      this.selectedBank = this.list[index]
      this.form.id = this.selectedBank.id
      this.form.amount = '',
      this.form.note = ''
      this.range = this.selectedBank['range'] || []
    },
    formatAmount(value) {
      let formatVal = +String(value).replace(/[^\d.]/g, '');
      if (Number.isNaN(formatVal)) formatVal = 0;
      if (value != formatVal) this.form.amount = formatVal;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        this.handleAjax()
      })
    },
    handleAjax() {
      this.loading = true
      this.disabled = true;
      accountApi.deposit(this.form).then(data => {
        if (data.code != 0) {
          this.notice(data.msg, 'warning')
        } else {
          this.notice('提交成功', 'success')
          this.result = data.info
        }
        this.loading = false
        this.disabled = false;
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    check () {
      //關閉結果頁並返回
      this.result = null;
      //重置參數
      this.bankIndex = -1;
      this.form.id = 0;
      this.form.username = '';
      this.form.amount = '';
      this.form.note = '';
    },
    copy (context) {
      this.copyData = context
      // !!!
      setTimeout(() => {
        this.$refs.copybtn.click()
      }, 100)
    },
    handleSuccess (e) {
      this.notice('复制成功', 'success')
    },
    handleError (e) {
      this.notice('复制失败', 'warning')
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-model {
  padding: 20px;
}
.pay-tip {
  margin-bottom: 20px;
  overflow: hidden;
  .tag {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    padding: 0 2px;
    border-radius: 3px;
    background: #fd9f80;
    color: #fff;
  }
}

.bank-select {
  margin-bottom: 20px;
  .select-item {
    display: inline-block;
    height: 50px;
    .bank-name {
      font-size: 14px;
    }
    .bank-icon {
      display: block;
      width: 100px;
      height: 25px;
    }
  }
  .ivu-radio-group-item {
    padding: 5px 10px;
    border: 2px solid #fff;
    &.ivu-radio-wrapper-checked,
    &:hover {
      border-color: $primary-color;
    }
  }
}

.pay-form {
  border-top: 1px dashed #ddd;
  .remind {
    margin: 20px;
    padding: 10px 20px;
    border: 1px solid #ffce89;
    background: #fffaec;
    font-weight: 700;
  }
}

.pay-result {
  border: 1px solid #ffce89;
  background: #fffaec;
  li {
    padding-left: 100px;
    line-height: 50px;
    border-bottom: 1px dashed #ffce89;
  }
}
</style>
