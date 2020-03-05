<template lang="pug">
.bet-bar.single
  .betbar-wrap(v-if="rxds_reg.test(mode)")
    .bet-select
      CheckboxGroup.checkbox-group(v-model="filterDigits_" @on-change="filterDigitsChange")
        Checkbox(v-for="(n, i) in reverseDigits", :key="i", :label="n")
          span(v-text="`${n}位`")
      span.tip 温馨提示：你选择了
        em.text-primary(v-text="filterDigits_.length")
        | 个位置，系统自动根据位置组合成
        em.text-primary(v-text="combine(filterDigits_.length)")
        | 个方案。
  .bet-custom
    Input.textarea(type="textarea" v-model="inputVal" @on-change="changeHanlder")
    .control
      .tip 每注号码之间请使用逗号（，）、分号（；）或回车键隔开，每注内间隔使用空格即可。
      Button.clear(@click="empty()") 清空
</template>

<script>
import { Combination } from "utils/lottery/helper";
const rxqh_reg = /^(RX|Q|H)(\d)Z[HU][A-Z0-9]{2,}$/; // (任选前后) 直选和值、组选和值、组选复式
const rxds_reg = /^RX(\d)\w+_M?DS$/; // (任选单式)
const rxBdKd_reg = /^RX([0-9])ZX[BK]D$/; //（任选）组选包胆、直选跨度

export default {
  name: "SSC_DS",
  props: {
    category: String, // 彩种别名
    mode: String, // 玩法别名
    betInfo: [Object, Array],
    filterDigits: Array // 位置筛选
  },
  data() {
    return {
      inputVal: "",
      rxds_reg: rxds_reg,
      // 任选单式
      minDigitLen: 2,
      reverseDigits: "万千百十个",
      filterDigits_: this.filterDigits
    };
  },
  computed: {
    selectedList() {
      let result = this.validate(this.inputVal);
      return result.list;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.inputVal = "";
      // 任选 直选和值、组选和值、组选复式
      let rex = this.mode.match(rxds_reg);
      let ary = [];
      if (rex) {
        ary = ["万", "千", "百", "十", "个"].slice(5 - parseInt(rex[1]));
        this.filterDigits_ = ary;
        this.$emit("update:filterDigits", ary);
        this.minDigitLen = this.minDigits();
      }
    },
    validate(str) {
      return this.$parent.validate(str);
    },
    changeHanlder() {
      this.$emit("changeSelected", {
        list: this.selectedList,
        singleStr: this.inputVal
      });
    },
    empty() {
      this.$parent.count = 0
      this.$parent.parentPrice = 0
      this.inputVal = "";
    },
    minDigits() {
      let rex = this.mode.match(rxds_reg);
      return rex ? parseInt(rex[1]) : 0;
    },
    combine(c) {
      return c ? Combination(c, this.minDigitLen) : 0;
    },
    filterDigitsChange(value) {
      this.$emit("update:filterDigits", value);
    }
  },
  watch: {
    "betInfo.empty"(value, oldVal) {
      if (value) this.inputVal = "";
    },
    mode: "init"
  }
};
</script>

<style scoped>
.bet-single {
  margin-right: 68px;
}
.bet-single >>> textarea.ivu-input {
  width: 629px;
  height: 140px;
  padding: 10px;
  border: 1px solid #818181;
}
</style>
