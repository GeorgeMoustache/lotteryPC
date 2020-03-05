<template lang="pug">
.profile_record-main
  .profile_record-head
    .date-row
      .quick-date 快捷选时：
        RadioGroup(v-model="dateType" type="button" @on-change="quickDate()") 
          Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
      .custom-date 自选时间：
        Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
    span 紅包類型：
      Select.form-width-sm.mr10(v-model="query.redpackType")
        Option(v-for="(item, index) in ['全部', '普通红包', '炫耀红包', '单雷红包', '多雷红包']" :value="index" :key="index") {{item}}
    Button(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索
  .today-detail.mr10(align="right") 
    | {{type == 1 ? '发包' : '領包'}}金额：
    span.text-error {{totalMoney}}　
    | 详情数据每10分钟统计一次，以明细为准
  record-table(:loading="loading" :data="list" :columns="tableColumns()")
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from 'vuex';
import { recordApi } from 'api';
import RecordTable from 'components/themeMix/RecordTable';
import mixins from 'utils/mixins/quickDate';

export default {
  name: 'RecordTrans',
  props: ['type'],
  mixins: [mixins],
  components: {
    RecordTable
  },
  data () {
    return {
      submiting: false,
      loading: false,

      // query
      query: {
        current: 1,
        size: 20,
        constomDate: '',
        type: this.type,
        redpackType: 0 //紅包類型[0:全部, 1:普通, 2:炫耀, 3:單雷, 4:多雷]
      },

      list: [],
      total: 0,
      totalMoney: 0,
      dateType: 0,
      newDateArray: [],
      firstFetch: true,
    }
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

    this.fetchData()
  },
  methods: {
    tableColumns () {
      let columns = []
      if (this.query.type == 1) {
        columns = [
          {
            title: '日期',
            key: 'date'
          }, {
            title: '房间',
            key: 'room'
          }, {
            title: '红包类型',
            key: 'redpack'
          }, {
            title: '发包金额',
            key: 'money'
          }, {
            title: '发包退回金额',
            key: 'returnMoney'
          },{
            title: '获赔金额',
            key: 'compensateMoney'
          }
        ]
      } else {
        columns = [
          {
            title: '日期',
            key: 'date'
          }, {
            title: '房间',
            key: 'room'
          }, {
            title: '红包类型',
            key: 'redpack'
          }, {
            title: '領包金额',
            key: 'money'
          }, {
            title: '赔付金额',
            key: 'compensateMoney'
          }
        ]
      }
      
      return columns
    },
    fetchData () {
      this.submiting = true
      this.loading = true

      //預設從 api 拉取今日資料
      if (this.firstFetch) {
        let dateFormat = "yyyy-MM-dd";
        let today = new Date().Format(dateFormat);
        this.query.constomDate = today + ',' + today;
        this.firstFetch = false;
      }

      recordApi.recordRedpack({params: this.query}).then(data => {
        let { list, total, totalMoney } = data;
        this.loading = false
        this.submiting = false
        if (data.code != 0) return
        this.list = list
        this.total = total;
        this.totalMoney = totalMoney
      })
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    searchData() {
      this.query.current = 1
      this.fetchData()
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

.platform {
  margin-bottom: 10px;
  .trans-out,
  .trans-in {
    display: inline-flex;
    align-items: center;
    width: 200px;
    white-space: nowrap;
  }
  .trans-out {
    margin-right: 20px;
  }
  .trans-in {
    margin-right: 10px;
  }
}
</style>