<template lang="pug">
#trend
  Tabs.layout-wrap(v-model="type")
    TabPane(v-for="item in tabs" :label="item.groupName" :name="item.groupId + ''" :key="item.groupId")
  .navs
    ul.layout-wrap
      li(v-for="(item, idx) in navs" :key="idx" v-show="type == 0 ? true : item.type == type" @click="navClick(item)")
        a(v-text="item.label" :class="{'active': item.alias == query.category}")
  .filter.layout-wrap
    Checkbox(v-model="showLine") 显示折线
    Checkbox(v-model="hideOmit") 不带遗漏
    RadioGroup(v-model="query.limit" type="button" size="small")
      Radio(label="20") 最近20期
      Radio(label="30") 最近30期
      Radio(label="50") 最近50期
      Radio(label="100") 最近100期
  chart#chart.layout-wrap(:params="query" :class="{'hide-line': !showLine, 'hide-omit': hideOmit}")
</template>

<script>
import { lotteryApi } from 'api';
import { mapGetters } from 'vuex';

export default {
  name: 'LotteryTrend',
  data () {
    return {
      query: {
        category: this.$route.params.alias,
        icon: '',
        limit: 30
      },
      type: 0,
      showLine: true,
      hideOmit: false,
    }
  },
  computed: {
    ...mapGetters([
      'sideNav',
      'appConfig',
    ]),
    navs () {
      return this.sideNav.list || []
    },
    tabs () {
      return this.$root.CATEGORYS;
    },
    lottery () {
      if (!this.navs.length) return {}
      let category = this.$route.params.alias
      if (category == null) {
        this.$router.replace({path: `/trend/${this.navs[0].alias}`})
      }
      this.query.category = category
      return this.navs.find(item => item.alias == category) || {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.query = {
        category: this.$route.params.alias,
        icon: '',
        limit: 30
      }
      this.showLine = true
      this.hideOmit = false
      this.updateComponent()

      lotteryApi.sideNav().then(data => {
        let gameList = data.list
        gameList.forEach((item)=> {
          if(item.alias == this.query.category) {
            this.query.icon = item.icon
          }
        })
      });
      
      //需要額外打這支 api 才可獲取詳細彩種內容
      this.$store.dispatch("sideNav");
    },
    updateComponent () {
      let { category } = this.query;
      this.$options.components.Chart = () => {
        let species =  this.$root.$getSpecies(category);
        if (species === 'PK10') species = 'FT';
        return import(`components/themeBoMao/Trend/${species}`);
      }
    },
    navClick (item) {
      this.$router.push({path: `/trend/${item.alias}`})
    }
  },
  watch: {
    '$route': 'init'
  }
}
</script>