<template lang="pug">
.g-doc
  layout-header.g-head
  .g-body
    router-view.layout-wrap
  layout-footer.g-foot(v-once)
  mammon-float(v-if="showMammon")
</template>

<script>
import LayoutHeader from 'components/themeMix/Layout/Header/Index';
import LayoutFooter from 'components/themeMix/Layout/Footer/Index';
import MammonFloat from 'components/MammonFloat';

export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutFooter,
    MammonFloat
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    showMammon() {
      return this.appConfig.hasRedRain && !/redRain/.test(this.$route.path);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-doc {
  background: #f8f8f8;
}
.g-body {
  position: relative;
  @include clearfix();
}
.g-foot {
  margin-top: 30px;
}
</style>




