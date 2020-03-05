<template lang="pug">
.chart-wrap.theme-v2
  table.chart-table
    thead
      tr
        th 期数
        th
          ul.filter-type
            li(@click="showType = 0", :class="{active: showType == 0}") 显示号码
            li(@click="showType = 1", :class="{active: showType == 1}") 显示大小
            li(@click="showType = 2", :class="{active: showType == 2}") 显示单双
        th(colspan="5") 1～5龙虎
        th(colspan="3") 冠亚和
    tbody
      tr(v-for="(item, idx) in list" :key="item.issue")
        td(v-text="item.issue")
        template(v-if="item.nums")
          td
            ul.lottery-balls.ball-md(v-if="showType == 0" v-html="item.nums")
            ul.lottery-balls.ball-md(v-if="showType == 1" v-html="item.dx")
            ul.lottery-balls.ball-md(v-if="showType == 2" v-html="item.ds")
          td(v-for="(n, i) in item.lh", :key="item.issue + n + i", v-text="n")
          td(v-for="(n, i) in item.gyh", :key="item.issue + n + i", v-text="n")
        template(v-else)
          td(colspan="9") 正在开奖...
</template>

<script>

export default {
  name: 'Trend_FT',
  props: ['data'],
  data() {
    return {
      showType: 0,
    };
  },
  computed: {
    list() {
      let { list = [] } = this.data;

      const LABELS = {
        big: '大',
        small: '小',
        even: '双',
        odd: '单',
      };
      return list.map(item => {
        let { openNum, issue } = item;
        if (!openNum) {
          return {
            issue,
            nums: '',
          };
        }

        const ary = item.openNum.split(',');
        // 号码
        const nums = ary.map(n => `<li class="lottery-ball ft-num ball-${n}">${n}</li>`).join('');
        // 大小
        const dx = ary
          .map(n => {
            const val = n > 5 ? 'big' : 'small';
            return `<li class="lottery-ball ft-num ball-${val}">${LABELS[val]}</li>`;
          })
          .join('');
        // 单双
        const ds = ary
          .map(n => {
            const val = n % 2 ? 'odd' : 'even';
            return `<li class="lottery-ball ft-num ball-${val}">${LABELS[val]}</li>`;
          })
          .join('');
        // 冠军和
        const [first, second] = ary;
        const sum = parseInt(first, 10) + parseInt(second, 10);
        const gyh = [sum, sum > 11 ? '大' : '小', sum % 2 ? '单' : '双'];

        // 龙虎
        let lh = [];
        const { length } = ary;
        ary.forEach((n, i) => {
          if (i < 5) {
            lh.push(n > ary[length - i - 1] ? '龙' : '虎');
          }
        });
        return {
          issue,
          nums,
          dx,
          ds,
          lh,
          gyh,
        };
      });
    },
  }
};
</script>

<style lang="scss" scoped>
ul.filter-type {
  li {
    display: inline-block;
    width: 80px;
    height: 37px;
    margin-right: 10px;
    line-height: 34px;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    &:hover,
    &.active {
      color: #f33;
      background: linear-gradient(180deg, rgba(255, 51, 51, 0.15) 0, #f0f0f0);
    }
  }
}
</style>
