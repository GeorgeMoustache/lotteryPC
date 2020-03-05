<template lang="pug">
.profile_record-main
  .profile_record-head
    .date-row
      .quick-date 快捷选时：
        RadioGroup(v-model="dateType" type="button" @on-change="quickDate()") 
          Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
      .custom-date 自选时间：
        Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
    .platform
      .trans-out 转出帐户：
        Select(v-model="query.transOutId")
          Option(value="9999") 全部
          Option(v-for="item in platform" :value="item.platId" :key="item.platId") {{item.platform}}
      .trans-in 转入帐户：
        Select(v-model="query.transInId")
          Option(value="9999") 全部
          Option(v-for="item in platform" :value="item.platId" :key="item.platId") {{item.platform}}
      Button(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索
  record-table(:loading="loading" :data="list" :columns="tableColumns()")
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  modal4-bet-detail(:info="info", :show.sync="modal")
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from 'vuex';
import { recordApi, gameBoyApi } from 'api';
import RecordTable from 'components/themeMix/RecordTable';
import Modal4BetDetail from 'components/themeMix/Modal4BetDetail';
import mixins from 'utils/mixins/quickDate';

export default {
  name: 'RecordTrans',
  mixins: [mixins],
  components: {
    RecordTable,
    Modal4BetDetail
  },
  data () {
    return {
      gameList: [],
      submiting: false,
      loading: false,
      // modal
      modal: false,
      info: {
        showMore: false,
        viewMoreText: '...展开'
      },
      // query
      query: {
        current: 1,
        size: 20,
        constomDate: '',
        transOutId: '9999',
        transInId: '9999'
      },
      list: [],
      total: 0,
      today: {},
      dateType: 0,
      newDateArray: [],
      firstFetch: true,
      platform: []
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

    //取得所有帳戶平台
    gameBoyApi.allGame().then(data=>{
      this.platform = data.wallet
    })

    this.fetchData()
  },
  methods: {
    tableColumns () {
      let columns = [
        {
          title: '日期',
          key: 'date'
        }, {
          title: '交易类型',
          key: 'type'
        }, {
          title: '交易金额',
          key: 'money'
        }, {
          title: '转出',
          key: 'transout'
        }, {
          title: '转入',
          key: 'transin'
        },{
          title: '状态',
          key: 'status'
        }
      ]
      return columns
    },
    fetchData () {
      //判斷除了全部外，轉出與轉入不可以是相同的平台
      if (this.query.transOutId != '9999' && this.query.transOutId == this.query.transInId) {
        this.$Notice.error({
          title: '操作错误',
          desc: '转入与转出平台不可相同'
        });
        return
      }

      this.submiting = true
      this.loading = true

      //預設從 api 拉取今日資料
      if(this.firstFetch) {
        let dateFormat = "yyyy-MM-dd";
        let today = new Date().Format(dateFormat);
        this.query.constomDate = today + ',' + today;
        this.firstFetch = false;
      }

      recordApi.transList({params: this.query}).then(data => {
        this.loading = false
        this.submiting = false
        if (data.code != 0) return
        this.list = data.data.list
        this.total = data.data.total
      })
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    searchData() {
      this.query.current = 1
      this.fetchData()
    },
    showDetail (obj) {
      this.modal = true
      this.info = Object.assign(this.info, obj.row || obj, {
        showMore: false,
        viewMoreText: '...展开'
      });
    },
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