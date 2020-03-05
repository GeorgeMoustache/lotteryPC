<template lang="pug">
ul.tree
	li.tree-node
		router-link.tree-content.tree-root(tag="div" :to="{path: '/lottery'}")
			span.label 购彩大厅
			Icon.refresh(type="ios-loop-strong" @click.native="refresh" :class="{'loading': loading}")
	li.tree-node(v-for="folder in folders")
		tree-folder(:folder="folder" :cls="cls" visible)
</template>

<script>
import TreeFolder from './tree-folder';
import { mapGetters } from 'vuex';

export default {
	name: 'Tree',
	components: {
		TreeFolder
	},
	data () {
		return {
			cls: 'tree-root',
			loading: false
		}
	},
	computed: {
		...mapGetters([
			'requesting',
			'error',
			'sideNav'
		]),
		folders () {
			let data = this.sideNav
			if (data.length == 0) return
			const rootNames = ['热门彩种', '高频彩', '低频彩']
			let result = []
			result.push({
				label: rootNames[0],
				children: data.hots
			})

			const groupList = this.$root.CATEGORYS;
			const high = groupList.slice(1).map(group => { // 排除第一个“全部彩种”
				const { groupId, groupName } = group;
				const list = data.list.filter(item => {
					const { column, type } = item;
					return column == 1 && type == groupId;
				});
				return {
					label: groupName,
					children: list,
				};
			})
			result.push({
				label: rootNames[1],
				children: high
			})

			let low = data.list.filter(item => item.column == 2)
			if (low.length) {
				result.push({
					label: rootNames[2],
					children: low
				})
			}
			return result
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.$store.dispatch('sideNav')
		},
		refresh () {
			this.loading = true
			clearTimeout(this.tid)
			this.tid = setTimeout(() => {
				this.fetchData()
				this.loading = false
				this.$Message.info('已更新，请不要频繁操作')
			}, 500)
		}
	}
}
</script>

<style lang="scss">

.tree {
	$border: 1px solid #c8c8c8;
	li {
		border-top: $border;
		line-height: 30px;
		cursor: pointer;
	}
	.tree-content {
		@include clearfix();
		padding: 5px 15px;
		font-size: 14px;
	}
	.tree-root {
		background: #e1e1e1;
		font-size: 16px;
	}
	.icon {
		overflow: hidden;
		float: left;
		margin-right: 15px;
		width: 30px;
		height: 30px;
		border-radius: 60px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.refresh.loading {
		animation: loop 1s linear infinite;
	}
	@keyframes loop {
		0% { transform: rotate(0deg) }
		100% { transform: rotate(360deg) }
	}
	.ivu-icon {
		float: right;
		font-size: 20px;
		line-height: 30px;
		color: #666;
	}
	.tree-node:hover > .tree-content > .icon img {
		transition: .5s;
		transform: rotate(1turn);
	}
}
</style>
