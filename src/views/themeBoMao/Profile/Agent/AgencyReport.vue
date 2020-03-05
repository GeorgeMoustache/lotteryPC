<template lang="pug">
#agency-report
  .page-tabs
    a(v-for="item in tabList" :key="item.id" :class="{'active': item.id == tabIndex}" @click="selectTab(item.id)") {{item.name}}
  .filter
    .quick-date
      RadioGroup(v-model="dateType" type="button" @on-change="quickDate") 
        Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
    .custom-data 自选时间：
      Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
    .user
      Input(v-model="query.userName" placeholder="下级报表查询")
      Checkbox(v-model="query.itself" true-value="1" false-value="0") 包含代理自身数据
    .submit  
      Button(type="info" @click="fetchData" :loading="submiting") 点击查询
  .list(v-if="tabIndex == -1")
    dl
      dt 我的团队
      dd
        span(@click="openTeamReport(1)")
          em ¥{{infoList.teamBalance}}
          i 团队余额
        span(@click="openTeamReport(1)")
          em ¥{{infoList.betMoney}}
          i 投注金额
        span(@click="openTeamReport(1)")
          em ¥{{infoList.bonus}}
          i 中奖金额
    dl
      dt 充值提现
      dd
        span(@click="openTeamReport(2)")
          em ¥{{infoList.rechargeMoney}}
          i 充值金额
        span(@click="openTeamReport(2)")
          em ¥{{infoList.withdrawMoney}}
          i 提现金额
        span(@click="openTeamReport(2)")
          em ¥{{infoList.totalLoseMoney}}
          i 扣款金额
    dl
      dt 团队成績
      dd
        span(@click="openTeamReport(1, 1)")
          em.link {{infoList.betNum}}人
          i 投注人数
        span(@click="openTeamReport(1, 2)")
          em.link {{infoList.firstChargeNum}}人
          i 首充人数
        span(@click="openTeamReport(1, 3)")
          em.link {{infoList.registerNum}}人
          i 注册人数
        span(@click="openTeamReport(1)")
          em.link {{infoList.childUserNum}}人
          i 团队人数
    dl
      dt 活动优惠
      dd
        span(@click="openTeamReport(2)")
          em ¥{{infoList.activityMoney}}
          i 活动礼金
        span(@click="openTeamReport(2)")
          em ¥{{infoList.teamFanDian}}
          i 团队返点
        span(@click="openTeamReport(2)")
          em ¥{{infoList.teamProfit}}
          i 团队盈利
    Spin(fix v-if="submiting")
      Icon(type="load-c" size="18" class="spin-icon-load")
      div 加载中
  .list(v-if="tabIndex == 1")
    dl(v-for="(item, index) in infoList" :key="index")
      dt {{item.platform}}
      dd
        span(@click="openTeamReport(item.thirdPartyId)")
          em {{item.people}} 人
          i 投注人数
        span(@click="openTeamReport(item.thirdPartyId)")
          em {{item.betMoney}}
          i 有效投注
        span(@click="openTeamReport(item.thirdPartyId)")
          em(v-if="item.profit != 0" :class="item.profit > 0 ? 'text-success' : 'text-error'" v-text="item.profit > 0 ? '+' +　item.profit : item.profit")
          em(v-else) {{item.profit}}
          i 输赢
    Spin(fix v-if="submiting")
      Icon(type="load-c" size="18" class="spin-icon-load")
      div 加载中
  Modal(v-model="modal" width="800")
    p(slot="header") 详情
    record-table(:loading="loading" :data="detailList" :columns="tableColumns")
    .table-page(v-if="detailList.length")
      Page.inline-block(:total="total" :current="params.current" :page-size="params.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { agentApi } from 'api';
import mixins from 'utils/mixins/quickDate';
import RecordTable from 'components/themeMix/RecordTable';

export default {
  name: 'AgencyReport',
  mixins: [mixins],
  inject: ['ivNotice'],
  components: {
    RecordTable,
  },
  data() {
    return {
      tabList: [{ id: -1, name: '彩票' }], //頁籤清單
      tabIndex: -1, //選中的頁籤
      dateType: 0, //預設日期為今天
      newDateArray: [], //過濾後的快捷選時清單
      firstFetch: true, //初次獲取開關
      submiting: false, //查詢按鈕開關
      infoList: {}, //資料列表

      //搜尋資料參數
      //userName:下級帳號id, itself:是否包含代理自身數據, startDate:開始區間, endData:結束區間
      query: {
        startDate: '',
        endDate: '',
        userName: '',
        itself: '1',
      },

      //彈窗详情參數
      //modal:開關, type:類型(彩票用), thirdPartyId:平台ID(第三方用) current:頁數, size:筆數, listType:彩票使用何種表格(1 || 2) detailList:資料, loading:loading開關, total:總筆數
      modal: false,
      params: {
        current: 1,
        size: 20,
        type: 1
      },
      listType: 1,
      peopleType: false, //首充人數使用
      detailList: [],
      loading: false,
      total: 0,
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
    //資料列表格式
    tableColumns() {
      let columns = [];
      if (this.tabIndex == -1) {
        if (this.listType == 1) {
          if (this.peopleType) {
            columns = [
              {
                title: '账号',
                key: 'username',
              },
              {
                title: '首充金额',
                key: 'firstChargeMoney',
              },
              {
                title: '首充时间',
                key: 'chargeTime',
              },
            ];
          } else {
            columns = [
              {
                title: '账号',
                key: 'username',
              },
              {
                title: '投注次数',
                key: 'betNums',
              },
              {
                title: '投注金额',
                key: 'betMoney',
              },
              {
                title: '中奖金额',
                key: 'winMoney',
              },
              {
                title: '余额',
                key: 'balance',
              },
              {
                title: '注册时间',
                key: 'registerDate',
              },
              {
                title: '最后登录时间',
                key: 'lastLoginDate',
              },
            ];
          }
        } else {
          columns = [
            {
              title: '账号',
              key: 'username',
            },
            {
              title: '充值金额',
              key: 'depositMoney',
            },
            {
              title: '提现金额',
              key: 'withdrawMoney',
            },
            {
              title: '扣款金额',
              key: 'debitMoney',
            },
            {
              title: '活动礼金',
              key: 'activityMoney',
            },
            {
              title: '团队返点',
              key: 'returnPoint',
            },
            {
              title: '团队盈利',
              key: 'teamProfit',
            },
          ];
        }
      } else {
        columns = [
          {
            title: '账号',
            key: 'username',
          },
          {
            title: '投注金额',
            key: 'betMoney',
          },
          {
            title: '输赢金额',
            key: 'profit',
          },
        ];
      }
      return columns;
    },
  },
  created() {
    //取得完整第三方列表 render 頁籤
    if (this.$root.thirdPartyRecord.length > 0) {
      this.tabList.push({ id: 1, name: '第三方' });
    }

    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    //如果下級報表回傳資料為第三方平台則使用對應頁籤
    if (this.$parent.returnLowerReport) {
      let returnLowerReport = this.$parent.returnLowerReport;
      if (returnLowerReport.isThirdParty) {
        this.tabIndex = 1;
      }
    }

    this.resetFilter();
    this.fetchData();
  },
  methods: {
    //頁籤切換
    selectTab(id) {
      this.tabIndex = id;
      this.resetFilter();
      this.fetchData();
    },
    //重置參數
    resetFilter() {
      this.dateType = 0;
      this.firstFetch = true;
      this.query.itself = '1';
      this.query.userName = '';
    },
    //獲取資料
    fetchData() {
      this.submiting = true;

      //預設從 api 拉取今日資料
      if (this.firstFetch) {
        let dateFormat = 'yyyy-MM-dd';
        let today = new Date().Format(dateFormat);
        if (this.$parent.returnLowerReport) {
          let { dateType, startDate, endDate, userName } = this.$parent.returnLowerReport;
          this.dateType = dateType;
          this.query.startDate = startDate;
          this.query.endDate = endDate;
          this.query.constomDate = startDate + ',' + endDate;
          this.query.userName = userName;
        } else {
          this.query.constomDate = today + ',' + today;
          this.query.startDate = today;
          this.query.endDate = today;
        }
        this.firstFetch = false;
      } else {
        let dateSeparate = this.query.constomDate.split(',');
        this.query.startDate = dateSeparate[0];
        this.query.endDate = dateSeparate[1];
        delete this.query['date'];
      }

      //判斷頁籤種類使用對應的 api 方式獲取資料
      let api;
      if (this.tabIndex == -1) {
        api = 'agencyReport';
      } else {
        api = 'agencyReportThirdParty';
      }

      agentApi[api]({ params: this.query }).then(data => {
        this.submiting = false;
        let { code, msg } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg,
          });
          return;
        }

        //判斷頁籤類型使用不同方式接資料
        if (this.tabIndex == -1) {
          this.infoList = data.info;
        } else {
          this.infoList = data.list;
        }
      });

      //獲取資料後清空由下級報表傳上來的資訊
      delete this.$parent['returnLowerReport'];
    },
    searchData() {
      this.fetchData();
    },
    //開啟詳情資料
    openTeamReport(type, peopleType) {
      this.modal = true;
      this.loading = true;
      this.params.current = 1;
      this.peopleType = false;
      delete this.params['type'];
      delete this.params['thirdPartyId'];
      delete this.params['peopleType'];
      this.fetchTeamReport(type, peopleType);
    },
    //獲取詳情資料
    fetchTeamReport(type, peopleType) {
      if (type) {
        if (this.tabIndex == -1) {
          this.params.type = type;
          this.listType = type;
        } else {
          this.params.thirdPartyId = type;
        }
      }

      if (peopleType) {
        this.params.peopleType = peopleType;
        if (peopleType == 2) this.peopleType = true;
      }

      let params = Object.assign(this.params, this.query);
      delete params['constomDate'];

      agentApi.teamReport({ params }).then(data => {
        this.loading = false;
        let { code, msg, list, total } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.detailList = list;
        this.total = total;
      });
    },
    //彈窗詳情換頁
    changePage(value) {
      this.params.current = value;
      this.fetchTeamReport();
    },
  },
};
</script>