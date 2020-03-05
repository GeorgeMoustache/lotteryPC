<template lang="pug">
Form(ref="form" :model="form" :rules="rules" :label-width="120")
  FormItem(label="登录密码：" prop="old")
    Input.form-width(type="password" v-model="form.old" placeholder="请输入旧的登录密码")
    span.text-gray.ml10 旧密码如输错3次，将冻结您的帐号
  FormItem(label="新密码：" prop="new")
    Input.form-width(type="password" v-model="form.new" @on-keyup="keyupFormart($event, 'new')" placeholder="请输入新的登录密码")
    span.text-gray.ml10 请输入6-12个数字字母组合的密码
  FormItem(label="密码确认：" prop="passwdCheck")
    Input.form-width(type="password" v-model="form.passwdCheck" @on-keyup="keyupFormart($event, 'passwdCheck')" placeholder="请再次输入新的登录密码")
  FormItem
    Button(type="primary" @click="handleSubmit('form')" :disabled="disabled" :loading="loading") 确定
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'Profile_ResetLoginPasswd',
  data () {
    const validatorPass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入新的登录密码'))
      } else if (value && value.length < 6) {
        callback(new Error('请至少输入6位字符'))
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
        callback(new Error('请再次输入新的登录密码'))
      } else if (value !== this.form.new) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        old: '',
        new: '',
        passwdCheck: ''
      },
      rules: {
        old: [
          { required: true, message: '请输入旧的登录密码', trigger: 'blur' }
        ],
        new: [
          { required: true, validator: validatorPass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatorPassCheck, trigger: 'blur' }
        ]
      },
      loading: false,
      disabled: false
    }
  },
  created () {
  },
  methods: {
    notice (msg, type) {
      this.$Message[type](msg)
    },
    keyupFormart (event, prop) {
      let value = event.target.value
      let formartVal = String(value).replace(/[^0-9a-zA-Z]/g, '')
      formartVal = formartVal.substring(0, 12)
      if (value != formartVal) this.form[prop] = formartVal
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
      accountApi.resetLoginPasswd(form).then(data => {
        this.loading = false
        if (data.code != 0) {
          if (data.errorTime == 3) {
            this.disabled = true
          }
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
