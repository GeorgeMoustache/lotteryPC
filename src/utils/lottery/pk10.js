import { createTemplate, padLeftZero, pokerSplice, rand, unique, uniqueSelecteCount, pushCart } from './helper';

// 北京PK拾
const BJPK10 = {
	/********************************************************************************
	 * 前一直选
	 *******************************************************************************/
	Q1ZX: {
		help: {
			desc: '从第一名中至少选择1个号码组成一注。',
			explain: '从01-10中至少选择1个号码组成一注，所选号码与开奖号码中第一位相同即中奖。',
			example: '投注方案：01<br>开奖号码：01 02 03 04 05 06 07 08 09 10<br>即可中前一直选。'
		},
		tplData: createTemplate({
			min: 1,
			max: 10,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				const len = this.template.length
				let index = 0
				while (index < len) {
					this.selectedList[index].push(padLeftZero(rand(10, 1)))
					index++
				}
				return
			}
			while (time > 0) {
				let len = this.template.length
				let index = 0
				let result = []
				while (index < len) {
					result.push(padLeftZero(rand(10, 1)))
					index++
				}
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = 0
			sum = this.selectedList.reduce((pre, cur, idx) => {
				return pre * cur.length
			}, 1)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 前二直选
	 *******************************************************************************/
	Q2ZX: {
		help: {
			desc: '从第一名、第二名中至少选择1个号码组成一注。',
			explain: '从冠军、亚军位中至少各选择一个号码组成一注，开奖号码中第一、第二位与选号按位相同，即为中奖。',
			example: '投注方案：冠军01，亚军02 开奖号码：01 02 03 04 05 06 07 08 09 10即可中前二直选。'
		},
		tplData: createTemplate({
			time: 2,
			min: 1,
			max: 10,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 10, 2)
				let len = this.template.length
				let index = 0
				while (index < len) {
					this.selectedList[index].push(padLeftZero(ary[index]))
					index++
				}
				return
			}
			while (time > 0) {
				let result = []
				let ary = pokerSplice(1, 10, 2)
				let len = this.template.length
				let index = 0
				while (index < len) {
					result.push(padLeftZero(ary[index]))
					index++
				}
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = 0
			sum = this.selectedList.reduce((pre, cur, idx) => {
				return pre * cur.length
			}, 1)
			let ary = this.selectedList.reduce((pre, cur) => {
				return pre.concat(cur)
			}, [])
			sum -= ary.length - unique(ary).length
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 前三直选
	 *******************************************************************************/
	Q3ZX: {
		help: {
			desc: '从第一名、第二名、第三名中至少选择1个号码组成一注。',
			explain: '从冠军、亚军、季军位中至少各选择一个号码组成一注，开奖号码中第一、第二、第三位与选号按位相同，即为中奖。',
			example: '投注方案：冠军01，亚军02，季军03 开奖号码：01 02 03 04 05 06 07 08 09 10即可中前三直选。'
		},
		tplData: createTemplate({
			time: 3,
			min: 1,
			max: 10,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 10, 3)
				let len = this.template.length
				let index = 0
				while (index < len) {
					this.selectedList[index].push(padLeftZero(ary[index]))
					index++
				}
				return
			}
			while (time > 0) {
				let result = []
				let ary = pokerSplice(1, 10, 3)
				let len = this.template.length
				let index = 0
				while (index < len) {
					result.push(padLeftZero(ary[index]))
					index++
				}
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = uniqueSelecteCount(this.selectedList)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 定位胆
	 *******************************************************************************/
	DWD: {
		help: {
			desc: '从第一名到第十名任意位置上选择1个或1个以上号码。',
			explain: '从冠军到第十名任意位置上至少选择1个或1个以上号码，每注由1个号码组成，所选号码与相同位置上的开奖号码一致，即为中奖。',
			example: '投注方案：冠军01 开奖号码：01 02 03 04 05 06 07 08 09 10即中定位胆。'
		},
		tplData: createTemplate({
			time: 10,
			min: 1,
			max: 10,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[rand()].push(('0' + rand(10, 1)).substr(-2))
				return
			}
			while (time > 0) {
				let result = ['', '', '', '', '', '', '', '', '', '']
				result.splice(rand(), 1, ('0' + rand(10, 1)).substr(-2))
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = 0
			sum = this.selectedList.reduce((pre, cur, idx) => {
				return pre += cur.length
			}, 0)
			this.count = sum
			return sum
		}
	}
}

export default BJPK10;
