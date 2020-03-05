<template lang="pug">
.betdraw-bar(:class="{'active': showDraw}" v-if="/[^P]K3/.test(category)")
  table
    thead
      tr
        th 期号
        th 奖号
        th 和值
        th 形态
    tbody
      tr(v-for="(item, idx) in list" :key="idx")
        td(v-text="item.issue")
        td
          b.text-error(v-text="item.openNum")
        td(v-text="item.sum")
        td(v-html="item.dxds")
  span.toggle-btn(@click="showDraw = !showDraw" v-text="`${showDraw ? '隐藏' : '显示'}开奖公告`")
</template>

<script>
import { WS } from '@/store/mutation-types';
import { lotteryApi } from 'api';
import { mapGetters } from 'vuex';

export default {
  name: 'BetDrawBar',
  props: ['category'],
  data () {
    return {
      list: [],
      showDraw: false
    }
  },
  computed: {
    ...mapGetters({
      websocketMessage: WS.LOTTERY_INFO,
    })
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const { category } = this;
      if (!/[^P]K3/.test(category)) return;
      let params = {
        params: {
          category,
          limit: 20
        }
      }
      lotteryApi.trend(params).then(data => {
        if (data.code != 0) return
        let list = data.list.splice(0, 20)
        this.list = list.map(item => {
          let sum = item.openNum.split(',').reduce((pre, n) => pre += +n, 0)
          item.sum = sum
          let dx = sum < 11 ? '小' : '大'
          let ds = sum%2 ? '单' : '双'
          let cls1 = sum < 11 ? 'bg-blue' : 'bg-yellow'
          let cls2 = sum%2 ? 'bg-blue' : 'bg-yellow'
          item.dxds = `<span class="ball ${cls1}">${dx}</span>|<span class="ball ${cls2}">${ds}</span>`
          return item
        })
        this.showDraw = true
      })
    }
  },
  watch: {
    'category': 'init',
    websocketMessage ({open_lottery, open_code_list, open_issue}) {
      if (this.category != open_lottery) return
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.betdraw-bar {
  position: fixed;
  z-index: 21;
  top: 50%;
  left: 0;
  margin-top: -266px;
  border: 1px solid #ddd;
  background: #fff;
  transition: .2s transform ease;
  transform: translate3d(-100%, 0, 0);
  &.active {
    transform: translate3d(0, 0, 0);
  }
  th {
    border-bottom: 1px solid #ddd;
    line-height: 30px;
    font-weight: normal;
    background: #f2f4f7;
  }
  td {
    border-bottom: 1px dashed #ebebeb;
    border-right: 1px dashed #ebebeb;
    line-height: 24px;
    padding: 0 5px;
    text-align: center;
  }
  .toggle-btn {
    position: absolute;
    top: 50%;
    right: -30px;
    width: 30px;
    margin-top: -32px;
    padding: 5px 0;
    border-radius: 0 5px 5px 0;
    background: #999;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
}
</style>
