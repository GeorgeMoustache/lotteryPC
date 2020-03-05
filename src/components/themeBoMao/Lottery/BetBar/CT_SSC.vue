<template lang="pug">
.ct-mode-view
  //- 整合
  template(v-if="/^ZH/.test(mode)")
    //- 总和/龙虎
    table.bet-table(v-if="tplList[0]")
      thead
        tr
          td(colspan="12" v-text="tplList[0].label")
      tbody
        template(v-for="(item, index) in tplList[0].values")
          <tr v-if="index % 4 === 0">
          </tr v-if="index % 4 !== 0">
            td(:key="item.label + 0" @click="handleSelected($event, 0, item, index)")
              .content
                span.label(v-text="item.label")
                span.ratio(v-text="item.ratio")
                price-input.value(size="small" :price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
    //- 万位 -> 个位
    .table-group
      template(v-for="(child, childIndex) in tplList")
        table.bet-table.ct(v-if="childIndex > 0" :key="child.id")
          thead
            tr
              td(colspan="3" v-text="child.label")
          tbody
            tr(v-for="(item, index) in child.values", :key="item.label + childIndex")
              td(@click="handleSelected($event, childIndex, item, index)")
                .content
                  span.label(v-if="isNaN(item.label)") {{item.label}}
                  //- 纯数字
                  span.label(v-else)
                    span.ball-ct.ball-orange.ball-round {{item.label}}
                  span.ratio {{item.ratio}}
                  price-input.value(size="small" :price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
  //- 龙虎斗
  .table-group(v-if="/^LHD/.test(mode)")
    template(v-for="(child, childIndex) in tplList")
      table.bet-table.vs(:key="child.id")
        thead
          tr
            td {{child.label}}
        tbody
          tr(v-for="(item, index) in sortLHD(child.values)", :key="item.label + childIndex")
            td(@click="handleSelected($event, childIndex, item, index)")
              .content
                span.label {{['龙', 'VS', '虎'][index]}}
                span.ratio {{item.ratio}}
                price-input.value(size="small" :price.sync="item.price" :curObj="item" @formatPrice="formatPrice(item)")
</template>

<script>
import PriceInput from 'components/themeBoMao/Lottery/PriceInput';
import mixin from './ct_mixins';

export default {
  name: "BetBar_CT_SSC",
  mixins: [mixin],
  components: {
    PriceInput
  },
  methods: {
    init() {
      const { mode, modeObj, price } = this;
      if (modeObj.children == null) return;
      this.tplList = modeObj.children.map(item => {
        const { alias } = item;
        const ratios = String(item.ratio).split("|");
        let labels = [];
        let match;

        // 整合
        if (/^ZH/.test(mode)) {
          labels = ["大", "小", "单", "双"];
          if (/ZH[A-Z]W$/.test(alias)) {
            labels = labels.concat(["质", "合", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
          } else {
            // 总和/龙虎
            labels = labels.map(str => "总和" + str);
            labels = labels.concat(["龙", "虎", "和"]);
          }
        } else if (/^LHD/.test(mode)) {
          labels = ["龙", "虎", "和"];
        }

        item.values = labels.map((label, i) => {
          return {
            label,
            ratio: ratios[i] || ratios[0],
            price: ""
          };
        });
        return item;
      });
    },
    // 排序 龙虎斗
    sortLHD(list) {
      let obj = {
        '龙': 1,
        '和': 2,
        '虎': 3
      };
      return list.sort((a, b) => obj[a.label] - obj[b.label]);
    },
  },
};
</script>
