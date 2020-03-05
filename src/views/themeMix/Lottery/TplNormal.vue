<template lang="pug">
.lottery_play_wrap
  lottery-info(:lottery="info" v-on:finish="onFinish")
  lottery-mode(:alias="category" :help="help" v-on:changeModeTpl="renderTemplate")
  .mode-template
    .number-cell(v-for="(item, index) in template" :key="index")
      bet-bar(:category="category" :mode="mode" :betInfo="item" :index="index" :length="template.length" @changeSelected="changeSelected" @changeSelected_DT="changeSelected_DT" :filterDigits.sync="filterDigits")
  bet-util(:count="count" :mode="mode" :category="category" :parentPrice="parentPrice" v-on:addBet="addBet")
  .divide
  .bet-cart-wrap.fn-clear
    bet-cart.fn-left(ref="betCart" :list="cartList" v-on:removeBet="removeBet" v-on:changeChase="isChase = arguments[0]" v-on:emptyCart="emptyCart")
    .fn-left
      Button(type="success" size="large" @click="submitCheck" :loading="submitLoading")
        template(v-if="!submitLoading")
          Icon(type="checkmark-round")
          |  确认投注
        span(v-else) 请稍等...
      p 总注数：
        span.text-primary-type2(v-text="totalCount")
        |  注
      p 总金额：
        span.text-primary-type2(v-text="totalCost")
        |  元
  chase-list(v-if="isChase" :alias="category" :price="totalCost" v-on:changeStop="isStop = arguments[0]")
  record-list(:alias="category" :curIssue="curIssue" :isRefresh="!submitLoading" :isFinish="isFinish")
  bet-draw-bar(:category="category")
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
          tr(v-for="item in cartList")
            td(v-text="item.label")
            td(v-text="item.unitLabel")
            td(v-html="$root.formatNums(item, 'nums')")
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
import LotteryInfo from 'components/themeMix/LotteryInfo';
import LotteryMode from 'components/themeMix/LotteryMode';
import BetUtil from 'components/themeMix/BetUtil';
import BetCart from 'components/themeMix/BetCart/Normal';
import ChaseList from 'components/themeMix/ChaseList';
import RecordList from 'components/themeMix/RecordList';
import BetDrawBar from 'components/themeMix/BetDrawBar';
import { mapGetters, mapMutations } from 'vuex';
import { chatApi } from '@/api';

const UNIT = { 1: '元', 0.1: '角', 0.01: '分' }

export default {
  name: 'LotteryTplNormal',
  components: {
    LotteryInfo,
    LotteryMode,
    BetUtil,
    BetCart,
    ChaseList,
    RecordList,
    BetDrawBar
  },
  data () {
    return {
      isDev: __DEV__,
      info: this.lotteryInfo || {},
      category: '', // 菜种别名
      mode: '', // 玩法
      help: {}, // 帮助
      template: [], // 玩法模版数据
      selectedList: [],	// 选择的号码列表
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
    chaseTotalCost () { // 追号总共花费
      const price = Number(this.totalCost)
      if (isNaN(price)) return 0
      if (!this.isChase) return 0
      let value = this.formatChaseList.reduce((sum, item) => {
        return sum + item.ratio * price
      }, 0)
      if (value == null) return 0
      return (value).toFixed(2)
    },
    curIssue () {
      return this.lotteryInfo.curIssue
    },
    sharePlanPermission() {
      if (this.appConfig.hasChat == 1 && this.userRoomAccess) {
        if (this.isCommissioner) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    shareOrderPermission() {
      if (this.appConfig.hasChat == 1 && this.userRoomAccess) {
        return true
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
      window.scrollTo(0, 0)
      this.category = this.$route.path.replace(/(\/lottery)?[^\w]/, '')
      this.species = this.$root.$getSpecies(this.category)
      this.submitLoading = false // 按钮状态重置！！！
      this.emptyCart()// clean cart
      this.updateComponent()
      this.fetchInfo()
    },
    fetchInfo () {
      this.$store.dispatch('lotteryInfo', {category: this.category}).then(data => {
        this.getEndTime(data)
        if (data.code == -1) {
          this.notice('数据获取失败', 'error')
          this.info = {}
          return
        }
        this.info = data
      }).catch(err => {
        this.notice('数据获取失败', 'error')
        this.info = {}
      })
    },
    updateComponent () {
      this.$options.components.BetBar = () => {
        return import(`components/themeMix/BetBar/${this.species}`)
      }
    },
    renderTemplate ({mode, modeLabel, subModeObj, price}) {
      this.mode = mode
      this.modeLabel = modeLabel
      this.parentPrice = price

      // change methods
      this.help = {}
      const config = SET[this.species][this.mode]
      for (let o in config) this[o] = config[o]

      // 安徽快3：和值-和值
      // if (/HZHZ/.test(mode)) {}
      const ratios = (subModeObj.ratio+'').split('|')
      this.template = config['tplData'].map(child => {
        child.ratios = null
        child.ratios = ratios
        return child
      })

      // empty selectedList
      this.empty()

      // init selectedList & selectedDigit
      let len = this.template.length
      this.selectedList.splice(0)
      this.selectedDigit.splice(0)
      while (len > 0) {
        this.selectedList.push([])
        this.selectedDigit.push('')
        len--
      }
    },
    changeSelected ({value, index, digit}) {
      this.template[index].empty = !value.length // fix
      this.selectedList.splice(index, 1, value)
      this.selectedDigit[index] = digit
      this.selectedCount()
    },
    // 胆拖
    changeSelected_DT ({value, index, digit}) {
      // 11X5: 组选胆拖、任选胆拖
      // ["3ZUXDT", "3ZUXDT", "3", undefined, index: 3, input: "SMQ3ZUXDT"]
      // ["RXDT2Z", "RXDT2Z", undefined, "2", index: 0, input: "RXDT2Z2"]
      // AHK3: *不同号-胆拖
      // ["BTH3DT", "BTH3DT", undefined, undefined, "3", index: 0, input: "BTH3DT"]
      this.selectedList.splice(index, 1, value)
      const mode = this.mode
      let dt_rex = mode.match(/((\d+)ZUXDT|RXDT(\d+)Z|BTH(\d+)DT)/)
      if (dt_rex) {
        let max = dt_rex[2] ? dt_rex[2] : (dt_rex[3] ? dt_rex[3] : dt_rex[4])
        max = max - 1
        let curIdx = this.selectedList.findIndex(item => item == value)
        this.selectedList.forEach((item, idx) => {
          if (curIdx == 0 && idx == 0 && item.length > max) {
            item.splice(0, item.length - max)
          } else if (idx != curIdx) {
            let lastVal = value[value.length - 1]
            let eqIdx = item.findIndex(n => n == lastVal)
            eqIdx > -1 && item.splice(eqIdx, 1)
          }
        })
      }
      // AHK3: 二同号-单选
      if (/TH2DX/.test(mode)) {
        let curIdx = this.selectedList.findIndex(item => item == value)
        this.selectedList.forEach((item, idx) => {
          if (idx != curIdx) {
            let lastVal = value[value.length - 1]
            lastVal = (+lastVal)%10
            let eqIdx = item.findIndex(n => (+n)%10 == lastVal)
            eqIdx > -1 && item.splice(eqIdx, 1)
          }
        })
      }
      this.changeSelected({value: value, index: index, digit: digit})
    },
    empty () {
      this.template.map(item => item.empty = true)
    },
    addBet ({cost, price, unit}) {
      if (cost == 0) return this.notice('号码选择不完整或金额有误，请重新选择', 'warning')

      let { category, mode, modeLabel, selectedList, selectedDigit, count } = this
      let digit = Object.assign([], selectedDigit)

      // 安徽快3
      if (/[^P]K3$/.test(category) && /^HZHZ$/.test(mode)) {// 和值-和值
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
            unitLabel: UNIT[unit]
          }
          this.cartList.unshift(item)
        })
        this.empty()
        return
      }

      let nums = '', reg = /(Z[A-Z]XHZ|TSH|TH(\d+)[DF]X)$/
      if (reg.test(mode)) { // 直选和值、组选和值 | 三同号-单选、二同号-复选
        nums = selectedList.map(child => child.sort((a, b) => a - b))
      } else {
        nums = selectedList.map(child => Array.isArray(child) ? child.sort((a, b) => a - b) : child)
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
        unitLabel: UNIT[unit]
      }

      // 任选 直选和值、组选和值、组选复式
      let isRXreg = mode.match(/^RX(\d)Z[HU][A-Z0-9]{2,}$/)
      if (isRXreg) {
        item.digits = this.filterDigits.map(item => '万千百十个'.indexOf(item)).sort().join(',')
        item.digitsLabel = item.digits.split(',').map(n => '万千百十个'.charAt(n) + '位').join('、')
      }
      // 任选胆拖
      isRXreg = mode.match(/^RXDT(\d)Z\d$/)
      if (isRXreg) {
        item.digits = isRXreg[1]
      }

      this.cartList.unshift(item)
      this.empty()
    },
    removeBet ({index}) {
      this.cartList.splice(index, 1)
    },
    emptyCart () {
      this.cartList.splice(0);
      this.form = {} //清除分享注單 & 計劃的參數
    },
    submitCheck () {
      if (!this.cartList.length) return this.notice('请先添加投注内容', 'warning')
      if (this.isChase) {
        let list = this.chaseList.filter(item => item.ratio > 0 && item.isSelect)
        list = JSON.parse(JSON.stringify(list))
        const price = this.totalCost
        list = list.map(item => {
          delete item.endtime
          delete item.isSelect
          delete item.digit
          item.cost = (item.ratio * price).toFixed(2)
          return item
        })
        this.formatChaseList = list
      } else {
        this.formatChaseList.splice(0) // fix
      }
      this.modal = true
    },
    submit () {
      let {category, lotteryInfo, curIssue, isStop, cartList, formatChaseList} = this
      if (lotteryInfo.alias != category || curIssue == null) return this.notice('操作失败，请刷新页面重试', 'error')
      this.submitLoading = true
      let list = JSON.parse(JSON.stringify(cartList))
      let params = {
        category: category,
        betIssue: curIssue,
        list: list.map(item => {
          delete item._nums
          delete item.label
          delete item.category
          delete item.price
          delete item.unit
          delete item.unitLabel

          delete item.digit
          if (Array.isArray(item.nums)) item.nums = item.nums.join(',')
          return item
        }),
        isStop: isStop,
        chaseTime: formatChaseList.length,
        chaseList: formatChaseList
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
                this.formatChaseList.splice(0)
              },
              onCancel: ()=> {
                this.emptyCart();
                this.formatChaseList.splice(0)
              }
            })
          } else {
            this.emptyCart();
            this.formatChaseList.splice(0)
          }
        }
      })
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let { price, category, label, count, mode } = this.cartList[0];
      this.form.betAmount = price;
      this.form.category = category;
      this.form.issue = this.curIssue;
      this.form.list = [];
      this.form.list.push({value: label, count: count});
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
    notice (msg, type) {
      this.$Message[type](msg)
    },
    onFinish () {
      // 关闭追号
      this.$refs.betCart.isChase = false
      this.isChase = false
    }
  },
  watch: {
    '$route': 'init',
    filterDigits(cur) {
      this.selectedCount()
    }
  }
}
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
</style>
