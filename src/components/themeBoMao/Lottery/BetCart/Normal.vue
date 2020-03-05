<template lang="pug">
.bet-cart
  .title 购彩篮
    .toggle 我要追号：
      i-switch.ivu-switch-middle(v-model="isChase" @on-change="changeChase")
        span(slot="open")
        span(slot="close")
  .list
    table
      thead
        tr
          td 玩法
          td 号码
          td 注
          td 倍
          td 金额
      tbody
        tr(v-for="(item, itemIdx) in list" :key="itemIdx")
          td.td-num(v-html="formatBetNum(item)")
          td.td-count(v-text="`${item.count}注`")
          td.td-price(v-text="`${item.price}(${item.unitLabel})`")
          td.td-cost(v-text="`${item.cost}元`")
          td.td-remove
            span.remove(@click="remove(itemIdx)" title="删除")
              Icon(type="close" color="#ed3f14")
    p.null-tip(v-show="!list.length") 暂无投注项
  .control
    template(v-if="$parent.isStopSales")
      Button(disabled) 暂停销售
    template(v-else)
      Button(type="primary" @click="$parent.submitCheck()" :loading="$parent.submitLoading")
        template(v-if="!$parent.submitLoading") 确认下注
        span(v-else) 请稍等...
    Button.clear(@click="$parent.onEmpty()") 清空购彩篮
</template>

<script>
const TSH = {
  'bz': '豹子',
  'sz': '顺子',
  'dz': '对子'
}
export default {
  name: 'BetCart_Normal',
  props: ['list'],
  inject: ['ivNotice'],
  data () {
    return {
      isChase: false,
    }
  },
  methods: {
    formatBetNum (item) {
      let label = `[${item.label}]<br>`, {category, mode, digit, nums, _nums} = item
      let result = ''
      // K3
      if (/[^P]K3$/.test(category)) {
        result = `${digit}：(${_nums})` // toString
        if (/(DT$|TH2DX)/.test(mode)) { // 胆拖|二同号-单选
          result = _nums.map((item, i) => `${digit[i]}：(${item})`).join('，')
        }
        return `${label.replace(/<br>/, ' ')}${result}`
      }
      // SSC
      if (/SSC$/.test(category)) {
        if (/_M?DS$/.test(mode)) { // 单式
          result = `号码：(${nums.join(',')})`
          return `${label}${result}`
        }
        if (/TSH$/.test(mode)) { // 特殊号
          result = `${digit}：(` + nums.split(',').map(n => TSH[n]).join(',') + ')'
          return `${label}${result}`
        }
      }
      let len = _nums.length
      result = _nums.reduce((pre, item, i) => {
        if (item.length) {
          return pre + `${digit[i]}：(${item})` + (i < len - 1 ? '<br>' : '')
        } else {
          return pre
        }
      }, '')
      return `${label}${result}`
    },
    remove (itemIdx) {
      this.$emit('removeBet', {
        index: itemIdx
      })
    },
    changeChase (status) {
      if (status && !this.list.length) {
        this.$nextTick(() => this.isChase = false)
        this.ivNotice('warning', '请先添加投注内容');
        return
      }
      
      this.$emit('changeChase', status)
    },
  },
  watch: {
    'list.length': function(value) {
      if (value == 0) {
        this.$nextTick(() => this.isChase = false)
        this.$emit('changeChase', false)
      }
    }
  }
}
</script>
