<template lang="pug">
#bank-card
  .page-tabs
    router-link(:to="{path: '/profile/information'}") 个人中心
    router-link(:to="{path: '/profile/password'}") 安全中心
    router-link(:to="{path: '/profile/bankCard'}") 银行卡管理
  #never-bind(v-if="accountInfo.isBind == 0")
    p 您还没有绑定银行卡
    router-link(:to="{path: '/profile/withdraw'}") 立即绑定
  .card-wrap(v-else)
    .card
      p 银行名称：{{bankInfo.bankName}}
      p 银行卡号：{{bankInfo.cardNo}}
      p 开户人姓名：{{bankInfo.userName}}
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

export default {
  name: 'BankCard',
  inject: ['ivNotice'],
  data() {
    return {
      bankInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
  },
  created() {
    accountApi.withdraw().then(data => {
      let { code, msg, info } = data;
      if (code != 0) return this.ivNotice('error', msg);
      this.bankInfo = info;
        
    });
  }
}
</script>