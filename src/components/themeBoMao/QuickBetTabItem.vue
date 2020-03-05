<template lang="pug">
//- 20191115 todo 這個元件可能沒用到可以刪除
.tab-content
  //- p(v-text="tplData")
  //- p(v-text="selectedList")
  .hd.fn-clear
    span.lottery-issue(v-text="`第${item.curIssue}期`")
    clocker.count-down(:time="endTime" @on-finish="finish")
      <span class="count-down-separator">截止：</span>
      <span class="count-down-num">%D</span>
      <span class="count-down-separator">天</span>
      <span class="count-down-num">%H</span>
      <span class="count-down-separator">小时</span>
      <span class="count-down-num">%M</span>
      <span class="count-down-separator">分</span>
      <span class="count-down-num">%S</span>
      <span class="count-down-separator">秒</span>
    .fn-right
      router-link(:to="{path: `/lottery/${item.alias}`}" target="_blank") 自助选号
      span |
      router-link(:to="{path: `/trend/${item.alias}`}" target="_blank") 走势图
  .bd.fn-clear
    .lottery-icon
      img(:src="item.icon")
    template(v-for="list in selectedList")
      ul.lottery-balls.ball-lg(v-if="list.length")
        li.lottery-ball(v-for="(n, i) in list" :key="i" v-text="n")
  .ft.fn-clear
    InputNumber(:max="5000" :min="1" v-model="multiple")
    span &nbsp;倍&nbsp;&nbsp;&nbsp;共
    span.text-error(v-text="multiple * appConfig.defaultCost")
    span 元
    .fn-right
      Button(type="default" icon="ios-loop-strong" @click="random").mr10 换一注
      Button(type="primary" @click="submit") 立即投注
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import SET from 'utils/lottery/index';
import clocker from 'components/themeMix/Clocker/index';

export default {
  name: 'QuickBetTabItem',
  props: ['lottery'],
  components: {
    clocker,
  },
  data() {
    return {
      item: this.lottery,
      category: this.lottery.alias,
      mode: this.lottery.mode,
      template: [], // 玩法模版数据
      selectedList: [], // 选择的号码列表
      multiple: 1,
      endTime: this.lottery.endTime,
    };
  },
  computed: {
    ...mapGetters(['appConfig']),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // change methods
      const { category, mode } = this;
      const config = SET[this.$root.$getSpecies(category)][mode];
      for (let o in config) this[o] = config[o];

      this.template = config['tplData'];
      // 初始化selectedList
      this.empty();
      this.random();
    },
    ...mapMutations(['getEndTime', 'quickBet_add']),
    finish() {
      this.$store.dispatch('refreshIssue', this.item);
      setTimeout(() => {
        this.getEndTime(this.item);
        this.endTime = this.item.endTime; // todo optimize
      }, COUNTDOWN_INTERVAL);
    },
    random() {
      this.randomSelect();
    },
    empty() {
      let len = this.template.length;
      this.selectedList.splice(0);
      while (len > 0) {
        this.selectedList.push([]);
        len--;
      }
    },
    submit() {
      let { category, mode, selectedList, multiple } = this;
      this.quickBet_add({
        category: category,
        selectedList: selectedList,
        multiple,
        multiple,
        mode: mode,
      });
      let routeData = this.$router.resolve({ path: `/lottery/${this.category}` });
      window.open(routeData.href, '_blank');
      // this.$root.openWindow({path: `/lottery/${this.category}`}, 'lottery')
    },
  },
};
</script>
