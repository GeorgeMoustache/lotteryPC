<template lang="pug">
.ct-mode-view
  //- 双面盘
  template(v-if="/^SMP/.test(mode)")
    //- 冠、亚和
    table.bet-table(v-if="tplList[0]")
      thead
        tr
          th.p5(colspan="12" v-text="tplList[0].label")
      tbody
        tr
          td(
            v-for="(item, index) in tplList[0].values"
            :key="item.label + 0"
            @click="handleSelected($event, 0, item, index)"
            :class="{'active': item.activeCls}"
            )
            div(style="width: 25%" v-text="item.label")
            div.text-warning(style="width: 35%" v-text="item.ratio")
            price-input(
              style="width: 40%"
              size="small"
              :price.sync="item.price"
              :curObj="item"
              @formatPrice="formatPrice(item)"
              )
    //- 冠军 -> 第十名
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
              div(style="width: 15%" v-text="item.label")
              div.text-warning(style="width: 38%" v-text="item.ratio")
              price-input(
                style="width: 46%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
      br(v-if="/^(0|5)$/.test(childIndex)")
  //- 定位胆
  template(v-if="/^DWD/.test(mode)")
    template(v-for="(child, childIndex) in tplList")
      table.bet-table(:key="child.id", style="width: 20%")
        thead
          tr
            th.p5(colspan="3" v-text="child.label")
        tbody
          tr(v-for="(item, index) in child.values", :key="item.label + childIndex")
            td(
              @click="handleSelected($event, childIndex, item, index)"
              :class="{'active': item.activeCls}"
              )
              div(style="width: 25%")
                span.ball-pk10(:class="`ball-${item.label}`" v-text="item.label")
              div.text-warning(style="width: 30%" v-text="item.ratio")
              price-input(
                style="width: 45%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
      br(v-if="childIndex === 4")
  //- 冠亚军
  template(v-if="/^GYJ/.test(mode)")
    table.bet-table.hack(v-for="(child, childIndex) in tplList",:key="child.id")
      thead
        tr
          th.p5(colspan="12" v-text="child.label")
        tr
          th.no-padding(v-for="n in 4")
            div(style="width: 20%") 号码
            div(style="width: 35%") 赔率
            div(style="width: 45%") 金额
      tbody
        template(v-for="(item, index) in child.values")
          <tr v-if="index < 20 && index % 4 == 0">
          </tr v-if="index < 20 && index % 4 != 0">
            td(
              @click="handleSelected($event, childIndex, item, index)"
              :class="{'active': item.activeCls}"
              )
              div(style="width: 20%" v-text="item.label")
              div.text-warning(style="width: 35%" v-text="item.ratio")
              price-input(
                style="width: 45%"
                size="small"
                :price.sync="item.price"
                :curObj="item"
                @formatPrice="formatPrice(item)"
                )
          <tr v-if="index === 16"></tr>
</template>

<script>
import PriceInput from 'components/themeMix/PriceInput';
import mixin from './ct_mixins';

const LABELS = {
  DWD: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  GYJ: [
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '和大',
    '和小',
    '和单',
    '和双',
  ],
};

export default {
  name: 'BetBar_CT_PK10',
  mixins: [mixin],
  components: {
    PriceInput,
  },
  methods: {
    init() {
      const { mode, modeObj, price } = this;
      if (modeObj.children == null) return;
      this.tplList = modeObj.children.map(item => {
        const { alias } = item;
        const ratios = String(item.ratio).split('|');
        let labels = [];
        let match;

        // 双面盘
        if (/^SMP/.test(mode)) {
          // 冠、亚和
          if (alias === 'SMPGYH') {
            labels = ['和大', '和小', '和单', '和双'];
          } else {
            labels = ['大', '小', '单', '双'];
            match = alias.match(/D(\d+)M$/);
            // 前五名
            if (match && match[1] <= 5) {
              labels = labels.concat(['龙', '虎']);
            }
          }
        }
        // 定位胆
        else if (/^DWD/.test(mode)) {
          labels = LABELS.DWD;
        }
        // 冠亚军
        else if (/^GYJ/.test(mode)) {
          labels = LABELS.GYJ;
        }

        item.values = labels.map((label, i) => {
          return {
            label,
            ratio: ratios[i] || ratios[0],
            price: '',
          };
        });
        return item;
      });
    },
  },
};
</script>
