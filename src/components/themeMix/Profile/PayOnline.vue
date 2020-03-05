<template lang="pug">
.pay-model
  Form(ref="form" :model="form" :rules="rules" :label-width="120")
    FormItem(label="存款人姓名:" prop="username")
      Input.form-width-sm(v-model="form.username")
    FormItem(label="开户银行:" prop="id")
      Select(v-model="bankIndex" @on-change="selectChange" style="width: 200px")
        Option(v-for="(item, index) in list" :key="index" :value="index" :label="item.bankName")
    FormItem(label="充值金额:" prop="amount")
      Input.form-width-sm(number v-model="form.amount" @on-keyup="formatAmount($event.target.value)" @on-blur="formatAmount($event.target.value)")
      span.tip(v-if="range.length") （单笔充值限额：最低
        span.text-error(v-text="range[0]")
        | 元 ，最高
        span.text-error(v-text="range[1]")
        | 元）
    FormItem
      Button(type="primary" :loading="loading" @click="handleSubmit('form')") 立即充值
</template>

<script>
import { accountApi } from 'api';

let windowFeatures = `
  width=1200,
  height=750,
  menubar=no,
  location=no,
  resizable=yes,
  scrollbars=yes,
  status=no,
  toolbar=no
`

export default {
  name: 'PayOnline',
  props: ['list'],
  data () {
    return {
      bankIndex: '',
      range: [],
      form: {
        username: '',
        id: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入存款人姓名', trigger: 'blur' }
        ],
        id: [
          { required: true, message: '请选择开户银行' }
        ],
        amount: [
          { validator: this.$root.$validateAmount(this) }
        ]
      },
      loading: false
    }
  },
  methods: {
    selectChange (value) {
      let selectedBank = this.list[value]
      this.form.amount = ''
      this.form.id = selectedBank.id
      this.range = selectedBank.range || []
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
      let newWindow = window.open('', 'onlinePay', windowFeatures)
      accountApi.deposit(this.form).then(data => {
        if (data.code != 0) {
          this.notice(data.msg, 'warning')
        } else {
          const h5url = data.info.h5url
          if (h5url) {
            newWindow.location.href = h5url
            if (newWindow) {
              newWindow.focus()
            } else {
              this.notice('请设置浏览器的弹窗为“允许”', 'warning')
            }
          }
        }
        this.loading = false
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
