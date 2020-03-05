<template lang="pug">
.manage-icode
  Form(ref="form", :label-width="120")
    FormItem(label="开户类型：")
      RadioGroup(v-model="query.userType" type="button" @on-change="onChange")
        Radio(label=1) 代理
        Radio(label=0) 玩家
  record-table(:loading="loading", :data="list", :columns="tableColumns()")
  .table-page(v-if="list.length")
    Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  button(style="display:none;" ref="copybtn" v-clipboard="copyData" @success="handleSuccess" @error="handleError") 复制
  Alert(type="warning" show-icon) 温馨提示：“邀请码” 与 “注册链接” 功能一致，可以复制邀请码、注册链结，或直接复制二维码转发注册链结。
  Modal(v-model="infoModal")
    h3(slot="header") 详情
    Form(:label-width="120")
      FormItem(v-for="(item, index) in infoList", :key="index", :label="item.label")
        Input.form-width-sm(:value="item.setPoint", :readonly="true", :disabled="true")
  //- 代理會員註冊
  Modal#proxyReg(v-model="regPanelEnabled" :class="{'active': regPanelEnabled}" title="会员注册" width="875")
    Register(:inviteCode="inviteCode")
    div(slot="footer")
</template>

<script>
import { agentApi } from 'api';
import RecordTable from 'components/themeMix/RecordTable';
import Register from 'components/Register';

export default {
  name: 'ManageIcode',
  inject: ['ivNotice'],
  components: {
    RecordTable,
    Register
  },
  data () {
    return {
      query: {
        userType: '1',
        current: 1,
        size: 20
      },
      list: [],
      total: 0,
      loading: false,
      copyData: ' ',

      infoModal: false,
      infoList: [],

      regPanelEnabled: false,
      inviteCode: '',
    }
  },
  created () {
    this.fetchData()
    this.$bus.$on('closeRegPanel', this.closeRegPanel)
  },
  beforeDestroy() {
    this.$bus.$off('closeRegPanel');
  },
  methods: {
    fetchData () {
      this.loading = true;
      agentApi.getInviteUrl({params: this.query}).then(data => {
        this.loading = false;
        let { code, msg } = data;
        if (code != 0) return this.ivNotice('warning', msg)
        this.list = data.list
        this.total = data.total
      })
    },
    tableColumns () {
      let columns = [
        {
          title: '邀请码',
          render: (h, {row}) => {
            let value = row.inviteCode
            return h('div', [
              h('Input', {
                props: {
                  size: 'small',
                  readonly: true,
                  value: value
                },
                'class': 'form-width-sm'
              }),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.copy(value)
                  }
                }
              }, '复制')
            ])
          }
        },
        {
          title: '注册链接',
          render: (h, {row}) => {
            let value = row.inviteUrl;
            let qrCodeLink = row.qrCodeLink;
            return h('div', [
              h('Input', {
                props: {
                  size: 'small',
                  readonly: true,
                  value: value
                },
                'class': 'form-width-sm'
              }),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.copy(value)
                  }
                }
              }, '复制'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.copy(qrCodeLink)
                  }
                }
              }, '复制二维码')
            ])
          }
        },
        {
          title: '备注',
          render: (h, {row}) => {
            let value = row.remark && row.remark.trim()
            if (value == '') value = '未设置'
            return h('Button', {
              props: {
                size: 'small',
                type: 'text'
              },
              on: {
                click: () => {
                  this.onComfirm(row)
                }
              }
            }, value)
          }
        },
        {
          title: '生成时间',
          key: 'addTime'
        },
        {
          title: '状态',
          key: 'state'
        },
        {
          title: '操作',
          render: (h, {row, index}) => {
            return h('div', {
              'class': 'util'
            }, [
              h('a', {
                on: {
                  click: () => {
                    this.onInfoModal(row)
                  }
                }
              }, '详情'),
              <span>|</span>,
              h('a', {
                on: {
                  click: () => {
                    this.openRegPanel(row.inviteCode)
                  }
                }
              }, '会员注册'),
              <span>|</span>,
              h('a', {
                on: {
                  click: () => {
                    this.onDelModal(row, index)
                  }
                }
              }, '删除')

            ])
          }
        }
      ]
      return columns
    },
    onComfirm (obj) {
      let remark = obj.remark
      this.$Modal.confirm({
        title: '备注',
        loading: true,
        render: (h) => {
          return h('Input', {
            style: {
              marginTop: '24px'
            },
            props: {
              value: remark,
              autofocus: true,
              placeholder: '请输入备注名'
            },
            on: {
              input: (val) => {
                this.value = val
                remark = val
              }
            }
          })
        },
        onOk: () => {
          agentApi.inviteUrlRemark({inviteCode: obj.inviteCode, remark: remark}).then(data => {
            let { code, msg } = data;
            if (code != 0) return this.ivNotice('warning', msg)
            this.ivNotice('success', msg)
            this.$Modal.remove()
            obj.remark = remark
          })
        }
      })
    },
    onInfoModal ({inviteCode}) {
      agentApi.rebateInfo({params: {inviteCode: inviteCode}}).then(data => {
        let { code, msg } = data;
        if (code != 0) return this.ivNotice('warning', msg)
        this.infoModal = true
        this.infoList = data.list
      })
    },
    onDelModal (row, index) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '您确定要删除这条邀请码吗？',
        onOk: () => {
          agentApi.delInviteUrl({params: {inviteCode: row.inviteCode}}).then(data => {
            let { code, msg } = data;
            if (code != 0) return this.ivNotice('warning', msg)
            this.ivNotice('success', msg)
            this.list.splice(index, 1)
          })
        }
      })
    },
    copy (context) {
      this.copyData = context
      // !!!
      setTimeout(() => {
        this.$refs.copybtn.click()
      }, 100)
    },
    handleSuccess (e) {
      this.ivNotice('success', '复制成功')
    },
    handleError (e) {
      this.ivNotice('warning', '复制失败')
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    },
    onChange () {
      this.query.current = 1
      this.fetchData()
    },
    //開啟代理會員註冊彈窗並傳入邀請碼
    openRegPanel(inviteCode) {
      this.inviteCode = inviteCode;
      this.regPanelEnabled = true;
    },
    //關閉代理會員註冊彈窗並傳入邀請碼
    closeRegPanel() {
      this.inviteCode = '';
      this.regPanelEnabled = false;
    },
  }
}
</script>

<style lang="scss">
.manage-icode {
  .util a {
    padding: 5px;
  }
  .util span {
    padding: 5px;
  }
  .ivu-btn-text {
    margin-left: 3px;
  }
}
</style>
