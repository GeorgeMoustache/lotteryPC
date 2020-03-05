<template lang="pug">
.news-view
  .news-detail
    .head
      h2.news-title(v-text="info.title")
      span.news-from 来源：转载
    .body
      .news-content(v-html="info.content")
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'NewsDetail',
  data () {
    return {
      query: {
        id: this.$route.params.id
      },
      info: {}
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
      let path = this.$route.path
      newsApi[~path.indexOf('notice') ? 'noticeDetail' : 'detail']({params: this.query}).then(data => {
        const { code, msg, info } = data;
        if (code != 0) return this.notice(msg, 'error')
        info.content = info.content.replace(/\r\n/g, '<br>')
        this.info = info
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    }
  }
}
</script>

<style lang="scss" scoped>

.news-view {
  padding: 20px 0;
}
.news-detail {
  border: 1px solid #ececec;
  background: #fff;
  .head {
    padding: 25px 20px 5px;
    border-bottom: 1px dashed #d5d5d5;
    h2.news-title {
      font-size: 26px;
      text-align: center;
      line-height: 38px;
    }
  }
  .body {
    padding: 20px;
  }
  .news-content {
    font-size: 13px;
    color: #333;
    line-height: 26px;
    text-align: left;
  }
}
</style>
