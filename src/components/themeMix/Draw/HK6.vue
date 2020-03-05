<template lang="pug">
.chart-wrap
  table.chart-table
    thead
      tr
        th(rowspan="2") 期数
        th(rowspan="2") 正码一
        th(rowspan="2") 正码二
        th(rowspan="2") 正码三
        th(rowspan="2") 正码四
        th(rowspan="2") 正码五
        th(rowspan="2") 正码六
        th(rowspan="2") 特码
        th(colspan="5") 特码
      tr
        th 单双
        th 大小
        th 合单双
        th 合大小
        th 大小尾
    tbody
      tr.ball-row(v-for="(item, index) in list" :key="index")
        td(v-text="item.issue")
        template(v-if="item.openNum != ''")
          td(v-for="(num, idx) in item.formatOpenNum", :key="item.issue + idx")
            .lottery-ball.ball-md(v-text="num.val", :class="`ball-${num.sb}`")
            .twelve-label(v-text="num.sx")
          td(v-for="(value, key) in item.tm", :key="item.issue + key")
            span(v-text="value")
        template(v-else)
          td(colspan="12") 無資料
    tfoot
</template>

<script>

export default {
  name: 'Trend_HK6',
  props: ['data'],
  computed: {
    list() {
      let { list = [] } = this.data;
      return list.map(item => {
        if (item.openNum == undefined) {
          item.openNum = '' 
        }
        let { formatOpenNum } = item;
        if (formatOpenNum == null) {
          let ary = item.openNum.split(',');
          ary = ary.map(n => {
            let obj = this.getHK6Color(n);
            obj.sx = this.getHK6_12(n);
            return obj;
          });
          formatOpenNum = ary;
          item.formatOpenNum = ary;
        }
        if (item.tm == null) {
          const last = formatOpenNum[formatOpenNum.length - 1].val;
          const last_hz = String(last).split('').reduce((pre, cur) => pre + Number(cur), 0);
          item.tm = {
            ds: last == 49 ? '和' : last % 2 ? '单' : '双',
            dx: last == 49 ? '和' : last > 24 ? '大' : '小',
            hds: last == 49 ? '和' : last_hz % 2 ? '合单' : '合双',
            hdx: last == 49 ? '和' : last_hz > 6 ? '合大' : '合小',
            dxw: last == 49 ? '和' : last % 10 > 4 ? '尾大' : '尾小',
          };
        }
        return item;
      });
    },
  },
  methods: {
    getHK6Color(value) {
      return this.$root.getHK6Color(value);
    },
    getHK6_12(value) {
      return this.$root.getHK6_12(value);
    },
  }
};
</script>
