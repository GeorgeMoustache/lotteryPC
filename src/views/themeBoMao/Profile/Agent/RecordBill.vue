<template lang="pug">
.record-bill
  .filter
    .quick-date
      RadioGroup(v-model="dateType" type="button" @on-change="quickDate(); resetCurrent()") 
        Radio(v-for="(item, index) in newDateArray" :label="index" :key="index") {{item}}
    .custom-data 自选时间：
      Date-picker(type="daterange" v-model="customDate" :options="dateRangeOpt" format="yyyy-MM-dd" placeholder="选择时间" @on-change="changeCustomDate($event)")
    .option(v-if="mainTypeValue != 1") 时选方式：
      Select(v-model="query.timeType" @on-change="changeTimeType()")
        Option(v-for="(item, index) in ['发起时间', '处理时间']" :value="index" :label="item" :key="index")
    .user
      label 会员账号：
        Input(type="text" v-model="query.userName" placeholder="下级交易查询" @on-change="resetCurrent()")
    .option
      span 主类：
      Select.form-width-sm(v-model="mainTypeValue" @on-change="getSubList()")
        Option(v-for="item in mainTypeList" :key="item.type" :value="item.type" :label="item.label")
      span {{subTypeTitle}}
      Select.form-width-sm(v-model="query.type" @on-change="resetCurrent()")
        template(v-if="mainTypeValue == 2 && query.timeType == 1")
          Option(v-for="item in subTypeList" :key="item.type" :value="item.type" :label="item.label" v-if="item.type == 1 || item.type == 2 || item.type == 4")
        template(v-else-if="mainTypeValue == 3 && query.timeType == 1")
          Option(v-for="item in subTypeList" :key="item.type" :value="item.type" :label="item.label" v-if="item.type == 2 || item.type == 3 || item.type == 4")
        template(v-else)
          Option(v-for="item in subTypeList" :key="item.type" :value="item.type" :label="item.label")
    .submit
      Button(type="info" @click="searchData()" :loading="submiting") 搜索
  record-table(:loading="submiting", :data="list", :columns="tableColumns")
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  Modal(v-model="modal" width="600")
    p(slot="header") 详情
    p(v-html="info.note" style="line-height: 2")
    p(slot="footer")
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from "vuex";
import { agentApi } from 'api';
import RecordTable from 'components/themeBoMao/RecordTable';
import mixins from 'utils/mixins/quickDate';

export default {
  name: 'AgentRecordBill',
  mixins: [mixins],
  components: {
    RecordTable
  },
  data () {
    return {
      dateType: 0,
      mainTypeList: [], //主類 + 次類列表
      mainTypeValue: 0,  //主類 type
      subTypeList: [], //次類列表
      subTypeTitle: '', //次類標題
      filterChanged: false, //是否更動過主類及次類
      query: {
        startDate: '',
        endDate: '',
        current: 1,
        size: 20,
        userName: this.$route.query.username || '',
        type: 0,
        timeType: 0 //時選方式
      },
      submiting: false,
      listType: '', //資料列表使用何種表格
      list: [],
      total: 0,
      newDateArray: [],
      firstFetch: true,
      // modal
      modal: false,
      info: {},
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
    tableColumns () {
      let columns = []
      switch (this.listType) {
        case 1:
          columns = [
            {
              title: '账号',
              key: 'userName',
              className: 'text-info'
            },
            {
              title: '时间',
              key: 'addTime'
            },
            {
              title: '摘要',
              key: 'typeName'
            },
            {
              title: '收入金额',
              key: 'inMoney'
            },
            {
              title: '支出金额',
              key: 'outMoney'
            },
            {
              title: '可用余额',
              key: 'balance'
            },
            {
              title: '备注',
              render: (row, column, index) => {
                let note = column.row.remarks;
                if(note.length > 1) {
                  return row('a',{
                    on: {
                      click: () => {
                        this.modal = true
                        this.info.note = note
                      }
                    }
                  } , '查看详情')
                } else {
                  return row('span', '')
                }
              }
            },
            {
              title: '状态',
              render: (h, {row}) => {
                if (row.status == 0) {
                  return <span class="text-success">成功</span>
                } else {
                  return <span class="text-error">失败</span>
                }
              }
            }
          ]
          break;
        case 2:
          columns = [
            {
              title: '账号',
              key: 'userName',
              className: 'text-info'
            },
            {
              title: '发起时间',
              key: 'addTime'
            },
            {
              title: '充值金额',
              key: 'payMoney'
            },
            {
              title: '到账金额',
              key: 'intoMoney'
            },
            {
              title: '状态',
              key: 'state'
            }
          ]
          break;
        case 3:
          columns = [
            {
              title: '账号',
              key: 'userName'
            },
            {
              title: '提现银行',
              key: 'bankName'
            },
            {
              title: '银行卡号',
              key: 'bankCardNo'
            },
            {
              title: '姓名',
              key: 'ownerName'
            },
            {
              title: '提现金额',
              key: 'withdrawMoney'
            },
            {
              title: '提现时间',
              key: 'addTime'
            },
            {
              title: '状态',
              key: 'state'
            }
          ]
          break;
        default:
          break;
      }
      return columns
    }
  },
  created () {
    //測試帳號快捷選時功能限制
    if (this.accountInfo.type == 3) {
      this.dateAry.length = 4;
    }

    //取得快捷選時列表
    this.newDateArray = this.dateAry;

    this.fetchTypes();
  },
  methods: {
    //取得次類標題文字
    getSubTypeTitle() {
      if (this.mainTypeValue == 1) {
        this.subTypeTitle = '摘要：'
      } else {
        this.subTypeTitle = '状态：'
      }
    },
    //獲取主類及次類列表
    fetchTypes () {
      agentApi.billTypes().then(data => {
        let { code, msg, list } = data;
        if (data.code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg
          })
          return
        }
        this.mainTypeList = list;
        this.mainTypeValue = list[0].type;
        this.subTypeList = this.mainTypeList[0].subList;
        this.getSubTypeTitle();
        this.fetchData();
      })
    },
    //獲取資料
    fetchData () {
      this.submiting = true

      //判斷使用何種方式打 api
      let api;
      if (this.mainTypeValue == 1) {
        api = 'recordBill';
      } else if (this.mainTypeValue == 2) {
        api = 'recordRecharge';
      } else {
        api = 'recordWithdraw';
      }
      
      //預設從 api 拉取今日資料
      if (this.firstFetch) {
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
        this.$router.push({});
        delete this.query['date'];
      }

      //判斷如果變更過搜尋選項就將 current 重設為 1
      if (this.filterChanged) {
        this.query.current = 1;
      }

      agentApi[api]({params: this.query}).then(data => {
        this.submiting = false
        let { code, msg, list, total } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg
          })
          return
        }
        this.list = list;
        this.total = total;
        this.listType = this.mainTypeValue;
        this.filterChanged = false;
      })
    },
    //如主類及次類有變更則重置 current 為 1
    resetCurrent() {
      this.filterChanged = true;
    },
    //主類變更 tirgger 次類別標題及列表更新
    getSubList() {
      this.mainTypeList.forEach((item) => {
        if (item.type == this.mainTypeValue) {
          this.subTypeList = item.subList;
        }
      })
      this.query.type = this.subTypeList[0].type;
      this.getSubTypeTitle();
      this.query.timeType = 0;
      this.resetCurrent();
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    searchData() {
      this.query.current = 1;
      this.fetchData();
    },
    //變更時選方式
    changeTimeType() {
      if (this.mainTypeValue == 2) {
        this.query.timeType == 1 ? this.query.type = 1 : this.query.type = -1;
        return
      }

      if (this.mainTypeValue == 3) {
        this.query.timeType == 1 ? this.query.type = 2 : this.query.type = -1;
        return
      }
    }
  }
}
</script>
