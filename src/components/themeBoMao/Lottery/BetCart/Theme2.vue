<template lang="pug">
.bet-cart
  .title 购彩篮
  .list
    table
      thead
        tr
          td 玩法
          td 注数
          td 金额
          td 可中金额
          td 删除
      tbody
        tr(v-for="(item, itemIdx) in list" :key="`${item.mode}_${item.nums}`")
          td.td-num [{{item.modeLabel}}]&nbsp;&nbsp;{{item.nums}}
          td.td-count {{item.count}}注
          td.td-price 每注
            price-input(:price.sync="item.price" :curObj="item" :size="'small'")
            | 元
          td.td-cost 
            span(v-text="calcAward(item)")
            | &nbsp;&nbsp;元
          td.td-remove
            span.remove(@click="remove(itemIdx)" title="删除")
              Icon(type="close" color="#ed3f14")
    p.null-tip(v-show="!list.length") 暂无投注项
  .foot.fn-clear
    price-input.input-light(:price.sync="same.price" :curObj="same" @onFocus="onFocus(same)" @formatPrice="formatPrice(same)" :placeholder="'请输入统一金额'" :throttle="false")
    .fn-right 总注数：
      span.text-primary-type2 {{totalCount}}
      | 注，总金额：
      span.text-primary-type2 {{totalCost}}
      | 元
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
import PriceInput from 'components/themeBoMao/Lottery/PriceInput';

export default {
  name: 'BetCartTheme2',
  components: {
    PriceInput,
  },
  props: {
    list: Array,
    same: { // 统一金额
      type: Object,
      default: {
        price: '',
      },
    },
    totalCount: [Number, String],
    totalCost: [Number, String],
  },
  methods: {
    // 计算奖金
    calcAward({ price, count, ratio }) {
      let result = price * count * ratio;
      if (Number.isNaN(result)) result = 0;
      return result.toFixed(2);
    },
    onFocus(obj) {
      obj.price = '';
    },
    // 统一金额
    formatPrice({ price }) {
      this.list.forEach(item => {
        item.price = price;
        return item;
      });
    },
    // 删除某个号码方案
    remove(itemIdx) {
      this.$emit('removeBet', {
        index: itemIdx,
      });
    },
    // 清空购物车
    empty() {
      if (!this.list.length) return;
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否清空确认区中所有投注内容？',
        onOk: () => {
          this.$emit('emptyCart');
        },
      });
    },
  },
};
</script>
