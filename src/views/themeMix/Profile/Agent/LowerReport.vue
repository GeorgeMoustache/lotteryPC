<template lang="pug">
div
  .agent-title 下级报表
  .profile_record
    //- 頁籤
    .profile-tab
      a(v-for="item in tabList" :key="item.id" :class="{'active': item.id == tabIndex}" @click="selectTab(item.id)") {{item.name}}
    //- 主內容
    .agent-wrap
      .profile_record-head
        .date-row
          .quick-date 快捷选时：
            RadioGroup(v-model="dateType" type="button" @on-change="quickDate") 
              Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
          .custom-date 自选时间：
            Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
        .sort 资料排序方式：
          RadioGroup(v-model="query.sort" @on-change="searchData()")
            Radio(v-for="(item, index) in ['账号', '投注金额']" :label="index" :key="index") {{item}}
          Button(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 点击查询
      .user-breadcrumb(v-if="lowerNames.length > 0")
        template(v-for="(item, index) in lowerNames")
          a(@click="returnBack(index)") {{item}}
      record-table(:loading="loading" :data="list" :columns="tableColumns")
      .table-page(v-if="list.length")
        Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters, mapActions } from "vuex";
import { agentApi } from 'api';
import mixins from 'utils/mixins/quickDate';
import RecordTable from 'components/themeMix/RecordTable';

export default {
  name: 'LowerReport',
  mixins: [mixins],
  components: {
    RecordTable
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
      //userName:下級帳號id, startDate:開始區間, endData:結束區間, current:頁數, size:每頁筆數, sort:資料排序方式(0:依帳號, 1:依投注金額)
      query: {
        current: 1,
        size: 20,
        userName: '',
        startDate: '',
        endDate: '',
        sort: 0,
      },

      loading: false,
      list: [], //資料列表
      total: 0, //總筆數
      lowerNames: [], //下級會員
      cache: {},
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
    //資料列表格式
    tableColumns () {
      let columns = [];
      if (this.tabIndex == -1) {
        columns = [
          {
            title: '账号',
            key: 'userName',
            className: 'text-info'
          },
          {
            title: '用户类型',
            key: 'userType'
          },
          {
            title: '投注金额',
            key: 'betMoney'
          },
          {
            title: '中奖金额',
            key: 'winMoney'
          },
          {
            title: '返点金额',
            key: 'rebateMoney'
          },
          {
            title: '活动礼金',
            key: 'discountMoney'
          },
          {
            title: '扣款金额',
            key: 'totalLoseMoney'
          },
          {
            title: '投注人数',
            render: (h, {row}) => {
              let {betNum, userType} = row
              if (betNum > 0 && ~userType.indexOf('代理')) {
                return h('a', {
                'class': 'text-error',
                  on: {
                    click: () => {
                      let {userId, userName} = row
                      this.seeLower(userId, userName)
                    }
                  }
                }, betNum)
              } else {
                return h('div', betNum)
              }
            }
          },
          {
            title: '盈利',
            render: (h, {row}) => {
              return h('a', {
                'class': 'text-error',
                on: {
                  click: () => {
                    this.$parent.returnLowerReport = {
                      isThirdParty: false,
                      dateType: this.dateType,
                      startDate: this.query.startDate,
                      endDate: this.query.endDate,
                      userName: row.userName,
                    }
                    this.$router.push({path: `/profile/agent/agencyReport`})
                  }
                }
              }, row.profitMoney)
            }
          }
        ]
      } else {
        columns = [
          {
            title: '账号',
            key: 'userName',
            className: 'text-info'
          },
          {
            title: '类型',
            key: 'userType'
          },
          {
            title: '有效投注',
            key: 'betMoney'
          },
          {
            title: '投注人数',
            render: (h, {row}) => {
              let {people, userType} = row;
              if (people > 0 && ~userType.indexOf('代理')) {
                return h('a', {
                'class': 'text-error',
                  on: {
                    click: () => {
                      let {userId, userName} = row
                      this.seeLower(userId, userName)
                    }
                  }
                }, people)
              } else {
                return h('div', people);
              }
            }
          },
          {
            title: '输赢金额',
            render: (h, {row}) => {
              let textClass = '';
              let profit = row.profit;
              if (profit > 0) {
                textClass = 'text-success';
                profit = '+' + profit;
              } else if (profit < 0) {
                textClass = 'text-error';
              }

              return h('a', {
                'class': textClass,
                on: {
                  click: () => {
                    this.$parent.returnLowerReport = {
                      isThirdParty: true,
                      dateType: this.dateType,
                      startDate: this.query.startDate,
                      endDate: this.query.endDate,
                      userName: row.userName,
                    }
                    this.$router.push({path: `/profile/agent/agencyReport`})
                  }
                }
              }, profit)
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
      this.customDate = '';
      this.firstFetch = true;
      this.query = {
        userName: '',
        current: 1,
        size: 20,
        sort: 0
      }
      
      //對應第三方需額外重置參數
      if (this.tabIndex != -1) {
        this.query.thirdPartyId = this.tabIndex;
      }
      
      //清空 list 避免 columns render 錯誤
      this.list = [];

      //清空下級會員
      this.lowerNames = [];
    },
    fetchData () {
      this.submiting = true;
      this.loading = true;
      
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
        api = 'lowerReport';
      } else {
        api = 'lowerReportThirdParty';
        this.query.thirdPartyId = this.tabIndex;
      }

      agentApi[api]({ params: this.query }).then(data => {
        this.submiting = false;
        this.loading = false;
        let { code, msg, total, list } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '获取数据失败',
            desc: msg
          })
          return
        }
        
        this.list = list
        this.total = total;

        let {userName, current, startDate, endDate} = this.query
        this.cache[[userName, current, startDate, endDate].join('@')] = {
          list: JSON.parse(JSON.stringify(data.list)),
          total: total,
          current: + data.current
        }
      })
    },
    checkData () {
      let {userName, current, startDate, endDate} = this.query
      let key = [userName, current, startDate, endDate].join('@')
      let obj = this.cache[key]
      if (obj) {
        this.list.splice(0)
        this.list.push(...obj.list)
        this.total = obj.total
        this.query.current = obj.current
      } else {
        this.fetchData()
      }
    },
    seeLower (userId, userName) {
      Object.assign(this.query, {
        current: 1,
        userName: userName
      })
      this.lowerNames.push(userName)
      this.checkData()
    },
    returnBack (index) {
      this.query.userName = this.lowerNames[index - 1] || ''
      this.query.current = 1
      this.lowerNames.splice(index)
      this.checkData()
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
.user-breadcrumb {
  width: 100%;
  margin-bottom: 20px;
  padding: 0 15px;
  a {
    display: inline-block;
    margin-bottom: 6px;
    font-size: 12px;
    color: #495060;
    &::before {
      content: ">";
      padding: 0 5px;
    }
  }
}
</style>