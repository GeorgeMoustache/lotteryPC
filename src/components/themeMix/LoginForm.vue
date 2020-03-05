<template lang="pug">
Form(ref="form" :model="form" :rules="rules" inline)
  FormItem(prop="userName")
    Input(type="text" 
          v-model="form.userName" 
          @on-keyup="onKeyup('userName', $event)" 
          placeholder="请输入会员帐号")
      Icon(type="ios-person-outline" slot="prepend")
  FormItem(prop="password")
    Input(type="password" 
          v-model="form.password" 
          @on-keyup="onKeyup('password', $event)" 
          placeholder="请输入登录密码"
          :maxlength="holder.password.maxLength" )
      Icon(type="ios-locked-outline" slot="prepend")
  FormItem.vcode(prop="vcode")
    Input.form-width-sm(type="text" placeholder="请输入验证码" v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
      img(
        slot="append"
        v-show="vcode"
        @click="refreshVcode"
        :src="vcode")
  FormItem
    Button.mr15(type="error" @click="handleSubmit('form')") 登录
    Button(type="error" @click="register" ) 注册
  //- register-modal(:show.sync="modal")  ＝>  405註解，貌似沒用到，406之後若還是不需要就連同component一併刪除
</template>

<script>
import mixin1 from '@/utils/Register_Login/Register_Login';
import mixin2 from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'LoginForm',
  mixins: [mixin1, mixin2],
  inject: ['ivNotice'],
  methods: {
    register() {
      this.$router.push({path: '/register'})
    }
  }
}
</script>
