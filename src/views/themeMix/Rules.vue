<template lang="pug">
.rules-wrap
  .rules-side
    .rules-side-head
      h3
        span(v-text="selected.label")
        | 玩法规则
    .rules-side-body
      ul(v-if="sideNav.list")
        li(v-for="item in sideNav.list" :key="item.alias")
          router-link(:to="{path: `/rules/${item.alias}`}" :class="{'active': item.alias == category}")
            i.lottery-icon
              img(:src="item.icon")
            span.lottery-label(v-text="item.label")
  .rules-main#top
    rules-detail(:data="selected")
  BackTop
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Rules',
  data() {
    return {
      category: '',
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'requesting', 'error', 'sideNav']),
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
      this.category = this.$route.params.category;
      this.updateComponent();
      window.scrollTo(0, 0);
      //如果是 theme2 要去打這支 api 不然玩法不會出來
      if(this.appConfig.themeName == 'theme2') {
        this.$store.dispatch("sideNav");
      }
    },
    updateComponent() {
      this.$options.components.RulesDetail = () => {
        let fileName = this.$root.$getSpecies(this.category);
        if (fileName === 'FT') fileName = 'PK10';
        return import(`components/Rules/${fileName}`);
      };
    },
  },
  watch: {
    $route: 'init',
    category(value) {
      this.updateComponent();
    },
  },
};
</script>

<style lang="scss">
.rules-wrap {
  display: flex;
  padding: 20px 0;
}
.rules-side {
  width: 218px;
  margin-right: 10px;
  border: 1px solid #ececec;
  background: #fff;
  &-head {
    border-top: 3px solid $layout-primary;
    border-bottom: 1px solid #ececec;
    text-align: center;
    line-height: 53px;
    color: #333;
    font-size: 16px;
  }
  li {
    border-bottom: 1px solid #ececec;
    line-height: 47px;
  }
  a {
    display: block;
    padding-left: 50px;
    color: #666;
    &.active,
    &:hover {
      border-left: 3px solid $layout-primary;
      padding-left: 47px;
      color: $layout-primary;
    }
  }
  .lottery-icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .lottery-label {
    font-size: 14px;
  }
}

.rules-main {
  flex-grow: 1;
  width: 765px;
  border: 1px solid #ececec;
  background: #fff;
  .rules-detail {
    padding: 25px 15px;
    line-height: 22px;
  }
  .lottery-icon {
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eee;
    overflow: hidden;
    img {
      display: block;
      width: 40px;
      height: 40px;
    }
  }
  .main {
    padding: $space;
    font-size: 13px;
    line-height: 1.5;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 100%;
  }
  h2 {
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 3px solid #f8f8f8;
    font-size: 14px;
    font-weight: 700;
    line-height: 40px;
  }
  h3 {
    margin: 30px 0 10px;
    font-size: 14px;
    font-weight: 700;
  }
  h4 {
    margin: $space 0;
  }
  h5 {
    margin: $space-sm 0;
  }
  .navs {
    margin-bottom: 30px;
    li {
      margin-bottom: 10px;
    }
    a {
      font-weight: 700;
      color: $layout-primary;
    }
  }
  ol,
  ul {
    list-style: none;
    li {
      margin-bottom: $space;
    }
  }
  ol {
    list-style: none;
    counter-reset: list;
    li:before {
      counter-increment: list;
      content: counter(list) '. ';
    }
  }
  img {
    display: block;
    width: 100%;
    margin: 0 auto;
    max-width: 500px;
    height: auto;
  }
  table {
    margin-bottom: 20px;
    background: #fff;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    th {
      background: #efefef;
      font-weight: normal;
    }
    td,
    th {
      word-break: break-all;
      text-align: center;
      line-height: 2;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
  }
  .gotop {
    padding-top: $space-lg;
    float: right;
    color: #7f2d00;
  }
}
</style>
