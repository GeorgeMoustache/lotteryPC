<template lang="pug">
.bet-cart
  .title 购彩篮
  .list
    table
      thead
        tr
          td 投注项彩种
          td 下注类型
          td 号码
          td 总注数
          td 金额
          td
      tbody
        tr(v-for="(item, itemIdx) in list" :key="itemIdx")
          td(v-text="item.categoryLabel")
          td(v-text="item.label")
          td(v-text="item.nums")
          td(v-text="item.count")
          td(v-text="item.price")
          td
            span.remove(@click="remove(itemIdx)" title="删除")
              Icon(type="close" color="#ed3f14")
    p.null-tip(v-show="!list.length") 暂无投注项..
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
export default {
  name: 'BetCart_PCDD',
  props: {
    list: Array,
  },
  data () {
    return {
    }
  },
  methods: {
    remove (itemIdx) {
      this.$emit('removeBet', {
        index: itemIdx
      })
    },
    empty () {
      if (!this.list.length) return
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否清空确认区中所有投注内容？',
        onOk: () => {
          this.$emit('emptyCart')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
td {
  text-align: center;
}
</style>
