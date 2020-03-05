<template lang="pug">
.lottery_play_wrap
  .left-games
    lottery-mode(:alias="category", @changeModeTpl="renderTemplate")
    util-submit(v-if="!isStopSales" :price.sync='quickPrice')
    bet-bar(
      :category="category"
      :mode="mode"
      :modeObj="modeObj"
      :price.sync="quickPrice"
      :betList.sync="betList"
      )
    util-submit(v-if="!isStopSales" :price.sync='quickPrice')
    .lottery_bet-wrap
      record-list(
        :alias="category"
        :curIssue="curIssue"
        :isRefresh="!submitLoading"
        :isFinish="isFinish"
        )
  //- 浮動 List 功能
  .right-games
    .switch
      a.draw-bar(v-if="drawBarButtonEnabled" @click="openBetDrawBar()") 开奖公告
      a.trend-ball(v-if="trendBallButtonEnabled" @click="openTrendBallList()") 路单
    .wrap
      BetDrawBar(ref="BetDrawBar" :category="category")
      TrendBallList(ref="TrendBallList" :category="category")
      WebChat
  Modal(v-model="betModal" title="投注确认" @on-ok="submit")
    .bet-modal
      dl.hd
        dd 彩种：
          em(v-text="info.label")
        dd 期号：
          em 第{{info.curIssue}}期
        dd 投注内容：
      ul.bd
        table(v-if="betList.length")
          tr(v-for="item in betList", :key="item.mode + item.label")
            td {{`[${modeLabel}_${item.subModeLabel}] ${item.label}`}}
            td 金额：{{Number(item.price).toFixed(2)}}
            td 赔率：{{item.ratio}}
      p.ft 投注总金额：
        em.text-error {{betCost}}元
    Button.share-plan(v-if="sharePlanPermission" :loading="sharingPlan" @click="sharePlan")
      span(v-if="!sharingPlan") 发送计划至聊天室
      span(v-if="sharingPlan") 发送计划中
</template>

<script>
import LotteryMode from 'components/themeMix/LotteryModeCT';
import UtilSubmit from './UtilCtSubmit';
import { mapGetters } from 'vuex';
import mixins from './mixins';
import WebChat from 'components/WebChat';
import RecordList from 'components/themeMix/RecordList';
import BetDrawBar from 'components/BetDrawBar';
import TrendBallList from 'components/TrendBallList';
import { chatApi } from '@/api';

export default {
  name: 'LotteryTplBothCT',
  mixins: [mixins],
  props: {
    // 倒计时结束（刷新记录）
    isFinish: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LotteryMode,
    UtilSubmit,
    RecordList,
    BetDrawBar,
    TrendBallList,
    WebChat,
  },
  data() {
    return {
      modeObj: {}, // 分类
      mode: '', // 玩法
      quickPrice: '', // 快捷筹码

      betList: [], // 投注列表
      betModal: false, // 弹窗
      submitLoading: false, // 确认投注(刷新记录)
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      allowSendMsg: true, //使用者是否有發言的權限
      isCommissioner: false, //是否為計劃專員
      sharingPlan: false, //分享計劃開關
      form: {}, //分享注單 & 計劃參數
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'lotteryInfo']),
    info() {
      return this.lotteryInfo || {};
    },
    betCost() {
      let value = this.betList.reduce((pre, cur) => (pre * 100 + cur.price * 100) / 100, 0);
      return value.toFixed(2);
    },
    curIssue() {
      return this.lotteryInfo.curIssue;
    },
    //分享計劃權限
    sharePlanPermission() {
      if (this.appConfig.hasChat == 1 && this.userRoomAccess) {
        if (this.isCommissioner && this.allowSendMsg) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    //分享注單權限
    shareOrderPermission() {
      if (this.appConfig.hasChat == 1 && this.userRoomAccess) {
        if (this.allowSendMsg) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    //開獎公告按鈕開關
    drawBarButtonEnabled() {
      if (this.appConfig.hasBetDrawBar == '1') {
        return true
      } else {
        return false
      }
    },
    //路單按鈕開關
    trendBallButtonEnabled() {
      if (this.appConfig.bet_history_analysis == 1) {
        if (/SSC/.test(this.category)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      window.scrollTo(0, 0);
      const path_match = this.$route.path.match(/(?:\/lottery\/)?(\w+)/);
      this.category = path_match ? path_match[1] : '';

      this.betList.splice(0);
      this.updateComponents();

      //載入有紀錄的playType
      var playType = this.$parent.playType;

      //根據上層決定玩法轉換
      if (playType == '/1') {
        this.$router.push({ path: `/lottery/${this.category}${playType}` });
      }
    },
    updateComponents() {
      let { category } = this;
      let speciesCategory = this.$root.$getSpecies(category);
      if (speciesCategory == 'FT') speciesCategory = 'PK10';

      this.$options.components.BetBar = () => {
        return import(`components/themeMix/BetBar/CT_${speciesCategory}`);
      };
    },
    // 渲染模版
    renderTemplate({ mode, modeObj, modeLabel, subModeObj, price }) {
      this.modeObj = modeObj;
      this.modeLabel = modeLabel;
      this.mode = mode;
    },
    submit() {
      const { category, lotteryInfo, betList } = this;
      const { alias, curIssue } = this.lotteryInfo;
      if (alias != category || curIssue == null) return this.notice('操作失败，请刷新页面重试', 'error');
      this.submitLoading = true;
      let list = JSON.parse(JSON.stringify(betList));
      let params = {
        category: 'CT' + category, // 传统玩法前缀
        betIssue: curIssue,
        list: list.map(item => {
          item.cost = item.price;
          item.count = 1;
          item.nums = item.label;
          delete item.activeCls;
          delete item.price;
          delete item.ratio;
          delete item.subModeLabel;
          delete item.label;
          return item;
        }),
        isStop: true,
        chaseTime: 0,
        chaseList: [],
      };
      this.$store.dispatch('submitBet', params).then(data => {
        this.submitLoading = false;
        if (data.code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: data.msg || '投注失败',
          });
        } else {
          this.$Notice.success({
            title: '系统提示',
            desc: data.msg || '投注成功',
          });

          //發送成功後如果有權限，詢問要不要分享到聊天室
          if (this.shareOrderPermission) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '您是否要分享此注单至聊天室?',
              okText: '分享',
              cancelText: '取消',
              onOk: () => {
                //如果只有單一注單才可以分享
                if (this.betList.length == 1) {
                  this.shareConfig();
                  this.shareBet();
                } else {
                  this.$Notice.error({
                    title: '系统提示',
                    desc: '目前只支持单一注单分享',
                  });
                }
                this.betList.splice(0);
              },
              onCancel: () => {
                this.betList.splice(0);
              },
            });
          } else {
            this.betList.splice(0);
          }
        }
      });
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let { price, label, mode } = this.betList[0];
      this.form.betAmount = price;
      this.form.category = 'CT' + this.category;
      this.form.issue = this.curIssue;
      this.form.list = [];
      this.form.list.push({ value: label, count: 1 });
      this.form.modeCode = mode;
    },
    // //分享注單
    // // 191119 kyle 405註解
    // shareBet() {
    //   chatApi.shareBet({form: this.form}).then(data => {
    //     switch (data.code) {
    //       case '0':
    //         this.$Notice.success({
    //           title: '系统提示',
    //           desc: '成功分享注单至聊天室'
    //         })
    //         break;
    //       case '-1':
    //         this.$Notice.error({
    //           title: '系统提示',
    //           desc: '分享注单失败'
    //         })
    //         break;
    //       default:
    //         this.$Notice.error({
    //           title: '系统提示',
    //           desc: data.msg
    //         })
    //         break;
    //     }
    //     this.betList.splice(0);
    //   })
    // },
    //發送計劃至聊天室
    sharePlan() {
      this.sharingPlan = true;
      if (this.betList.length == 1) {
        this.shareConfig();
        this.$Modal.confirm({
          title: '系统提示',
          content: '您是否要分享此计划至聊天室',
          okText: '分享',
          cancelText: '取消',
          onOk: () => {
            chatApi.sharePlan({ form: this.form }).then(data => {
              if (data.code != 0) {
                this.$Notice.error({
                  title: '系统提示',
                  desc: '分享计划失败',
                });
              } else {
                this.$Notice.success({
                  title: '系统提示',
                  desc: '成功分享计划至聊天室',
                });
              }
              this.sharingPlan = false;
            });
          },
          onCancel: () => {
            this.sharingPlan = false;
          },
        });
      } else {
        this.$Notice.error({
          title: '系统提示',
          desc: '只支持单一注单分享',
        });
        this.sharingPlan = false;
      }
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
    //開獎公告開關
    openBetDrawBar() {
      this.$refs.BetDrawBar.showDraw = !this.$refs.BetDrawBar.showDraw;
      this.$refs.TrendBallList.show = false;
    },
    //路單開關
    openTrendBallList() {
      this.$refs.TrendBallList.show = !this.$refs.TrendBallList.show;
      this.$refs.BetDrawBar.showDraw = false;
    }
  },
  watch: {
    $route: 'init',
  },
};
</script>
