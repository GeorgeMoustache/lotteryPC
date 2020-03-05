<template lang="pug">
.lottery-info
  .info-left
    .icon
      img(:src="lottery.icon" :alt="lottery.label")
    dl
      dt(v-text="lottery.label")
      dd(v-show="lottery.totalIssue && !/^HKSIX$/.test(category)" v-html="`总共 <span class='text-primary'>${lottery.totalIssue}</span> 期`")
      dd
        router-link.btn-primary(:to="{path: `/trend/${lottery.alias}`}")
          span 号码走势
        router-link.btn-primary(:to="{path: `/rules/${lottery.alias}`}" target="_blank")
          span 玩法规则
      dd(v-if="/(PK10|FT|SSC)$/.test(lottery.alias)")
        RadioGroup(type="button" size="small" v-model="switchStyle" @on-change="changeStyle")
          Radio(label="0") 传统
          Radio(label="1") 官方
  .info-main
    template(v-if="!isReady")
      p.countdown-tip 距离投注截止还有
      .stop-sales 加载中...
    template(v-else-if="isStopSales")
      p.countdown-tip 距离投注截止还有
      .stop-sales {{stopSalesText}}
    template(v-else)
      p.countdown-tip 第<span class='text-primary'>{{lottery.curIssue}}</span>期已开盘，距离投注截止还有
        //- 开启
        Icon(v-if="audio_play" @click.native="setPlayState(0)" type="android-notifications")
        Icon(v-else @click.native="setPlayState(1)" type="android-notifications-off")
      clocker.count-down(v-if="lottery.endTime" :time="lottery.endTime" @on-finish="finish(lottery)" @on-tick="tick")
        <span class="count-down-num">%H</span>:<span class="count-down-num">%M</span>:<span class="count-down-num">%S</span>
  .info-right
    .show(v-show="issueShowIndex == 0")
      p.label
        span(v-text="lottery.label")
        span.text-primary(v-text="lottery.openIssue")
        span 期
        span.text-primary(v-show="!isOpened") &nbsp;&nbsp;正在开奖
      ul.lottery-balls(v-if="lottery.openNum" :class="openNumCls" v-html="$root.formatOpenNum(lottery)")
    ul.recently(v-show="issueShowIndex == 1")
      li.recently-item(v-for="(item, index) in lottery.recently" :key="index")
        span 第
        span.text-primary(v-text="getIssue(item)")
        span 期开奖号码：
          template(v-if="/28$/.test(category)")
            ul.ball-xs(v-html="$root.format28(item.openNum)")
          template(v-else-if="/HKSIX$/.test(category)")
            ul.ball-xs(v-html="$root.formatHK6(item.openNum)")
          template(v-else-if="/(PK10|FT)$/.test(category)")
            ul.ball-xs.ft-nums
              li.lottery-ball(v-for="(n, i) in item.openNum.split(',')" :key="i" v-text="n", :class="`ball-${n}`")
          template(v-else)
            span.num(v-for="(n, i) in item.openNum.split(',')" :key="i" v-text="n")
    ul.tab
      li.tab-content(@click="toggleIssue(0)" :class="{'active': issueShowIndex == 0 }") 近一期
      li.tab-content(@click="toggleIssue(1)" :class="{'active': issueShowIndex == 1 }") 近五期
  Modal(v-model="modal" title="温馨提示" width="300")
    p.font-lg(v-html="`${lottery.openIssue}期已截止<br>当前期号<span class='text-primary'>${lottery.curIssue}</span><br>投注时请注意期号`")
  <audio ref="tick" controls="controls" hidden="true">
    <source src="@/assets/themeMix/lottery-tick.mp3" type="audio/mpeg">
  </audio>
</template>

<script>
import clocker from 'components/themeMix/Clocker/index';
import { WS, ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapMutations } from 'vuex';
import { lotteryApi } from 'api';
import mixins from '@/views/themeMix/Lottery/mixins';

export default {
  name: 'LotteryInfo',
  mixins: [mixins],
  props: ['lottery'],
  components: {
    clocker
  },
  data () {
    return {
      issueShowIndex: 0,
      modal: false,
      isOpened: false,
      tid: null,
      openNumCls: {},
      category: '',

      // 声音提醒
      tickTimer: 0,
      playPromise: void 0,
      switchStyle: '0',
    }
  },
  created () {
    this.init()
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
    init () {
      //渲染两面盘筛选按钮选中状态 20190611 停用
      // const playStyle = /\/1$/.test(this.$route.path) ? '1' : '0';
      // this.switchStyle = playStyle;
      this.issueShowIndex = 0
      this.category = this.lottery.alias
      this.openNumClsFn()
      if (this.lottery.openNum == '') {
        this.isOpened = false
        this.loopNum()
      } else {
        this.isOpened = true
      }

      //20190611 改用從本地調用已儲存的playType
      this.loadSelectPlayType(this.category);
    },
    loadSelectPlayType(toCategory){
      //載入有紀錄的playType start
      var playType = this.$parent.playType;

      //根據上層決定的原法指定渲染
      this.switchStyle = playType === '/1'? '1':'0'
      // if(this.category){
      //   this.changeStyle(playType === '/1'? '1':'0')
      // }
    },
    tick() {
      if (!this.audio_play) return;
      if (+new Date(this.lottery.endTime) - new Date().setMilliseconds(window.diffTime) <= 5e3) {
        this.palyTick();
      }
    },
    palyTick() {
      // 间隔间隔至少1秒
      if (Date.now() - this.tickTimer < 1e3) {
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
    // countdown
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
        }, 3e3)
      })

      this.isOpened = false
      this.loopNum()

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
          }, 3e3)
        });
      }, 2e3);
    },
    openNumClsFn () {
      let { category } = this
      this.openNumCls = {
        'ball-lg': /(SSC|11X5|[^P]K3)$/.test(category),
        'ball-md': /(PK10|FT)$/.test(category),
      }
    },
    loopNum () {
      let that = this
      clearTimeout(this.tid)
      start()

      function start () {
        that.tid = setTimeout(() => {
          if (that.isOpened) return clearTimeout(that.tid)
          that.lottery.openNum = that.randomNum()
          start()
        }, 200)
      }
    },
    randomNum () {
      let category = this.category, ary = [];
      if (/SSC$/.test(category)) {
        for (let i = 0; i < 5; i++) {
          ary.push(rand())
        }
      } else if (/(PK10|FT)$/.test(category)) {
        for (let i = 0; i < 10; i++) {
          ary.push(padLeftZero(rand(10, 1)))
        }
      } else if (/11X5$/.test(category)) {
        for (let i = 0; i < 5; i++) {
          ary.push(padLeftZero(rand(11)))
        }
      } else if (/[^P]K3$/.test(category)) {
        for (let i = 0; i < 3; i++) {
          ary.push(rand(6, 1))
        }
      } else if (/28$/.test(category)) {
        for (let i = 0; i < 3; i++) {
          ary.push(rand())
        }
      } else if (/HKSIX$/.test(category)) {
        for (let i = 0; i < 7; i++) {
          ary.push(padLeftZero(rand(49, 1)))
        }
      }

      return ary.join(',')

      function padLeftZero(str) {
        return ('0' + str).substr(-2)
      }
      function rand(max = 9, min = 0) {
        let {floor, random} = Math
        return floor(random() * (max - min + 1)) + min
      }
    },
    toggleIssue (type) {
      this.issueShowIndex = type
    },
    getIssue(item) {
      let { issue } = item;
      return /(PK10|FT)$/.test(this.category) ? (issue + '').substr(-7) : issue;
    },
    // 传统&官方玩法的切换
    changeStyle(value) {
      // 官方链接/1, 传统为默认
      const type = value == 1 ? '/1' : '';

      //儲存最後的玩法
      this.$parent.savePlayType(this.category , type);

      //變更上層紀錄
      this.$parent.playType = type;

      //根據切換轉導
      this.$router.push({path: `/lottery/${this.category}${type}`});
    },
  },
  watch: {
    websocketMessage({open_lottery, open_code_list, open_issue}) {
      if (this.category != open_lottery) return
      this.isOpened = true

      setTimeout(() => {
        this.$parent.isFinish = true;
        this.$store.commit(ACCOUNT.BETSTATE); // 修改投注状态，用于更新用户财富信息
      }, 8e3);
      setTimeout(() => this.$parent.isFinish = false, 9e3);

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
    'lottery.alias': 'init'
  }
}
</script>

<style lang="scss" scoped>
.lottery-info {
  padding: 20px 0 10px 10px;
  @include clearfix();
  line-height: 1;
  font-size: 12px;
}

.info-left {
  overflow: hidden;
  float: left;
  margin-right: 10px;
  .icon {
    overflow: hidden;
    float: left;
    margin-right: 10px;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: #fff;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  dl {
    overflow: hidden;
  }
  dt {
    margin-top: 5px;
    font-size: 16px;
  }
  dd {
    margin-top: 5px;
    font-size: 12px;
  }
}

.btn-primary {
  display: inline-block;
  padding: 3px 0;
  transition: all .2s linear;
  color: $primary-color;
  .ivu-icon {
    margin-right: 5px;
  }
  &:hover,
  &:active {
    text-decoration: underline;
  }
  &:last-child {
    margin-left: 8px;
  }
}

.info-main {
  float: left;
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px #cecece dashed;
  .countdown-tip {
    margin-bottom: 5px;
    text-align: left;
  }
  .stop-sales {
    width: 280px;
    height: 66px;
    line-height: 66px;
    border-radius: 4px;
    background: #666;
    letter-spacing: 5px;
    font-size: 36px;
    text-align: center;
    color: #fff;
  }
  .ivu-icon {
    font-size: 20px;
    color: #a2a4aa;
    cursor: pointer;
  }
}

.info-right {
  position: relative;
  float: left;
  margin-top: -8px;
  padding-right: 25px;
  height: 104px;
  .label {
    margin: 16px 0 10px;
  }
  .tab {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    overflow: hidden;
    li {
      display: inline-block;
      height: 52px;
      padding: 7px 3px;
      color: $primary-type2;
      background: #fff;
      transition: all 0.2s linear;
      border: 1px $primary-type2 solid;
      cursor: pointer;
      &:hover,
      &.active {
        background: $primary-type2;
        color: #fff;
      }
    }
    li:first-child {
      border-radius: 3px 3px 0 0;
    }
    li:last-child {
      border-radius: 0 0 3px 3px;
    }
  }
}
.recently {
  font-size: 12px;
  line-height: 1;
  & > li {
    margin-bottom: 2px;
  }
}
.num {
  vertical-align: middle;
  display: inline-block;
  margin-right: 2px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  font-weight: 400;
  text-align: center;
  background: $primary-type2;
  color: #fff;
}

// 彩票-倒计时
.count-down {
  width: 225px;
  height: 45px;
  background: #000;
  font-family: "digital-7";
  font-size: 45px;
  color: #fff;
  line-height: 1;
  text-align: center;
  span {
    display: inline-block;
    width: 60px;
  }
}
</style>
