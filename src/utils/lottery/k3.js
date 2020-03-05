import { createTemplate, pokerSplice, rand, Combination } from './helper';

// 安徽快3
// 随机跟this.template有关联，购物车没有随机
const AHK3 = {
	/********************************************************************************
	 * 和值
	 *******************************************************************************/
	// 和值
	// ------------------------------------------------------------------------------
	HZHZ: {
		help: {
			desc: '从大小单双、3-18中任意选择1个或1个以上进行投注。',
			explain: '从大小单双、3-18中任意选择1个或1个以上进行投注，开奖的3个号码相加和值大小或和值属性与投注号码相同即中奖；如开奖号码：113，和值为5；投注：5，则中奖，投注：单，也中奖；',
			example: '投注：5，开奖号码：113，和值为5，即中奖；投注：“单”与开奖号码和值属性对应，也中奖；'
		},
		tplData: createTemplate({
			min: -1,
			max: 18,
			formatFn: i => i < 3 ? '大小单双'.charAt(i + 1) : i
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				// !!! value-ratio
				let value = ''
				try {
					value = this.tplData[0].nums[rand(19)]
				} catch (error) {
					value = rand(18, 3)
				}
				// selectedList = [[value]]
				this.selectedList[0].push(value)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 三同号
	 *******************************************************************************/
	// 通选
	// ------------------------------------------------------------------------------
	TH3TX: {
		help: {
			desc: '对所有相同的三个号码（111,222,...,666）进行投注。',
			explain: '对所有的豹子（111，222，333，444，555，666）进行投注。当开奖号码为任意一个豹子时，即中奖。',
			example: '投注方案：三同号通选 开奖号码：111、222、333、444、555、666，即中三同号通选。',
		},
		tplData: createTemplate({
			max: 0,
			formatFn: i => '三同号通选'
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('三同号通选')
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	// 单选
	// ------------------------------------------------------------------------------
	TH3DX: {
		help: {
			desc: '对所有相同的三个号码（111,222,...,666）中任意选择一组号码进行投注。',
			explain: '任意选择一个或多个豹子（111，222，333，444，555，666）进行投注，选号与开奖号码一致即中奖。',
			example: '投注方案：111<br>开奖号码：111，即中三同号单选。'
		},
		tplData: createTemplate({
			min: 1,
			max: 6,
			formatFn: i => '' + i + i + i
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let i = rand(6, 1)
				this.selectedList[0].push('' + i + i + i)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 三不同号
	 *******************************************************************************/
	// 标准
	// ------------------------------------------------------------------------------
	BTH3BZ: {
		help: {
			desc: '对三个各不相同的号码进行投注。',
			explain: '从1-6中任选3个或多个号码，所选号码与开奖号码的3个号码相同（顺序不限）即中奖。',
			example: '投注方案：123<br>开奖号码：123，即中三不同号。'
		},
		tplData: createTemplate({
			min: 1,
			max: 6
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let rex = this.mode.match(/BTH(\d+)BZ/)
				let len = rex ? rex[1] : 3
				let ary = pokerSplice(1, 6, len)
				this.selectedList.splice(0, 1, ary)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let rex = this.mode.match(/BTH(\d+)BZ/)
			let len = rex ? rex[1] : 3
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				let n = cur.length
				if (!n) return 0
				return pre + Combination(n, len)
			}, 0)
			this.count = sum
			return sum
		}
	},
	// 胆拖
	// ------------------------------------------------------------------------------
	BTH3DT: {
		help: {
			desc: '从1-6中，选取3个及以上的号码进行投注，每注需至少包括1个胆码及2个拖码。',
			explain: '选1~2个胆码，选1~5个拖码，胆码加拖码不少于3个，选号与开奖号相同即中奖。',
			example: '投注方案：胆码5，拖码34 开奖号码：345，即中三不同号胆拖。'
		},
		tplData: createTemplate({
			time: 2,
			min: 1,
			max: 6
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let rex = this.mode.match(/BTH(\d+)DT/)
				let len = rex ? rex[1] : 3
				let ary = pokerSplice(1, 6, len)
				this.selectedList.splice(0, 1, [ary.shift()])
				this.selectedList.splice(1, 1, ary)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let rex = this.mode.match(/BTH(\d+)DT/)
			let len = rex ? rex[1] : 3
			let ary = this.selectedList
			let danLen = ary[0].length
			let tuoLen = ary[1].length
			let sum = (danLen && tuoLen) ? Combination(tuoLen, len - danLen) : 0
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 三连号
	 *******************************************************************************/
	// 通选
	// ------------------------------------------------------------------------------
	LH3TX: {
		help: {
			desc: '对所有三个相连的号码（仅限：123、234、345、456）进行投注。',
			explain: '对所有三个相连的号码（仅限：123、234、345、456）进行投注，当开奖号码为任意1个三连号时，即中奖。',
			example: '投注方案：三连号通选 开奖号码：123、234、345、456，即中三连号通选。'
		},
		tplData: createTemplate({
			max: 0,
			formatFn: i => '三连号通选'
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('三连号通选')
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 二同号
	 *******************************************************************************/
	// 复选
	// ------------------------------------------------------------------------------
	TH2FX: {
		help: {
			desc: '对三个号码中两个指定的相同号码和一个任意号码进行投注。',
			explain: '对所有的对子（11，22，33，44，55，66）进行投注。当开奖号码中包含选择的对子(不含豹子)时，即中奖。',
			example: '投注方案：11 开奖号码：112、113、114、115、116，即中二同号复选。'
		},
		tplData: createTemplate({
			min: 1,
			max: 6,
			formatFn: i => '' + i + i
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let i = rand(6, 1)
				this.selectedList[0].push('' + i + i)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	// 单选
	// ------------------------------------------------------------------------------
	TH2DX: {
		help: {
			desc: '对三个号码中两个指定的相同号码和一个指定的不同号码进行投注。',
			explain: '至少选择1对相同号码和1个不同号码进行投注，所选号码与开奖号码的3个号码相同即中奖。',
			example: '投注方案：同号11，不同号2<br>开奖号码：112，即中二同号单选。'
		},
		tplData: createTemplate({
			time: 2,
			min: 1,
			max: 6,
			formatFn: (i, time) => time == 1 ? i : '' + i + i
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 6, 2)
				let n1 = ary.shift()
				this.selectedList.splice(0, 1, ['' + n1 + n1])
				this.selectedList.splice(1, 1, ary)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre * cur.length
			}, 1)
			this.count = sum
			return sum
		}
	}
}
AHK3.BTH2BZ = Object.assign({}, AHK3.BTH3BZ) // 二不同号-标准
AHK3.BTH2DT = Object.assign({}, AHK3.BTH3DT) // 二不同号-胆拖
AHK3.BTH2BZ.help = {
	desc: '对三个号码中两个指定的不同号码和一个任意号码进行投注。',
	explain: '从1-6中任选2个或多个号码，所选号码与开奖号码任意2个号码相同，即中奖。',
	example: '投注方案：12 开奖号码：123、112，即中二不同号。'
}
AHK3.BTH2DT.help = {
	desc: '从1~6中，选取2个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
	explain: '选1个胆码，选1~5个拖码，胆码加拖码不少于2个，选号与开奖号码任意2号相同即中奖。',
	example: '投注方案：胆码1，拖码2 开奖号码：123、112，即中二不同号胆拖。'
}

export default AHK3;
