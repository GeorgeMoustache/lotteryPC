<template lang="pug">
.view28.fn-clear
  //- 混合
  .bet-module(v-if="/HHHH/.test(mode)")
    table
      thead
        tr
          template(v-for="i in 2")
            th 选项
            th 赔率
            th 金额(元)
      tbody
        template(v-for="(item, i) in HHHH")
          <tr v-if="i % 2 == 0">
          </tr v-if="i % 2 != 0">
            td
              span.ball(:class="formatCls(item.value)" v-text="item.value")
            td(v-text="item.ratio")
            td
              price-input(:price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
  //- 波色
  .bet-module(v-else-if="/BSBS/.test(mode)")
    table
      thead
        tr
          th 选项
          th 赔率
          th 金额(元)
      tbody
        tr(v-for="(item, i) in BSBS")
          td
            span.ball(:class="formatCls(item.value)" v-text="item.value")
          td(v-text="item.ratio")
          td
            price-input(:price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
  //- 豹子
  .bet-module(v-else-if="/BZBZ/.test(mode)")
    table
      thead
        tr
          th 选项
          th 赔率
          th 金额(元)
      tbody
        tr(v-for="(item, i) in BZBZ")
          td
            span.ball(:class="formatCls(item.value)" v-text="item.value")
          td(v-text="item.ratio")
          td
            price-input(:price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
  //- 特码
  .bet-module(v-else-if="/TMTM/.test(mode)")
    table
      thead
        tr
          template(v-for="i in 4")
            th 选项
            th 赔率
            th 金额(元)
      tbody
        tr(v-for="i in 7")
          template(v-for="j in 4" v-if="TMTM[i-1+(j-1)*7]")
            td
              span.ball(:class="formatCls(TMTM[i-1+(j-1)*7].value)" v-text="TMTM[i-1+(j-1)*7].value")
            td(v-text="TMTM[i-1+(j-1)*7].ratio")
            td
              price-input(:price.sync="TMTM[i-1+(j-1)*7].price" :curObj="TMTM[i-1+(j-1)*7]" @formatPrice="formatPrice(TMTM[i-1+(j-1)*7])")
    //- 特码包三
    table.table-sm
      tr
        td
          span.ball.ball-red 特码包三
        td(v-text="TMTMB3.ratio")
        td(v-for="n in 3" v-if="TMTMB3.values")
          Select.ball-xs(v-model="TMTMB3.values[n-1]" :class="formatCls(TMTMB3.values[n-1])" @on-change="selectChange" :transfer="true" style="width:60px")
            Option(v-for="n in 28" :value="n-1" :key="n" v-text="n-1" :label="n - 1")
        td 下注金额：
          price-input(:price.sync="TMTMB3.price" :curObj="TMTMB3" @formatPrice="formatPrice(TMTMB3)")
          | 元
</template>

<script>
import { mapGetters } from 'vuex';
import SET from 'utils/lottery/index';
import PriceInput from 'components/themeMix/PriceInput';

export default {
  name: 'BetBar_PCDD',
  components: {
    PriceInput
  },
  props: {
    alias: String, // 彩种别名
    mode: String, // 玩法
    empty: Boolean
  },
  data() {
    return {
      HHHH: {},
      BSBS: {},
      BZBZ: {},
      TMTM: {},
      TMTMB3: {},
      cacheData: {},
      betNum: [],
    };
  },
  computed: {
    ...mapGetters(['lotteryMode', 'selectMode'])
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.category = this.alias;
      this.getData();
    },
    getData() {
      let { category } = this;
      this.$store.dispatch('lotteryMode', { category: category }).then(list => {
        const config = SET[this.$root.$getSpecies(category)];
        let data = {};
        const index = {
          HHHH: 1,
          BSBS: 2,
          BZBZ: 3,
          TMTM: 4,
          TMTMB3: 5
        };
        list.forEach(obj => {
          obj.children.forEach(item => {
            let { alias, ratio, price } = item;
            let _data = config[alias]['tplData'];
            let list = _data[0].nums;
            let ratios = String(ratio).split('|');
            if (alias == 'TMTMB3') {
              let ary = [1, 2, 3];
              return (data[alias] = {
                alias: alias,
                index: index[alias],
                label: item.label,
                values: ary,
                value: ary.join(','),
                ratio: ratios[0],
                minPrice: price
              });
            }
            data[alias] = list.map((n, i) => {
              return {
                alias: alias,
                index: index[alias],
                label: item.label,
                value: n,
                ratio: ratios[i],
                minPrice: price
              };
            });
          });
        });
        this.cacheData = JSON.parse(JSON.stringify(data));
        for (let p in data) this[p] = data[p];
        // log(this.TMTM)
        // this.render4store();
      });
    },
    formatCls(n) {
      return `ball-${findsb(n).alias}`;
      function findsb(value) {
        let sbAry = [
          { alias: 'green', label: '绿', summary: [1, 4, 7, 10, 16, 19, 22, 25, '极大', '极小', '绿波', '豹子'] },
          {
            alias: 'blue',
            label: '蓝',
            summary: [2, 5, 8, 11, 17, 20, 23, 26, '大单', '小单', '大双', '小双', '蓝波']
          },
          { alias: 'red', label: '红', summary: [3, 6, 9, 12, 15, 18, 21, 24, '大', '小', '单', '双', '红波'] },
          { alias: 'gray', label: '无', summary: [0, 13, 14, 27] }
        ];
        let sbObj = sbAry.find(obj => {
          let num = obj.summary.find(n => n == value);
          return num != null;
        });
        return sbObj;
      }
    },
    formatPrice (item) {
      let { alias, value } = item;
      let index = this.betNum.findIndex(el => alias == el.alias && value == el.value);
      if (index != -1) {
        item.price ? this.betNum.splice(index, 1, item) : this.betNum.splice(index, 1);
      } else {
        item.price && this.betNum.unshift(item);
      }

      this.emitBetList();
    },
    selectChange() {
      let obj = this.TMTMB3;
      obj.value = obj.values.join(',');

      //比對三個數字是否選到相同的，提示錯誤
      let value = obj.values;
      let n1 = value[0];
      let n2 = value[1];
      let n3 = value[2];
      if (n1 == n2 || n1 == n3 || n2 == n3) {
        this.$Notice.error({
          title: '系统提示',
          desc: '三个号码不能为相同的数字，请重新选择'
        })
      }

      this.emitBetList();
    },
    emitBetList() {
      let ary = Object.assign([], this.betNum);
      this.$emit('changeSelected', {
        value: ary
      });
    }
  },
  watch: {
    empty(value, oldVal) {
      if (value) {
        this.betNum.splice(0);
        let data = JSON.parse(JSON.stringify(this.cacheData));
        for (let p in data) this[p] = data[p];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view28 .mode-tab {
  height: 39px;
}
.bet-module {
  float: left;
  margin-bottom: 15px;
  th {
    font-size: 14px;
    height: 40px;
    font-weight: normal;
  }
  td {
    padding: 8px 5px;
    text-align: center;
  }
}
.table-sm {
  margin-left: auto;
  width: auto;
  td {
    padding: 8px 3px;
  }
}
.ball {
  display: inline-block;
  padding: 8px;
  min-width: 32px;
  border-radius: 20px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3) inset;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  color: #fff;
  &-red {
    background: $ball-red;
  }
  &-green {
    background: $ball-green;
  }
  &-blue {
    background: $ball-blue;
  }
  &-gray {
    background: $ball-gray;
  }
}
.price {
  width: 70px;
}
</style>
