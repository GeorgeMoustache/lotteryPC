<template lang="pug">
.bet-util
  | 您选择了
  span.number(v-text="count")
  | 注, 共
  span.number(v-text="cost")
  | 元, 单注金额：
  Input.price(pattern="[0-9]*" :maxlength="priceMaxLength" :number="true" ref="input" v-model="price" @on-blur="formatPrice")
  ul.unit
    li(v-for="n in units" :key="n" :class="{active: n == unit}" @click="unit = n") {{unitLabel[n]}}
  .control
    Button.addcart(type="primary" @click="submit()") 添加至购彩篮
    Button.reset(@click="empty()") 重置
</template>

<script>
import { mapGetters } from 'vuex';
import mixins from "utils/mixins/bet";

export default {
	name: 'BetUtil',
	props: ['count', 'category', 'mode', 'parentPrice'],
  mixins: [mixins],
	data () {
		return {
			price: 0, // 单注金额
			unit: '1', // 单位（元、角、分
			unitLabel: {
				'1': '元',
				'0.1': '角',
				'0.01': '分'
			}
		}
  },
	computed: {
		...mapGetters(['quickBet_list']),
		units () {
			let str = this.appConfig.units
			return str ? str.split(',') : ['1']
		},
		cost () {
			let {count, price, unit} = this
			if (isNaN(price)) price = 0
			return (count * price * unit).toFixed(2)
    },
	},
	methods: {
		init () {
      let {defaultCost = 0} = this.appConfig
			let { quickBet_list, category } = this // store
      let multiple = 1
			if (quickBet_list) {
				let ss = quickBet_list[category]
        if (ss) multiple = ss.multiple
			}
      this.price = multiple * defaultCost
      this.unit = '1'
    },
		formatPrice () {
      this.validatePrice();
			this.$emit('update:parentPrice', this.price);
    },
    unitChange() {
      this.validatePrice();
    },
    validatePrice() {
      const { price, unit } = this;
      const value = (price * 1000 * unit) / 1000;
      const result = this.checkPrice(value);
      return result;
    },
		submit () {
      if (!this.validatePrice()) return;
      const { cost, price, unit } = this;
			this.$emit('addBet', {
				cost,
				price,
				unit,
			});
		},
		empty() {
			this.$parent.count = 0
      this.$parent.parentPrice = 0
			this.$parent.empty();
		}
	},
	watch: {
    'mode': 'init',
    'appConfig': 'init' // TODO: 异步数据的操作
	}
}
</script>