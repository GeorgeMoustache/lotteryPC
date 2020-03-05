<template lang="pug">
div
  //- 模板 1~4 使用
  template(v-if="appConfig.themeName != 'theme5' && appConfig.themeName != 'theme6'")
    Form(ref="form" :model="form" :rules="rules" label-position="right" :label-width="80")
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
        FormItem(:key="item.code" :prop="item.code" :label="`${item.title}:`")
          Input(v-model="form[item.code]" :ref="item.code" :disabled="item.code == 'inviteCode'" :placeholder="item.code == 'realName' ? '请与绑定出款银行卡一致' : ''")
          p.form-tip(v-if="holder[item.code]") {{holder[item.code].holderReg}}
      //- 再次標配
      FormItem.vcode(label="验证码:" prop="vcode" key=0)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
      FormItem
        .buttons 
          Button.reset(type="ghost" @click="handleReset('form')") 重置
          Button.submit(type="error" @click="handleSubmit('form')") 提交
          Button.next(type="primary" @click="nextReg()") 提交并建下一笔
  //- 模板 5~6 使用
  template(v-else)
    Form(ref="form" :model="form" :rules="rules")
      //- 標配
      FormItem(prop="userName")
        Input(v-model="form.userName" @on-keyup="onKeyup('userName', $event)" :placeholder="holder.userName.holderReg")
      FormItem(prop="password")
        Input(v-model="form.password" type="password" @on-keyup="onKeyup('password', $event)" :placeholder="holder.password.holderReg")
      FormItem(prop="passwordCheck")
        Input(v-model="form.passwordCheck" type="password" @on-keyup="onKeyup('passwordCheck', $event)" :placeholder="holder.passwordCheck.holderReg")
      //- 動態
      template(v-for="(item, index) in columnList")
        FormItem(:key="item.code" :prop="item.code")
          Input(v-model="form[item.code]" :ref="item.code" :placeholder="holder[item.code] && holder[item.code].holderReg" :disabled="item.code == 'inviteCode'")
      //- 再次標配
      FormItem.vcode(prop="vcode" key=0)
        Input(v-model="form.vcode" @on-focus="vcodeFocus" @on-keyup="onKeyup('vcode', $event)" @keyup.enter.native="handleSubmit('form')" :placeholder="holder.vcode.holderReg")
          img(slot="append" v-show="vcode" @click="refreshVcode" :src="vcode")
      FormItem
        .buttons 
          Button.reset(type="ghost" @click="handleReset('form')") 重置
          Button.submit(type="error" @click="handleSubmit('form',)") 提交
          Button.next(type="primary" @click="nextReg()") 提交并建下一笔
</template>

<script>
import { accountApi } from 'api';
import { vcode as vcodeApi } from 'api/urlConfig';
import mixin from '@/utils/Register_Login/regRules_mixin';
import { mapGetters } from 'vuex';

export default {
  name: 'Register',
  mixins: [mixin],
  props: ['inviteCode'],
  inject: ['ivNotice'],
  data() {
    return {
      form: {
        inviteCode: this.inviteCode, //代入指定代理邀請碼
        userName: '', //使用者名稱
        password: '', //密碼
        passwordCheck: '', //確認密碼(在送出前會被過濾掉)
        vcode: '', //輸入驗證碼
        agent: true //註冊代理帳號用
      },
      vcode: '', // 验证码图片
      columnList: [], // 註冊顯示欄位list
      onceSubmit: false //是否為直接提交
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(['appConfig']),
  },
  methods: {
    init() {
      accountApi.getRegColumnList().then(data => {
        //先判斷 api 資料中是否包含邀請碼欄位，如沒有則手動新增
        let hasInviteCode = false;
        data.list.forEach((item) => {
          if (item.code == 'inviteCode') {
            hasInviteCode = true;
          }
        })
        
        this.columnList = data.list;
        if (!hasInviteCode) {
          this.columnList.unshift({
            code: "inviteCode",
            title: "邀請碼",
            isRequired: true,
            isUnique: false
          })
        }
        
        this.$refs['form'].resetFields();

        //動態處理欄位
        this.processRules();
      });
    },
    //根據api有打到的項目取得validate基本配置
    processRules() {
      this.columnList.forEach((item, index) => {
        //處理rules
        const isRequired = item.isRequired;
        this.rules[item.code][0].required = isRequired;

        //處理placeholder說明
        let reg = this.holder[item.code].holderReg;
        this.holder[item.code].holderReg = reg.replace('{isRequired}', isRequired === true ? ',必填' : '');

        //動態處理form欄位，邀請碼預設一定要傳，不做動態處理
        if (item.code !== 'inviteCode') {
          this.$set(this.form, item.code, '');
        } else {
          this.$set(this.form, 'inviteCode', this.inviteCode)
        }
      });

      //密碼特殊處理
      if (this.appConfig.themeName != 'theme5' && this.appConfig.themeName != 'theme6') {
        this.holder.userName.holderReg = '须为6-16个字母或数字';
        this.holder.password.holderReg = '须为6-16个同时包含字母或数字的组合';
      }
    },
    //重新獲取驗證碼
    refreshVcode() {
      this.vcode = vcodeApi + `?v=${Math.random()}`;
    },
    //驗證碼聚焦
    vcodeFocus() {
      this.refreshVcode();
    },
    //過濾特殊字元
    onKeyup(propName, event) {
      let value = typeof event == 'string' ? event : event.target.value;
      this.form[propName] = value.replace(/[^a-zA-Z0-9]/g, '');
    },
    //提交送出
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.onceSubmit = true;
        accountApi.register(this.form).then(this.success);
      });
    },
    //註冊下一筆
    nextReg() {
      this.$refs['form'].validate(valid => {
        if (!valid) return;
        this.onceSubmit = false;
        accountApi.register(this.form).then(this.success);
      });
    },
    //送出完畢
    success(data) {
      if (data.code == 2) {
        //code:2, 驗證unique失敗
        let { columnCode, msg } = data.chkUnique;
        this.ivNotice('warning', msg);
        this.refreshVcode();
        return;
      } else if (data.code != 0) {
        this.refreshVcode();
        this.ivNotice('warning', data.msg);
        return;
      }
      this.ivNotice('success', data.msg);
      this.$refs['form'].resetFields();
      this.form.inviteCode = this.inviteCode;
      if (this.onceSubmit) this.$bus.$emit('closeRegPanel');
    },
    //重置表單
    handleReset(name) {
      this.$refs[name].resetFields();
      this.form.inviteCode = this.inviteCode;
    }
  },
  watch: {
    'inviteCode': 'init'
  },
}
</script>