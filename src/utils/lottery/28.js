import { createTemplate, pokerSplice, rand } from './helper';

const LABLES = {
	// 北京28
	HHHH: ['大', '小', '单', '双', '大单', '小单', '大双', '小双', '极大', '极小']
}

// 北京28
const BJ28 = {
	/********************************************************************************
	 * 混合
	 *******************************************************************************/
	// 混合
	// ------------------------------------------------------------------------------
	HHHH: {
		tplData: createTemplate({
			formatFn: i => {
				return LABLES.HHHH[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.HHHH[rand()])
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
	TMTM: {
		tplData: createTemplate({
			max: 27
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(rand(27))
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
	TMTMB3: {
		tplData: createTemplate({
			max: 27
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList.splice(0, 1, pokerSplice(0, 27, 3))
				return
			}
		},
		// 计算 注
		selectedCount() {
			let needCount = 0
			let sum = this.selectedList.reduce((pre, cur) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			this.needCount = sum == 3 ? 1 : 0
			return sum
		}
	},
	BSBS: {
		tplData: createTemplate({
			max: 2,
			formatFn: i => {
				return '红绿蓝'.charAt(i) + '波'
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('红绿蓝'.charAt(rand(2)) + '波')
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
	BZBZ: {
		tplData: createTemplate({
			max: 0,
			formatFn: i => {
				return '豹子'
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('豹子')
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
	}
}

export default BJ28;
