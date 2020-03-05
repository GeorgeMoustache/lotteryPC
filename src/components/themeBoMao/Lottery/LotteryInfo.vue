<template lang="pug">
.lottery-info
  .info-left
    img(:src="lottery.icon" :alt="lottery.label")
  .info-right
    .info
      .label {{lottery.label}}
      .total(v-show="lottery.totalIssue && !/^HKSIX$/.test(category)" v-html="`总共 <span>${lottery.totalIssue}</span> 期`")
    .counter
      template(v-if="!isReady")
        p.countdown-tip 距离投注截止还有
        .stop-sales 加载中...
      template(v-else-if="isStopSales")
        .stop-sales {{stopSalesText}}
      template(v-else)
        .tick
          Icon(v-if="audio_play" @click.native="setPlayState(0)" type="android-notifications")
          Icon(v-else @click.native="setPlayState(1)" type="android-notifications-off")
        .content
          .tip 
            | 第
            span {{lottery.curIssue}}
            | 期
            p 投注截止
          clocker.count-down(v-if="lottery.endTime" :time="lottery.endTime" @on-finish="finish(lottery)" @on-tick="tick")
            span.count-down-num %H
            | :
            span.count-down-num %M
            | :
            span.count-down-num %S
    .select-type(v-if="/(PK10|FT|SSC)$/.test(lottery.alias)")
      RadioGroup(type="button" size="small" v-model="playType.type" @on-change="changePlayType()")
        Radio(label="CT") 传统
        Radio(label="GF") 官方
  //- 溫馨提示
  Modal(v-model="modal" title="温馨提示" width="300")
    p(v-html="`${lottery.openIssue}期已截止`")
    p(v-html="`当前期号<span>${lottery.curIssue}</span>`")
    p 投注时请注意期号
  <audio ref="tick" controls="controls" hidden="true">
    <source src="@/assets/themeMix/lottery-tick.mp3" type="audio/mpeg">
  </audio>
</template>

<script>
import clocker from 'components/themeMix/Clocker/index';
import { WS, ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapMutations } from 'vuex';
import { lotteryApi } from 'api';

export default {
  name: 'LotteryInfo',
  props: ['lottery', 'playType', 'isReady', 'isStopSales'],
  components: {
    clocker
  },
  data () {
    return {
      modal: false,
      category: '',

      // 声音提醒
      tickTimer: 0,
      playPromise: void 0,
      switchStyle: '0',
    }
  },
  created () {
    this.init();
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      audio_play: 'audio_play',
      websocketMessage: WS.LOTTERY_INFO,
    }),
    stopSalesText() { // 暂停销售文案
      const { AppName = '' } = this.appConfig;
      const isHostHuifa = ~AppName.indexOf('汇发');
      return isHostHuifa ? '维护更新中' : '暂停销售';
    },
    info() { // for mixins
      return this.lottery;
    },
  },
  methods: {
    ...mapMutations(['getEndTime', 'setPlayState', 'getGapTime']),
    init() {
      this.category = this.lottery.alias;
    },
    tick() {
      if (!this.audio_play) return;
      if (+new Date(this.lottery.endTime) - new Date().setMilliseconds(window.diffTime) <= 5000) {
        this.palyTick();
      }
    },
    palyTick() {
      // 间隔间隔至少1秒
      if (Date.now() - this.tickTimer < 1000) {
        this.playPromise = null;
        return;
      }
      let audio = this.$refs.tick;

      try {
        if (this.playPromise) {
          this.playPromise.then(() => audio.pause()).catch(err => {});
        }
        audio.currentTime = 0;
        this.playPromise = audio.play();
        this.tickTimer = Date.now();
      } catch (err) {}
    },
    //倒數結束
    finish (lottery) {
      this.$root.fetchServerDate();
      this.$emit('finish')

      const { curIssue } = this.lottery;
      const { category } = this;
      this.$store.dispatch('refreshInfo', {category}).then(data => {
        if (this.lottery.curIssue == curIssue) {
          return this.adjustIssue(category);
        }
        this.modal = true
        setTimeout(() => {
          this.modal = false;
          document.body.style.overflow = '';
        }, 3000)
      })

      this.$bus.$emit('changeOpenStatus', false);
      this.$bus.$emit('triggerLoopNum');

      setTimeout(this.getEndTime, COUNTDOWN_INTERVAL, lottery)
      // TODO:
      if (/^\w?HKSIX$/.test(category)) {
        lotteryApi.issue({ params: { category: 'HKSIX' } }).then(data => {
        if (data.code != 0) return;
        this.getGapTime({category, countdown: data});
      });
      }
    },
    // 校正期号
    adjustIssue(category) {
      setTimeout(() => {
        this.$store.dispatch('refreshInfo', {category}).then(() => {
          this.modal = true
          setTimeout(() => {
            this.modal = false;
            document.body.style.overflow = '';
          }, 3000)
        });
      }, 2000);
    },
    // 传统&官方玩法的切换
    changePlayType() {
      this.$parent.pageLoading = true;
      this.$parent.savePlayType();
      this.$parent.fetchLotteryMode();
      this.$parent.updateComponent();
      this.$parent.emptyAllCart();
    } 
  },
  watch: {
    websocketMessage({open_lottery, open_code_list, open_issue}) {
      if (this.category != open_lottery) return
      this.$bus.$emit('changeOpenStatus', true);

      setTimeout(() => {
        this.$parent.isFinish = true;
        this.$store.commit(ACCOUNT.BETSTATE); // 修改投注状态，用于更新用户财富信息
      }, 8000);
      setTimeout(() => this.$parent.isFinish = false, 9000);

      this.lottery.openNum = open_code_list
      this.lottery.openIssue = open_issue
      // recently
      let exit = this.lottery.recently.find(item => item.issue == open_issue)
      if (exit) return
      this.lottery.recently.unshift({
        openNum: open_code_list,
        issue: open_issue
      })
      this.lottery.recently.splice(5)
    },
    //lottery資料父傳子時會有 delay，需要 watch 變化以正確 init
    'lottery.alias': 'init',
    $route(to) {
      this.init();
    }
  }
}
</script>