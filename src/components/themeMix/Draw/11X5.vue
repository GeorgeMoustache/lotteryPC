<template lang="pug">
.draw_table
  template(v-for="n in 3" v-if="length")
    .draw_table-col
      table
        thead
          tr
            th 期号
            th 开奖号
            th 大小
            th 奇偶
        tbody
          tr(v-for="(item, index) in filterList(list, n)" :key="item.issue" :class="{'light': index%2}")
            td(v-text="item.issue")
            template(v-if="item.issue <= data.openIssue")
              td
                b.text-primary(v-html="item.formatNum")
              td(v-text="item.dx")
              td(v-text="item.ds")
            template(v-else-if="item.issue == data.curIssue")
              td(colspan="3") 距离开奖还剩：
                clocker.count-down(:time="data.endTime" @on-finish="finish")
                router-link.btn.btn-warning(:to="{path: `/lottery/${data.alias}`}" target="_blank") 投注
            template(v-else)
              td(colspan="3")
</template>

<script>
import clocker from '@/components/themeMix/Clocker/index';

export default {
  name: 'DrawDetail_11X5',
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
          item.dx = dx(nums)
          item.ds = ds(nums)
        } else {
          item.formatNum = '正在开奖...'
        }
        return item
      })

      function dx(nums) {
        let ary = nums.filter(item => +item > 5)
        return `${ary.length}:${5-ary.length}`
      }

      function ds(nums) {
        let ary = nums.filter(item => +item % 2)
        return `${ary.length}:${5-ary.length}`
      }
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
