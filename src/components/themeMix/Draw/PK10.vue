<template lang="pug">
.draw_table
  template(v-for="n in 3" v-if="length")
    .draw_table-col
      table
        thead
          tr
            th 期号
            th 开奖号
        tbody
          tr(v-for="(item, index) in filterList(list, n)" :key="item.issue" :class="{'light': index%2}")
            td(v-text="item.issue")
            template(v-if="item.issue <= data.openIssue")
              td.ball-xs(v-if="/(PK10|FT)$/.test(item.alias)")
                b(v-html="$root.formatOpenNum(item)")
              td(v-else)
                b.text-primary(v-html="item.formatNum")
            template(v-else-if="item.issue == data.curIssue")
              td 距离开奖还剩：
                clocker.count-down(:time="data.endTime" @on-finish="finish")
                router-link.btn.btn-warning(:to="{path: `/lottery/${data.alias}`}" target="_blank") 投注
            template(v-else)
              td
</template>

<script>
import clocker from '@/components/themeMix/Clocker/index';

export default {
  name: 'DrawDetail_PK10',
  props: ['data'],
  components: {
    clocker
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    length () {
      return this.data.list ? Math.ceil(this.data.list.length/3) : 0
    },
    list () {
      let {alias, openIssue, openNum, curIssue} = this.data
      if (!(Array.isArray(this.data.list))) return []
      return this.data.list.map(item => {
        item.alias = alias
        if (item.issue == openIssue) item.openNum = openNum
        let nums = item.openNum
        if (nums) {
          nums = nums.split(',')
          item.formatNum = nums.join('&nbsp;&nbsp;')
        } else {
          item.formatNum = '正在开奖...'
        }
        return item
      })
    }
  },
  created () {
  },
  methods: {
    filterList (list, n) {
      return list.filter((el, i) => this.length * (n - 1) <= i && i < this.length * n)
    },
    finish () {
      this.$emit('finish')
    }
  }
}
</script>
