<template lang="pug">
.lottery_play_wrap
  .left-games
    lottery-info(v-if="showLotteryInfo", :lottery="info" @finish="onFinish")
    lottery-mode(:alias="category", :help="help", @changeModeTpl="renderTemplate")
    .lottery_bet-wrap
      .mode-template.template-v2
        .number-cell(v-for="(item, index) in template", :key="index")
          bet-bar(
            ref="betBar"
            :category="category",
            :mode="mode",
            :modeLabel="modeLabel",
            :betInfo="item",
            @changeSelected="changeSelected"
            :removeItem="removeItem"
            :selectedCount="selectedCount"
            )
      .fn-clear
        //- TMBXM
        Button.fn-right.mb16.ivu-btn-middle(
          v-if="/HKSIX$/.test(category) && mode === 'TMBXM'"
          @click="filter_btnClick"
          type="warning"
          style="margin-right: 68px; font-size: 12px;"
          ) 特别号快速输入
      .bet-cart-wrap.fn-clear
        bet-cart.fn-left(
          :list="cartList"
          :totalCount="betCount"
          :totalCost="betCost"
          :same="same"
          @removeBet="removeBet"
          @emptyCart="emptyCart"
          )
        .fn-left
          Button.ivu-btn-middle(v-if="isStopSales" disabled) 暂停销售
          Button.ivu-btn-middle(
            v-else-if="/^\w?HKSIX$/.test(category) && isHK6Disabled"
            type="primary"
            disabled
            )
            span 开盘
            clocker(:time="gapTime" format="%H : %M : %S" @on-finish="gapFinish")
          Button.ivu-btn-middle(
            v-else
            type="primary"
            @click="submitCheck"
            :loading="submitLoading"
            )
            template(v-if="!submitLoading") 立即投注
            template(v-else) 请稍等...
          .mb16
          Button.ivu-btn-middle(type="default" @click="onEmpty") 删除全部
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
  Modal(v-model="modal" title="投注确认" @on-ok="submit")
    .bet-modal
      dl.hd
        dd 彩种：
          em(v-text="info.label")
        dd 期号：
          em 第{{info.curIssue}}期
        dd 投注内容：
      .bd
        table
          tbody
            tr(v-for="item in cartList", :key="item.mode + item.nums")
              td [{{item.modeLabel}}] {{item.nums}}
              td ￥{{item.price * item.count}}
      p.ft 投注总金额：
        em.text-error {{betCost}}元
    Button.share-plan(v-if="sharePlanPermission" :loading="sharingPlan" @click="sharePlan")
      span(v-if="!sharingPlan") 发送计划至聊天室
      span(v-if="sharingPlan") 发送计划中
  //- 特别号快速输入
  Modal.hk_filter-modal(v-model="filter_modal" title="特别号快速输入" width="600")
    quick-bet-hk6(@cancel="filter_cancel", @submit="filter_submit")
    div(slot="footer")
</template>

<script>
import SET from 'utils/lottery/kq_index';
import BetBar from 'components/themeMix/BetBar/HK6';
import BetCart from 'components/themeMix/BetCart/Theme2';
import clocker from 'components/themeMix/Clocker/index';
import { mapGetters, mapMutations } from 'vuex';
import mixins from './mixins';
import WebChat from 'components/WebChat';
import LotteryInfo from 'components/themeMix/LotteryInfo';
import RecordList from 'components/themeMix/RecordList';
import QuickBetHk6 from 'components/themeMix/QuickBetHK6';
import BetDrawBar from 'components/BetDrawBar';
import { chatApi } from '@/api';

// 现：HK专用，前：两面盘传统(传统)玩法
export default {
  name: 'LotteryTplBothKQ',
  mixins: [mixins],
  props: {
    // 倒计时结束（刷新记录）
    isFinish: {
      type: Boolean,
      default: false,
    },
    // 显示顶部彩种信息
    showLotteryInfo: {
      type: Boolean,
      default: true,
    }
  },
  components: {
    LotteryInfo,
    BetBar,
    BetCart,
    clocker,
    RecordList,
    QuickBetHk6,
    BetDrawBar,
    WebChat
  },
  data() {
    return {
      info: this.lotteryInfo || {},
      mode: '', // 玩法
      help: {}, // 帮助
      template: [], // 玩法模版数据
      cartList: [], // 购物车
      removeItem: {}, // 购物车移除的项

      modal: false,
      submitLoading: false, // 确认投注
      // isFinish: false, // 倒计时结束（刷新记录）

      same: {
        price: '',
      }, // 统一金额

      // 特别号快速输入
      filter_modal: false,
      isCommissioner: false, //是否為計劃專員
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      sharingPlan: false, //分享計劃開關
      form: {}, //分享注單 & 計劃參數
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'lotteryInfo', 'gapTime', 'isHK6Disabled']),
    betCount() {
      return this.cartList.reduce((pre, cur) => pre + cur.count, 0);
    },
    betCost() {
      return this.cartList.reduce((pre, cur) => (pre * 100 + cur.price * 100 * cur.count) / 100, 0);
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
    ...mapMutations(['getEndTime', 'gapFinish', 'getGapTime']),
    init() {
      window.scrollTo(0, 0);
      const path_match = this.$route.path.match(/(?:\/lottery\/)?(\w+)/);
      this.category = path_match ? path_match[1] : '';
      this.species = this.$root.$getSpecies(this.category);
      this.submitLoading = false;
      this.emptyCart(); // clean cart
      this.updateComponent();
      // 是否加载数据
      this.showLotteryInfo && this.fetchInfo();
    },
    // 获取彩种信息
    fetchInfo() {
      const { category } = this;
      this.$store.dispatch('lotteryInfo', { category }).then(data => {
        // 仅HK6倒计时从接口获取(BHK6、HK6包含endTime、lastEndTime)
        if (/^\w?HKSIX$/.test(category)) {
          this.getGapTime({ category, countdown: data }); // 封盘
        } else {
          this.getEndTime(data);
        }
        this.info = data;
      });
    },
    updateComponent() {
      this.$options.components.LotteryMode = () => {
        const { category } = this;
        let fileName;
        if (/HKSIX$/.test(category)) {
          fileName = 'LotteryModeHK6';
        } else {
          fileName = 'LotteryModeTheme2';
        }
        return import(`components/themeMix/${fileName}`);
      };
    },
    // 渲染模版
    renderTemplate({ mode, modeLabel, subModeObj, price }) {
      this.mode = mode;
      this.modeLabel = modeLabel;
      this.parentPrice = price;

      // change methods
      this.help = {};
      // PK10 => FT
      let { species } = this;
      if (species == 'PK10') species = 'FT';
      const config = SET[species][this.mode];
      for (let o in config) this[o] = config[o];

      const ratios = (subModeObj.ratio + '').split('|');

      this.template = config['tplData'].map(child => {
        if (Array.isArray(child)) {
          const nums = child.reduce((pre, cur) => {
            pre.push(cur.value);
            return pre;
          }, []);
          return {
            empty: true,
            nums,
            ratios,
          };
        }
        child.ratios = null;
        child.ratios = ratios;
        return child;
      });
    },
    // 号码选择 value:Array
    changeSelected({ value }) {
      const { cartList, category, mode } = this;
      // 自选不中
      const isMulti = /HKSIX$/.test(category) && /(LXLW\d+|^LM\d+|ZXBZ|HXHX)/.test(mode);

      const beforeList = cartList.filter(item => item.mode === mode);
      if (!isMulti && (beforeList.length > value.length)) {
        // 删除号码
        const removeItem = beforeList.find((item, idx) => {
          // 最后一位 或者 其他位置
          if (value[idx] == null || item.nums != value[idx].nums) return item;
        });
        if (removeItem) {
          const removeIdx = cartList.findIndex(item => item.mode == mode && item.nums == removeItem.nums);
          cartList.splice(removeIdx, 1);
        }
      } else {
        // 添加数据
        value.forEach(item => {
          const { nums } = item;
          // 查找添加进来的数据
          const isExist = beforeList.find(el => el.nums === nums);
          if (isMulti && isExist) {
            this.$Modal.warning({
              title: '温馨提示',
              content: '已选过该组号码'
            });
            return;
          }
          if (isExist == null) {
            item.count = item.count || 1;
            item.price = '';
            this.removeItem = {}; // 修改删除的状态
            cartList.unshift(item);
          }
        });
      }
    },
    // 删除某个号码方案
    removeBet({ index }) {
      const [removeItem] = this.cartList.splice(index, 1);
      this.removeItem = removeItem;
    },
    // 清空购物车
    emptyCart() {
      this.cartList.splice(0);
      this.removeItem = null; // 删除全部
      this.same.price = '';
      this.form = {} //清除分享注單 & 計劃的參數
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
    // emptyCart() {},
    onFinish() {},
    /**
     * 校验投注列表的金额
     * @param {Array} list 投注列表
     * @returns {Boolean} 全部通过校验为 true
     */
    validatePrice(list) {
      return list.every(item => {
        return this.$parent.checkPrice(item.price);
      });
    },
    submitCheck() {
      const { betCount, betCost, cartList, parentPrice } = this;
      if (!betCount) return this.notice('请先添加投注内容', 'warning');
      if (betCost == 0) return this.notice('请先输入投注金额', 'warning');
      const emptyPrice = cartList.some(item => !item.price);
      if (emptyPrice) return this.notice('请先输入投注金额', 'warning');
      if (!this.validatePrice(cartList)) return;

      this.modal = true;
    },
    submit() {
      const { category, lotteryInfo, cartList } = this;
      const { alias, curIssue } = this.lotteryInfo;
      if (alias != category || curIssue == null) return this.notice('操作失败，请刷新页面重试', 'error');
      this.submitLoading = true;
      let list = JSON.parse(JSON.stringify(cartList));
      let params = {
        category: category,
        betIssue: curIssue,
        list: list.map(item => {
          item.cost = item.price * item.count;
          delete item.price;
          delete item.ratio;
          delete item.modeLabel;
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
            desc: data.msg || '投注失败'
          })
        } else {
          this.$Notice.success({
            title: '系统提示',
            desc: data.msg || '投注成功'
          })

          //發送成功後如果有權限，詢問要不要分享到聊天室
          if (this.shareOrderPermission) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '您是否要分享此注单至聊天室?',
              okText: '分享',
              cancelText: '取消',
              onOk: ()=> {
                //如果只有單一注單才可以分享
                if (this.cartList.length == 1) {
                  this.shareConfig();
                  this.shareBet();
                } else {
                  this.$Notice.error({
                    title: '系统提示',
                    desc: '目前只支持单一注单分享'
                  })
                }
                this.emptyCart();
              },
              onCancel: ()=> {
                this.emptyCart();
              }
            })
          } else {
            this.emptyCart();
          }
        }
      });
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let { price, modeLabel, nums, count, mode } = this.cartList[0];
      this.form.betAmount = price;
      this.form.category = this.category;
      this.form.issue = this.curIssue;
      this.form.list = [];
      this.form.list.push({value: nums, count: count});
      this.form.modeCode = mode;
    },
    // //分享注單
    // // 191119 kyle 405註解
    // shareBet() {
    //   chatApi.shareBet({form: this.form}).then(data => {
    //     switch (data.code) {
    //       case '-1':
    //         this.$Notice.error({
    //           title: '系统提示',
    //           desc: '分享注单失败'
    //         })  
    //         break;
    //       case '107':
    //         this.$Notice.error({
    //           title: '系统提示',
    //           desc: data.msg
    //         })  
    //         break;
    //       default:
    //         this.$Notice.success({
    //           title: '系统提示',
    //           desc: '成功分享注单至聊天室'
    //         })  
    //         break;
    //     }
    //     this.emptyCart();
    //   })
    // },
    //發送計劃至聊天室
    sharePlan() {
      this.sharingPlan = true;
      if (this.cartList.length == 1) {
        this.shareConfig();
        this.$Modal.confirm({
          title: '系统提示',
          content: '您是否要分享此计划至聊天室',
          okText: '分享',
              cancelText: '取消',
          onOk: ()=> {
            chatApi.sharePlan({form: this.form}).then(data => {
              if (data.code != 0) {
                this.$Notice.error({
                  title: '系统提示',
                  desc: '分享计划失败'
                })
              } else {
                this.$Notice.success({
                  title: '系统提示',
                  desc: '成功分享计划至聊天室'
                })
              }
              this.sharingPlan = false;
            })
          },
          onCancel: ()=> {
            this.sharingPlan = false;
          }
        })
      } else {
        this.$Notice.error({
          title: '系统提示',
          desc: '只支持单一注单分享'
        })
        this.sharingPlan = false;
      }
    },
    // 特别号快速输入-提交
    filter_cancel() {
      this.filter_modal = false;
    },
    filter_submit(list) {
      this.filter_modal = false;

      let [ children ] = this.$refs.betBar;
      if (children && children.betNum) {
        let { ratios } = this.template[0]; // ！！！
        let betNum = [];
        let betNumValue = [];
        let cartList = [];
        list.forEach(val => {
          let ratio = ratios[val-1];
          betNum.push(`${val}-${ratio}`);
          betNumValue.push({
            nums: '' + val,
            ratio,
            mode: "TMBXM",
            modeLabel: "特码_选码",
          });
        });
        children.betNum = betNum;
        this.changeSelected({value: betNumValue});
      }
    },
    // 打开 快捷选号
    filter_btnClick() {
      let that = this;
      if (this.cartList.length) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '购物车里已有号码，如用快捷选号会清除掉，是否继续？',
          onOk() {
            that.filter_modal = true;
            that.emptyCart();
          }
        })
      } else {
        this.filter_modal = true;
      }
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

<style lang="scss" scoped>
.lottery_play_wrap .foot {
  margin-top: -60px;
  width: 920px;
  font-size: 14px;
  text-align: center;
  p {
    line-height: 70px;
  }
  em {
    font-style: normal;
  }
  .submit-btn {
    margin-bottom: 40px;
    width: 150px;
    height: 50px;
    font-size: 18px;
    font-weight: 700;
  }
}
.template-v2 {
  margin-right: 68px;
}
.bet-modal {
  font-size: 14px;
  line-height: 32px;
  em {
    font-style: normal;
  }
  dd {
    color: #666;
    em {
      color: #333;
    }
  }
  ul {
    border: 1px solid #ddd;
    height: 130px;
    padding: 0 5px;
    overflow: auto;
  }
  .ft {
    color: #666;
  }
}
</style>
