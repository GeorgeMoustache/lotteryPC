<template lang="pug">
#information
  .title 个人信息
  .wrap
    img.user-avatar(src="@/assets/themeMix/member-avatar.png")
    Form.list(ref="form" :model="form" :rules="rules" label-position="right" :label-width="100")
      FormItem(label="会员账号：") 
        Input(v-model="accountInfo.username" disabled)
      FormItem(v-for="item in columnList" :key="item.code" :prop="item.code != 'realName' ? item.code : ''" :label="item.title + '：'")
        Input(v-model="form[item.code]" :placeholder="holder[item.code] && holder[item.code].holderReg" :disabled="item.code == 'realName'")
    .buttons
      Button.submit(type="primary" @click="handleSubmit('form')") 提交
      router-link.reset(:to="{path: '/profile/'}") 取消
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapActions } from 'vuex';
import { accountApi } from 'api';
import mixin from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'ProfileInformation',
  mixins: [mixin],
  inject: ['ivNotice'],
  data() {
    return {
      form: {},
      columnList: [], // 註冊顯示欄位list
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
  },
  created() {
    this.fetchSysPromotion();
    this.columnList = this.accountInfo.list;
    this.processRules();
  },
  methods: {
    ...mapActions(['fetchSysPromotion']),
    //根據api有打到的項目取得validate基本配置
    processRules() {
      this.columnList.forEach((item, index) => {
        //處理rules
        const isRequired = item.isRequired;
        this.rules[item.code][0].required = isRequired;

        //處理placeholder說明
        let reg = this.holder[item.code].holderReg;
        this.holder[item.code].holderReg = reg.replace('{isRequired}', isRequired === true ? ',必填' : '');

        //動態處理form欄位
        this.$set(this.form, item.code, item.value);
      });
    },
    //更新會員資料
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        accountApi.updateUserInfo(this.form).then(data => {
          let { code, msg } = data;
          if (code != 0) {
            this.ivNotice('error', msg);
          } else {
            this.ivNotice('success', msg);
            this.$router.push({ path: '/profile' });
          }
        });
      });
    },
  },
};
</script>