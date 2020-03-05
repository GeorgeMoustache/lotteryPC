<template lang="pug">
.betcoin
  span.label 金额
  Input.value(v-model="cPrice" :maxlength="priceMaxLength" @on-blur="blurPrice($event)")
  a.reset(@click="handleReset") 重置金额
  ul.coin
    li(v-for="(item, index) in [10, 50, 100, 500, 1000, 5000]" :key="item" @click="increase(item)" v-text="item")
  Button(type="primary" @click="handleSubmit()") 提交注单
</template>

<script>
import mixins from "utils/mixins/bet";

export default {
  name: 'UtilCtSubmit', // 传统玩法表单组件
  props: {
    price: [Number, String], // sync
  },
  mixins: [mixins],
  inject: ['ivNotice'],
  data() {
    return {
      cPrice: this.price,
    };
  },
  methods: {
    blurPrice(event) {
      let { value } = event.target;
      this.checkPrice(value);
      this.cPrice = value;
      event.target.value = value;
      this.updatePrice();
    },
    increase(num) {
      let price = this.cPrice;
      let [minCost, maxCost] = this.costRange;
      price = parseInt(price, 10);
      if (Number.isNaN(price)) price = 0;
      price = price + parseInt(num);
      if (price >= maxCost) {
        price = maxCost;
        this.ivNotice('warning', '已达最大投注金额');
      }
      this.cPrice = price;

      this.updatePrice();
    },
    formatPrice() {},
    handleReset() {
      this.cPrice = '';
      this.updatePrice();
      this.$bus.$emit('resetSelected');
    },
    handleSubmit() {
      this.$bus.$emit('validateForm', this.costRange);
    },
    // 更新父节点数据
    updatePrice() {
      // 更新父组件
      this.$emit('update:price', this.cPrice);
      // 更新兄弟组件
      this.$bus.$emit('updatePrice', this.cPrice);
    },
  },
  watch: {
    // TODO:
    price(value) {
      this.cPrice = value;
    },
  },
};
</script>