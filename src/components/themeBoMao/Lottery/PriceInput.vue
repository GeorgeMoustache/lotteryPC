<template lang="pug">
Input.price(
  ref="input"
  :size="size"
  :placeholder="placeholder"
  :maxlength="priceMaxLength"
  v-model="cPrice"
  @on-focus="onFocus()"
  @on-blur="blurPrice($event)"
  )
</template>

<script>
/**
 * 使用范例
 * price-input(:price.sync="item.price", :curObj="item", @formatPrice="formatPrice(item)")
 */
import mixins from "utils/mixins/bet";

export default {
  name: 'PriceInput',
  props: {
    price: [Number, String], // sync
    curObj: Object,
    placeholder: String,
    size: String,
    throttle: {
      type: Boolean,
      default: true,
    },
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
      this.$emit('update:price', value);
      this.$emit('formatPrice', this.curObj);
    },
    onFocus() {
      this.$emit('onFocus');
    },
  },
  watch: {
    price(value) {
      this.cPrice = value;
    },
  },
};
</script>
