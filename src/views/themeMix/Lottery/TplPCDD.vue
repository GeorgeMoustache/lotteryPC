<template lang="pug">
.lottery_play_wrap
  .left-games
    lottery-info(:lottery="info", @finish="onFinish")
    lottery-mode(:alias="category" :help="help" @changeModeTpl="renderTemplate")
    .lottery_bet-wrap
      .mode-template
        bet-bar(:alias="category" :mode="mode" :empty="empty" @changeSelected="changeSelected")
      .bet-cart-wrap.fn-clear
        bet-cart.fn-left(ref="betCart" :list="cartList" :totalCount="totalCount" :totalCost="totalCost" @removeBet="removeBet" @emptyCart="emptyCart" :showChaseSwitch="false")
        .fn-left
          template(v-if="isStopSales")
            Button.ivu-btn-middle(disabled) 暂停销售
            .mb16
          template(v-else)
            Button.ivu-btn-middle(type="warning" @click="addBet") 添加注单
            .mb16
            Button.ivu-btn-middle(type="primary" @click="submitCheck" :loading="submitLoading")
              template(v-if="!submitLoading") 确认投注
              span(v-else) 请稍等...
            .mb16
            Button.ivu-btn-middle(type="default" @click="onEmpty") 删除全部
      record-list(
        v-bind:alias="category"
        v-bind:curIssue="curIssue"
        v-bind:isRefresh="!submitLoading"
        v-bind:isFinish="isFinish"
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
  Modal(v-model="modal" @on-ok="submit")
    p(slot="header") 投注确认
    .modal-bd
      table.modal-table
        template(v-for="(list, key) in modalObj")
          tr
            th(:rowspan="list.length")
              b.text-warning(v-text="key")
            td
              b.text-success(v-text="`${list[0].nums}:`")
              em.text-gray ￥
              span(v-text="list[0].cost")
          tr(v-for="(item, idx) in list" v-if="idx")
            td
              b.text-success(v-text="`${item.nums}:`")
              em.text-gray ￥
              span(v-text="item.cost")
    b.text-warning(v-text="`投注总金额: ${totalCost} 元`")
    Button.share-plan(v-if="sharePlanPermission" :loading="sharingPlan" @click="sharePlan")
      span(v-if="!sharingPlan") 发送计划至聊天室
      span(v-if="sharingPlan") 发送计划中
</template>

<script>
import LotteryInfo from 'components/themeMix/LotteryInfo';
import LotteryMode from 'components/themeMix/LotteryMode';
import BetBar from 'components/themeMix/BetBar/PCDD';
import BetCart from 'components/themeMix/BetCart/PCDD';
import mixins from './mixins';
import { mapGetters, mapMutations } from 'vuex';
import WebChat from 'components/WebChat';
import RecordList from 'components/themeMix/RecordList';
import BetDrawBar from 'components/BetDrawBar';
import { chatApi } from '@/api';

export default {
  name: 'LotteryTplPCDD',
  components: {
    LotteryInfo,
    LotteryMode,
    BetBar,
    BetCart,
    RecordList,
    BetDrawBar,
    WebChat
  },
  mixins: [mixins],
  data () {
    return {
      info: this.lotteryInfo || {},
      mode: '', // 玩法
      selectedList: [],	// 选择的号码列表
      cartList: [],
      empty: true,
      modal: false, // 弹窗
      submitLoading: false, // 确认投注
      modalObj: {},
      help: {}, // 帮助

      isFinish: false, // 倒计时结束（刷新记录）
      isCommissioner: false, //是否為計劃專員
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      sharingPlan: false, //分享計劃開關
      form: {} //分享注單 & 計劃參數
    }
  },
  computed: {
    ...mapGetters(['appConfig', 'requesting', 'error', 'lotteryInfo', 'chaseList']),
    totalCount () {
      return this.cartList.reduce((pre, item) => pre += item.count, 0)
    },
    totalCost () {
      let value = this.cartList.reduce((pre, item) => pre += (+item.cost), 0)
      if (isNaN(value)) return 0
      return value.toFixed(2)
    },
    curIssue () {
      return this.lotteryInfo.curIssue
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
  created () {
    this.init()
  },
  methods: {
    ...mapMutations(['getEndTime']),
    init () {
      this.category = this.$route.path.replace(/(\/lottery)?[^\w]/, '')
      this.submitLoading = false
      this.fetchInfo()
    },
    fetchInfo () {
      this.$store.dispatch('lotteryInfo', {category: this.category}).then(data => {
        this.getEndTime(data)
        this.info = data
      })
    },
    changeSelected ({value}) {
      this.empty = false
      this.selectedList = value
    },
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
    addBet () {
      let { category, info, curIssue, selectedList } = this
      if (!selectedList.length) return this.notice('您未选择任何号码', 'warning');
      if (!this.validatePrice(selectedList)) return;

      this.sortList(selectedList)

      selectedList.map(item => {
        this.cartList.unshift({
          categoryLabel: info.label,
          category: category,
          mode: item.alias,
          label: item.label,
          nums: item.value,
          count: 1,
          cost: item.price,
          price: item.price,
          ratio: item.ratio,
          unit: 1,
          unitLabel: '元',
        })
      })

      selectedList.splice(0)
      this.emptyBet()
    },
    sortList(list) {
      let compare = [
          ["大", "小", "单", "双", "大单", "小单", "大双", "小双", "极大", "极小"],
          ["红波", "绿波", "蓝波"],
        ]
      list.sort((a, b) => a.index - b.index)
      list.sort((a, b) => {
        if (a.index != b.index) return 0
        let idx = a.index
        switch (idx) {
          // 混合&波色
          case 1:
          case 2:
            idx = idx - 1
            var aIdx = compare[idx].findIndex(el => el == a.value)
            var bIdx = compare[idx].findIndex(el => el == b.value)
            return aIdx - bIdx
          // 特码
          case 4:
            return a.value - b.value
            break;
          default:
            return 0
            break;
        }
      })
    },
    removeBet ({index}) {
      this.cartList.splice(index, 1)
    },
    emptyBet() {
      this.empty = true
    },
    emptyCart () {
      this.cartList.splice(0);
      this.form = {} //清除分享注單 & 計劃的參數
    },
    submitCheck () {
      const { cartList } = this;
      if (!cartList.length) return this.notice('请先添加投注内容', 'warning');

      let obj = {}
      cartList.forEach(item => {
        let label = item.label
        if (obj[label] == null) obj[label] = []
        obj[label].push({
          nums: item.nums,
          cost: item.cost
        })
      })
      this.modalObj = obj
      this.modal = true
    },
    submit () {
      this.submitLoading = true
      let {category, info, curIssue, cartList} = this

      let list = JSON.parse(JSON.stringify(cartList))
      let params = {
        category: category,
        betIssue: curIssue,
        list: list.map(item => {
          delete item.categoryLabel
          delete item.label
          if (Array.isArray(item.nums)) item.nums = item.nums.join(',')
          return item
        }),
        isStop: false,
        chaseTime: 0,
        chaseList: []
      }
      this.$store.dispatch('submitBet', params).then(data => {
        this.submitLoading = false
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
      })
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let { price, category, label, nums, count, mode } = this.cartList[0];
      this.form.betAmount = price;
      this.form.category = category;
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
    //     this.formatChaseList.splice(0)
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
    onFinish () {
    },
    renderTemplate ({mode, modeLabel, subModeObj, price}) {
      this.mode = mode
      this.modeLabel = modeLabel
      this.parentPrice = price
      this.subModeObj = subModeObj
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
    '$route': 'init'
  }
}
</script>

<style lang="scss" scoped>
.modal-bd {
  height: 250px;
}
.modal-table {
  th {
    width: 200px;
    text-align: center;
  }
  td b {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
}
</style>
