<template lang="pug">
div
  .agent-title 投注明细
  .profile_record
    //- 頁籤
    .profile-tab
      a(v-for="item in tabList" :key="item.id" :class="{'active': item.id == tabIndex}" @click="selectTab(item.id)") {{item.name}}
    //- 主內容
    .agent-wrap
      .agent-betRecord
        .profile_record-head
          .date-row
            .quick-date 快捷选时：
              RadioGroup(v-model="dateType" type="button" @on-change="quickDate") 
                Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
            .custom-date 自选时间：
              Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
          .mb10(v-if="tabIndex == -1")
            label 选择彩种：
            Select.form-width-sm.mr15(v-model="query.category")
              Option(value="all") 所有彩种
              Option(v-for="item in gameList", :value="item.alias", :label="item.label", :key="item.alias")
            label 类型：
            Select.form-width-sm(v-model="query.state")
              Option(value="0" label="全部")
              Option(value="3" label="已中奖")
              Option(value="2" label="未中奖")
              Option(value="1" label="等待开奖")
          div
            label 会员账号：
            Input.form-width(type="text" v-model="query.userName" placeholder="下级投注查询")
            Button.ml10(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索  
        .total-profit(v-if="tabIndex != -1") 输赢统计：
          span(v-if="totalProfit != 0" :class="totalProfit > 0 ? 'text-success' : 'text-error'" v-text="totalProfit > 0 ? '+' + totalProfit : totalProfit")
          span(v-else) {{totalProfit}}
        record-table(:loading="submiting", :data="list", :columns="tableColumns")
        .table-page(v-if="list.length")
          Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
      modal4-bet-detail(:info="info", :show.sync="modal" v-if="tabIndex == -1")
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters, mapActions } from "vuex";
import { agentApi, lotteryApi } from 'api';
import mixins from 'utils/mixins/quickDate';
import RecordTable from 'components/themeMix/RecordTable';
import Modal4BetDetail from '@/components/themeMix/Modal4BetDetail';

export default {
  name: 'RecordBet',
  mixins: [mixins],
  components: {
    RecordTable,
    Modal4BetDetail
  },
  data() {
    return {
      tabList: [{id: -1, name: '彩票'}], //頁籤清單
      tabIndex: -1, //選中的頁籤
      dateType: 0, //預設日期為今天
      newDateArray: [], //過濾後的快捷選時清單
      firstFetch: true, //初次獲取開關
      submiting: false, //查詢按鈕開關

      //搜尋資料參數
      //userName:下級帳號id, itself:是否包含代理自身數據, startDate:開始區間, endData:結束區間, category:彩種, state:狀態, current:頁數, size:每頁筆數
      query: {
        startDate: '',
        endDate: '',
        userName: this.$route.query.username || '',
        category: 'all',
        state: '0',
        current: 1,
        size: 20,
      },
      
      gameList: [], //彩種列表
      list: [], //資料列表
      total: 0, //總筆數
      totalProfit: 0, //第三方總盈虧

      //查看詳情參數 
      //modal:彈窗開關, showMore:展開詳情開關, viewMoreText:展開按鈕文字 
      modal: false,
			info: {
        viewMoreText: '...展开',
        showMore: false
			},
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
    //資料列表格式
    tableColumns () {
      let columns = [];
      if(this.tabIndex == -1) {
        columns = [
          {
            title: '账号',
            key: 'username',
            className: 'text-info'
          }, {
            title: '彩种',
            key: 'categoryLabel'
          }, {
            title: '期号',
            key: 'issue'
          }, {
            title: '投注内容',
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
            title: '投注金额',
            key: 'cost'
          }, {
            title: '开奖号码',
            render: (h, {row}) => {
              return <span>{row.openNum}</span>
            }
          }, {
            title: '中奖金额',
            key: 'win'
          }, {
            title: '奖金状态',
            render: (h, params) => {
              let obj = params.row
              return h('b', {
                'class': obj.state == 3 ? 'text-error' : obj.state == 2 ? 'text-success' : ''
              }, this.$root.formatState(obj).replace('已结算（', '').replace(')', ''))
            }
          }, {
            title: '投注时间',
            key: 'date'
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
      } else {
        columns = [
          {
            title: '账号',
            key: 'userName',
          }, 
          {
            title: '时间',
            key: 'date'
          }, 
          {
            title: '平台',
            key: 'platform'
          }, 
          {
            title: '游戏',
            key: 'game'
          },
          {
            title: '投注金额',
            key: 'betMoney'
          },
          {
            title: '输赢',
            render: (h, {row}) => {
              if (row.profit > 0) {
                return <span class="text-success">+{row.profit}</span>
              } else if (row.profit < 0){
                return <span class="text-error">{row.profit}</span>
              } else {
                return <span>{row.profit}</span>
              }
              
            }
          }
        ]
      }
      return columns;
    },
  },
  created() {
    //取得完整第三方列表 render 頁籤
    this.tabList.push(...this.$root.thirdPartyRecord);

    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    //獲取資料
    this.resetFilter();
    this.fetchData();

    //彩票獲取彩種
    if (this.tabIndex == -1) {
      this.fetchCategory();
    }
  },
  methods: {
    //頁籤切換
    selectTab(id) {
      this.tabIndex = id;      
      this.$router.push({});
      this.resetFilter();
      this.fetchData();
    },
    //重置參數
    resetFilter() {
      this.dateType = 0;
      this.customDate = '';
      this.firstFetch = true;
      this.query = {
        userName: this.$route.query.username || '',
        current: 1,
        size: 20,
      }

      //對應彩票或第三方需額外重置參數
      if (this.tabIndex == -1) {
        this.query.category = 'all';
        this.query.state = '0';
      } else {
        this.query.thirdPartyId = this.tabIndex;
      }

      //清空 list 避免 columns render 錯誤
      this.list = [];

      //清空總盈虧數字
      this.totalProfit = 0;
    },
    //彩票獲取彩種
    fetchCategory() {
      lotteryApi.allLottery().then(data => {
        let { code, msg, list } = data;
        if (code != 0) return
        this.gameList = list;
      });
    },
    fetchData () {
      this.submiting = true;

      //預設從 api 拉取今日資料
      if(this.firstFetch) {
        let dateFormat = "yyyy-MM-dd";
        let today = new Date().Format(dateFormat);
        this.query.constomDate = today + ',' + today;
        this.query.startDate = today;
        this.query.endDate = today;
        this.firstFetch = false;
      } else {
        let dateSeparate = this.query.constomDate.split(',')
        this.query.startDate = dateSeparate[0];
        this.query.endDate = dateSeparate[1];
        delete this.query['date'];
      }

      //判斷頁籤種類使用對應的 api 方式獲取資料
      let api;
      if (this.tabIndex == -1){
        api = 'recordBet';
      } else {
        api = 'recordBetThirdParty';
        this.query.thirdPartyId = this.tabIndex;
      }

      agentApi[api]({params: this.query}).then(data => {
        this.submiting = false;
        let { code, msg, list, total } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg
          })
          return 
        }
        this.list = list
        this.total = total

        //如果是第三方平台額外取得總盈虧
        if (this.tabIndex != -1) {
          this.totalProfit = data.totalProfit;
        }
      })
    },
    formatList () {
      let curIssue = this.curIssue
      this.list = this.list.map(item => {
        if (item.issue < curIssue) item._disabled = true
        return item
      })
    },
    showDetail (obj) {
      this.modal = true
      this.info = Object.assign(this.info, obj.row || obj, {
				showMore: false,
				viewMoreText: '...展开'
			});
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    searchData() {
      this.query.current = 1;
      this.fetchData();
    }
  }
}
</script>

<style lang="scss" scoped>
.total-profit {
  margin-bottom: 10px;
  padding: 0 20px;
  font-size: 16px;
  color: #495060;
  text-align: right;
}
</style>