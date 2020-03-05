<template lang="pug">
.ct-submit-wrap.fn-clear
  .fn-left
    Input.form-width-sm(
      v-model="cPrice"
      :maxlength="priceMaxLength"
      @on-blur="blurPrice($event)"
      )
      span(slot="prepend") 金额
  Button.fn-left(@click="handleReset") 重置
  Button.fn-left(type="primary" @click="handleSubmit" style="margin-left: 8px") 提交注单
  ul.jetton-list.fn-left
    li(
      v-for="(item, index) in [10, 50, 100, 500, 1000, 5000]"
      :key="item"
      @click="increase(item)"
      )
      i.iconfont.icon-jetton(:class="'jetton' + index")
      span(v-text="item")
</template>

<script>
import mixins from 'utils/mixins/bet';

export default {
  name: 'UtilCtSubmit', // 传统玩法表单组件
  props: {
    price: [Number, String], // sync
  },
  mixins: [mixins],
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
        this.$Message.warning({
          content: '已达最大投注金额',
        });
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

<style lang="scss" scoped>
.ct-submit-wrap {
  padding: 20px;
}
.jetton-list {
  margin-top: -10px;
  @extend %clearfix;
  li {
    position: relative;
    float: left;
    width: 54px;
    height: 52px;
    margin-left: 10px;
    text-align: center;
    cursor: pointer;
    &:after {
      font-size: 5.2em;
      position: absolute;
      left: 0;
      left: -2px;
      top: 20px;
    }
  }
  span {
    display: inline-block;
    color: #1b1b1b;
    width: 100%;
    height: 100%;
    line-height: 50px;
    font-size: 12px;
    font-weight: 700;
  }
  i.icon-jetton {
    position: absolute;
    top: 0;
    margin-top: -15px;
    font-size: 54px;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
  }
  @each $index, $color in (0: #319b0d, 1: #cea400, 2: #e75519, 3: #e21826, 4: #106ec8, 5: #7237af) {
    .jetton#{$index} {
      color: $color;
    }
  }
}
</style>
