<template lang="pug">
Form.form(ref="form" :model="form" :rules="rules" :label-width="120")
  template(v-for="item in tpl")
    FormItem(:label="`${item.label}：`" :prop="item.prop")
      template(v-for="n in 6")
        Select.form-width-xs(v-model="tempForm[item.prop][n-1]" @on-change="passwordChange(item.prop)" placeholder="-")
          Option(v-for="i in 10" :value="i-1" :key="n-1 + i")
  FormItem
    Button(type="primary" @click="handleSubmit('form')" :disabled="disabled" :loading="loading") 确定
</template>

<script>
import { accountApi } from 'api';

const TPL = [
  { label: '旧提款密码', prop: 'old' },
  { label: '新提款密码', prop: 'new' },
  { label: '确认新提款密码', prop: 'passwdCheck' }
]

export default {
  name: 'Profile_ResetWithdrawPasswd',
  data () {
    const validatorPass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入新的提款密码'))
      } else {
        if (this.form.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.form.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatorPassCheck = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请再次输入新的提款密码'))
      } else if (value !== this.form.new) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tpl: TPL,
      form: {
        old: '',
        new: '',
        passwdCheck: ''
      },
      tempForm: {
        old: [],
        new: [],
        passwdCheck: []
      },
      rules: {
        old: [
          { required: true, message: '请输入旧提款密码', trigger: 'change' }
        ],
        new: [
          { required: true, validator: validatorPass, trigger: 'change' }
        ],
        passwdCheck: [
          { required: true, validator: validatorPassCheck, trigger: 'change' }
        ]
      },
      loading: false,
      disabled: false
    }
  },
  created () {
  },
  methods: {
    passwordChange (prop) {
      let value = this.tempForm[prop].reduce((pre, n)=> {
        if (n != null) {
          return pre + n
        }
      }, '')
      if (value.length != 6) value = ''
      this.form[prop] = value
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (!valid) return
        this.handleAjax()
      })
    },
    handleAjax () {
      this.loading = true
      let _form = this.form
      let form = {
        old: _form.old,
        new: _form.new
      }
      accountApi.resetWithdrawPasswd(form).then(data => {
        this.loading = false
        if (data.code != 0) {
          this.notice(data.msg, 'warning')
        } else {
          this.notice(data.msg, 'success')
          this.$router.push({path: '/profile'})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
