<template lang="pug">
.trend-wrap
  draw-detail(v-if="selectedLottery" :data="selectedLottery")
</template>

<script>
import { mapGetters } from 'vuex';
import DrawDetail from 'components/themeMix/Draw/Index';

export default {
  name: 'LotteryHistory',
  components: {
    DrawDetail
  },
  data () {
    return {
      query: {
        category: this.$route.params.alias,
        limit: 30
      },
      type: 0,
      selectedLottery: null
    }
  },
  computed: {
    ...mapGetters([
      'requesting',
      'error',
      'sideNav'
    ]),
    navs () {
      let { list } = this.sideNav;
      if (list == null) return [];
      return list.filter(item => !/(HKSIX|FT)$/.test(item.alias))
    },
    tabs () {
      return this.$root.CATEGORYS;
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let category = this.$route.params.alias
      this.query.category = category
      if (/(HKSIX|FT)$/.test(category)) {
        return this.selectedLottery = null;
      }
      this.selectedLottery = this.navs.find(item => item.alias == category)
    },
    navClick (item) {
      this.$router.push({path: `/lottery/history/${item.alias}`})
    }
  },
  watch: {
    '$route': 'init',
    sideNav (value) {
      // todo optimize
      if (value && value.list) {
        const category = this.$route.params.alias
        if (/(HKSIX|FT)$/.test(category)) {
          return this.navClick(this.navs[0]);
        }
        this.selectedLottery = value.list.find(item => item.alias == category)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navs {
  @include clearfix();
  li {
    float: left;
    margin: 0 5px 10px 5px;
  }
  a {
    display: block;
    padding: 0 5px;
    min-width: 70px;
    line-height: 2;
    text-align: center;
    cursor: pointer;
    color: #495060;
    &.active,
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
