<template lang="pug">
.draw_table
  template(v-for="n in 3" v-if="length")
    .draw_table-col
      table
        thead
          tr
            th 期号
            th 开奖号
            th 十位
            th 个位
            th 后三
        tbody
          tr(v-for="(item, index) in filterList(list, n)" :key="item.issue" :class="{'light': index%2}")
            td(v-text="item.issue")
            template(v-if="item.issue <= data.openIssue")
              td.open-num(v-html="item.formatNum")
              td(v-text="item.ten")
              td(v-text="item.one")
              td(v-text="item.last3")
            template(v-else-if="item.issue == data.curIssue")
              td(colspan="4") 距离开奖还剩：
                clocker.count-down(:time="data.endTime" @on-finish="finish")
                router-link.btn.btn-warning(:to="{path: `/lottery/${data.alias}`}" target="_blank") 投注
            template(v-else)
              td(colspan="4")
</template>

<script>
import clocker from '@/components/themeBoMao/Clocker/index';

export default {
  name: 'DrawDetail_SSC',
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
          item.formatNum = nums.join('')
          item.ten = dxds({min: 4, n: nums[3]})
          item.one = dxds({min: 4, n: nums[4]})
          item.last3 = last3(nums)
        } else {
          item.formatNum = '正在开奖...'
        }
        return item
      })

      function dxds({min, n}) {
        let pre = n <= min ? '小' : '大'
        let suf = n%2 ? '单' : '双'
        return pre + suf
      }

      function last3(ary) {
        let len = ary.length
        let a1 = ary[len-3], a2 = ary[len-2], a3 = ary[len-1] // typeof String
        let str = ''
        if (a1 == a2 && a1 == a3) {
          str = '豹子'
        } else if (a1 == a2 || a1 == a3 || a2 == a3) {
          str = '组三'
        } else {
          str = '组六'
        }
        return str
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