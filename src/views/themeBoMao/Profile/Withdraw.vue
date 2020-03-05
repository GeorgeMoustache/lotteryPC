<template lang="pug">
#withdraw
  BindBank(v-if="accountInfo.isBind == 0")
  Withdraw(v-else :info="accountInfo")
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import BindBank from 'components/themeBoMao/Profile/BindBank';
import Withdraw from 'components/themeBoMao/Profile/Withdraw';

export default {
  name: 'ProfileWithdraw',
  components: {
    BindBank,
    Withdraw
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
  },
  created() {
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      this.$store.dispatch('accountInfo');
    }
  }
}
</script>