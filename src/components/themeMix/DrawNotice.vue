<template lang="pug">
.draw-notice.theme-v2(@mouseover="hover($event.target)")
  h3.box-hd
    i.icon-sprite.icon-draw
    | 开奖公告
  template(v-for="(item, index) in list")
    ul.list
      li(v-for="(child, idx) in item" :key="idx")
        .hd.fn-clear
          b.label.fn-left(v-text="child.label")
        .bd.fn-clear(:class="{pk10: /(PK10|FT)$/.test(child.alias)}")
          template(v-if="child.openNum")
            span.num(v-for="(n, i) in child.openNum.split(',')" :key="i" v-text="n")
          template(v-else)
            span.text-gray 正在开奖...
        .ft
          span.text-gray.fn-left(v-html="formatIssue(child.openIssue)")
          router-link.text-info(:to="{path: `/trend/${child.alias}`}") 走势
          router-link.text-info(:to="{path: `/lottery/${child.alias}`}") 投注
</template>

<script>
import { lotteryApi } from 'api';

export default {
  name: 'DrawNotice',
  data () {
    return {
      tabIndex: '0',
      labels: ['高频开奖', '低频开奖'],
      list: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      lotteryApi.drawNotice().then(data => {
        if (data.code != 0) return this.notice(data.msg, 'error')
        this.formatData(data.list)
      })
    },
    formatData (list) {
      // 低频彩
      let ary = list.filter(item => item.column == 1)
      this.list.push(ary.filter(item => /[^PK10]$/.test(item.alias)).splice(0, 4))
      // 高频彩
      this.list.push(ary.splice(0, 4))
    },
    formatIssue (str) {
      return `第${str}期`
    },
    formatDateTime (str) {
      // todo optimize
      return str.replace(/\d{4}-(\d{2}-\d{2})\s+\d{2}:\d{2}:\d{2}/g, '$1')
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    hover (target) {
      if (~target.className.indexOf('ivu-tabs-tab')) {
        let label = target.innerHTML
        label = label.replace(/<!---->/g, '').trim()
        let index = this.labels.findIndex(item => item == label)
        if (index != -1) {
          this.$nextTick(() => this.tabIndex = '' + index)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.draw-notice.theme-v2 {
  height: $layout-home-rank-height;
  border: 1px solid #ddd;
  background: #fff;
  overflow: hidden;
}
.draw-notice {
  width: 230px;
  .ivu-tabs {
    height: $layout-home-rank-height;
  }
  .ivu-tabs-bar {
    margin-bottom: 5px;
  }
  .ivu-tabs-nav {
    width: 228px;
  }
  .ivu-tabs-tab {
    width: 50%;
  }

  .list {
    li {
      height: 111px;
      padding: 5px 10px 0 15px;
      border-bottom: 1px solid #ddd;
      line-height: 30px;
    }
  }
  .bd {
    height: 32px;
  }
  .label {
    margin: 5px 10px 0 0;
    font-size: 14px;
    font-weight: normal;
  }
  .num {
    display: inline-block;
    color: $layout-primary;
    font-size: 16px;
    font-weight: 700;
    margin-right: 8px;
  }
  .pk10 .num {
    margin-right: 2px;
  }
  .ft {
    margin-top: -2px;
    text-align: right;
  }
  a {
    padding: 0 10px;
    &:hover {
      color: $layout-primary;
    }
  }
}
</style>
