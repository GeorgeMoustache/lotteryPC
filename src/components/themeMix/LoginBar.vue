<template lang="pug">
.login-bar
  login-form(v-if="!info.username")
  .user-info(v-else)
    span.user-name(v-text="`账号：${info.username}`")
    span.user-wealth(v-text="`余额：￥${info.wealth}`")
    router-link.btn.btn-primary(:to="{path: '/profile/deposit'}" target="_blank") 充值
    router-link.btn(:to="{path: '/profile/withdraw'}" target="_blank") 提现
    router-link(:to="{name: 'profileIndex'}" target="_blank")
      img(src='@/assets/themeMix/icon/profile.png')
      | 会员中心
    router-link(:to="{path: '/profile/record'}" target="_blank")
      img(src='@/assets/themeMix/icon/history.png')
      | 下注记录
    a(:href="appConfig.serviceUrl" target="_blank")
      img(src='@/assets/themeMix/icon/service.png')
      | 在线客服
    router-link(:to="{path: '/profile/message'}" target="_blank")
      img(src='@/assets/themeMix/icon/notice.png')
      | 消息中心
</template>
<script>
import LoginForm from 'components/themeMix/LoginForm';
import {ACCOUNT} from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  name: 'LoginBar',
  components: {
    LoginForm
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      info: ACCOUNT.ACCOUNTINFO,
      betState: ACCOUNT.BETSTATE
    })
  },
  methods: {
    refreshInfo () {
      this.$store.dispatch('accountInfo')
    }
  },
  watch: {
    // 投注状态改变，更新用户财富数据
    betState: 'refreshInfo'
  }
}
</script>

<style lang="scss" scoped>
.login-bar {
  overflow: hidden;
  height: 65px;
  padding: 12px 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #e1e1e1;
  color: #707070;
  font-size: 14px;
}
.user-info {
  line-height: 40px;
  .user-name,
  .user-wealth {
    margin-right: 26px;
  }
  img {
    vertical-align: middle;
    margin-right: 4px;
    color: #888;
    height: 20px;
  }
  a {
    margin-left: 20px;
    color: #707070;
    text-decoration: none;
    &:hover {
      color: #be0a20;
    }
  }
  .btn {
    display: inline-block;
    margin-left: 16px;
    width: 57px;
    height: 24px;
    line-height: 24px;
    background: #707070;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    text-align: center;
    &.btn-primary,
    &:hover {
      background: #be0a20;
      color: #fff;
    }
  }
}

</style>
