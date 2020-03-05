<template lang="pug">
.chase-list
  .title 
    | 追号
    .toggle
      i-switch.ivu-switch-middle(v-model="isStop" @on-change="changeStop" slot="extra")
      span(slot="open")
      span(slot="close")
      | 中奖后停止追号
  .chase-tabs(:animated="false")
    p.tool
      | 追号计划：起始倍数
      Input.ratio(:number="true" ref="ratioInput" :value="ratio" @on-blur="changeRatio($event.target.value)")
      | 追号期数
      Input.issue(:number="true" :maxlength="2" v-model="input4issue" @on-blur="changeIssue()")
      | (最多50期)
      | 总期数:
      span(v-text="issue")
      | 期 追号总金额:
      span(v-text="totalCost")
      | 元
  .list
    table
      thead
        tr
          td 期号
          td 倍
          td 金额
          td 日期
      tbody
        tr(v-for="(item, idx) in chaseList" :key="idx")
          td.td-issue
            Checkbox.ivu-checkbox-gray(v-model="item.isSelect" @on-change="changeSelect(item, idx)")
            span {{idx ? item.issue : `${item.issue}(当前期)`}}
          td.td-ratio
            Input.ratio(v-model="item.ratio" :maxlength="5" @on-blur="changeItemRatio($event.target.value, item)" :number="true")
            | 倍
          td.td-cost {{formatMoney(item)}}
          td.td-time {{item.endtime}}
</template>

<script>
import { mapGetters } from 'vuex';

const ISSUE = [
  {label: '5期', value: 5},
  {label: '10期', value: 10},
  {label: '15期', value: 15},
  {label: '20期', value: 20},
  {label: '25期', value: 25},
  {label: '全部', value: 50}
]

export default {
  name: 'ChaseList',
  props: ['alias', 'price'],
  data () {
    return {
      isStop: true,
      issueTpl: ISSUE,
      input4issue: 10
    }
  },
  computed: {
    ...mapGetters([
      'requesting',
      'error',
      'chaseList',
      'ratio'
    ]),
    issue () {
      return this.chaseList.filter(item => item.isSelect).length
    },
    totalCost () {
      const price = Number(this.price)
      if (isNaN(price)) return 0
      let value = this.chaseList.reduce((sum, item) => {
        return item.isSelect ? (sum + item.ratio * price) : sum
      }, 0)
      if (value == null) return 0
      return (value).toFixed(2)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('chaseIssue', { category: this.alias })
    },
    changeStop (status) {
      this.$emit('changeStop', status)
    },
    changeIssue () {
      let value = this.input4issue
      let formatValue = Number(String(value).replace(/[^\d]/, ''))
      if (isNaN(formatValue)) formatValue = 10
      if (formatValue <= 0) formatValue = 10
      if (formatValue > 50) formatValue = 50
      if (formatValue != value) this.input4issue = formatValue
      this.$store.commit('updateChaseList', {
        issue: formatValue
      })
    },
    formatMoney (item) {
      let value = (item.ratio * this.price).toFixed(2)
      return `￥${value}`
    },
    changeSelect(item, idx) {
      this.$store.commit('updateChaseList', {
        item: item,
        index: idx
      })
    },
    changeRatio(value) {
      let val = Number(value.replace(/[^\d.+]/, ''))
      if (val <= 0 || isNaN(val)) val = 1
      this.$store.commit('updateChaseList', {
        ratio: val
      })
    },
    changeItemRatio(value, item) {
      let val = Number(value.replace(/[^\d.+]/, ''))
      if (val <= 0 || isNaN(val)) val = 1
      item.ratio = val
    }
  },
  watch: {
    issue: function (value, oldValue) {
      this.input4issue = value
    }
  }
}
</script>