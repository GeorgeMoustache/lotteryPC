<template lang="pug">
.profile_record-main
  .profile_record-head
    .date-row
      .quick-date 快捷选时：
        RadioGroup(v-model="dateType" type="button" @on-change="quickDate()") 
          Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
      .custom-date 自选时间：
        Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
      .time-type 时选方式：
        Select.form-width-sm.mr10(v-model="query.timeType" @on-change="changeTimeType()")
          Option(v-for="(item, index) in ['发起时间', '处理时间']" :value="index" :label="item" :key="index")
    span 状态：
      Select.form-width-sm.mr10(v-model="query.status")
        Option(v-for="(item, index) in ['全部', '待确认', '已存入', '已取消']" :value="index" :label="item" :key="index" v-if="query.timeType == 0 ? index >= 0 : index > 1")
    Button(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索
  record-table(:loading="loading", :data="list", :columns="tableColumns()")
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  Modal(v-model="modal" width="600")
    p(slot="header") 详情
    p(v-html="info.note" style="line-height: 2")
    p(slot="footer")
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { recordApi, accountApi } from 'api';
import mixins from 'utils/mixins/quickDate';
import RecordTable from 'components/themeMix/RecordTable';

export default {
  name: "ProfileRecord_Deposit",
  mixins: [mixins],
  components: {
    RecordTable
  },
  data() {
    return {
      submiting: false,
      loading: false,
      // modal
      modal: false,
      info: {},
      // query
      query: {
        current: 1,
        size: 20,
        date: 0,
        constomDate: "",
        status: 0,
        timeType: 0 //時選方式
      },
      list: [],
      total: 0,
      dateType: 0,
      newDateArray: []
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
  },
  created() {
    //如果不是測試帳號就顯示完整頁籤，如果是就限制快捷選時選項
    if (this.accountInfo.type == 3) {
      this.dateAry.length = 4;
    }

    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    this.fetchData();
  },
  methods: {
    tableColumns() {
      let columns = [
        {
          title: "日期",
          key: "date"
        },
        {
          title: "收支单号",
          key: "No"
        },
        {
          title: "交易类型",
          key: "type"
        },
        {
          title: "交易金额",
          key: "amount"
        },
        {
          title: "交易状态",
          key: "status"
        },
        {
          title: "备注",
          render: (row, column, index) => {
            if (column.row.note) {
              let note = column.row.note;
              if(note != '') {
                return row('a',{
                  on: {
                    click: () => {
                      this.modal = true
                      let html = note.replace(';', ';<br>').replace(/(期号:\d+,订单号:\d+;)(期号:\d+,订单号:\d+;)/g, '$1&nbsp;&nbsp;&nbsp;&nbsp;$2<br>')
                      this.info.note = html
                    }
                  }
                } , '查看详情')
              } else {
                return row('span', '')
              }    
            } else {
              return row('span', '')
            }
          }
        }
      ];
      return columns;
    },
    fetchData() {
      this.submiting = true;
      this.loading = true;
      recordApi.depositList({ params: this.query }).then(data => {
        this.loading = false;
        this.submiting = false;
        let { code, list, total } = data;
        if (code != 0) return;
        this.list = list;
        this.total = total;
      });
    },
    changePage(value) {
      this.query.current = value;
      this.fetchData();
    },
    searchData() {
      this.query.current = 1
      this.fetchData()
    },
    //變更時選方式
    changeTimeType() {
      this.query.timeType == 1 ? this.query.status = 2 : this.query.status = 0;
    }
  }
};
</script>