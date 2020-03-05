<template lang="pug">
#profile-record
  .page-tabs
    a(v-for="(item, index) in tabList" :key="index" v-text="item" :class="{'active': tabIndex == index}" @click="selectTab(index)")
    a(v-if="$root.thirdPartyRecord.length" :class="{'active': tabIndex == 5}" @click="selectTab(5)") 额转记录
  .filter
    .quick-date
      RadioGroup(v-model="dateType" type="button" @on-change="quickDate()") 
        Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
    .custom-data 自选时间：
      Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
    .option(v-if="tabIndex == 0 || tabIndex == 1") 时选方式：
      Select(v-model="query.timeType" @on-change="changeTimeType()")
        Option(v-for="(item, index) in ['发起时间', '处理时间']" :value="index" :label="item" :key="index")
    //- 充值記錄用
    .option(v-if="tabIndex == 0") 状态：
      Select(v-model="query.status")
        Option(v-for="(item, index) in ['全部', '待确认', '已存入', '已取消']" :value="index" :label="item" :key="index" v-if="query.timeType == 0 ? index >= 0 : index > 1")
    //- 提款記錄用
    .option(v-if="tabIndex == 1") 状态：
      Select(v-model="query.status")
        template(v-if="query.timeType == 0")
          Option(v-for="(item, index) in ['全部', '成功', '等待审核', '审核未通过']" :value="index" :label="item" :key="index")
        template(v-else)
          Option(v-for="(item, index) in ['全部', '成功', '等待审核', '审核未通过']" :value="index" :label="item" :key="index" v-if="index == 1 || index == 3")
    //- 額轉記錄用
    .option(v-if="tabIndex == 5")
      .out 转出帐户：
        Select(v-model="query.transOutId")
          Option(value="9999") 全部
          Option(v-for="item in platform" :value="item.platId" :key="item.platId") {{item.platform}}
      .in 转入帐户：
        Select(v-model="query.transInId")
          Option(value="9999") 全部
          Option(v-for="item in platform" :value="item.platId" :key="item.platId") {{item.platform}}
    .submit
      Button(type="info" @click="searchData()" :loading="submiting") 搜索
  record-table(:loading="loading" :data="list" :columns="tableColumns")
  Page.table-page(v-if="list.length" :total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  //- 詳情彈框
  Modal(v-model="modal" width="600")
    p(slot="header") 详情
    p(v-html="info.note" style="line-height: 2")
    p(slot="footer")
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { recordApi, gameBoyApi } from 'api';
import mixins from 'utils/mixins/quickDate';
import RecordTable from 'components/themeBoMao/RecordTable';

export default {
  name: 'ProfileRecord',
  mixins: [mixins],
  components: {
    RecordTable,
  },
  data() {
    return {
      tabList: ['充值记录', '提款记录', '彩票消费', '奖金派送', '交易明细'],
      tabIndex: this.$route.params.tabIndex || '0',
      dateType: 0, //預設日期為今天
      newDateArray: [], //過濾後的快捷選時清單
      submiting: false, //搜尋按鈕開關
      loading: false, //列表loading狀態

      //query
      query: {
        current: 1,
        size: 20,
        date: 0,
        constomDate: '',
        status: 0,
        type: this.type, //彩票消费 = 1、奖金派送 = 2、交易明细 = 0
        transOutId: '9999', //額轉記錄轉出帳戶
        transInId: '9999', //額轉記錄轉入帳戶
        timeType: 0
      },

      //額轉記錄用
      firstFetch: true,
      platform: [],

      list: [], //資料列表
      total: 0, //總筆數

      //彈窗相關參數
      modal: false,
      info: {},
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
    //獲取頁籤名稱
    tabName() {
      if (this.tabIndex == 5) {
        return '额转记录';
      } else {
        return this.tabList[this.tabIndex];
      }
    },
    //判斷種類 (彩票消費、獎金派送、交易明細)
    type() {
      switch (this.tabIndex) {
        case '2':
          return 1;
          break;
        case '3':
          return 2;
          break;
        case '4':
          return 0;
          break;
        default:
          return 1;
          break;
      }
    },
    tableColumns() {
      let columns = [];
      switch (this.tabName) {
        case '充值记录':
          columns = [
            {
              title: '日期',
              key: 'date',
            },
            {
              title: '收支单号',
              key: 'No',
            },
            {
              title: '交易类型',
              key: 'type',
            },
            {
              title: '交易金额',
              key: 'amount',
            },
            {
              title: '交易状态',
              key: 'status',
            },
            {
              title: '备注',
              render: (row, column, index) => {
                if (column.row.note) {
                  let note = column.row.note;
                  if (note != '') {
                    return row(
                      'a',
                      {
                        on: {
                          click: () => {
                            this.modal = true;
                            let html = note.replace(';', ';<br>').replace(/(期号:\d+,订单号:\d+;)(期号:\d+,订单号:\d+;)/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;$2<br>');
                            this.info.note = html;
                          },
                        },
                      },
                      '查看详情'
                    );
                  } else {
                    return row('span', '');
                  }
                } else {
                  return row('span', '');
                }
              },
            },
          ];
          break;
        case '提款记录':
          columns = [
            {
              title: '提款流水号',
              key: 'No',
            },
            {
              title: '提款时间',
              key: 'date',
            },
            {
              title: '提款金额(元)',
              key: 'amount',
            },
            {
              title: '提款银行',
              key: 'bankName',
            },
            {
              title: '手续费',
              key: 'cost',
            },
            {
              title: '状态',
              key: 'status',
            },
            {
              title: '备注',
              render: (row, column, index) => {
                if (column.row.note) {
                  let note = column.row.note;
                  if (note != '') {
                    return row(
                      'a',
                      {
                        on: {
                          click: () => {
                            this.modal = true;
                            let html = note.replace(';', ';<br>').replace(/(期号:\d+,订单号:\d+;)(期号:\d+,订单号:\d+;)/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;$2<br>');
                            this.info.note = html;
                          },
                        },
                      },
                      '查看详情'
                    );
                  } else {
                    return row('span', '');
                  }
                } else {
                  return row('span', '');
                }
              },
            },
          ];
          break;
        case '额转记录':
          columns = [
            {
              title: '日期',
              key: 'date',
            },
            {
              title: '交易类型',
              key: 'type',
            },
            {
              title: '交易金额',
              key: 'money',
            },
            {
              title: '转出',
              key: 'transout',
            },
            {
              title: '转入',
              key: 'transin',
            },
            {
              title: '状态',
              key: 'status',
            },
          ];
          break;
        default:
          columns = [
            {
              title: '时间',
              key: 'date',
            },
            {
              title: '收支单号',
              key: 'No',
            },
            {
              title: '收支情况',
              key: 'status',
            },
            {
              title: '交易类型',
              key: 'type',
            },
            {
              title: '交易金额(元)',
              key: 'amount',
            },
            {
              title: '备注',
              render: (row, column, index) => {
                let note = column.row.note;
                if (note.length > 1) {
                  return row(
                    'a',
                    {
                      on: {
                        click: () => {
                          this.modal = true;
                          let html = note.replace(';', ';<br>').replace(/(期号:\d+,订单号:\d+;)(期号:\d+,订单号:\d+;)/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;$2<br>');
                          this.info.note = html;
                        },
                      },
                    },
                    '查看详情'
                  );
                } else {
                  return row('span', '');
                }
              },
            },
          ];
          break;
      }

      return columns;
    },
  },
  created() {
    //如果不是測試帳號就顯示完整頁籤，如果是就限制快捷選時選項
    if (this.accountInfo.type == 3) {
      this.dateAry.length = 4;
    }

    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    this.resetFilter();
    this.fetchData();
  },
  methods: {
    //頁籤切換
    selectTab(index) {
      this.tabIndex = index;
      this.$router.push({ params: { tabIndex: index } });
      this.resetFilter();
    },
    //重置參數
    resetFilter() {
      this.dateType = 0;
      this.customDate = '';
      this.query = {
        current: 1,
        size: 20,
        constomDate: '',
        timeType: 0,
      };

      //頁籤切換至額轉時需重置為初次獲取的狀態
      this.firstFetch = true;
      
      //非額轉預設為 query 加上 date 參數
      if (this.tabIndex != '5') {
        this.query.date = 0;
      }
      
      //充值記錄、提款記錄需要 status 參數
      if (this.tabIndex == '0' || this.tabIndex == '1') {
        this.query.status = 0;
        this.query.timeType = 0;
        return
      } 

      //彩票消費、獎金派送、交易明細需要 type 參數
      if (this.tabIndex == '2' || this.tabIndex == '3' || this.tabIndex == '4') return this.query.type = this.type;

      //額轉需要平台參數
      if (this.tabIndex == '5') {
        this.query.transOutId = '9999';
        this.query.transInId = '9999';
        return
      }
    },
    //獲取資料
    fetchData() {
      //判斷除了全部外，轉出與轉入不可以是相同的平台
      if (this.tabIndex == 5 && this.query.transOutId != '9999' && this.query.transOutId == this.query.transInId) {
        this.$Notice.error({
          title: '操作错误',
          desc: '转入与转出平台不可相同',
        });
        return;
      }

      this.submiting = false;
      this.loading = true;

      //預設從 api 拉取今日資料
      if (this.tabIndex == 5 && this.firstFetch) {
        let dateFormat = 'yyyy-MM-dd';
        let today = new Date().Format(dateFormat);
        this.query.constomDate = today + ',' + today;
        this.firstFetch = false;
      }

      //判斷頁籤種類使用對應的 api 方式獲取資料
      let api;
      switch (this.tabName) {
        case '充值记录':
          api = 'depositList';
          break;
        case '提款记录':
          api = 'withdrawList';
          break;
        case '额转记录':
          api = 'transList';
          //額轉額外獲取平台資訊
          gameBoyApi.allGame().then(data => {
            this.platform = data.wallet;
          });
          break;
        default:
          api = 'dealList';
          break;
      }

      this.list = [];

      recordApi[api]({ params: this.query }).then(data => {
        this.loading = false;
        this.submiting = false;
        let { code } = data;
        if (code != 0) return;

        this.list = [];

        //判斷頁籤類型使用不同方式接資料
        if (this.tabIndex != 5) {
          let { list, total } = data;
          this.list = list;
          this.total = total;
        } else {
          let { list, total } = data.data;
          this.list = list;
          this.total = total;
        }
      });

      this.$parent.currentPath = this.tabName;
    },
    //搜尋資料
    searchData() {
      this.query.current = 1;
      this.fetchData();
    },
    //切換頁數
    changePage(value) {
      this.query.current = value;
      this.fetchData();
    },
    //變更時選方式
    changeTimeType() {
      if (this.tabIndex == 0) return this.query.timeType == 1 ? this.query.status = 2 : this.query.status = 0;
      if (this.tabIndex == 1) return this.query.timeType == 1 ? this.query.status = 1 : this.query.status = 0;
    }
  },
  watch: {
    $route(to) {
      this.selectTab(this.$route.params.tabIndex);
      this.fetchData();
    },
  },
};
</script>
