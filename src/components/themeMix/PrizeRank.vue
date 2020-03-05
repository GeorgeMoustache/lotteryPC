<template lang="pug">
.prize-rank
  h3.hd
    i.icon-sprite.icon-gold
    | 最新中奖榜
  p.th
    span 用户名
    span 中奖金
  .bd
    scroll-seamless.seamless-warp(:data="list")
      ul
        li(v-for="(item, index) in list" :key="index")
          i.sort(v-text="formatNum(index)")
          span.username(v-text="item.username")
          em.amount(v-text="`${item.amount}元`")
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'PrizeRank',
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
      this.fetchData()
    },
    fetchData () {
      newsApi.prizeList().then(data => {
        this.list = data.list
      })
    },
    formatNum (n) {
      return ('0' + (n + 1)).substr(-2)
    }
  }
}
</script>

<style lang="scss" scoped>


.prize-rank {
  width: 230px;
  height: $layout-home-rank-height;
  border: 1px solid #ddd;
  background: #fff;
  .hd {
    height: 41px;
    line-height: 41px;
    border-bottom: 1px solid #ddd;
    background: #eee;
    font-size: 16px;
  }
  .th {
    span {
      display: inline-block;
      vertical-align: middle;
      width: 50%;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
      color: #333;
      background: #fff;
    }
  }
}

.seamless-warp {
  height: 385px;
  overflow: hidden;
  li {
    padding-left: 25px;
    line-height: 35px;
    @include clearfix();
  }
  .sort {
    display: inline-block;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: $layout-primary;
    border-radius: 3px;
    color: #fff;
    text-align: center;
  }
  .amount {
    float: right;
    width: 50%;
    font-style: normal;
    color: $layout-primary;
    text-indent: 2em;
  }
}
</style>
