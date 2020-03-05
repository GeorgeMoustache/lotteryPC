<template lang="pug">
.bet-cart
  .wrap
    .body
      table.bet-list(v-show="list.length")
        tr
          th 投注项彩种
          th 下注类型
          th 号码
          th 总注数
          th 金额
          th
        tr(v-for="(item, itemIdx) in list" :key="itemIdx")
          td(v-text="item.categoryLabel")
          td(v-text="item.label")
          td(v-text="item.nums")
          td(v-text="item.count")
          td(v-text="item.price")
          td
            span.remove(@click="remove(itemIdx)" title="删除")
              Icon(type="close" color="#ed3f14")
      p.null-tip(v-show="!list.length") 暂无投注项
    .foot.fn-clear
      .fn-right 总注数：
        span.text-primary-type2 {{totalCount}}
        | 注，总金额：
        span.text-primary-type2 {{totalCost}}
        | 元
</template>

<script>
export default {
  name: 'BetCart_PCDD',
  props: {
    list: Array,
    totalCount: [Number, String],
    totalCost: [Number, String],
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
