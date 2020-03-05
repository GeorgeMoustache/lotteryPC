<template lang="pug">
.lottery_play_wrap
  .left-games
    lottery-info(v-if="showLotteryInfo", :lottery="info" @finish="onFinish")
    lottery-mode(:alias="category" :help="help" v-on:changeModeTpl="renderTemplate")
    .lottery_bet-wrap
      .mode-template
        //- 单式
        template(v-if="/_M?DS$/.test(mode)")
          bet-single(:category="category" :mode="mode" :betInfo="template[0]", @changeSelected="changeSelected_single" :filterDigits.sync="filterDigits")
        .number-cell(v-else v-for="(item, index) in template" :key="index")
          bet-bar(:category="category" :mode="mode" :betInfo="item" :index="index" :length="template.length" @changeSelected="changeSelected" @changeSelected_DT="changeSelected_DT" :filterDigits.sync="filterDigits")
      bet-util(:count="count" :mode="mode" :category="category" :parentPrice="parentPrice" v-on:addBet="addBet")
      .bet-cart-wrap.fn-clear
        bet-cart.fn-left(ref="betCart" :list="cartList" :totalCount="totalCount" :totalCost="totalCost" @removeBet="removeBet" @changeChase="isChase = arguments[0]" @emptyCart="emptyCart")
        .fn-left
          template(v-if="isStopSales")
            Button.ivu-btn-middle(disabled) 暂停销售
          template(v-else)
            Button.ivu-btn-middle(type="primary" @click="submitCheck" :loading="submitLoading")
              template(v-if="!submitLoading") 确认投注
              span(v-else) 请稍等...
          .mb16
          Button.ivu-btn-middle(type="default" @click="onEmpty") 删除全部
      chase-list(v-if="isChase" :alias="category" :price="totalCost" v-on:changeStop="isStop = arguments[0]")
      record-list(:alias="category" :curIssue="curIssue" :isRefresh="!submitLoading" :isFinish="isFinish")
  //- 浮動 List 功能
  .right-games
    .switch
      a.draw-bar(v-if="drawBarButtonEnabled" @click="openBetDrawBar()") 开奖公告
      a.trend-ball(v-if="trendBallButtonEnabled" @click="openTrendBallList()") 路单
    .wrap
      BetDrawBar(ref="BetDrawBar" :category="category")
      TrendBallList(ref="TrendBallList" :category="category")
      WebChat
  Modal(v-model="modal" width="1000" @on-ok="submit")
    .modal-main(v-if="modal")
      p(slot="header") 投注确认
      p.modal-hd
        Icon(type="help-circled")
        span(v-if="chaseTotalCost != 0" v-text="`确定要追号 ${formatChaseList.length} 期？`")
        span(v-else-if="curIssue" v-text="`您确定加入 ${curIssue} 期？`")
      .modal-bd
        table.modal-table
          tr
            th 玩法
            th 单位
            th 内容
            th 位置
            th 金额
          tr(v-for="(item, index) in cartList")
            td(v-text="item.label")
            td(v-text="item.unitLabel")
            td(v-if="item.nums")
              template(v-if="/_M?DS$/.test(item.mode)")
                template(v-if="item.nums.join(',').length > 100")
                  p.ds_betnums(:class="{ellipsis2: !item.showMore}") {{item.nums.join(',')}}
                    a(@click="toggleDSDetails(item, index)") {{item.viewMoreText || '...展开'}}
                template(v-else) {{item.nums.join(',')}}
              template(v-else)
                p(v-html="formatNums(item, 'nums')")
            td
              span(v-if="item.digits" v-text="item.digitsLabel")
            td(v-text="item.cost")
      b.text-warning(v-text="`投注总金额: ${chaseTotalCost != 0 ? chaseTotalCost : totalCost} 元`")
      Button.share-plan(v-if="sharePlanPermission" :loading="sharingPlan" @click="sharePlan")
        span(v-if="!sharingPlan") 发送计划至聊天室
        span(v-if="sharingPlan") 发送计划中
</template>

<script>
import SET from 'utils/lottery/index';
import LotteryMode from 'components/themeMix/LotteryMode';
import BetUtil from 'components/themeMix/BetUtil';
import BetCart from 'components/themeMix/BetCart/Normal';
import { mapGetters, mapMutations } from 'vuex';
import mixins from './mixins';
import WebChat from 'components/WebChat';
import LotteryInfo from 'components/themeMix/LotteryInfo';
import ChaseList from 'components/themeMix/ChaseList';
import RecordList from 'components/themeMix/RecordList';
import BetDrawBar from 'components/BetDrawBar';
import TrendBallList from 'components/TrendBallList';
import BetSingle from 'components/themeMix/BetBar/SSC_DS';

import { chatApi } from '@/api';

const UNIT = { 1: '元', 0.1: '角', 0.01: '分' };

const rxqh_reg = /^(RX|Q|H)(\d)Z[HU][A-Z0-9]{2,}$/; // (任选前后) 直选和值、组选和值、组选复式
const rxds_reg = /^RX(\d)\w+_M?DS$/; // (任选单式)
const rxBdKd_reg = /^RX([0-9])ZX[BK]D$/; //（任选）组选包胆、直选跨度

// 两面盘官方玩法
export default {
  name: 'LotteryTplBothGF',
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
    },
  },
  components: {
    LotteryInfo,
    LotteryMode,
    BetUtil,
    BetCart,
    ChaseList,
    RecordList,
    BetDrawBar,
    TrendBallList,
    BetSingle,
    WebChat,
  },
  data() {
    return {
      isDev: __DEV__,
      info: this.lotteryInfo || {},
      category: '', // 菜种别名
      mode: '', // 玩法
      subModeObj: {}, // 玩法数据对象
      help: {}, // 帮助
      template: [], // 玩法模版数据
      selectedList: [], // 选择的号码列表
      selectedDigit: [], // 选择的位置
      count: 0, // 注数
      cartList: [],
      isChase: false,
      isStop: true,
      modal: false, // 弹窗
      submitLoading: false, // 确认投注(刷新记录)
      formatChaseList: [], // 格式化后的追号
      filterDigits: [],

      showDraw: false, // 显示开奖公告
      parentPrice: 10,
      isCommissioner: false, //是否為計劃專員
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      sharingPlan: false, //分享計劃開關
      form: {}, //分享注單 & 計劃參數
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'requesting', 'error', 'lotteryInfo', 'chaseList']),
    totalCount() {
      return this.cartList.reduce((pre, item) => (pre += item.count), 0);
    },
    totalCost() {
      let value = this.cartList.reduce((pre, item) => (pre += +item.cost), 0);
      if (isNaN(value)) return 0;
      return value.toFixed(2);
    },
    chaseTotalCost() {
      // 追号总共花费
      const price = Number(this.totalCost);
      if (isNaN(price)) return 0;
      if (!this.isChase) return 0;
      let value = this.formatChaseList.reduce((sum, item) => {
        return sum + item.ratio * price;
      }, 0);
      if (value == null) return 0;
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
        return true;
      } else {
        return false;
      }
    },
    //路單按鈕開關
    trendBallButtonEnabled() {
      if (this.appConfig.bet_history_analysis == 1) {
        if (/SSC/.test(this.category)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(['getEndTime']),
    init() {
      window.scrollTo(0, 0);
      const path_match = this.$route.path.match(/(?:\/lottery\/)?(\w+)/);
      this.category = path_match ? path_match[1] : '';

      //載入有紀錄的playType
      var playType = this.$parent.playType;

      //根據上層決定玩法轉換
      if (playType == '') {
        this.$router.push({ path: `/lottery/${this.category}${playType}` });
      }

      let species = this.$root.$getSpecies(this.category);
      if (species === 'FT') species = 'PK10';
      this.species = species;
      this.submitLoading = false; // 按钮状态重置！！！species
      this.emptyCart(); // clean cart
      this.updateComponent();
      // 是否加载数据
      this.showLotteryInfo && this.fetchInfo();
    },
    fetchInfo() {
      this.$store
        .dispatch('lotteryInfo', { category: this.category })
        .then(data => {
          this.getEndTime(data);
          if (data.code == -1) {
            this.notice('数据获取失败', 'error');
            this.info = {};
            return;
          }
          this.info = data;
        })
        .catch(err => {
          this.notice('数据获取失败', 'error');
          this.info = {};
        });
    },
    updateComponent() {
      this.$options.components.BetBar = () => {
        return import(`components/themeMix/BetBar/${this.species}`);
      };
    },
    renderTemplate({ mode, modeLabel, subModeObj, price }) {
      this.mode = mode;
      this.modeLabel = modeLabel;
      this.parentPrice = price;
      this.subModeObj = subModeObj;

      // change methods
      this.help = {};
      const config = SET[this.species][this.mode];
      if (config == null) {
        log('未配置玩法方法');
        return;
      }

      for (let o in config) this[o] = config[o];

      // 安徽快3：和值-和值
      // if (/HZHZ/.test(mode)) {}
      const ratios = (subModeObj.ratio + '').split('|');

      // 单式
      const isDS = /SSC$/.test(this.category) && /_M?DS$/.test(this.mode);
      if (isDS) {
        this.template.splice(0);
        this.template = [
          {
            empty: true,
            ratios,
          },
        ];
      } else {
        this.template = config['tplData'].map(child => {
          child.ratios = null;
          child.ratios = ratios;
          return child;
        });
      }

      // empty selectedList
      this.empty();

      // init selectedList & selectedDigit
      let len = this.template.length;
      this.selectedList.splice(0);
      this.selectedDigit.splice(0);
      if (!isDS) {
        while (len > 0) {
          this.selectedList.push([]);
          this.selectedDigit.push('');
          len--;
        }
      }
    },
    changeSelected({ value, index, digit }) {
      this.template[index].empty = !value.length; // fix
      this.selectedList.splice(index, 1, value);
      this.selectedDigit[index] = digit;
      this.selectedCount();
    },
    // 胆拖
    changeSelected_DT({ value, index, digit }) {
      // 11X5: 组选胆拖、任选胆拖
      // ["3ZUXDT", "3ZUXDT", "3", undefined, index: 3, input: "SMQ3ZUXDT"]
      // ["RXDT2Z", "RXDT2Z", undefined, "2", index: 0, input: "RXDT2Z2"]
      // AHK3: *不同号-胆拖
      // ["BTH3DT", "BTH3DT", undefined, undefined, "3", index: 0, input: "BTH3DT"]
      this.selectedList.splice(index, 1, value);
      const mode = this.mode;
      let dt_rex = mode.match(/((\d+)ZUXDT|RXDT(\d+)Z|BTH(\d+)DT)/);
      if (dt_rex) {
        let max = dt_rex[2] ? dt_rex[2] : dt_rex[3] ? dt_rex[3] : dt_rex[4];
        max = max - 1;
        let curIdx = this.selectedList.findIndex(item => item == value);
        this.selectedList.forEach((item, idx) => {
          if (curIdx == 0 && idx == 0 && item.length > max) {
            item.splice(0, item.length - max);
          } else if (idx != curIdx) {
            let lastVal = value[value.length - 1];
            let eqIdx = item.findIndex(n => n == lastVal);
            eqIdx > -1 && item.splice(eqIdx, 1);
          }
        });
      }
      // AHK3: 二同号-单选
      if (/TH2DX/.test(mode)) {
        let curIdx = this.selectedList.findIndex(item => item == value);
        this.selectedList.forEach((item, idx) => {
          if (idx != curIdx) {
            let lastVal = value[value.length - 1];
            lastVal = +lastVal % 10;
            let eqIdx = item.findIndex(n => +n % 10 == lastVal);
            eqIdx > -1 && item.splice(eqIdx, 1);
          }
        });
      }
      this.changeSelected({ value: value, index: index, digit: digit });
    },
    // 单式
    changeSelected_single({ list, singleStr }) {
      this.template[0].empty = !singleStr.length; // 内容是否为空
      this.selectedList = list;
      this.singleStr = singleStr;
      this.selectedCount();
    },
    empty() {
      this.template.map(item => (item.empty = true));
    },
    addBet({ cost, price, unit }) {
      if (cost == 0) return this.notice('号码选择不完整或金额有误，请重新选择', 'warning');

      let { category, mode, modeLabel, selectedList, selectedDigit, count } = this;
      let digit = Object.assign([], selectedDigit);

      // 单次最多投注注数
      const { single_max_count } = this.subModeObj;
      if (single_max_count != null && count > single_max_count) {
        return this.notice(`您输入的注数为:${count},当前彩种玩法单次投注最多:${single_max_count}注!`, 'warning');
      }

      // 时时彩-单式
      if (/SSC$/.test(category) && /_M?DS$/.test(mode)) {
        let filters = this.validate(this.singleStr);
        if (filters.msg) {
          return this.$Message.warning(filters.msg);
        }
        let item = {
          mode,
          nums: filters.list,
          count,
          cost: (price * unit * count).toFixed(2), // fix
          // 用于UI显示
          label: modeLabel,
          category,
          digit,
          price,
          unit,
          unitLabel: UNIT[unit],
        };
        this.getDigits(item);
        this.cartList.unshift(item);
        // empty
        this.count = 0; // TODO: 应该有更好的方式
        this.empty();
        return;
      }

      // 安徽快3
      if (/[^P]K3$/.test(category) && /^HZHZ$/.test(mode)) {
        // 和值-和值
        selectedList[0].forEach(el => {
          let item = {
            mode: mode,
            nums: el.value,
            count: 1,
            cost: (price * unit).toFixed(2), // fix
            ratio: el.ratio, // !!!
            // 用于UI显示
            _nums: el.value,
            label: modeLabel,
            category: category,
            digit: digit,
            price: price,
            unit: unit,
            unitLabel: UNIT[unit],
          };
          this.cartList.unshift(item);
        });
        this.empty();
        return;
      }

      let nums = '',
        reg = /(Z[A-Z]XHZ|TSH|TH(\d+)[DF]X)$/;
      if (reg.test(mode)) {
        // 直选和值、组选和值 | 三同号-单选、二同号-复选
        nums = selectedList.map(child => child.sort((a, b) => a - b));
      } else {
        nums = selectedList.map(child => (Array.isArray(child) ? child.sort((a, b) => a - b) : child));
      }

      let item = {
        mode: mode,
        nums: nums.map(item => item.join(reg.test(mode) ? ',' : '')).join(','),
        count: count,
        cost: cost,
        // 用于UI显示
        _nums: nums,
        label: modeLabel,
        category: category,
        digit: digit,
        price: price,
        unit: unit,
        unitLabel: UNIT[unit],
      };
      this.getDigits(item);
      this.cartList.unshift(item);
      this.empty();
    },
    // 获取位置数据
    getDigits(obj) {
      const { mode } = this;
      // 任选（直选和值、组选和值、组选复式 | 单式 | 胆拖 | 组选包胆、直选跨度）
      let rex = rxqh_reg.test(mode) || rxds_reg.test(mode) || /^RXDT(\d)Z\d$/.test(mode) || rxBdKd_reg.test(mode);
      if (rex) {
        obj.digits = this.filterDigits
          .map(item => '万千百十个'.indexOf(item))
          .sort()
          .join(',');
        obj.digitsLabel = obj.digits
          .split(',')
          .map(n => '万千百十个'.charAt(n) + '位')
          .join('、');
      }
    },
    removeBet({ index }) {
      this.cartList.splice(index, 1);
    },
    emptyCart() {
      this.cartList.splice(0);
      this.form = {}; //清除分享注單 & 計劃的參數
    },
    submitCheck() {
      if (!this.cartList.length) return this.notice('请先添加投注内容', 'warning');
      if (this.isChase) {
        let list = this.chaseList.filter(item => item.ratio > 0 && item.isSelect);
        list = JSON.parse(JSON.stringify(list));
        const price = this.totalCost;
        list = list.map(item => {
          delete item.endtime;
          delete item.isSelect;
          delete item.digit;
          item.cost = (item.ratio * price).toFixed(2);
          return item;
        });
        this.formatChaseList = list;
      } else {
        this.formatChaseList.splice(0); // fix
      }
      this.modal = true;
    },
    submit() {
      let { category, lotteryInfo, curIssue, isStop, cartList, formatChaseList } = this;
      if (lotteryInfo.alias != category || curIssue == null) return this.notice('操作失败，请刷新页面重试', 'error');
      this.submitLoading = true;
      let list = JSON.parse(JSON.stringify(cartList));

      // 投注数组
      let betList = [];
      list.forEach(item => {
        const { category, mode, cost, nums, count, digits } = item;
        // ssc-单式
        if (/SSC$/.test(category) && /_M?DS$/.test(mode)) {
          let splitAry = nums;
          let { length } = splitAry;
          let _cost = cost / length;
          // 直选单式的使用","分割号码
          if (/_MDS$/.test(mode)) {
            splitAry = splitAry.map(str => str.split('').join(','));
          }
          betList.push({
            cost,
            count,
            digits,
            mode,
            nums: splitAry.join('|'),
          });
          return;
        }

        delete item._nums;
        delete item.label;
        delete item.category;
        delete item.price;
        delete item.unit;
        delete item.unitLabel;

        delete item.digitsLabel;
        delete item.digit;

        if (Array.isArray(item.nums)) {
          item.nums = item.nums.join(',');
        }
        betList.push(item);
      });

      let params = {
        category: category,
        betIssue: curIssue,
        list: betList,
        isStop: isStop,
        chaseTime: formatChaseList.length,
        chaseList: formatChaseList,
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
                if (this.cartList.length == 1) {
                  this.shareConfig();

                  //直選單式特別處理
                  let value = this.form.list[0].value;
                  if (Array.isArray(value)) {
                    if (value.length == 1) {
                      let strValue = value[0];
                      let arrValue = strValue.split('');
                      let newValue = arrValue.join(',');
                      this.form.list[0].value = newValue;
                      this.shareBet();
                    } else {
                      this.$Notice.error({
                        title: '系统提示',
                        desc: '目前只支持单一注单分享',
                      });
                    }
                  } else {
                    this.shareBet();
                  }
                } else {
                  this.$Notice.error({
                    title: '系统提示',
                    desc: '目前只支持单一注单分享',
                  });
                }
                this.emptyCart();
                this.formatChaseList.splice(0);
              },
              onCancel: () => {
                this.emptyCart();
                this.formatChaseList.splice(0);
              },
            });
          } else {
            this.emptyCart();
            this.formatChaseList.splice(0);
          }
        }
      });
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let { price, category, label, nums, count, mode } = this.cartList[0];
      this.form.betAmount = price;
      this.form.category = category;
      this.form.issue = this.curIssue;
      this.form.list = [];
      this.form.list.push({ value: nums, count: count });
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
      this.$Message[type]({
        content: msg,
        duration: 3,
      });
    },
    onFinish() {
      // 关闭追号
      this.$refs.betCart.isChase = false;
      this.isChase = false;
    },
    // 格式化号码
    formatNums(item, props) {
      const { category, mode } = item;
      return this.$root.formatNums(item, props);
    },
    toggleDSDetails(item, index) {
      item.showMore = !item.showMore;
      item.viewMoreText = item.showMore ? '收起' : '...展开';
      this.cartList.splice(index, 1, item);
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
    },
  },
  watch: {
    $route: 'init',
    filterDigits(cur) {
      this.selectedCount();
    },
    isFinish(cur, old) {
      if (this.showLotteryInfo) return;
      if (cur) {
        this.$refs.betCart.isChase = false;
        this.isChase = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-hd {
  text-align: center;
  .ivu-icon {
    margin-right: 5px;
    vertical-align: middle;
    font-size: 30px;
    color: #f90;
  }
}
.ds_betnums {
  max-width: 600px;
}
</style>
