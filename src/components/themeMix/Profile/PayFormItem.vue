<template lang="pug">
Form(ref="form" :model="form" :rules="rules" inline :label-width="100" style="width: 350px; margin: 0 auto;")
  FormItem(label="充值金额：" prop="amount")
    Input(number v-model="form.amount" @on-keyup="formatAmount($event.target.value)" @on-blur="formatAmount($event.target.value)" style="width: 130px; margin-right: 20px;")
    Button(type="primary", :disabled="disabled", :loading="loading" @click="handleSubmit('form')") 下一步
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'PayFormItem',
  props: ['item'],
  data () {
    const validateAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入金额'));
      } else {
        let max = 99999999;
        let min = 1;
        const { item } = this;
        if (item && item.range) {
          max = Math.max(...item.range)
          min = Math.min(...item.range)
        }
        if (value < min) {
          callback(new Error(`输入最小金额不能低于${min}`));
        } else if (value > max) {
          callback(new Error(`输入最大金额不能高于${max}`));
        }
        callback();
      }
    };
    return {
      form: {
        id: this.item.id
      },
      rules: {
        amount: [
          { validator: validateAmount }
        ]
      },
      loading: false,
      disabled: false,
    }
  },
  methods: {
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
					return this.notice(data.msg, 'warning')
        }
        const { h5url } = data.info
        if (h5url) {
          location.href = h5url
        } else {
          this.$emit('submit', data);
        }
				this.loading = false;
        this.disabled = false;
      })
    },
    notice(msg, type) {
      this.$Message[type](msg)
    }
  }
}
</script>

<style>
</style>
