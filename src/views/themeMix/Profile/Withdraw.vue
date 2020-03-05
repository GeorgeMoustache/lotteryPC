<template lang="pug">
.profile_withdraw
  withdraw(v-if="info.isBind" :info="info")
  bind-bank(v-else v-on:bindend="fetchInfo")
</template>

<script>
import {ACCOUNT} from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import Withdraw from 'components/themeMix/Profile/Withdraw';
import BindBank from 'components/themeMix/Profile/BindBank';

export default {
  name: 'ProfileWithdraw',
  components: {
    Withdraw,
    BindBank
  },
  computed: {
    ...mapGetters({
      info: ACCOUNT.ACCOUNTINFO
    })
  },
  created () {
    this.fetchInfo();
  },
	methods: {
		fetchInfo () {
			this.$store.dispatch('accountInfo')
		}
	}
}
</script>
