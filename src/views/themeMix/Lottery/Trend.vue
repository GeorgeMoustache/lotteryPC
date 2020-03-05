<template lang="pug">
.trend-wrap
  Tabs(v-model="type")
    TabPane(v-for="item in tabs" :label="item.groupName" :name="item.groupId + ''" :key="item.groupId")
  ul.navs
    li(v-for="(item, idx) in navs" :key="idx" v-show="type == 0 ? true : item.type == type" @click="navClick(item)")
      a(v-text="item.label" :class="{'active': item.alias == query.category}")
  .filter-bar
    img(class="game-icon" :src="query.icon")
    .content
      .title {{lottery.label}}
      span.mr15 开奖号码
      Checkbox(v-model="showLine") 显示折线
      Checkbox(v-model="hideOmit") 不带遗漏
      RadioGroup(v-model="query.limit" type="button" size="small")
        Radio(label="20") 最近20期
        Radio(label="30") 最近30期
        Radio(label="50") 最近50期
        Radio(label="100") 最近100期
  chart#chart(:params="query" :class="{'hide-line': !showLine, 'hide-omit': hideOmit}")
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

      //如果是 theme2 要去打這支 api 不然玩法不會出來
      if(this.appConfig.themeName == 'theme2') {
        this.$store.dispatch("sideNav");
      }
    },
    updateComponent () {
      let { category } = this.query;
      this.$options.components.Chart = () => {
        let species =  this.$root.$getSpecies(category);
        if (species === 'PK10') species = 'FT';
        return import(`components/themeMix/Trend/${species}`);
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

.filter-bar {
  display: flex;
  align-items: center;
  padding: 15px 17px;
  background: #FFF;
  border-bottom: 1px dashed #ddd;
  .game-icon {
    display: block;
    width: 82px;
    height: 82px;
    margin-right: 15px;
  }
  .content {
    .title {
      margin-bottom: 10px;
      font-size: 16px;
      color: #495060;
    }
  }
}
</style>
