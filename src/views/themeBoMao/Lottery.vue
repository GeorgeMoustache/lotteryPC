<template lang="pug">
.container.lottery-wrap(:class="[aliasClass, groupClass]")
  .layout-wrap
    .head
      LotteryInfo(:lottery="info" :playType="playType" :isReady="isReady" :isStopSales="isStopSales" @finish="onFinish()")
      CurrentOpen(:lottery="info")
      .links
        router-link(:to="{path: `/rules/${info.alias}`}") 玩法说明
        router-link(:to="{path: `/trend/${info.alias}`}") 走势图
        router-link(:to="{path: /(HKSIX)$/.test(this.alias) ? `/trend/${info.alias}` : `/drawNotice/${info.alias}`}") 最近开奖
    .body-outer
      .body-inner
        LotteryMode(:playType="playType" :useTemplate="useTemplate" :modeList="modeList" :modeSelect="modeSelect")
        .play-outer
          .play-inner
            //- 玩法說明
            .mode-help(v-if="modeHelpEnabled") 玩法提示：{{help.desc}}
              .ratio(v-if="ratio") 赔率：
                b {{ratio}}
              .tooltip
                Tooltip(v-if="help.example" placement="top" :content="help.example")
                  Icon(type="navicon")
                  | 范例
                Tooltip(v-if="help.explain" placement="top" :content="help.explain")
                  Icon(type="ios-information")
                  | 中奖说明
            //- TplBothCT 
            template(v-if="useTemplate == 'tplCT'")
              UtilSubmit(v-if="!isStopSales" :price.sync='quickPrice')
              BetBar(:category="alias" :mode="subModeAlias" :modeObj="modeObj" :price.sync="quickPrice" :betList.sync="betList")
              UtilSubmit(v-if="!isStopSales" :price.sync='quickPrice')
            //- TplBothGF
            template(v-if="useTemplate == 'tplGF'")
              //- 单式玩法 
              template(v-if="/_M?DS$/.test(subModeAlias)")
                BetSingle(:category="alias" :mode="subModeAlias" :betInfo="template[0]" @changeSelected="changeSelected_single" :filterDigits.sync="filterDigits")
              //- 一般玩法
              .bet-bar-group(v-else v-for="(item, index) in template" :key="index")
                BetBar(:category="alias" :mode="subModeAlias" :betInfo="item" :index="index" :length="template.length" @changeSelected="changeSelected" @changeSelected_DT="changeSelected_DT" :filterDigits.sync="filterDigits")
              BetUtil(:count="count" :mode="subModeAlias" :category="alias" :parentPrice="parentPrice" v-on:addBet="addBet")
            //- TplBothKQ
            template(v-if="useTemplate == 'tplKQ'")
              .bet-bar-group(v-for="(item, index) in template" :key="index")
                BetBar(ref="betBar" :category="alias" :mode="subModeAlias" :modeLabel="modeLabel" :betInfo="item" @changeSelected="changeSelectedKQ" :removeItem="removeItem" :selectedCount="selectedCount")
              Button.special-number(v-if="/HKSIX$/.test(alias) && subModeAlias === 'TMBXM'" @click="filter_btnClick()") 特别号快速输入
            //- TplBothPCDD
            template(v-if="useTemplate == 'tplPCDD'")
              BetBar(:alias="alias" :mode="subModeAlias" :empty="emptyPCDD" @changeSelected="changeSelectedPCDD")
              .bet-util-pcdd
                p 总注数：
                  .number {{totalCount}} 
                  | 注，总金额：
                  .number {{totalCost}}
                  | 元
                Button(v-if="isStopSales" disabled) 暂停销售
                Button.addcart(@click="addBetPCDD()") 添加注单
          RecentlyOpen(:lottery="lotteryInfo")
        //- 購物車 + 追號
        .cart-wrap(v-if="useTemplate != 'tplCT'")
          //- 官方模式
          BetCart(v-if="useTemplate == 'tplGF'" ref="betCart" :list="cartList" :totalCount="totalCount" :totalCost="totalCost" @removeBet="removeBet()" @changeChase="isChase = arguments[0]" @emptyCart="emptyCart()")
          //- 六合彩用
          BetCart(v-if="useTemplate == 'tplKQ'" :list="cartList" :totalCount="betCountKQ" :totalCost="betCostKQ" :same="same" @removeBet="removeBet()" @emptyCart="emptyCart()")
          //- PC蛋蛋用
          BetCart(v-if="useTemplate == 'tplPCDD'" ref="betCart" :list="cartList" :totalCount="totalCount" :totalCost="totalCost" @removeBet="removeBet()" @emptyCart="emptyCart()")
          //- 追號
          template(v-if="useTemplate == 'tplGF'")
            ChaseList(v-if="isChase" :alias="alias" :price="totalCost" v-on:changeStop="isStop = arguments[0]")
        //- 投注記錄
        RecordList(:alias="alias" :curIssue="info.curIssue" :isRefresh="!submitLoading" :isFinish="isFinish")
        //- 開獎公告 + 路單 面板
        .float-panel
          BetDrawBar(ref="BetDrawBar" :category="alias")
          TrendBallList(ref="TrendBallList" :category="alias")
      //- 開獎公告 + 路單 按鈕
      .float-switch
        a.draw-bar(v-if="drawBarButtonEnabled" @click="openBetDrawBar()") 最近开奖
        a.trend-ball(v-if="trendBallButtonEnabled" @click="openTrendBallList()") 路单
  //- 特别号快速输入 (六合彩用)
  Modal(v-model="filter_modal" title="特别号快速输入" width="600")
    QuickBetHk6(@submit="filter_submit" @cancel="filter_cancel")
    div(slot="footer")
  //- 確認投注彈窗
  Modal(v-model="betModal" title="投注确认" @on-ok="submit()" ok-text="确认投注")
    .bet-modal
      //- 傳統模式用
      template(v-if="useTemplate == 'tplCT'")
        .info
          p 彩种：
            em(v-text="info.label")
          p 期号：
            em 第{{info.curIssue}}期
        .content
          .title 投注内容：
          .list
            table(v-if="betList.length")
              tr(v-for="item in betList", :key="item.mode + item.label")
                td {{`[${modeLabel}_${item.subModeLabel}] ${item.label}`}}
                td 金额：{{Number(item.price).toFixed(2)}}
                td 赔率：{{item.ratio}}
          .total 投注总金额：
            span {{betCost}}元
      //- 官方模式用
      template(v-if="useTemplate == 'tplGF'")
        .info
          p(v-if="chaseTotalCost != 0")
            em {{`确定要追号 ${formatChaseList.length} 期？`}}
          p(v-else-if="curIssue")
            em {{`您确定加入 ${curIssue} 期？`}}
        .content
          .title 投注内容：
          .list
            table
              tr
                td 玩法
                td 单位
                td 内容
                td 位置
                td 金额
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
          .total 投注总金额：
            span {{`${chaseTotalCost != 0 ? chaseTotalCost : totalCost}`}} 元
      //- 六合彩用
      template(v-if="useTemplate == 'tplKQ'")
        .info
          p 彩种：
            em(v-text="info.label")
          p 期号：
            em 第{{info.curIssue}}期
        .content
          .title 投注内容：
          .list
            table
              tbody
                tr(v-for="item in cartList", :key="item.mode + item.nums")
                  td [{{item.modeLabel}}] {{item.nums}}
                  td ￥{{item.price * item.count}}
          .total 投注总金额：
            span {{betCostKQ}}元
      //- PC蛋蛋用
      template(v-if="useTemplate == 'tplPCDD'")
        .content 
          .title 投注内容：
          .list
            table
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
          .total 投注总金额：
            span {{totalCost}}元
    Button.share-plan(v-if="sharePlanPermission" :loading="sharingPlan" @click="sharePlan")
      span(v-if="!sharingPlan") 发送计划至聊天室
      span(v-if="sharingPlan") 发送计划中
  //- 換彩種 loading 效果
  Spin(size="large" fix v-if="pageLoading") 
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { lotteryApi, chatApi } from '@/api';
import mixins from 'utils/mixins/bet';
import LotteryInfo from '@/components/themeBoMao/Lottery/LotteryInfo';
import CurrentOpen from '@/components/themeBoMao/Lottery/CurrentOpen';
import LotteryMode from '@/components/themeBoMao/Lottery/LotteryMode';
import UtilSubmit from 'components/themeBoMao/Lottery/UtilCtSubmit';
import SETGF from 'utils/lottery/index';
import SETKQ from 'utils/lottery/kq_index';
import BetSingle from 'components/themeBoMao/Lottery/BetBar/SSC_DS';
import BetUtil from 'components/themeBoMao/Lottery/BetUtil';
import ChaseList from 'components/themeBoMao/Lottery/ChaseList';
import QuickBetHk6 from 'components/themeBoMao/Lottery/QuickBetHK6';
import RecentlyOpen from 'components/themeBoMao/Lottery/RecentlyOpen';
import RecordList from 'components/themeBoMao/Lottery/RecordList';
import BetDrawBar from 'components/BetDrawBar';
import TrendBallList from 'components/TrendBallList';

//各種單位組合 (官方模式)
const UNIT = { 1: '元', 0.1: '角', 0.01: '分' };
const rxqh_reg = /^(RX|Q|H)(\d)Z[HU][A-Z0-9]{2,}$/; // (任选前后) 直选和值、组选和值、组选复式
const rxds_reg = /^RX(\d)\w+_M?DS$/; // (任选单式)
const rxBdKd_reg = /^RX([0-9])ZX[BK]D$/; //（任选）组选包胆、直选跨度

export default {
  name: 'Lottery',
  components: {
    LotteryInfo,
    CurrentOpen,
    LotteryMode,
    UtilSubmit,
    BetSingle,
    QuickBetHk6,
    BetUtil,
    ChaseList,
    RecentlyOpen,
    RecordList,
    BetDrawBar,
    TrendBallList
  },
  mixins: [mixins],
  inject: ['ivNotice'],
  data() {
    return {
      alias: '', //alias
      templateClass: '', //樣版對應 className
      groupClass: '', //彩種大分類 className
      aliasClass: '', //彩種對應 className
      info: {}, //彩種資料
      help: '', //玩法說明
      isFinish: false, //是否已開獎
      isStop: true, //官方玩法中獎後停止追號
      pageLoading: true, //更換頁面loading狀態
      
      //兩面盤玩法類別 (傳統CT || 官方GF)
      playType: {
        type: ''
      }, 
      
      //玩法模式列表
      modeList: {
        main: [],
        sub: []
      },

      //選擇玩法模式
      modeSelect: {
        main: '',
        sub: ''
      },

      //傳送給子元件使用的參數
      modeObj: {}, //主玩法模式整個 object
      subModeObj: {}, //次玩法模式整個 object
      subModeAlias: '', //次玩法模式的 alias

      //傳統模式使用參數
      quickPrice: '', //快捷筹码
      betList: [], //投注列表
      modeLabel: '', //主玩法標籤名稱

      //官方模式使用參數
      count: 0, // 注数
      parentPrice: 0,
      template: [], // 玩法模版数据
      selectedList: [],	// 选择的号码列表
      selectedDigit: [], // 选择的位置
      cartList: [],
      isChase: false,
      formatChaseList: [], // 格式化后的追号
      filterDigits: [],

      //六合彩使用參數
      same: {
        price: '', // 统一金额
      },
      removeItem: {}, // 购物车移除的项
      filter_modal: false, // 特别号快速输入彈窗

      //PCDD 使用參數
      modalObj: {},
      emptyPCDD: true,
      
      //確認投注彈窗
      betModal: false,

      submitLoading: false, //確認送出投注，同時刷新資料

      //分享至聊天室參數
      sharingPlan: false, //分享計劃開關
      form: {}, //分享注單 & 計劃參數
    }
  },
  computed: {
    ...mapGetters(['lotteryInfo', 'appConfig', 'chaseList']),
    //狀態是否已就緒
    isReady() {
      return this.alias != null;
    },
    //是否暫停銷售
    isStopSales: {
      get() {
        let { lotteryInfo = {} } = this; // fix: pk10,ssc官方玩法
        let { curIssue = '' } = Object.assign({}, lotteryInfo, this.info);
        curIssue = '' + curIssue;
        return !curIssue.length; // 是否暂停销售
      },
      set(value) {
        return value;
      },
    },
    //依彩種類型及玩法模式決定使用何種組合模板
    useTemplate() {
      let alias = this.alias;
      let type = this.playType.type;

      if (/(HKSIX)$/.test(alias)) {
        return 'tplKQ';
      } else if (/(28)$/.test(alias)) {
        return 'tplPCDD';
      } else if (/(K3)$/.test(alias)){
        return 'tplGF';
      } else if (/(11X5)$/.test(alias)){
        return 'tplGF';
      } else {
        if (type == 'CT') {
          return 'tplCT'
        } else {
          return 'tplGF';
        }
      }
    },
    //是否顯示玩法說明
    modeHelpEnabled() {
      let playType = this.playType.type;
      let useTemplate = this.useTemplate;
      
      //如果說明沒內容就隱藏玩法說明整塊
      if (this.help.desc == undefined || this.help.desc == '') {
        return false;
      }

      if (useTemplate == 'tplPCDD' || /SSC$/.test(this.alias) && playType == 'CT') {
        return false
      } else {
        return true
      }
    },
    //玩法說明倍率
    ratio: {
      get: function () {
        const { alias, subModeAlias } = this;
        if (subModeAlias == '') return 0;

        const { ratio } = this.subModeObj;
        let ary = (ratio + '').split('|');

        if (/[^P]K3$/.test(alias) && /HZHZ$/.test(subModeAlias)) return 0;

        if (/SSC$/.test(alias)) {
          ary.sort((a, b) => b - a);
          // 前(后)三组合
          if (/(Q|H)3ZH$/.test(subModeAlias)) {
            return `一等奖：${ary[0]}、二等奖：${ary[1]}、三等奖：${ary[2]}`;
          }
          // 组选和值、组选包胆、任选三组选和值
          if (/(Q|H|RX)3(ZUXHZ|ZXBD)$/.test(subModeAlias) || /(Q|H)3HHZX_DS/.test(subModeAlias)) {
            return `组三：${ary[0]}、组六：${ary[1]}`;
          }
          // 特殊号
          if (/TSH$/.test(subModeAlias)) {
            return `豹子：${ary[0]}、顺子：${ary[1]}、对子：${ary[2]}`;
          }
        }

        //六合彩需隱藏倍率顯示
        if (/(HKSIX|FT|PK10)$/.test(this.alias)) {
          return undefined
        }
        
        return ratio;
      },
      set: function (value) {
        return value;
      }
    },
    //確認投注彈窗中的總投注金額 (傳統模式使用)
    betCost() {
      let value = this.betList.reduce((pre, cur) => (pre * 100 + cur.price * 100) / 100, 0);
      return value.toFixed(2);
    },
    //計算總注數 (官方模式用)
    totalCount () {
      return this.cartList.reduce((pre, item) => pre += item.count, 0)
    },
    //計算總金額 (官方模式用)
    totalCost () {
      let value = this.cartList.reduce((pre, item) => pre += (+item.cost), 0)
      if (isNaN(value)) return 0
      return value.toFixed(2)
    },
    //計算追號總金額 (官方模式用)
    chaseTotalCost () {
      const price = Number(this.totalCost)
      if (isNaN(price)) return 0
      if (!this.isChase) return 0
      let value = this.formatChaseList.reduce((sum, item) => {
        return sum + item.ratio * price
      }, 0)
      if (value == null) return 0
      return (value).toFixed(2)
    },
    //獲取當期期號 (官方模式彈窗用)
    curIssue () {
      return this.lotteryInfo.curIssue
    },
    //計算總注數 (六合彩使用)
    betCountKQ() {
      return this.cartList.reduce((pre, cur) => pre + cur.count, 0);
    },
    //確認投注彈窗中的總投注金額 (六合彩使用)
    betCostKQ() {
      return this.cartList.reduce((pre, cur) => (pre * 100 + cur.price * 100 * cur.count) / 100, 0);
    },
    //取得分享計劃權限
    sharePlanPermission() {
      if (this.appConfig.hasChat == 1 && this.$parent.userRoomAccess) {
        if (this.$parent.isCommissioner) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    //取得分享注單權限
    shareOrderPermission() {
      if (this.appConfig.hasChat == 1 && this.$parent.userRoomAccess) {
        return true
      } else {
        return false
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
        if (/SSC/.test(this.alias)) {
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
    ...mapMutations(['getEndTime']),
    init() {
      this.alias = this.$route.params.alias;
      this.fetchClass();
      this.fetchLotteryInfo();
      this.fetchLotteryMode();
      this.updateComponent();
      this.emptyAllCart();
    },
    //根據頁面 alias 獲取對應 ClassName
    fetchClass() {
      let route = this.$route.path.split('/');
      let currentRoute = route.pop();
      this.aliasClass = currentRoute;
      
      if (/SSC$/.test(this.alias)) {
        this.groupClass = 'SSC';
      } else if (/(FT|PK10)$/.test(this.alias)) {
        this.groupClass = 'PK10'
      } else if (/(28)$/.test(this.alias)) {
        this.groupClass = 'PCDD'
      } else if (/(K3)$/.test(this.alias)) {
        this.groupClass = 'K3'
      } else if (/(HKSIX)$/.test(this.alias)) {
        this.groupClass = 'HKSIX'
      } else if (/(11X5)$/.test(this.alias)) {
        this.groupClass = 'ELEX5'
      }
    },
    //獲取彩種資訊
    fetchLotteryInfo() {
      this.pageLoading = true;
      this.$store.dispatch('lotteryInfo', { category: this.alias }).then(data => {
        this.getEndTime(data);
        this.info = data;
      });
    },
    //獲取玩法模式
    fetchLotteryMode() {
      let alias = this.alias;

      //如果 locatStorage 有記錄 type 就取用，否則就讀取 appConfig 預設值，連預設值都沒有就預設 "傳統"
      if (localStorage.hasOwnProperty('lastMode')) {
        let lastMode = JSON.parse(localStorage.getItem('lastMode'));
        if (lastMode[alias]) {
          this.playType.type = lastMode[alias].playType;
        } else {
          this.playType.type = this.appConfig.defaultPlayType || 'CT';
        }
      } else {
        this.playType.type = this.appConfig.defaultPlayType || 'CT';
      }

      let params = {};
      params.category = alias;

      if (this.useTemplate == 'tplCT') {
        params.tpl = '1';
      } 
      
      lotteryApi.mode({params: params}).then(data => {
        let { code, msg, list } = data;
        if (code != 0) return;

        //取得玩法模式
        this.modeList.main = list;
        let type = this.playType.type;

        //共用初始化動作
        let that = this;
        function defaultSetting() {
          that.modeList.sub = that.modeList.main[0].children;
          that.modeSelect.main = that.modeList.main[0].id;
          that.modeSelect.sub = that.modeList.sub[0].id;
        }

        //判斷使用預設值或 locatStorage 資料 render
        if (localStorage.hasOwnProperty('lastMode')) {
          let lastMode = JSON.parse(localStorage.getItem('lastMode'));
          if (lastMode[alias] && lastMode[alias][type]) {
            this.modeSelect.main = lastMode[alias][type].main;
            this.modeList.main.forEach(item => {
              if (item.id == this.modeSelect.main) {
                this.modeList.sub = item.children
                this.modeSelect.sub = lastMode[alias][type].sub;
              }
            })
          } else {
            defaultSetting();
          }
        } else {
          defaultSetting();
        }

        //依照選取玩法模式取得給子元件的參數
        this.getChildrenParams();

        //依照使用模版渲染對應內容
        this.renderTemplate();

        this.pageLoading = false;
      })
    },
    //依彩種取得不同的元件
    updateComponent () {
      let useTemplate = this.useTemplate;

      let species = this.$root.$getSpecies(this.alias);
      if (species == 'FT') species = 'PK10';
      
      //各彩種投注玩法內容，除傳統模式使用有CT前綴的component外，其餘一律直接對應
      this.$options.components.BetBar = () => {
        if (useTemplate == 'tplCT') {
          return import(`components/themeBoMao/Lottery/BetBar/CT_${species}`)
        } else if (useTemplate == 'tplPCDD') {
          return import(`components/themeBoMao/Lottery/BetBar/PCDD`)
        } else {
          return import(`components/themeBoMao/Lottery/BetBar/${species}`)
        }
      }
      
      //除了傳統模式都需要使用購物車，使用的種類又分為 Normal:官方, Theme2:六合彩, PCDD:蛋蛋
      this.$options.components.BetCart = () => {
        if (useTemplate == 'tplGF') {
          return import(`components/themeBoMao/Lottery/BetCart/Normal`)
        }
        if (useTemplate == 'tplKQ') {
          return import(`components/themeBoMao/Lottery/BetCart/Theme2`)
        }
        if (useTemplate == 'tplPCDD') {
          return import(`components/themeBoMao/Lottery/BetCart/PCDD`)
        }
      }
    },
    //渲染模板內容
    renderTemplate () {
      let useTemplate = this.useTemplate;
      
      //整合後模版需要特別取這個參數修正錯誤，主要對應使用在 utils/lottery 下，錯誤內容如下日後版本改正
      //11X5任選複式、任选胆拖下注與切換時時彩 + K3 三不同號、二不同號下注與切換時時彩
      this.mode = this.subModeAlias
      
      //玩法說明
      this.help = {};
      let desc = '';
      if (/(PK10|FT)$/.test(this.alias)) {
        if (/^SMP/.test(this.subModeAlias)) {
          desc =
            '冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
        // 定位胆
        else if (/^DWD/.test(this.subModeAlias)) {
          desc =
            '预测各名次之号码,所选号码与开奖结果相同即中奖。冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
        // 冠亚军
        else if (/^GYJ/.test(this.subModeAlias)) {
          desc =
            '预测冠军号码与亚军号码相加,所选数字与开奖结果相同即中奖。预测冠军号码与亚军号码相加,所选数字与开奖结果相同即中奖。预测各名次之号码,所选号码与开奖结果相同即中奖。冠军龙虎比较冠军与第十名号码，冠军号码较大为龙、反之为虎，其余情况视为不中奖。亚军龙虎比较亚军与第九名号码。季军龙虎比较季军与第八名号码。第四名龙虎比较第四名与第七名号码。第五名龙虎比较第五名与第六名号码。';
        }
        this.help.desc = desc;
      }

      //官方
      if (useTemplate == 'tplGF') {
        this.parentPrice = this.subModeObj.price;

        let species = this.$root.$getSpecies(this.alias);
        if (species === 'FT') species = 'PK10';
        this.species = species;

        // change methods
        const config = SETGF[this.species][this.subModeAlias];
        for (let o in config) this[o] = config[o]

        // 安徽快3：和值-和值
        // if (/HZHZ/.test(mode)) {}
        const ratios = (this.subModeObj.ratio+'').split('|')

        // 单式
        const isDS = /SSC$/.test(this.alias) && /_M?DS$/.test(this.subModeAlias);
        if (isDS) {
          this.template.splice(0);
          this.template = [{
            empty: true,
            ratios
          }];
        } else {
          this.template = config['tplData'].map(child => {
            child.ratios = null
            child.ratios = ratios
            return child
          })
        }

        // init selectedList & selectedDigit
        let len = this.template.length
        this.selectedList.splice(0)
        this.selectedDigit.splice(0)
        if (!isDS) {
          while (len > 0) {
            this.selectedList.push([])
            this.selectedDigit.push('')
            len--
          }
        }
      }

      //六合彩
      if (useTemplate == 'tplKQ') {
        this.parentPrice = this.subModeObj.price;

        let species = this.$root.$getSpecies(this.alias);
        
        if (species == 'PK10') species = 'FT';
        
        const config = SETKQ[species][this.subModeAlias];
        for (let o in config) this[o] = config[o];

        const ratios = (this.subModeObj.ratio + '').split('|');

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
      }
    },
    //依照選取玩法模式取得給子元件的參數
    getChildrenParams() {
      this.betList.length = 0; //購物車清空 (傳統)
      
      this.modeList.main.forEach(item => {
        if (item.id == this.modeSelect.main) {
          this.modeObj = item;
          this.modeLabel = item.label;
        }
      });
      
      this.modeList.sub.forEach(item => {
        if (item.id == this.modeSelect.sub) {
          this.subModeObj = item;
          this.subModeAlias = item.alias;
          this.modeLabel += '_'+ item.label
        }
      });
    },
    //記錄預設玩法
    savePlayType(fromMode) {
      let alias = this.alias;
      let type = this.playType.type;
      let storeData = {};
      if (localStorage.hasOwnProperty('lastMode')) {
        storeData = JSON.parse(localStorage.lastMode);
        if (storeData[alias]) {
          storeData[alias].playType = type;    
        } else {
          storeData[alias] = {}
        }
      } else {
        storeData[alias] = {}
      }
      
      storeData[alias].playType = type;
      
      if (fromMode) {
        if (type == 'CT') {
          storeData[alias].CT = {};
          storeData[alias].CT.main = this.modeSelect.main;
          storeData[alias].CT.sub = this.modeSelect.sub;
        } else {
          storeData[alias].GF = {};
          storeData[alias].GF.main = this.modeSelect.main;
          storeData[alias].GF.sub = this.modeSelect.sub;
        }
      }
      
      localStorage.setItem('lastMode', JSON.stringify(storeData));
    },
    //號碼選擇 (官方)
    changeSelected ({value, index, digit}) {
      this.template[index].empty = !value.length // fix
      this.selectedList.splice(index, 1, value)
      this.selectedDigit[index] = digit
      this.selectedCount()
    },
    //號碼選擇单式 (官方)
    changeSelected_single({list, singleStr}) {
      this.template[0].empty = !singleStr.length; // 内容是否为空
      this.selectedList = list;
      this.singleStr = singleStr;
      this.selectedCount()
    },
    //號碼選擇胆拖 (官方)
    changeSelected_DT ({value, index, digit}) {
      this.selectedList.splice(index, 1, value)
      const mode = this.subModeAlias;
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
    //號碼選擇 (六合彩)
    changeSelectedKQ({ value }) {
      const { cartList, alias, subModeAlias } = this;
      // 自选不中
      const isMulti = /HKSIX$/.test(alias) && /(LXLW\d+|^LM\d+|ZXBZ|HXHX)/.test(subModeAlias);

      const beforeList = cartList.filter(item => item.mode === subModeAlias);
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
    //號碼選擇 (PC蛋蛋)
    changeSelectedPCDD ({value}) {
      this.emptyPCDD = false;
      this.selectedList = value;
    },
    //開啟特別號快速選號 (六合彩)
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
    //特別號快速選號提交 (六合彩)
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
        this.changeSelectedKQ({value: betNumValue});
      }
    },
    //關閉特別號快速選號 (六合彩)
    filter_cancel() {
      this.filter_modal = false;
    },
    //增加注單至購物車 (官方)
    addBet ({cost, price, unit}) {
      if (cost == 0) return this.ivNotice('warning','号码选择不完整或金额有误，请重新选择')

      let { alias, subModeAlias, modeLabel, selectedList, selectedDigit, count } = this
      let digit = Object.assign([], selectedDigit)

      // 单次最多投注注数
      const { single_max_count } = this.subModeObj
      if (single_max_count != null && count > single_max_count) {
        return this.ivNotice('warning', `您输入的注数为:${count},当前彩种玩法单次投注最多:${single_max_count}注!`);
      }

      // 时时彩-单式
      if (/SSC$/.test(alias) && /_M?DS$/.test(subModeAlias)) {
        let filters = this.validate(this.singleStr);
        if (filters.msg) {
          return this.ivNotice('warning', filters.msg);
        }
        let item = {
          mode: subModeAlias,
          nums: filters.list,
          count: count,
          cost: (price * unit * count).toFixed(2), // fix
          // 用于UI显示
          label: modeLabel,
          category: alias,
          digit: digit,
          price: price,
          unit: unit,
          unitLabel: UNIT[unit]
        };
        this.getDigits(item);
        this.cartList.unshift(item);
        // empty
        this.count = 0; // TODO: 应该有更好的方式
        this.empty();
        return;
      }

      // 安徽快3
      if (/[^P]K3$/.test(alias) && /^HZHZ$/.test(subModeAlias)) {// 和值-和值
        selectedList[0].forEach(el => {
          let item = {
            mode: subModeAlias,
            nums: el.value,
            count: 1,
            cost: (price * unit).toFixed(2), // fix
            ratio: el.ratio, // !!!
            // 用于UI显示
            _nums: el.value,
            label: modeLabel,
            category: alias,
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
      if (reg.test(subModeAlias)) { // 直选和值、组选和值 | 三同号-单选、二同号-复选
        nums = selectedList.map(child => child.sort((a, b) => a - b))
      } else {
        nums = selectedList.map(child => Array.isArray(child) ? child.sort((a, b) => a - b) : child)
      }

      let item = {
        mode: subModeAlias,
        nums: nums.map(item => item.join(reg.test(subModeAlias) ? ',' : '')).join(','),
        count: count,
        cost: cost,
        // 用于UI显示
        _nums: nums,
        label: modeLabel,
        category: alias,
        digit: digit,
        price: price,
        unit: unit,
        unitLabel: UNIT[unit]
      }
      this.getDigits(item);
      this.cartList.unshift(item)
      this.empty()
    },
    //增加注單至購物車 (PC蛋蛋)
    addBetPCDD () {
      let { alias, info, curIssue, selectedList } = this
      if (!selectedList.length) return this.ivNotice('warning', '您未选择任何号码');
      if (!this.validatePrice(selectedList)) return;
      this.sortList(selectedList)

      selectedList.map(item => {
        this.cartList.unshift({
          categoryLabel: info.label,
          category: alias,
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
      
      this.emptyPCDD = true;
    },
    //获取位置数据 (官方)
    getDigits(obj) {
      const { subModeAlias } = this;
      // 任选（直选和值、组选和值、组选复式 | 单式 | 胆拖 | 组选包胆、直选跨度）
      let rex = rxqh_reg.test(subModeAlias) || rxds_reg.test(subModeAlias) || /^RXDT(\d)Z\d$/.test(subModeAlias) || rxBdKd_reg.test(subModeAlias);
      if (rex) {
        obj.digits = this.filterDigits.map(item => '万千百十个'.indexOf(item)).sort().join(',')
        obj.digitsLabel = obj.digits.split(',').map(n => '万千百十个'.charAt(n) + '位').join('、')
      }
    },
    //驗證金額
    validatePrice(list) {
      return list.every(item => {
        return this.checkPrice(item.price);
      });
    },
    //排序清單 PCDD用
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
    //格式化号码 (官方彈窗用)
    formatNums(item, props) {
      const { category, mode } = item;
      return this.$root.formatNums(item, props);
    },
    //單式號碼詳情 (官方彈窗用)
    toggleDSDetails(item, index) {
      item.showMore = !item.showMore;
      item.viewMoreText = item.showMore ? '收起' : '...展开';
      this.cartList.splice(index, 1, item);
    },
    //清空選號內容 (官方)
    empty () {
      this.template.map(item => item.empty = true);
    },
    //清空選號內容 (PC蛋蛋)
    emptyBet() {
      this.emptyPCDD = true
    },
    //移除購物車單筆注單
    removeBet (index) {
      let useTemplate = this.useTemplate;
      this.cartList.splice(index, 1)
      
      //六合彩
      if (useTemplate == 'tplKQ') {
        const [removeItem] = this.cartList.splice(index, 1);
        this.removeItem = removeItem;
      }
    },
    //清空購物車提示
    onEmpty() {
      if (!this.cartList.length) return;
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否清空确认区中所有投注内容？',
        onOk: () => {
          this.emptyCart();
        },
      });
    },
    //清空購物車
    emptyCart () {
      let useTemplate = this.useTemplate;

      this.cartList.splice(0);
      this.form = {} //清除分享注單 & 計劃的參數

      //六合彩
      if (useTemplate == 'tplKQ') {
        this.removeItem = null; // 删除全部
        this.same.price = '';
      }
    },
    //清空所有彩種購物車
    emptyAllCart() {
      this.betList.splice(0);
      this.emptyCart();
      this.formatChaseList.splice(0);
    },
    //確認投注 (非傳統模式共用)
    submitCheck () {
      let useTemplate = this.useTemplate;
      
      //官方
      if (useTemplate == 'tplGF') {
        if (!this.cartList.length) return this.ivNotice('warning', '请先添加投注内容')
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
        
      }
      
      //六合彩
      if (useTemplate == 'tplKQ') {
        const { betCountKQ, betCostKQ, cartList, parentPrice } = this;
        if (!betCountKQ) return this.ivNotice('warning','请先添加投注内容');
        if (betCostKQ == 0) return this.ivNotice('warning','请先输入投注金额');
        const emptyPrice = cartList.some(item => !item.price);
        if (emptyPrice) return this.ivNotice('warning','请先输入投注金额');
        if (!this.validatePrice(cartList)) return;
      }

      //PC蛋蛋
      if (useTemplate == 'tplPCDD') {
        const { cartList } = this;
        if (!cartList.length) return this.ivNotice('warning', '请先添加投注内容');
  
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
      }

      this.betModal = true
    },
    //確認投注
    submit() {
      let useTemplate = this.useTemplate;

      //阻檔彩種 alias 不正確或是沒有獲得當期號正確資訊
      if (this.lotteryInfo.alias != this.alias || this.lotteryInfo.curIssue == null) {
        this.ivNotice('error', '操作失败，请刷新页面重试');
        return
      }

      this.submitLoading = true;
      let params = {};

      //傳統組合參數
      if (useTemplate == 'tplCT') {
        let list = JSON.parse(JSON.stringify(this.betList));
        params = {
          category: 'CT' + this.lotteryInfo.alias, // 传统玩法前缀
          betIssue: this.lotteryInfo.curIssue,
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
      }

      //官方組合參數
      if (useTemplate == 'tplGF') {
        let list = JSON.parse(JSON.stringify(this.cartList));

        // 投注数组
        let betList = [];
        list.forEach(item => {
          const { category, mode, cost, nums, count, digits } = item;
          // ssc-单式
          if (/SSC$/.test(category) && /_M?DS$/.test(mode)) {
            let splitAry = nums;
            let {length} = splitAry;
            let _cost = cost/length;
            // 直选单式的使用","分割号码
            if (/_MDS$/.test(mode)) {
              splitAry = splitAry.map(str => str.split('').join(','));
            }
            betList.push({
              cost,
              count,
              digits,
              mode,
              nums: splitAry.join('|')
            })
            return;
          }

          delete item._nums
          delete item.label
          delete item.category
          delete item.price
          delete item.unit
          delete item.unitLabel
          delete item.digitsLabel
          delete item.digit

          if (Array.isArray(item.nums)) {
            item.nums = item.nums.join(',')
          }
          betList.push(item);
        });

        params = {
          category: this.lotteryInfo.alias,
          betIssue: this.lotteryInfo.curIssue,
          list: betList,
          isStop: this.isStop,
          chaseTime: this.formatChaseList.length,
          chaseList: this.formatChaseList
        }
      }

      //六合彩組合參數
      if (useTemplate == 'tplKQ') {
        let list = JSON.parse(JSON.stringify(this.cartList));
        params = {
          category: this.alias,
          betIssue: this.lotteryInfo.curIssue,
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
      }

      //PC蛋蛋組合參數
      if (useTemplate == 'tplPCDD') {
        let list = JSON.parse(JSON.stringify(this.cartList))
        params = {
          category: this.lotteryInfo.alias,
          betIssue: this.lotteryInfo.curIssue,
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
      }

      //發送 api
      this.$store.dispatch('submitBet', params).then(data => {
        let { code, msg } = data;
        this.submitLoading = false;

        if (code != 0) {
          this.ivNotice('error', msg || '投注失败');
        } else {
          this.ivNotice('success', msg || '投注成功');
          
          
          //發送成功後如果有權限，詢問要不要分享到聊天室
          if (this.shareOrderPermission) {
            this.$Modal.confirm({
              title: '系统提示',
              content: '您是否要分享此注单至聊天室?',
              onOk: ()=> {
                //如果只有單一注單才可以分享
                
                if (this.betList.length == 1 || this.cartList.length == 1) {
                  this.shareConfig();
                  this.shareBet();
                } else {
                  this.ivNotice('error', '目前只支持单一注单分享');
                }
                this.emptyAllCart();
              },
              onCancel: ()=> {
                this.emptyAllCart();
              }
            })
          } else {
            this.emptyAllCart();
          }
        }
      });
    },
    //組合分享注單&計劃的參數
    shareConfig() {
      let useTemplate = this.useTemplate;

      //傳統
      if (useTemplate == 'tplCT') {
        let { price, label, mode } = this.betList[0];
        this.form.betAmount = price;
        this.form.category = 'CT' + this.alias;
        this.form.issue = this.curIssue;
        this.form.list = [];
        this.form.list.push({value: label, count: 1});
        this.form.modeCode = mode;
      }

      //官方
      if (useTemplate == 'tplGF') {
        let { price, category, label, nums, count, mode } = this.cartList[0];
        this.form.betAmount = price;
        this.form.category = category;
        this.form.issue = this.curIssue;
        this.form.list = [];
        this.form.list.push({value: nums, count: count});
        this.form.modeCode = mode;
      }

      //六合彩
      if (useTemplate == 'tplKQ') {
        let { price, modeLabel, nums, count, mode } = this.cartList[0];
        this.form.betAmount = price;
        this.form.category = this.alias;
        this.form.issue = this.curIssue;
        this.form.list = [];
        this.form.list.push({value: nums, count: count});
        this.form.modeCode = mode;
      }

      //PC蛋蛋
      if (useTemplate == 'tplPCDD') {
        let { price, category, label, nums, count, mode } = this.cartList[0];
        this.form.betAmount = price;
        this.form.category = category;
        this.form.issue = this.curIssue;
        this.form.list = [];
        this.form.list.push({value: nums, count: count});
        this.form.modeCode = mode;
      }
    },
    //分享注單
    shareBet() {
      chatApi.shareBet({form: this.form}).then(data => {
        let { code, msg } = data;
        switch (code) {
          case '-1':
            this.ivNotice('error', '分享注单失败');
            break;
          case '107':
            this.ivNotice('error', msg);
            break;
          default:
            this.ivNotice('success', '成功分享注单至聊天室');
            //博貓模板需在分享後自動開啟聊天室
            this.$parent.webChatEnabled = true;
            break;
        }
        this.emptyAllCart();
      })
    },
    //發送計劃至聊天室
    sharePlan() {
      this.sharingPlan = true;
      if (this.betList.length == 1 || this.cartList.length == 1) {
        this.shareConfig();
        this.$Modal.confirm({
          title: '系统提示',
          content: '您是否要分享此计划至聊天室',
          onOk: ()=> {
            chatApi.sharePlan({form: this.form}).then(data => {
              let { code, msg } = data;
              if (code != 0) {
                this.ivNotice('error', '分享计划失败');
              } else {
                this.ivNotice('success', '成功分享计划至聊天室');
                //博貓模板需在分享後自動開啟聊天室
                this.$parent.webChatEnabled = true;
              }
              this.sharingPlan = false;
            })
          },
          onCancel: ()=> {
            this.sharingPlan = false;
          }
        })
      } else {
        this.ivNotice('error', '只支持单一注单分享');
        this.sharingPlan = false;
      }
    },
    //完成開獎
    onFinish() {
      let useTemplate = this.useTemplate;
      this.isFinish = true;

      //關閉追號 (官方用)
      if (useTemplate == 'tplGF') {
        this.$refs.betCart.isChase = false
        this.isChase = false 
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
    $route(to) {
      this.init();
    },
    //官方用
    filterDigits(cur) {
      this.selectedCount()
    },
  }
}
</script>