<template lang="pug">
.profile-outer.container
  .layout-wrap
    ul.side-nav
      li.record(v-if="$root.thirdPartyRecord.length > 0")
        a(:class="{active: tabIndex == 0}") 投注记录
        .sub-menu
          .title 投注记录
          router-link(:to="{path: '/profile/BetRecord/-1'}") 彩票
          router-link(v-for="item in $root.thirdPartyRecord" :key="item.id" :to="{path: '/profile/BetRecord/' + item.id}") {{item.name}}
      li.financial
        a(:class="{active: tabIndex == 1}") 资金管理
        .sub-menu
          .title 资金管理
          router-link(:to="{ path: '/profile/deposit'}") 充值
          router-link(:to="{ path: '/profile/withdraw'}") 提款
          router-link(:to="{ path: '/profile/moneyTrans'}" v-if="transEnabled") 额度转换
          router-link(:to="{path: '/profile/record/0'}") 充值记录
          router-link(:to="{path: '/profile/record/1'}") 提款记录
          router-link(:to="{path: '/profile/record/2'}") 彩票消费
          router-link(:to="{path: '/profile/record/3'}") 奖金派送
          router-link(:to="{path: '/profile/record/4'}") 交易明细
          router-link(:to="{path: '/profile/record/5'}" v-if="$root.thirdPartyRecord.length") 额转记录
      li.account
        a(:class="{active: tabIndex == 2}") 帐户管理
        .sub-menu
          .title 帐户管理
          router-link(:to="{path: '/profile/information'}") 个人资料
          router-link(:to="{path: '/profile/password'}") 密码管理
          router-link(:to="{path: '/profile/bankCard'}") 银行卡管理
      li.team
        a(:class="{active: tabIndex == 3}") 代理中心
        .sub-menu
          .title 代理中心
          router-link(:to="{path: '/profile/agent/intro'}") 代理说明
          router-link(:to="{path: '/profile/agent/agencyReport'}") 代理报表
          router-link(:to="{path: '/profile/agent/lowerReport'}") 下级报表
          router-link(:to="{path: '/profile/agent/manageInvite'}") 下级开户
          router-link(:to="{path: '/profile/agent/member'}") 会员管理
          router-link(:to="{path: '/profile/agent/recordBet'}") 投注明细
          router-link(:to="{path: '/profile/agent/recordBill'}") 交易明细
      li.profit(v-if="$root.thirdPartyRecord.length > 0")
        a(:class="{active: tabIndex == 4}") 今日盈亏
        .sub-menu
          .title 今日盈亏
          router-link(:to="{path: '/profile/todayProfit'}") 今日盈亏
    .profile-inner
      #breadcrumb {{breadCrumb[tabIndex]}} &gt; {{currentPath}}
      router-view
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  name: 'ProfileLayout',
  data() {
    return {
      breadCrumb: ['投注记录', '资金管理', '帐户管理', '代理中心', '今日盈亏'],
      currentPath: this.$route.meta.title
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
    tabIndex() {
      let route = this.$route.path.split('/');
      if (route.includes('BetRecord')) {
        return 0;
      } else if (route.includes('deposit') || route.includes('withdraw') || route.includes('moneyTrans') || route.includes('record')) {
        return 1;
      } else if (route.includes('information') || route.includes('password') || route.includes('bankCard')) {
        return 2;
      } else if (route.includes('agent')) {
        return 3;
      } else if (route.includes('todayProfit')) {
        return 4;
      }
    },
    transEnabled() {
      if (this.$root.thirdPartyTab.length) {
        if (this.accountInfo.type == 3) {
          return false;
        } else {
          return true;
        }  
      } else {
        return false;
      }
    }
  },
  watch: {
    '$route.meta.title': {
      handler(to, from) {
        this.currentPath = this.$route.meta.title
      },
      immediate: true
    }
  }
}
</script>