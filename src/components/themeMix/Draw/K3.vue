<template lang="pug">
.draw_table
  template(v-for="n in 3" v-if="length")
    .draw_table-col
      table
        thead
          tr
            th 期号
            th 开奖号
            th 和值
            th 形态
        tbody
          tr(v-for="(item, index) in filterList(list, n)" :key="item.issue" :class="{'light': index%2}")
            td(v-text="item.issue")
            template(v-if="item.issue <= data.openIssue")
              td
                b.text-primary(v-html="item.formatNum")
              td(v-text="item.sum")
              td(v-text="item.form")
            template(v-else-if="item.issue == data.curIssue")
              td(colspan="3") 距离开奖还剩：
                clocker.count-down(:time="data.endTime" @on-finish="finish")
                router-link.btn.btn-warning(:to="{path: `/lottery/${data.alias}`}" target="_blank") 投注
            template(v-else)
              td(colspan="3")
  .draw_explain
    h3 中奖说明
    table
      thead
        tr
          th(colspan="2") 玩法
          th 开奖号码示例
          th 投注号码示例
          th 中奖规则
      tbody
        tr
          td(rowspan="2") 三同号
          td 单选
          td 1 1 1
          td 111
          td 至少选择一个三同号投注，猜中即中奖
        tr
          td 通选
          td 1 1 1
          td 三同号通选
          td 至少选择一个三同号投注，猜中即中奖
        tr
          td(rowspan="2") 三不同号
          td 标准
          td 1 2 3
          td 123
          td 竞猜开奖号码中的3个号码
        tr
          td 胆拖
          td 1 2 3
          td 123
          td 竞猜开奖号码中的3个号码，胆码(1-2个),拖码(1-5个)
        tr
          td 二同号
          td 复选
          td 1 1 5
          td 11
          td 竞猜开奖号码中的二同号数字(即对子号码),非对子不中奖
</template>

<script>
import clocker from '@/components/themeMix/Clocker/index';

export default {
  name: 'DrawDetail_K3',
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
          item.sum = sum(nums)
          item.form = form(nums)
        } else {
          item.formatNum = '正在开奖...'
        }
        return item
      })

      function sum(ary) {
        return ary.reduce((pre, cur) => pre + (+cur), 0)
      }

      function form(ary) {
        let a1 = ary[0], a2 = ary[1], a3 = ary[2] // typeof String
        let str = ''
        if (a1 == a2 && a1 == a3) { str = '三同号' }
        else if (a1 == a2-1 && a1 == a3-2) { str = '三连号' }
        else if (a1 == a2 || a1 == a3 || a2 == a3) { str = '二同号' }
        else { str = '三不同号' }
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
