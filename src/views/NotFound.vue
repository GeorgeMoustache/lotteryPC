<template lang="pug">
.not-found
  img(v-if="appConfig.notFound", :src="appConfig.notFound" width="404" alt="抱歉，无法访问此页面！")
  h1 抱歉，无法访问此页面！
  p 您可以尝试以下操作：<br>
    | 1.页面可能不存在，
    router-link(:to="{path: '/'}" replace) 返回首页
    <br >
    | 2.页面可能已失效，
    a(@click="back") 返回上一页
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NotFound',
  computed: {
    ...mapGetters(['appConfig'])
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.not-found {
  padding-top: 150px;
  text-align: center;
  h1 {
    color: #59adf2;
    font-weight: 100;
    margin: 40px 0;
    margin-bottom: 20px;
  }
  p {
    line-height: 1.8;
    color: #666;
    text-align: left;
    display: table;
    margin: 0 auto;
  }
}
</style>
