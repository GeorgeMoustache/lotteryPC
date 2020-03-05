<template lang="pug">
.ct-mode-view
  //- 整合
  template(v-if="/^ZH/.test(mode)")
    //- 总和/龙虎
    table.bet-table(v-if="tplList[0]")
      thead
        tr
          th.p5(colspan="12" v-text="tplList[0].label")
      tbody
        template(v-for="(item, index) in tplList[0].values")
          <tr v-if="index % 4 === 0">
          </tr v-if="index % 4 !== 0">
            td(
              :key="item.label + 0"
              @click="handleSelected($event, 0, item, index)"
              :class="{'active': item.activeCls}"
              )
              div(style="width: 30%" v-text="item.label")
              div.text-warning(style="width: 30%" v-text="item.ratio")
              price-input(
                style="width: 40%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
    //- 万位 -> 个位
    template(v-for="(child, childIndex) in tplList")
      table.bet-table(v-if="childIndex > 0", :key="child.id", style="width: 20%")
        thead
          tr
            th.p5(colspan="3" v-text="child.label")
        tbody
          tr(v-for="(item, index) in child.values", :key="item.label + childIndex")
            td(
              @click="handleSelected($event, childIndex, item, index)"
              :class="{'active': item.activeCls}"
              )
              div(v-if="isNaN(item.label)" style="width: 25%") {{item.label}}
              //- 纯数字
              div(v-else style="width: 25%")
                span.ball-ct.ball-orange.ball-round {{item.label}}
              div.text-warning(style="width: 30%") {{item.ratio}}
              price-input(
                style="width: 45%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
      br(v-if="childIndex == 0")
  //- 龙虎斗
  template(v-if="/^LHD/.test(mode)")
    template(v-for="(child, childIndex) in tplList")
      table.bet-table(
        :key="child.id"
        style="width: 25%"
        :style="{'margin-right': /(6|9)/.test(childIndex) ? '25%' : 0}")
        thead
          tr
            th.p5(width="50") 组合
            th.p5(colspan="2") {{child.label}}
        tbody
          tr(v-for="(item, index) in sortLHD(child.values)", :key="item.label + childIndex")
            td(@click="handleSelected($event, childIndex, item, index)") {{['龙', 'VS', '虎'][index]}}
            td(
              @click="handleSelected($event, childIndex, item, index)"
              :class="{'active': item.activeCls}"
              )
              div.text-warning(style="width: 40%") {{item.ratio}}
              price-input(
                style="width: 60%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
      br(v-if="/(3|6|9)/.test(childIndex)")
</template>

<script>
import PriceInput from 'components/themeMix/PriceInput';
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
