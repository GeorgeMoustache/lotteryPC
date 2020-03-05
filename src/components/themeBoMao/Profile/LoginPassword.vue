<template lang="pug">
.login
  Form(ref="form" :model="form" :rules="rules")
    .title 修改登录密码
    FormItem(prop="old")
      Input(type="password" v-model="form.old" placeholder="请输入旧的登录密码，必填")
      .tip 旧密码如输错3次，将冻结您的帐号
    FormItem(prop="new")
      Input(type="password" v-model="form.new" @on-keyup="keyupFormart($event, 'new')" placeholder="请输入新的登录密码，必填")
      .tip 请输入6-12个数字字母组合的密码
    FormItem(prop="passwdCheck")
      Input(type="password" v-model="form.passwdCheck" @on-keyup="keyupFormart($event, 'passwdCheck')" placeholder="请再次输入新的登录密码，必填")
    FormItem
      Button(@click="handleSubmit('form')" :disabled="disabled" :loading="loading") 确定
</template>
<script>
import { accountApi } from 'api';

export default {
  name: 'LoginPassword',
  inject: ['ivNotice', 'reload'],
  data() {
    //驗證相關參數
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
      loading: false, //loading 狀態
      disabled: false, //鎖定按鈕
    }
  },
  methods: {
    //輸入時驗證 (登入用)
    keyupFormart (event, prop) {
      let value = event.target.value
      let formartVal = String(value).replace(/[^0-9a-zA-Z]/g, '')
      formartVal = formartVal.substring(0, 12)
      if (value != formartVal) this.form[prop] = formartVal;
    },
    //送出
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (!valid) return
        this.loading = true;

        let _form = this.form;
        let form = {
          old: _form.old,
          new: _form.new
        }

        accountApi.resetLoginPasswd(form).then(data => {
          this.loading = false;
          let { code, msg } = data;
          if (code != 0) {
            //輸入錯誤達三次鎖定
            if (data.errorTime == 3) {
              this.disabled = true
            }
            this.ivNotice('warning', msg)
          } else {
            this.ivNotice('success', msg)
            this.reload();
          }
        })
      })
    }
  }
}
</script>