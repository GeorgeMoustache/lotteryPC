<template lang="pug">
.chart-wrap
  table.chart-table
    thead
      tr
        th 期号
        th 开奖号码
        th 大小单双
        th 色波
    tbody
      tr.ball-row(v-for="(item, index) in list" :key="index")
        td(v-text="item.issue")
        td
          ul.ball-xs(v-html="item.result")
        td(v-text="item.dxds")
        td(v-text="item.sb")
    tfoot
      tr
        th 期号
        th 开奖号码
        th 大小单双
        th 色波
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Trend_11X5',
  props: {
    params: Object,
    showLine: Boolean,
    hideOmit: Boolean
  },
  computed: {
    ...mapGetters([
      'requesting',
      'error',
      'trendData'
    ]),
    list () {
      let list = this.trendData.list || []
      return list.map(item => {
        if (item.openNum == '') return
        let ary = item.openNum.split(',')
        let sum = ary.reduce((pre, n) => +n + pre, 0)
        let sbObj = this.findsb(sum)
        return {
            issue: item.issue,
            result: this.format28(item.openNum),
            dxds: (sum > 13 ? '大' : '小') + (sum % 2 == 0 ? '双' : '单'),
            sb: sbObj ? sbObj.label : ''
          }
      })
    }
  },
  data () {
    return {
      tid: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$store.dispatch('trendData', this.params)
    },
    format28 (nums) {
      let ary = nums.split(',')
      let result = ary.map(n =>`<li class="lottery-ball">${n}</li>`)
      let sum = ary.reduce((pre, n) => +n + pre, 0)
      let cls = this.findsb(sum) || ''
      if (cls) cls = `ball-${cls.alias}`
      result = result.join('<li class="symbol">+</li>') + '<li class="symbol">=</li>' + `<li  class="lottery-ball ${cls}">${sum}</li>`
      return result
    },
    findsb(value) {
      let sbAry = [
        { alias: 'green', label: '绿', summary: [1, 4, 7, 10, 16, 19, 22, 25, '极大', '极小', '绿波', '豹子'] },
        { alias: 'blue', label: '蓝', summary: [2, 5, 8, 11, 17, 20, 23, 26, '大单', '小单', '大双', '小双', '蓝波'] },
        { alias: 'red', label: '红', summary: [3, 6, 9, 12, 15, 18, 21, 24, '大', '小', '单', '双', '红波'] },
        { alias: 'gray', label: '无', summary: [0, 13, 14, 27] }
      ]
      let sbObj = sbAry.find(obj => {
        let num = obj.summary.find(n => n == value)
        return num != null
      })
      return sbObj
    }
  },
  watch: {
    '$route': 'init',
    'params.limit': 'init'
  }
}
</script>
