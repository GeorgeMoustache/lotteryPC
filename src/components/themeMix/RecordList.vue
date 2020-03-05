<template lang="pug">
.record-wrap
	.record-tabs
		h3 投注记录
		record-table(:loading="loading", :data="list", :columns="tableColumns()", 	@on-selection-change="handleSelectChange")
		.table-page(v-if="list.length")
			Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-sizer placement="top" :page-size-opts="[5,10,15,20]")
			Button.inline-block(type="primary" size="small" :loading="submiting" @click="cancelBet")
				span(v-if="!submiting") 撤单
				span(v-else) 执行中...
	modal4-bet-detail(:info="info", :show.sync="modal")
</template>

<script>
import { recordApi } from 'api';
import {ACCOUNT} from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import RecordTable from 'components/themeMix/RecordTable';

export default {
	name: 'RecordList',
	props: [
		'alias', // 彩种
		'curIssue', // 当前期号
		'isRefresh', // 是否更新
		'isFinish' // 是否更新
	],
	components: {
		RecordTable,
		Modal4BetDetail: () => import('./Modal4BetDetail')
	},
	computed: {
		...mapGetters({
			accountInfo: ACCOUNT.ACCOUNTINFO
		})
	},
	data () {
		return {
			query: {
				category: this.alias,
				size: 10,
				current: 1,
				tabIndex: 0
			},
			showCheckbox: false,
			loading: false,
			list: [],
			total: 0,
			modal: false,
			info: {
				showMore: false,
				viewMoreText: '...展开'
			},
			submiting: false,
			selection: []
		}
	},
	created () {
		this.init()
	},
	methods: {
		init () {
			let obj = {
				category: this.alias,
				current: 1,
				tabIndex: 0
			}
			this.query = Object.assign(this.query, obj)
			this.list.splice(0)
			this.fetchData()
		},
		fetchData () {
			if (!this.accountInfo.username) return
			this.loading = true
			recordApi.betList({params: this.query}).then((data) => {
				this.loading = false
				if (data.code != 0) return
				this.list = data.list
				this.formatList()
				this.total = data.total
			})
		},
		formatList () {
			// let curIssue = this.curIssue
			this.list = this.list.map(item => {
				if (item.state != 1) item._disabled = true
				return item
			})
		},
		tableColumns () {
			let columns = [{
					type: 'selection'
					// @on-selection-change="handleSelectChange"
				}, {
					title: '彩种',
					key: 'categoryLabel'
				}, {
					title: '期号',
					key: 'issue'
				}, {
					title: '下注玩法',
					key: 'modeLabel'
				}, {
					title: '下注号码',
					render: (h, {row}) => {
						let category = row.category || row.alias
						return h('div', {
							'class': 'betnum',
							domProps: {
								innerHTML: this.$root.formatNums(row, 'betNum')
							}
						})
					}
				}, {
					title: '下注总额',
					key: 'cost'
				}, {
					title: '中奖金额',
					key: 'win'
				},
				// {
				// 	title: '开奖号码',
				// 	render: (h, {row}) => {
				// 		return <span>{row.openNum}</span>
				// 	}
				// },
				{
					title: '状态',
					render: (h, params) => {
						let obj = params.row
						return h('b', {
							'class': obj.state == 3 ? 'text-error' : obj.state == 2 ? 'text-success' : ''
						}, this.$root.formatState(obj).replace('已结算（', '').replace(')', ''))
					}
				}, {
					title: '下注时间',
					render: (h, params) => {
						return h('span', params.row.date.substr(5))
					}
				}, {
					title: '详情',
					render: (h, params) => {
						return h('a', {
							on: {
								click: () => {
									this.showDetail(params)
								}
							}
						}, '查看')
					}
				}
			]
			return columns
		},
		notice (msg, type) {
			this.$Message[type](msg)
		},
		showDetail (obj) {
			this.modal = true
			this.info = Object.assign(this.info, obj.row, {
				showMore: false,
				viewMoreText: '...展开'
			});
		},
		handleSelectChange (selection) {
			this.selection = selection.map(item => item.id)
		},
		cancelBet () {
			if (!this.selection.length) return this.$Message.info('请选择需要撤销的注单号！')
			this.submiting = true
			this.$store.dispatch('cancelBet', this.selection).then(data => {
				this.submiting = false
				if (data.code != 0) {
					this.notice(data.msg || '操作错误', 'error')
				} else {
					this.selection.splice(0)
					this.fetchData()
					this.notice(data.msg || '操作成功', 'success')
				}
			})
		},
		// tabItemClick (value) {
		// 	this.query.tabIndex = value
		// 	this.fetchData()
		// },
		changePage (value) {
			this.query.current = value
			this.fetchData()
		},
		changePageSize (value) {
			this.query.size = value
			this.fetchData()
		}
	},
	watch: {
		alias: 'init',
		curIssue: 'formatList',
		isRefresh (value) {
			if (value) this.init()
		},
		isFinish (value) {
			if (value) this.init()
		},
		accountInfo (value) {
			if (value.username) this.fetchData()
		}
	}
}
</script>

<style lang="scss" scoped>
.record-tabs {
  border: 1px solid #dddee1;
  h3 {
    position: relative;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-bottom: 1px solid #d6d6d6;
    font-size: 14px;
    font-weight: normal;
    color: #707070;
    &:after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      height: 2px;
      width: 80px;
      background: currentColor;
    }
  }
}
.modal-table {
	margin-top: 5px;
	border: 1px solid #ccc;
	th {
		width: 20%;
	}
}
.inline-block {
	display: inline-block;
	vertical-align: middle;
}
</style>
