<template lang="pug">
#rules
  Tabs.layout-wrap(v-model="type")
    TabPane(v-for="item in tabs" :label="item.groupName" :name="item.groupId + ''" :key="item.groupId")
  .navs
    ul.layout-wrap
      li(v-for="(item, idx) in navs" :key="idx" v-show="type == 0 ? true : item.type == type" @click="navClick(item)")
        a(v-text="item.label" :class="{'active': item.alias == category}")
  .layout-wrap
    RulesDetail(:data="selected")
</template>

<script>
import { mapGetters } from 'vuex';
import { lotteryApi } from 'api';

export default {
  name: 'Rules',
  data() {
    return {
      category: this.$route.params.category,
      type: 0,
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'sideNav']),
    navs () {
      return this.sideNav.list || []
    },
    tabs () {
      return this.$root.CATEGORYS;
    },
    selected() {
      let { sideNav, category } = this;
      if (sideNav == null || sideNav.list == null) return {};
      if (category == null) {
        this.category = sideNav.list[0].alias;
        this.$router.replace({ params: { category: this.category } });
        return sideNav.list[0];
      }
      return sideNav.list.find(item => item.alias == category) || {};
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.category = this.$route.params.category
      this.updateComponent()

      //需要額外打這支 api 才可獲取詳細彩種內容
      this.$store.dispatch("sideNav");
    },
    updateComponent() {
      this.$options.components.RulesDetail = () => {
        let fileName = this.$root.$getSpecies(this.category);
        if (fileName === 'FT') fileName = 'PK10';
        return import(`components/Rules/${fileName}`);
      };
    },
    navClick (item) {
      this.category = item.alias;
      this.$router.push({path: `/rules/${item.alias}`});
      this.updateComponent();
    }
  },
  watch: {
    'category': 'updateComponent'
  }
};
</script>