<template lang="pug">
.news-view
  .news-wrap
    .head
      h3 资讯列表
    .body
      ul.news-list(v-if="list.length")
        li.news-item(v-for="(item, index) in list" :key="index")
          router-link(:to="{path: `/news/${item.id}`}" :title="item.title" :class="{'z-new': index < 3}")
            Icon(type="arrow-right-b")
            span.news-title(v-text="item.title")
            span.news-date(v-text="item.date")
      p.null(v-else) 暂无内容
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'News',
  data () {
    return {
      query: {
        current: 1,
        size: 20
      },
      list: [],
      total: 0
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.fetchData()
    },
    fetchData () {
      newsApi.list({params: this.query}).then(data => {
        if (data.code != 0) return this.notice(data.msg, 'error')
        this.list = data.list
        this.total = data.total
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>

.news-view {
  padding: 20px 0;
}
.news-wrap {
  margin-bottom: 10px;
  border: 1px solid #ececec;
  background: #fff;
  .head {
    padding-left: 20px;
    line-height: 44px;
    border-bottom: 1px solid #ececec;
    h3 {
      font-size: 18px;
      color: #ff0022;
    }
  }
  .news-item {
    padding: 0 20px;
    line-height: 50px;
    font-size: 14px;
    border-top: 1px solid #ececec;
    @include clearfix();
    a {
      color: #666;
      &.z-new {
        color: #ff0022;
      }
    }
    a:hover {
      color: $layout-primary;
    }
  }
  .news-title {
    margin-left: 5px;
  }
  .news-date {
    float: right;
    color: #ccc;
  }
  .null {
    padding: 20px;
  }
}
</style>
