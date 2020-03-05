<template lang="pug">
.register-login
  .layout-wrap
    .header
      .wrap
        a.logo(:title="appConfig.AppName" v-text="appConfig.AppName" :style="{ backgroundImage: `url(${appConfig.logo})` }")
        .navBar
          router-link(:to="{path: '/'}") 回首页
          a.support(v-if="appConfig.serviceUrl != ''" @click="service()" ) 客服
    .container
      //- logo
      img.logo(:src="appConfig.AppIcon")
      //- 標題
      h3.title 用户
        span(v-text="isRegister? '注册':'登录'")
      //- 注册
      .register(v-if="isRegister")
        .tip 已有账号？
          a(@click="switchForm()") 立即登录
        Form(ref="form" :model="form" :rules="rules" label-position="right")
          //- 標配
          FormItem(prop="userName")
            Input(v-model="form.userName" 
                  :placeholder="holder.userName.holderReg" 
                  @on-keyup="onKeyup('userName', $event)")
          //- password
          FormItem(prop="password")
            Input(v-model="form.password" type="password" 
                  :placeholder="holder.password.holderReg" 
                  :maxlength="holder.password.maxLength" 
                  @on-keyup="onKeyup('password', $event)")
          //- checkPassword
          FormItem(prop="passwordCheck")
            Input(v-model="form.passwordCheck" type="password" 
                  :placeholder="holder.passwordCheck.holderReg" 
                  :maxlength="holder.passwordCheck.maxLength" 
                  @on-keyup="onKeyup('passwordCheck', $event)")
          //- 動態生成
          template(v-for="(item, index) in columnList")
            FormItem(v-if="item.code == 'inviteCode' ? isNeedInvite : true" :key="item.code" :prop="item.code")
              Input(v-model="form[item.code]" :placeholder="holder[item.code] && holder[item.code].holderReg" :disabled="item.code=='inviteCode' && !!$route.params.inviteCode")
          //- vcode
          FormItem.vcode(prop="vcode" key=0)
            Input(v-model="form.vcode" 
                  :placeholder="holder.vcode.holderReg" 
                  @on-focus="vcodeFocus" 
                  @on-keyup="onKeyup('vcode', $event)" 
                  @keyup.enter.native="handleSubmit('form')")
              img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
          .lawMsg 提交注册信息即为同意：
            a(@click="openAgree()") 《法律声明》
          .buttons
            Button.submit(@click="handleSubmit('form')") 提交
            Button.reset(type="ghost" @click="handleReset('form')") 重置
      //- 登錄
      .login(v-else)
        Form(ref="form" :model="form" :rules="rules" label-position="right")
          //-userName 標配
          FormItem.id(prop="userName")
            Input(v-model="form.userName" 
                  :placeholder="holder.userName.holderLog" 
                  @on-keyup="onKeyup('userName', $event)")
          //- password
          FormItem.password(prop="password")
            Input(v-model="form.password" type="password" 
                  :placeholder="holder.password.holderLog" 
                  :maxlength="holder.password.maxLength" 
                  @on-keyup="onKeyup('password', $event)")
          //- vcode
          FormItem.verify(prop="vcode" key=0)
            Input(v-model="form.vcode" 
                  :placeholder="holder.vcode.holderLog" 
                  @on-focus="vcodeFocus" 
                  @on-keyup="onKeyup('vcode', $event)" 
                  @keyup.enter.native="handleSubmit('form')")
              img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
          .buttons
            Button.submit(@click="handleSubmit('form')") 立即登录
        .tip 没有帐号？
          a(@click="switchForm()") 立即注册
  LayoutFooter
  transition(name="fade")
    RegisterAgreement(v-if="agreementEnabled")
</template>

<script>
import LayoutFooter from '@/components/themeBoMao/Layout/Footer';
import RegisterAgreement from '@/components/themeBoMao/RegisterAgreement';
import mixin1 from '@/utils/Register_Login/Register_Login';
import mixin2 from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'Register_Login',
  mixins: [mixin1, mixin2],
  inject: ['ivNotice'],
  components:{
    LayoutFooter,
    RegisterAgreement
  },
  methods: {
    //客服連結
    service() {
      window.open(this.appConfig.serviceUrl, '客服系统', "width=740, height=660");
    }
  }
}
</script>