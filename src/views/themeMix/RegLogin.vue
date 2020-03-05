<template lang="pug">
.regLogin-view
  //- 注册
  template(v-if="isRegister")
    .header
      h3.fn-left 用户注册
      .fn-right
        span.text-gray 已有账号？
        a.text-primary(@click="switchForm") 立即登录
    Form(ref="form" :model="form" :rules="rules" label-position="right"  :label-width="80")
      //- 標配
      FormItem(label="会员帐号:" prop="userName")
        Input(v-model="form.userName" @on-keyup="onKeyup('userName', $event)")
        p.form-tip(v-text="holder.userName.holderReg")
      FormItem(label="登录密码:" prop="password")
        Input(v-model="form.password" type="password" @on-keyup="onKeyup('password', $event)" placeholder="请输入注册密码而非出款密码")
        p.form-tip(v-text="holder.password.holderReg")
      FormItem(label="确认密码:" prop="passwordCheck")
        Input(v-model="form.passwordCheck" type="password" @on-keyup="onKeyup('passwordCheck', $event)")
      //- 動態
      template(v-for="(item, index) in columnList")
        FormItem(v-if="item.code == 'inviteCode' ? isNeedInvite : true" :key="item.code" :prop="item.code" :label="`${item.title}:`")
          Input(v-model="form[item.code]" :ref="item.code" :disabled="item.code=='inviteCode' && !!$route.params.inviteCode" :placeholder="item.code == 'realName' ? '请与绑定出款银行卡一致' : ''")
          p.form-tip(v-if="holder[item.code]") {{holder[item.code].holderReg}}
      //- 再次標配
      FormItem.vcode(label="验证码:" prop="vcode" key=0)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
      .notice *为必填栏位
      FormItem
        span.text-gray 提交注册信息即为同意：
        a(target="_self" onclick="window.open('/registerAgreement','register-agreement','width=1000,height=653').focus()") 《法律声明》
      FormItem
        Button.mr15(type="ghost" @click="handleReset('form')") 重置
        Button(type="error" @click="handleSubmit('form')") 提交
  //- 登录
  template(v-else)
    .header.fn-clear
      h3.fn-left 用户登录
      .fn-right(v-if="!isHostBihuo")
        span.text-gray 没有账号？
        a.text-primary(@click="switchForm") 立即注册
    Form(ref="form" :model="form" :rules="rules" label-position="right"  :label-width="80")
      FormItem(label="会员帐号:" prop="userName")
        Input(v-model="form.userName" @on-keyup="onKeyup('userName', $event)")
      FormItem(label="登录密码:" prop="password")
        Input(v-model="form.password" type="password" @on-keyup="onKeyup('password', $event)" placeholder="请输入注册密码而非出款密码")
      FormItem.vcode(label="验证码:" prop="vcode" key=1)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
      FormItem
        Button.mr15(type="ghost" @click="handleReset('form')") 重置
        Button(type="error" @click="handleSubmit('form')") 提交
</template>

<script>
import mixin1 from '@/utils/Register_Login/Register_Login';
import mixin2 from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'RegLogin',
  mixins: [mixin1, mixin2],
  inject: ['ivNotice'],
  methods: {
    //---overWrite---//
    processRules() {
      //根據api有打到的項目取得validate基本配置
      this.columnList.forEach((item, index) => {
        //處理rules
        const isRequired = item.isRequired;
        this.rules[item.code][0].required = isRequired;

        //處理placeholder說明
        let reg = this.holder[item.code].holderReg;
        let arrReg = reg.split('，');
        if (item.code === 'realName' || item.code === 'nickName') {
          this.holder[item.code].holderReg = arrReg[arrReg.length - 1];
        } else {
          this.holder[item.code].holderReg = '';
        }

        //動態處理form欄位
        this.$set(this.form, item.code, '');
      });

      //密碼特殊處理
      this.holder.userName.holderReg = '须为6-16个字母或数字';
      this.holder.password.holderReg = '须为6-16个同时包含字母或数字的组合';
    },
  },
};
</script>

<style lang="scss" scoped>
.regLogin-view {
  margin-top: 20px;
  margin-bottom: 20px;
  background: #fff;
  border: 1px solid #ddd;
  .header {
    margin: 0 20px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
    h3 {
      font-size: 18px;
    }
  }
  .ivu-form {
    margin: 0 auto;
    padding: 50px 0;
    width: 600px;
  }
  .ivu-input-wrapper {
    width: 240px;
  }
  .form-tip {
    margin-left: 10px;
    display: inline-block;
    color: #999;
  }
}

.notice {
  margin-bottom: 10px;
  padding-top: 10px;
  color: #ed3f14;
  text-indent: 160px;
}
</style>
