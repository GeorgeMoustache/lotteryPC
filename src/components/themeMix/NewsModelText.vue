<template lang="pug">
ul.news-model
  template(v-if="list.length")
    li(v-for="(item, index) in list" :key="index")
      template(v-if="index % 5 == 0")
        router-link.light(:to="{path: `/news/${item.id}`}" v-text="item.title" :title="item.title")
        router-link(:to="{path: `/news/${item.id}`}" :title="item.title")
          span.text-gray 新闻
          span.mr10.ml10.text-gray |
          span(v-text="item.title")
      template(v-else)
        router-link(:to="{path: `/news/${item.id}`}" :title="item.title")
          span.text-gray 新闻
          span.mr10.ml10.text-gray |
          span(v-text="item.title")
  template(v-else)
    li.null 加载中...
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'NewsModelText',
  data () {
    return {
      list: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      newsApi.list({
        params: {
          current: 1,
          size: 10
        }
      }).then(data => {
        if (data.code != 0) return this.notice(data.msg, 'error')
        this.list = data.list.splice(0, 10)
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    }
  }
}
</script>

<style lang="scss" scoped>

.news-model {
  width: 460px;
  padding: 0 30px;
  font-size: 14px;
  overflow: hidden;
}

a {
  display: block;
  line-height: 30px;
  color: #666;
  @include ellipsis;
  &:hover {
    color: $layout-primary;
  }
}
a.light {
  margin-top: 10px;
  font-size: 18px;
  line-height: 50px;
  color: $layout-primary;
}
</style>
