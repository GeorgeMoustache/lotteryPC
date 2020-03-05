<template lang="pug">
Modal(v-model="modal" width="600").login-modal
  //- 注册
  template(v-if="isRegister")
    .fn-clear(slot="header")
      h3.fn-left 用户注册
      .fn-right(style="margin-right: 40px")
        span.text-gray 已有账号？
        a.text-primary(@click="switchForm") 立即登录
    Form(ref="form" :model="form" :rules="rules" label-position="right"  :label-width="80")
      FormItem(label="邀请码:" prop="inviteCode")
        Input(v-model="form.inviteCode" @on-keyup="onKeyup('inviteCode', $event)", :disabled="!!inviteCode")
      FormItem(label="用户名:" prop="username")
        Input(v-model="form.username" @on-keyup="onKeyup('username', $event)")
        p.form-tip 用户名须为6-16个字母或数字
      FormItem(label="手机号码:" prop="tel" v-if="needTel")
        Input(v-model="form.tel")
      FormItem(label="密码:" prop="password")
        Input(v-model="form.password" type="password" @on-keyup="onKeyup('password', $event)")
        p.form-tip 密码须为6-16个同时包含字母或数字的组合
      FormItem(label="确认密码:" prop="passwordCheck")
        Input(v-model="form.passwordCheck" type="password" @on-keyup="onKeyup('passwordCheck', $event)")
      FormItem.vcode(label="验证码:" prop="vcode" key=0)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
      FormItem
        span.text-gray 提交注册信息即为同意：
        a(target="_self" onclick="window.open('/registerAgreement','register-agreement','width=1000,height=653').focus()") 《法律声明》
  //- 登录
  template(v-else)
    .fn-clear(slot="header")
      h3.fn-left 用户登录
      .fn-right(style="margin-right: 40px" v-if="!isHostBihuo")
        span.text-gray 没有账号？
        a.text-primary(@click="switchForm") 立即注册
    Form(ref="form" :model="form" :rules="rules" label-position="right"  :label-width="80")
      FormItem(label="用户名:" prop="username")
        Input(v-model="form.username" @on-keyup="onKeyup('username', $event)")
      FormItem(label="密码:" prop="password")
        Input(v-model="form.password" type="password" @on-keyup="onKeyup('password', $event)")
        p.form-tip 密码须为6-16个同时包含字母或数字的组合
      FormItem.vcode(label="验证码:" prop="vcode" key=1)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
  p(slot="footer")
    Button.mr15(type="ghost" @click="handleReset('form')") 重置
    Button(type="error" @click="handleSubmit('form')") 提交
</template>
<script>
import * as url from 'api/urlConfig';
import { mapGetters } from 'vuex';

export default {
  name: 'RegisterModal',
  props: ['show'],
  data () {
     const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
      if (this.form.passwordCheck !== '') {
        // 对第二个密码框单独验证
        this.$refs.form.validateField('passwordCheck')
      }
      callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      let errors = []
      if (value === '') {
        errors.push(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        errors.push(new Error('两次输入的密码不一致'))
      }
      callback(errors)
    }
    return {
      modal: this.show,
      inviteCode: '',
      form: {
        inviteCode: '',
        username: '',
        password: '',
        passwordCheck: '',
        vcode: '',
        tel: '',
      },
      rules: {
        inviteCode: [
          { required: true, message: '邀请码不能为空', trigger: 'blur' },
          { pattern: /^\d{5,}$/, message: '您输入的邀请码错误或者已过期', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '不符合格式要求', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '不符合格式要求', trigger: 'blur' }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        vcode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      vcode: '', // 验证码图片
      isRegister: true,
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
    isHostBihuo() {
      let { AppName = '' } = this.appConfig;
      return ~AppName.indexOf('必火');
    },
    needTel() { // 是否需要手机号
      const { register_tel = 0 } = this.appConfig;
      return +register_tel;
    }
  },
  created () {
    const KEY = 'inviteCode'
    let cacheCode = localStorage.getItem(KEY)
    if (cacheCode) {
      this.inviteCode = cacheCode
      this.form.inviteCode = cacheCode
    }
    this.setNameRule();
  },
  methods: {
    switchForm () {
      this.isRegister = !this.isRegister
      this.handleReset('form')
      this.setNameRule();
    },
    setNameRule() {
      if (this.isRegister) {
        this.rules.username.push(
          { pattern: /^[a-zA-Z0-9]{6,16}$/, message: '不符合格式要求', trigger: 'blur' }
        )
      } else {
        this.rules.username.splice(1);
      }
    },
    refreshVcode() {
      this.vcode = url.vcode + `?v=${Math.random()}`
    },
    vcodeFocus() {
      this.refreshVcode()
    },
    onKeyup (propName, event) {
      let value = typeof event == 'string' ? event : event.target.value
      this.form[propName] = value.replace(/[^a-zA-Z0-9]/g, '')
      switch (propName) {
        case 'username':
        case 'password':
        case 'passwordCheck':
          this.form[propName] = this.form[propName].substr(0, 16)
          break;
        case 'vcode':
          this.form[propName] = this.form[propName].substr(0, 4)
          break;
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        this[this.isRegister ? 'handleRegister' : 'handleLogin']()
      })
    },
    handleRegister () {
      this.$store.dispatch('register', this.form).then(data => {
        if (data.code != 0) {
          this.refreshVcode();
          return this.notice(data.msg || '注册失败', 'warning')
        }
        this.notice(data.msg || '注册成功', 'success')
        location.reload()
      })
    },
    handleLogin () {
      this.$store.dispatch('login', this.form).then(data => {
        if (data.code != 0) {
          this.refreshVcode();
          return this.notice(data.msg || '登录失败', 'warning')
        }
        this.notice(data.msg || '登录成功！', 'success')
        location.reload()
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    notice (msg, type) {
      this.$Message[type](msg)
    }
  },
  watch: {
    show(value) {
      this.modal = value
    },
    modal(value) {
      this.$emit('update:show', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-modal {
  .ivu-input-wrapper {
    width: 240px;
  }
  .form-tip {
    margin-left: 10px;
    display: inline-block;
    color: #999;
  }
}
</style>
