<template lang="pug">
.agent-wrap
  .agent-member
    .user-header.mb20
      h3 会员管理
        a(v-for="(item, index) in lowerNames", :key="item.userName + item.userId") &nbsp;&gt;&nbsp;
          span(v-text="item.userName" @click="returnBack(index)")
    .mb20
      label 账号：
      Input.form-width-sm.mr10(type="text" v-model="query.userName")
      label 用户类型：
      Select.form-width-sm.mr10(v-model="query.userType")
        Option(value="-1") 全部
        Option(value="1") 代理
        Option(value="0") 玩家
    .sort.mb20 资料排序方式：
      RadioGroup(v-model="query.sort" @on-change="searchData()")
        Radio(v-for="(item, index) in ['账号', '余额', '注册时间', '最后登录']" :label="index" :key="index") {{item}}
      Button.ml10(type="info" icon="ios-search" @click="searchData()" :loading="submiting") 搜索
    record-table(:loading="submiting", :data="list", :columns="tableColumns()")
    .table-page(v-if="list.length")
      Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  Modal(v-model="infoModal")
    h3(slot="header") 详情
    Form(:label-width="120")
      FormItem(v-for="(item, index) in infoList", :key="index", :label="item.label")
        Input.form-width-sm(:value="item.setPoint", :readonly="true", :disabled="true")
</template>

<script>
import { agentApi } from 'api';
import RecordTable from 'components/themeMix/RecordTable';

export default {
  name: 'AgentMember',
  components: {
    RecordTable
  },
  data () {
    return {
      queryUserName: '',
      query: {
        current: 1,
        size: 20,
        userId: 0,
        userName: '',
        userType: '-1',
        sort: 0
      },
      list: [],
      total: 0,
      submiting: false,

      infoModal: false,
      infoList: [],

      lowerNames: [],
      cache: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.submiting = true
      agentApi.memberList({params: this.query}).then(data => {
        this.submiting = false
        if (data.code != 0) return this.notice(data.msg || '获取数据失败', 'warning')
        this.list = data.list
        this.total = data.total
        let {userName, current, userType, userId} = this.query
        this.cache[[userName, current, userType, userId].join('@')] = {
          list: JSON.parse(JSON.stringify(data.list)),
          total: data.total,
          current: +data.current
        }
      })
    },
    checkData () {
      let {userName, current, userType, userId} = this.query
      let key = [userName, current, userType, userId].join('@')
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
    searchData() {
      this.query.current = 1;
      this.query.userId = 0;
      this.lowerNames.splice(0);
      this.fetchData();
    },
    seeLower (userId, userName) {
      Object.assign(this.query, {
        current: 1,
        userId,
        userName,
      })
      this.lowerNames.push({
        userId,
        userName,
      })
      this.checkData()
    },
    returnBack (index) {
      let { userId = 0, userName = '' } = this.lowerNames[index - 1] || {};
      this.query.userName = userName
      this.query.userId = userId
      this.query.current = 1
      this.lowerNames.splice(index)
      this.checkData()
    },
    tableColumns () {
      let columns = [
        {
          title: '账号',
          key: 'userName'
        },
        {
          title: '用户类型',
          key: 'userType'
        },
        {
          title: '下级人数',
          render: (h, {row}) => {
            let {lowerCount, userType} = row
            if (lowerCount > 0 && ~userType.indexOf('代理')) {
              return h('a', {
                'class': 'text-error',
                on: {
                  click: () => {
                    let {userId, userName} = row
                    this.seeLower(userId, userName)
                  }
                }
              }, lowerCount)
            } else {
              return h('div', lowerCount)
            }
          }
        },
        {
          title: '余额',
          key: 'balance'
        },
        {
          title: '注册时间',
          key: 'regTime',
        },
        {
          title: '最后登录',
          key: 'loginTime'
        },
        {
          title: '操作',
          render: (h, {row}) => {
            return h('div', {
              'class': 'util'
            }, [
              h('router-link', {
                props: {
                  to: {path: `/profile/agent/RecordBet?username=${row.userName}`}
                }
              }, '投注明细'),
              h('router-link', {
                props: {
                  to: {path: `/profile/agent/RecordBill?username=${row.userName}`}
                }
              }, '交易明细'),
              h('a', {
                on: {
                  click: () => {
                    this.onInfoModal(row.userId)
                  }
                }
              }, '查看返点')
            ])
          }
        }
      ]
      return columns
    },
    onInfoModal (userId) {
      agentApi.rebateInfo({params: {userId: userId}}).then(data => {
        if (data.code != 0) return this.notice(data.msg || '获取数据失败', 'warning')
        this.infoModal = true
        this.infoList = data.list
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    }
  }
}
</script>

<style lang="scss">
.agent-member {
  .util a {
    font-size: 12px;
    padding: 5px;
  }
}
</style>
