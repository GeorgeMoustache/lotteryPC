<template lang="pug">
.profile-wrap
  .profile-side
    .side-nav
      router-link(:to="{path: '/profile'}" active-class="")
        icon(type="ios-home")
        | 会员中心
      router-link(:to="{path: '/profile/todayProfit'}")
        icon(type="pie-graph")
        | 今日盈亏
      router-link(:to="{path: '/profile/deposit'}")
        icon(type="social-yen")
        | 充值存款
      router-link(v-if="transButtonEnabled" :to="{path: '/profile/moneyTrans'}")
        icon(type="arrow-swap")
        | 额度转换
      router-link(:to="{path: '/profile/withdraw'}")
        icon(type="social-yen-outline")
        | 提现取款
      router-link(:to="{path: '/profile/info'}")
        icon(type="card")
        | 账户信息
      router-link(:to="{path: '/profile/record'}")
        icon(type="ios-list")
        | 交易记录
      router-link(:to="{path: '/profile/BetRecord'}")
        icon(type="ios-list-outline")
        | 注单记录
      template(v-if="proxyEnabled")
        a
          icon(type="ios-people")
          | 代理中心
        ul.sub-menu
          li
            router-link(:to="{path: '/profile/agent/intro'}") 代理说明
            router-link(:to="{path: '/profile/agent/agencyReport'}") 代理报表
            router-link(:to="{path: '/profile/agent/lowerReport'}") 下级报表
            router-link(:to="{path: '/profile/agent/manageInvite'}") 下级开户
            router-link(:to="{path: '/profile/agent/member'}") 会员管理
            router-link(:to="{path: '/profile/agent/recordBet'}") 投注明细
            router-link(:to="{path: '/profile/agent/recordBill'}") 交易明细
  .profile-main
    router-view
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

export default {
  name: 'Profile',
  data() {
    return {
      transButtonEnabled: true,
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
    //如果是代理權限帳號就開啟代理選單
    proxyEnabled() {
      let { username, userType } = this.accountInfo;
      if (username && username.substring(0, 5) != 'Guest' && (userType && ~userType.indexOf('代理'))) return true;
    },
  },
  created() {
    let { type } = this.accountInfo;
    //第三方遊戲都關閉或是測試帳號的話就隱藏額轉按鈕
    if (this.$root.thirdPartyTab.length == 0 || type == 3) {
      this.transButtonEnabled = false;
    }
  },
};
</script>

<style lang="scss" scoped>
$side-width: 197px;

.profile {
  &-wrap {
    display: flex;
  }
  &-side {
    flex-shrink: 0;
    width: $side-width;
    background: #fff;
  }
  &-main {
    width: 100%;
    padding: 20px 0 0 20px;
  }
}

.side-nav {
  a {
    display: flex;
    align-items: center;
    padding: 15px;
    border-right: 3px solid transparent;
    font-size: 14px;
    color: #707070;
    font-weight: bold;
    &:hover,
    &.router-link-active,
    &.router-link-exact-active {
      border-right-color: #f13131;
      color: #f13131;
    }
  }
  .ivu-icon {
    display: block;
    width: 25px;
    margin-right: 6px;
    font-size: 25px;
  }
  .sub-menu a {
    padding: 10px 20px 10px 47px;
    border: none;
    font-size: 12px;
    color: #707070;
    font-weight: normal;
    &:hover,
    &.router-link-active {
      color: #f13131;
    }
  }
}

.logout-tip {
  padding: 20px;
  font-size: 18px;
  color: #c00;
}
</style>
