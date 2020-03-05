<template lang="pug">
.agent-member
  .user-breadcrumb
    a(v-for="(item, index) in lowerNames" :key="item.userName + item.userId" @click="returnBack(index)" v-text="item.userName")
  .filter
    .user 账号：
      Input(type="text" v-model="query.userName")
    .option 用户类型：
      Select(v-model="query.userType")
        Option(value="-1") 全部
        Option(value="1") 代理
        Option(value="0") 玩家
    .sort 资料排序方式：
      RadioGroup(v-model="query.sort" @on-change="searchData()")
        Radio(v-for="(item, index) in ['账号', '余额', '注册时间', '最后登录']" :label="index" :key="index") {{item}}
    .submit
      Button(type="info" @click="searchData()" :loading="submiting") 搜索
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
import RecordTable from 'components/themeBoMao/RecordTable';

export default {
  name: 'AgentMember',
  components: {
    RecordTable,
  },
  inject: ['ivNotice'],
  data() {
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
      cache: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.submiting = true;
      agentApi.memberList({ params: this.query }).then(data => {
        this.submiting = false;
        if (data.code != 0) return this.ivNotice('warning', data.msg || '获取数据失败');
        this.list = data.list;
        this.total = data.total;
        let { userName, current, userType, userId } = this.query;
        this.cache[[userName, current, userType, userId].join('@')] = {
          list: JSON.parse(JSON.stringify(data.list)),
          total: data.total,
          current: +data.current,
        };
      });
    },
    checkData() {
      let { userName, current, userType, userId } = this.query;
      let key = [userName, current, userType, userId].join('@');
      let obj = this.cache[key];
      if (obj) {
        this.list.splice(0);
        this.list.push(...obj.list);
        this.total = obj.total;
        this.query.current = obj.current;
      } else {
        this.fetchData();
      }
    },
    searchData() {
      this.query.current = 1;
      this.query.userId = 0;
      this.lowerNames.splice(0);
      this.fetchData();
    },
    seeLower(userId, userName) {
      Object.assign(this.query, {
        current: 1,
        userId,
        userName,
      });
      this.lowerNames.push({
        userId,
        userName,
      });
      this.checkData();
    },
    returnBack(index) {
      let { userId = 0, userName = '' } = this.lowerNames[index - 1] || {};
      this.query.userName = userName;
      this.query.userId = userId;
      this.query.current = 1;
      this.lowerNames.splice(index);
      this.checkData();
    },
    tableColumns() {
      let columns = [
        {
          title: '账号',
          key: 'userName',
        },
        {
          title: '用户类型',
          key: 'userType',
        },
        {
          title: '下级人数',
          render: (h, { row }) => {
            let { lowerCount, userType } = row;
            if (lowerCount > 0 && ~userType.indexOf('代理')) {
              return h(
                'a',
                {
                  class: 'text-error',
                  on: {
                    click: () => {
                      let { userId, userName } = row;
                      this.seeLower(userId, userName);
                    },
                  },
                },
                lowerCount
              );
            } else {
              return h('div', lowerCount);
            }
          },
        },
        {
          title: '余额',
          key: 'balance',
        },
        {
          title: '注册时间',
          key: 'regTime',
        },
        {
          title: '最后登录',
          key: 'loginTime',
        },
        {
          title: '操作',
          render: (h, { row }) => {
            return h(
              'div',
              {
                class: 'util',
              },
              [
                h(
                  'router-link',
                  {
                    props: {
                      to: { path: `/profile/agent/RecordBet?username=${row.userName}` },
                    },
                  },
                  '投注明细'
                ),
                h(
                  'router-link',
                  {
                    props: {
                      to: { path: `/profile/agent/RecordBill?username=${row.userName}` },
                    },
                  },
                  '交易明细'
                ),
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.onInfoModal(row.userId);
                      },
                    },
                  },
                  '查看返点'
                ),
              ]
            );
          },
        },
      ];
      return columns;
    },
    onInfoModal(userId) {
      agentApi.rebateInfo({ params: { userId: userId } }).then(data => {
        if (data.code != 0) return this.ivNotice('warning', data.msg || '获取数据失败');
        this.infoModal = true;
        this.infoList = data.list;
      });
    },
    changePage(value) {
      this.query.current = value;
      this.fetchData();
    },
  },
};
</script>