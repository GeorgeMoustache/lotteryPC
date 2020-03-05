<template lang="pug">
.profile_info
  .profile_info-wrap
    .profile_info-head
      span 账号：
        em(v-text="info.username")
      span.wealth 余额：
        em.text-warning(v-text="info.wealth")
        | &nbsp;CNY
    .profile_info-body
      Tabs(v-model="tabIndex" :animated="false")
        TabPane(label="修改登录密码")
          login-passwd.model-box
        TabPane(label="修改取款密码")
          withdraw-passwd.model-box
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import LoginPasswd from 'components/themeMix/Profile/ResetLoginPasswd';
import WithdrawPasswd from 'components/themeMix/Profile/ResetWithdrawPasswd';

export default {
  name: 'ProfileInfo',
  components: {
    LoginPasswd,
    WithdrawPasswd
  },
  data () {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      info: ACCOUNT.ACCOUNTINFO
    })
  }
}
</script>

<style lang="scss" scoped>
.profile_info {
  em {
    font-style: normal;
  }
  &-wrap {
    background: #fff;
  }
  &-head {
    padding: 30px;
    .wealth {
      margin: 0 20px 0 40px;
    }
  }
  .model-box {
    padding: 20px 20px 200px;
  }
}
</style>
