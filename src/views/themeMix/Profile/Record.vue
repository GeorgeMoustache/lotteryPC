<template lang="pug">
.profile_record
  Tabs(v-model="tabIndex" :animated="false")
    TabPane(label="充值记录")
      record-deposit(:fetch="tabIndex == 0")
    TabPane(label="提款记录")
      record-withdraw(:fetch="tabIndex == 1")
    TabPane(label="彩票消费")
      record-deal(:fetch="tabIndex == 2" :type="1")
    TabPane(label="奖金派送")
      record-deal(:fetch="tabIndex == 3" :type="2")
    TabPane(label="交易明细")
      record-deal(:fetch="tabIndex == 4" :type="0")
    TabPane(label="额转记录" v-if="$root.thirdPartyRecord.length")
      recordTrans(:fetch="tabIndex == 5")
    TabPane(label="发包记录")
      recordRedpack(:fetch="tabIndex == 6" :type="1")
    TabPane(label="領包记录")
      recordRedpack(:fetch="tabIndex == 7" :type="2")
</template>

<script>
import RecordDeposit from 'components/themeMix/Profile/RecordDeposit';
import RecordWithdraw from 'components/themeMix/Profile/RecordWithdraw';
import RecordDeal from 'components/themeMix/Profile/RecordDeal';
import RecordTrans from 'components/themeMix/Profile/RecordTrans';
import RecordRedpack from 'components/themeMix/Profile/RecordRedpack';

export default {
  name: 'ProfileRecord',
  components: {
    RecordDeposit,
    RecordWithdraw,
    RecordDeal,
    RecordTrans,
    RecordRedpack,
  },
  data () {
    return {
      tabIndex: + this.$route.params.tabIndex || 0
    }
  },
  created() {
    if (this.$route.query.recordType == 'trans') {
      this.tabIndex = 5
      this.$router.push({path: '/profile/record'})
    }
  }
}
</script>
