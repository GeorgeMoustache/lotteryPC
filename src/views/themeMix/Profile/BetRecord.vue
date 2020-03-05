<template lang="pug">
div
  .profile_record
    //- 頁籤
    .profile-tab
      a(v-for="item in tabList" :key="item.id" :class="{'active': item.id == tabIndex}" @click="selectTab(item)") {{item.name}}
    //- 主內容
    //- 搜尋
    .profile_record-head
      .date-row
        .quick-date 快捷选时：
          RadioGroup(v-model="dateType" type="button" @on-change="quickDate") 
            Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
        .custom-date 自选时间：
          Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
        Button(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索
      //- 彩種專用篩選項目
      span(v-if="tabIndex == -1")
        | 选择彩种：
        Select.form-width-sm.mr10(v-model="query.category")
          Option(value="all") 所有彩种
          Option(v-for="item in lotteryList" :value="item.alias" :label="item.label" :key="item.alias")
        Select.form-width-sm.mr10(v-model="query.betType")
          Option(v-for="(item, index) in ['全部投注', '普通投注', '追号投注']" :value="index" :label="item" :key="index")
      //- 真人平台專用篩選項目
      .platform(v-if="tabName == 'liveCasino'") 平台选择：
        RadioGroup(v-model="query.platId" type="button") 
          Radio(v-for="item in platList" :label="item.platId" :key="item.platId") {{item.showName}}
    //- 當日詳情 (彩票)
    .today-detail(v-if="tabIndex == -1") 当日详情：
      span.text-error(v-text="today.total")
      | 中奖金额：
      span.text-error(v-text="today.win")
      | 盈利金额：
      span.text-error(v-text="today.profit")
      span.text-error &nbsp;&nbsp;详情数据每10分钟统计一次，以明细为准
    //- 當日詳情 (第三方)
    .today-detail(v-else)
      | 输赢统计：
      span(:class="amountProfit > 0 ? 'text-success': 'text-error'" v-text="amountProfit")
      span &nbsp;&nbsp;可检视近两个月记录，资料五分钟统计一次
    //- 資料列表
    record-table(:loading="loading" :data="list" :columns="tableColumns")
    .table-page(v-if="list.length")
      Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
    //- 詳細資料彈窗 (彩票)
    modal4-bet-detail(:info="info", :show.sync="modal")
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from "vuex";
import RecordTable from "@/components/themeMix/RecordTable";
import Modal4BetDetail from "@/components/themeMix/Modal4BetDetail";
import mixins from 'utils/mixins/quickDate';
import { recordApi, lotteryApi, accountApi, gameBoyApi } from 'api';

export default {
  name: 'BetRecord',
  mixins: [mixins],
  components: {
    RecordTable,
    Modal4BetDetail
  },
  data() {
    return {
      tabList: [{id: -1, name: '彩票', linkEname: 'lottery'}], //頁籤清單
      tabIndex: -1, //選中的頁籤
      tabName: 'lottery', //選中頁籤的 linkEname
      dateType: 0, //預設日期為今天
      newDateArray: [], //過濾後的快捷選時清單
      submiting: false, //搜尋按鈕開關
      loading: false, //列表 loading 狀態

      //搜尋資料參數
      //current:目前頁數, size:每頁筆數, date:快捷選時類型, constomDate:日期區間, category:彩種, betType:投注分類
      query: {
        current: 1,
        size: 20,
        date: 0,
        constomDate: '',
        category: 'all',
        betType: 0,
        platId: '9999',
      },

      list: [], //資料列表
      total: 0,

      //彩票分類相關
      today: {}, //當日詳情
      lotteryList: [], //彩種列表
      amountProfit: '', //第三方當日詳情
      
      //資料詳情彈窗
      modal: false,
      info: {
        showMore: false,
        viewMoreText: '...展开'
      },

      platList: [{platId: '9999', showName: '全部'}] //真人列表篩選項目
    }
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
    //資料列表格式
    tableColumns () {
      let columns = [];
      switch (this.tabName) {
        case 'cardGame':
          columns = [
            {
              title: "时间",
              key: "date"
            },
            {
              title: "平台",
              key: "platName"
            },
            {
              title: "游戏",
              key: "gameName"
            },
            {
              title: "输赢金额",
              render: (row, column, index) => {
                let profit = column.row.profit;
                if (profit > 0) {
                  return <span class="text-success">+{column.row.profit}</span>;
                } else if (profit < 0) {
                  return <span class="text-error">{column.row.profit}</span>;
                } else {
                  return <span>{column.row.profit}</span>;
                }
              }
            },
            {
              title: "有效投注",
              key: "betMoney"
            },
          ];
          break
        case 'liveCasino':
          columns = [
            {
              title: "时间",
              key: "date"
            },
            {
              title: "平台",
              key: "platName"
            },
            {
              title: "游戏",
              key: "gameName"
            },
            {
              title: "输赢金额",
              render: (row, column, index) => {
                let profit = column.row.profit;
                if (profit > 0) {
                  return <span class="text-success">+{column.row.profit}</span>;
                } else if (profit < 0) {
                  return <span class="text-error">{column.row.profit}</span>;
                } else {
                  return <span>{column.row.profit}</span>;
                }
              }
            }
          ];
          break;
        default:
          columns = [
            {
              title: '彩种',
              key: 'categoryLabel'
            }, {
              title: '期号',
              key: 'issue'
            }, {
              title: '下注玩法',
              key: 'modeLabel'
            }, {
              title: '下注号码',
              render: (h, {row}) => {
                let category = row.category || row.alias
                return h('div', {
                  'class': 'betnum',
                  domProps: {
                    innerHTML: this.$root.formatNums(row, 'betNum')
                  }
                })
              }
            }, {
              title: '下注总额',
              key: 'cost'
            }, {
              title: '中奖金额',
              key: 'win'
            }, {
              title: '开奖号码',
              render: (h, {row}) => {
                return <span>{row.openNum}</span>
              }
            }, {
              title: '状态',
              render: (h, params) => {
                let obj = params.row
                return h('b', {
                  'class': obj.state == 3 ? 'text-error' : obj.state == 2 ? 'text-success' : ''
                }, this.$root.formatState(obj).replace('已结算（', '').replace(')', ''))
              }
            }, {
              title: '下注时间',
              render: (h, params) => {
                return h('span', params.row.date.substr(5))
              }
            }, {
              title: '详情',
              render: (h, params) => {
                return h('a', {
                  on: {
                    click: () => {
                      this.showDetail(params)
                    }
                  }
                }, '查看')
              }
            }
          ]
          break;
      }
      return columns
    }
  },
  created() {
    //如果不是測試帳號就顯示完整頁籤，如果是就限制快捷選時選項
    if (this.accountInfo.type != 3) {
      this.tabList.push(...this.$root.thirdPartyRecord);
    } else {
      this.dateAry.length = 4;
    }
    
    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    this.fetchData();
  },
  methods: {
    //頁籤切換
    selectTab(item) {
      this.tabIndex = item.id;
      this.tabName = item.linkEname;

      this.resetFilter();
      this.fetchData();
    },
    //重置參數
    resetFilter() { 
      this.dateType = 0;
      this.customDate = '';
      this.firstFetch = true;
      this.query.current = 1;
      this.query.size = 20;
      this.query.date = 0;
      this.query.constomDate = '';
      this.query.category = 'all';
      this.query.betType = 0;
      this.query.platId = '9999';
    },
    fetchData () {
      this.submiting = true;
      this.loading = true;

      //預設從 api 拉取今日資料
      if (this.firstFetch) {
        let dateFormat = "yyyy-MM-dd";
        let today = new Date().Format(dateFormat);
        this.query.constomDate = today + ',' + today;
        this.firstFetch = false;
      }

      //判斷頁籤種類使用對應的 api 方式獲取資料
      let api, thirdPartyId;
      if (this.tabIndex == -1){
        api = 'betList';
        thirdPartyId = '';

        //彩票類型需要額外獲取彩種
        lotteryApi.allLottery().then(data => {
          let { code, list } = data;
          if (code != 0) return
          this.lotteryList = list;
        });
        
        //彩票類型需要額外獲取今日詳情
        recordApi.todayDetail().then(data => {
          if (data.code != 0) return
          this.today = data.info
        })

      } else {
        api = 'betRecord';
        thirdPartyId = this.tabIndex;
      }

      //如果是真人額外獲取篩選項目
      if (this.tabName == 'liveCasino') {
        this.platList.length = 1;
        gameBoyApi.allGame({params: {thirdPartyId: this.tabIndex}}).then(data=>{
          const { code, wallet } = data;
          if (code != 0) return;
          this.platList.push(...wallet);
        })
      }

      recordApi[api]({params: this.query}, thirdPartyId).then(data => {
        this.loading = false
        this.submiting = false
        let { code } = data;
        if (code != 0) return

        this.list = [];

        //判斷頁籤類型使用不同方式接資料
        if (this.tabIndex == -1) {
          let { list, total } = data;
          this.list = list;
          this.formatList();
          this.total = total;
        } else {
          let { list, amountProfit, totalCount } = data.data;
          this.list = list;
          this.amountProfit = amountProfit;
          this.total = totalCount
        }
      })
    },
    //換頁
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    searchData() {
      this.query.current = 1
      this.fetchData()
    },
    //格式化資料
    formatList () {
      let curIssue = this.curIssue
      this.list = this.list.map(item => {
        if (item.issue < curIssue) item._disabled = true
        return item
      })
    },
    //詳情彈窗
    showDetail (obj) {
      this.modal = true
      this.info = Object.assign(this.info, obj.row || obj, {
        showMore: false,
        viewMoreText: '...展开'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.today-detail {
  padding: 0 0 10px 20px;
  font-size: 14px;
  span {
    padding-right: 5px;
  }
}
</style>