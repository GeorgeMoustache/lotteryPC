<template lang="pug">
#password
  .page-tabs
    router-link(:to="{path: '/profile/information'}") 个人中心
    router-link(:to="{path: '/profile/password'}") 安全中心
    router-link(:to="{path: '/profile/bankCard'}") 银行卡管理
  //- 設定密碼種類切換
  .tabs
    a(v-for="(item, index) in tabList" :key="index" v-text="item" :class="{'active': tabIndex == index}" @click="changePassType(index)")
  //- 登錄密碼
  LoginPassword(v-if="tabIndex == 0")
  //- 提現密碼
  WithdrawPassword(v-else)
</template>

<script>
import LoginPassword from 'components/themeBoMao/Profile/LoginPassword';
import WithdrawPassword from 'components/themeBoMao/Profile/WithdrawPassword';

export default {
  name: 'ProfilePassword',
  inject: ['ivNotice', 'reload'],
  components: {
    LoginPassword,
    WithdrawPassword
  },
  data() {
    return {
      tabList: ['修改登录密码', '设置提現密码'],
      tabIndex: 0, //設置密碼類型 [0:登錄密碼, 1:提現密碼]
    }
  },
  methods: {
    //變更密碼類型
    changePassType(index) {
      this.tabIndex = index;
    },
  }
}
</script>