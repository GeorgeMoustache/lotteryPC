<template lang="pug">
.chart-wrap
  table.chart-table
    thead
      tr
        th(rowspan="2") 期号
        th(rowspan="2" :colspan="colLen") 开奖号码
        template(v-for="n in colLen")
          th(:colspan="digitLen" v-text="`第${digit.charAt(n-1)}位`")
      tr
        template(v-for="i in colLen")
          th(v-for="j in digitLen" v-text="j")
    tbody
      tr.ball-row(v-for="(item, index) in list" :key="index")
        td(v-text="item.issue")
        td(v-for="(n, i) in item.openNum.split(',')" :key="i")
          span.num-ball.ball-orange(v-text="n")
        template(v-for="(omit, idx) in item.omits")
          td.light-bg(v-for="(n, i) in omit.split(',')")
            span(v-text="+n || i+1" :class="fomartCls(n, idx)")
      tr
        th 出现总次数
        td(:colspan="colLen")
        td(v-for="(n, i) in appearTime" :key="i")
          span.num-ball(v-text="n")
      tr
        th 平均遗漏值
        td(:colspan="colLen")
        td(v-for="(n, i) in meanOmit" :key="i")
          span.num-ball(v-text="n")
      tr
        th 最大遗漏值
        td(:colspan="colLen")
        td(v-for="(n, i) in maxOmit" :key="i")
          span.num-ball(v-text="n")
      tr
        th 最大连出值
        td(:colspan="colLen")
        td(v-for="(n, i) in maxTime" :key="i")
          span.num-ball(v-text="n")
    tfoot
      tr
        th(rowspan="2") 期号
        th(rowspan="2" :colspan="colLen") 开奖号码
        template(v-for="n in colLen")
          th(:colspan="digitLen" v-text="`第${digit.charAt(n-1)}位`")
      tr
        template(v-for="i in colLen")
          th(v-for="j in digitLen" v-text="j")
</template>

<script>
import { mapGetters } from 'vuex';
import * as UTIL from 'utils/trend';

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
      return this.trendData.list || []
    },
    appearTime () {
      return this.trendData.appearTime || []
    },
    meanOmit () {
      return this.trendData.meanOmit || []
    },
    maxOmit () {
      return this.trendData.maxOmit || []
    },
    maxTime () {
      return this.trendData.maxTime || []
    }
  },
  data () {
    return {
      colLen: 5,
      digit: '一二三四五',
      digitLen: 11,

      tid: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$store.dispatch('trendData', this.params).then(() => {
        clearTimeout(this.tid)
        this.tid = setTimeout(UTIL.init, 200, {colLen: this.colLen})
      })
    },
    fomartCls(n, i) {
      let cls = 'text-ball'
      if (n == 0) {
        cls = 'omit-ball ball-'
        cls += i % 2 == 0 ? 'green' : 'orange'
      }
      return cls
    }
  },
  watch: {
    '$route': 'init',
    'params.limit': 'init'
  }
}
</script>
