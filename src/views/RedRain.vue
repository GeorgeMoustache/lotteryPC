<template lang="pug">
  .redRain__view(ref="wrap")
    .redRain__body(:style="{backgroundImage: `url(${info.bgUrl})`}")
      .redRain__main
        .redRain__inner
          .redRain__countdown
            span.count-down-separator {{countdown.label}}
            clocker.count-down(:time="countdown.dateTime" @on-finish="finish()")
              <span class="count-down-num">%H</span>
              <span class="count-down-separator">小时</span>
              <span class="count-down-num">%M</span>
              <span class="count-down-separator">分</span>
              <span class="count-down-num">%S</span>
              <span class="count-down-separator">秒</span>
          .redRain__win
            .redRain__win-wrap
              marquee(
                behavior="scroll"
                direction="scroll"
                scrollamount="15"
                onmouseover="this.stop();"
                onmouseout="this.start();"
                style="height:100%;width:100%;"
                v-html="winHtml")
    .redRain__rules
      .redRain__main(v-html="info.rules")
    .mask(v-show="activeStep1 || activeStep2")
    .step1.redpacket__popup.flip(v-show="activeStep1")
      .redpacket__popup-content
        a.redpacket__popup-close(@click="close(1)")
        p.redpacket__popup-title 您还有{{grabNum}}次机会
        a.step1-btn(@click="grabRedRain")
    .step2.redpacket__popup.flip(v-show="activeStep2")
      .redpacket__popup-content
        a.redpacket__popup-close(@click="close(2)")
        p.redpacket__popup-title 恭喜发财，大吉大利!
        p.step2-foot
          | 红包
          em {{amount}}
          | 元
</template>

<script>
import { redRainApi } from 'api';
import clocker from 'components/themeMix/Clocker/index';
import animationInit from 'utils/redRain';
const NUMS = 80;

export default {
  name: "RedRain",
  components: {
    clocker
  },
  data() {
    return {
      // 基本信息
      info: {
        bgUrl: "",
        startTime: "",
        endTime: "",
        rules: ""
      },
      winHtml: "", // 中奖列表
      grabNum: 0, // 抢次数
      amount: "00.00", // 金额
      activeStep1: 0, // 窗口1
      activeStep2: 0, // 窗口2
      busy: 0, // 阻止频繁提交

      isInit: false,
      countdown: {
        type: "other",
        label: "",
        dateTime: "2019-01-01 12:00:00"
      }
    };
  },
  created() {
    this.fetchData();
    this.fetchWinData();
  },
  beforeRouteLeave(to, from, next) {
    this.removeLeafElements();
    next();
  },
  methods: {
    // 获取页面数据
    async fetchData() {
      this.isInit = false;
      const res = await redRainApi.info();
      this.isInit = true;
      const { code, msg, info } = res;
      if (code != 0) return this.notice(msg);
      let { startTime, endTime } = info;
      const nowTime = new Date().setMilliseconds(window.diffTime);
      let start_time = new Date(startTime.replace(/-/g, "/")).getTime();
      let end_time = new Date(endTime.replace(/-/g, "/")).getTime();
      if (start_time >= nowTime) {
        this.countdown = {
          type: "start",
          label: "开始时间:",
          dateTime: startTime
        };
      } else if (start_time <= nowTime && nowTime <= end_time) {
        this.countdown = {
          type: "end",
          label: "剩余时间:",
          dateTime: endTime
        };
        this.init();
      }
      this.info = info;
    },

    // 获取中奖列表数据
    async fetchWinData() {
      const res = await redRainApi.userRedRain();
      const { code, msg, list } = res;
      if (code != 0) return this.notice(msg);
      let ary = list.split(",").map(item => {
        let [user, money] = item.split("|");
        return `恭喜${user}获得现金${money}元`;
      });
      this.winHtml = ary.join("&nbsp;&nbsp;&nbsp;&nbsp;");
    },

    // 红包初始化
    init() {
      animationInit(NUMS);
      let that = this;
      // TODO: 取消事件
      const oWrap = document.getElementById("app");
      that.oWrap = oWrap;
      oWrap.addEventListener(
        "click",
        function(e) {
          let event = e || window.event;
          let target = event.target || event.srcElement;
          if (/(leaf|redPacet)/.test(target.className)) {
            that.getRedRain();
          }
        },
        false
      );
    },

    // 倒计时结束
    finish() {
      const { type } = this.countdown;
      const that = this;
      let fn = {
        other() {},
        start() {
          that.countdown = {
            type: "end",
            label: "剩余时间:",
            dateTime: that.info.endTime
          };
          that.init();
        },
        end: this.removeLeafElements
      };
      fn[type]();
    },

    // 获取红包次数
    async getRedRain() {
      if (this.busy) return;
      this.busy = 1;
      try {
        let res = await redRainApi.getRedRain();
        this.busy = 0;
        let { code, msg, grabNum } = res;
        if (code != 0) {
          return this.$Modal.warning({
            title: "温馨提醒",
            content: msg || "您今天无抽奖资格！"
          });
        }
        this.grabNum = grabNum;
        this.activeStep1 = 1;
      } catch (error) {
        this.busy = 0;
      }
    },

    // 抢红包
    async grabRedRain() {
      if (this.busy) return;
      if (!this.grabNum) {
        return this.$Modal.warning({
          title: "温馨提醒",
          content: "您今天无抽奖资格！"
        });
      }
      this.busy = 1;
      try {
        let res = await redRainApi.grabRedRain();
        this.busy = 0;
        let { code, msg, amount } = res;
        if (code != 0) {
          return this.notice(msg);
        }
        this.amount = amount;
        this.activeStep1 = 0;
        this.activeStep2 = 1;
      } catch (error) {
        this.busy = 0;
      }
    },

    // 关闭红包
    close(index) {
      this[`activeStep${index}`] = 0;
    },

    // 移除红包元素
    removeLeafElements() {
      for (var i = 0; i < NUMS; i++) {
        var div = document.getElementById(`leaf_${i}`);
        div && div.parentNode && div.parentNode.removeChild(div);
        div = null;
      }
    },

    // 提示
    notice(msg, type = "warning") {
      this.$Message[type](msg);
    }
  }
};
</script>

<style lang="scss" scoped>
.redRain {
  &__view {
    width: 100% !important;
    background: url('~assets/redRain/bg.png') repeat;
  }
  &__body {
    overflow: hidden;
    height: 688px;
    background: no-repeat center #6d0101;
  }
  &__main {
    margin: 0 auto;
    width: 1040px;
  }
  &__inner {
    padding-top: 365px;
  }
  &__countdown {
    position: absolute;
    margin-top: 145px;
    width: 535px;
    height: 165px;
    left: 50%;
    margin-left: -262px;
    text-align: center;
  }
  &__win {
    overflow: hidden;
    position: absolute;
    top: 600px;
    margin-left: 180px;
    height: 40px;
    width: 652px;
    background: url('~assets/redRain/lb_bg.png') center no-repeat;
  }
  &__win-wrap {
    width: 510px;
    height: 40px;
    text-align: left;
    font-size: 14px;
    line-height: 40px;
    color: #fff;
    margin-left: 130px;
    font-weight: 700;
  }
  &__rules {
    margin: 0px auto;
    padding: 20px 0 60px;
    font-size: 14px;
    font-weight: 700;
    line-height: 2;
    color: #fff;
  }
}
.count-down-separator {
  color: #fff;
  font-size: 32px;
}
.count-down-num {
  margin: 0px 10px;
  padding: 2px 5px;
  height: 48px;
  border: 3px solid #e8170f;
  border-radius: 10px;
  background-color: #680502;
  color: #ffe349;
  font-size: 32px;
}
.subbtn {
  display: block;
  margin: 0 auto;
  margin-top: (618/2) * 1px;
  width: (342/2) * 1px;
  height: (96/2) * 1px;
  background: url('~assets/redRain/subbtn.png') no-repeat;
  background-size: contain;
}
.mask {
  z-index: 50;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
.flip {
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateX(0);
  backface-visibility: hidden;
  transform: translateX(0);
}
.redpacket__popup {
  z-index: 50;
  position: fixed;
  left: 50%;
  top: 50%;
  width: (576/2) * 1px;
  height: (780/2) * 1px;
  border-radius: 6px;
  margin-left: (288/2) * -1px;
  margin-top: (390/2) * -1px;
  background: url('~assets/redRain/packet.png') no-repeat;
  background-size: contain;
  &-content {
    position: relative;
    padding-top: (343/2) * 1px;
    height: (437/2) * 1px;
    text-align: center;
  }
  &-close {
    position: absolute;
    top: -25px;
    right: -25px;
    width: 51px;
    height: 51px;
    background: url('~assets/redRain/close.png') no-repeat;
    background-size: contain;
  }
  &-title {
    font-size: 23px; /*px*/
    line-height: 1;
    color: #fff;
  }
}
.step1-btn {
  position: absolute;
  left: 50%;
  top: (468/2) * 1px;
  width: (360/2) * 1px;
  height: (111/2) * 1px;
  margin-left: (180/2) * -1px;
  background: url('~assets/redRain/open.png') no-repeat;
  background-size: contain;
}
.step2-foot {
  margin-top: 45px;
  font-size: 15px; /*px*/
  line-height: 1;
  color: #fff;
  em {
    font-size: 45px; /*px*/
    color: #fff100;
    font-style: normal;
  }
}
@keyframes Updown {
  from {
    margin-top: -0.32rem;
  }
  to {
    margin-top: 0rem;
  }
}
</style>

<style lang="scss">
.leaf {
  z-index: 40;
  position: absolute;
  animation-iteration-count: 1, 1;
  animation-direction: normal, normal;
  animation-timing-function: linear, ease-in;
  backface-visibility: hidden;
  & > i {
    display: block;
    width: 64px;
    height: 88px;
    background: url('~assets/redRain/petal.png') no-repeat;
    background-size: contain;
  }
}
@keyframes fade {
  0%,
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes drop {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, 1100px, 0);
  }
}
@keyframes clockwiseSpin {
  0% {
    transform: none;
  }
  100% {
    transform: rotate(480deg);
  }
}
@keyframes counterclockwiseSpinAndFlip {
  0% {
    transform: none;
  }
  100% {
    transform: rotate(-480deg);
  }
}
</style>
