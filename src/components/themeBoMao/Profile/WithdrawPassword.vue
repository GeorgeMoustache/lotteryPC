<template lang="pug">
.withdraw
  #never-bind(v-if="accountInfo.isBind == 0")
    p 您还没有绑定银行卡
    router-link(:to="{path: '/profile/withdraw'}") 立即绑定
  Form(v-else ref="form" :model="form" :rules="rules" :label-width="120")
    .title 修改提現密码
      span 提現密码为平台的提款密码，不是银行卡密码
    template(v-for="item in tpl")
      FormItem(:label="`${item.label}：`" :prop="item.prop")
        template(v-for="n in 6")
          Select(v-model="tempForm[item.prop][n-1]" @on-change="passwordChange(item.prop)" placeholder="-")
            Option(v-for="i in 10" :value="i-1" :key="n-1 + i")
    FormItem
      Button(@click="handleSubmit('form')" :disabled="disabled" :loading="loading") 确定
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

export default {
  name: 'WithdrawPassword',
  inject: ['ivNotice', 'reload'],
  data() {
    //驗證相關參數
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
      tpl:  [
        { label: '旧提款密码', prop: 'old' },
        { label: '新提款密码', prop: 'new' },
        { label: '确认新提款密码', prop: 'passwdCheck' }
      ],
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
      loading: false, //loading 狀態
      disabled: false, //鎖定按鈕
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
  },
  methods: {
    //下拉選擇驗證 (提款用)
    passwordChange (prop) {
      let value = this.tempForm[prop].reduce((pre, n)=> {
        if (n != null) {
          return pre + n
        }
      }, '')
      if (value.length != 6) value = ''
      this.form[prop] = value
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

        accountApi.resetWithdrawPasswd(form).then(data => {
          this.loading = false;
          let { code, msg } = data;
          if (code != 0) {
            this.ivNotice('warning', msg);
          } else {
            this.ivNotice('success', msg);
            this.reload();
          }
        })
      })
    }
  }
}
</script>