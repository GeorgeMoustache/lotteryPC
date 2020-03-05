import { createTemplate, padLeftZero, pokerSplice, rand, unique, Combination, uniqueSelecteCount, pushCart } from './helper';

// 广东11选5
const GD11X5 = {
	/********************************************************************************
	 * 三码
	 *******************************************************************************/
	// 后三直选复式
	// ------------------------------------------------------------------------------
	SMH3ZHX: {
		help: {
			desc: '从第三位、第四位、第五位中至少各选择1个号码。',
			explain: '从01-11中选择3个或多个不重复号码，所选号码与当期5个开奖号码中的后3个号码相同，且顺序一致，即为中奖。',
			example: '投注方案：01 02 03<br>开奖号码： * * 01 02 03 ，即中后三直选。'
		},
		tplData: createTemplate({
			time: 3,
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, 3)
				ary = ary.map(el => padLeftZero(el))
				let len = this.template.length
				let index = 0
				while (index < len) {
					this.selectedList[index].push(ary[index])
					index++
				}
				return
			}
			while (time > 0) {
				let result = []
				let ary = pokerSplice(1, 11, 3)
				ary = ary.map(el => padLeftZero(el))
				let len = this.template.length
				let index = 0
				while (index < len) {
					result.push(ary[index])
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
	// 后三组选复式
	// ------------------------------------------------------------------------------
	SMH3ZUX: {
		help: {
			desc: '从01-11中任意选择3个或3个以上号码。',
			explain: '从01-11中选择3个或多个号码，所选号码与当期5个开奖号码中的后3个号码相同，顺序不限，即为中奖。',
			example: '投注方案：01 02 03<br>开奖号码： * * 03 01 02 （后三顺序不限），即中后三组选。',
		},
		tplData: createTemplate({
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, 3)
				ary = ary.map(el => padLeftZero(el))
				this.selectedList.splice(0, 1, ary)
				return
			}
			while (time > 0) {
				let ary = pokerSplice(1, 11, 3)
				let result = [ary.map(el => padLeftZero(el))]
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				let n = cur.length
				if (!n) return 0
				return pre + Combination(n, 3)
			}, 0)
			this.count = sum
			return sum
		}
	},
	// 后三组选胆拖
	// ------------------------------------------------------------------------------
	SMH3ZUXDT: {
		help: {
			desc: '从01-11中，选取3个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
			explain: '从01-11中选择3个或多个号码进行投注，每注需至少包括1个胆码及1个拖码，共3个号码。所选单注号码与当期5个开奖号码中的后3个号码相同，顺序不限，即为中奖。',
			example: '投注方案：胆码 02，拖码 01 06<br>开奖号码：* * 02 01 06 （后三顺序不限），即中后三组选胆拖。'
		},
		tplData: createTemplate({
			time: 2,
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			let dt_rex = this.mode.match(/((\d+)ZUXDT|RXDT(\d+)Z)/)
			let len = 2
			if (dt_rex) len = dt_rex[2] ? dt_rex[2] : dt_rex[3]

			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, len)
				ary = ary.map(el => padLeftZero(el))
				this.selectedList[0].push(ary.shift())
				this.selectedList[1].push(...ary)
				return
			}
			while (time > 0) {
				let ary = pokerSplice(1, 11, len)
				ary = ary.map(el => padLeftZero(el))
				let result = [ary.shift(), ary]
				let props = {}
				if (/^RXDT/.test(this.mode)) {
					props = {
						digits: len
					}
				}
				pushCart.call(this, {
					result: result,
					props: props
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let dt_rex = this.mode.match(/((\d+)ZUXDT|RXDT(\d+)Z)/)
			let len = 2
			if (dt_rex) len = dt_rex[2] ? dt_rex[2] : dt_rex[3]

			let ary = this.selectedList
			let danLen = ary[0].length
			let tuoLen = ary[1].length
			let sum = (danLen && tuoLen) ? Combination(tuoLen, len - danLen) : 0
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 二码
	 *******************************************************************************/
	// 后二直选复式
	// ------------------------------------------------------------------------------
	EMH2ZHX: {
		help: {
			desc: '从第四位、第五位中至少各选择1个号码。',
			explain: '从每位各选1个或多个号码2个号码组成一注，所选号码与当期5个开奖号码中的后2个号码相同，且顺序一致，即为中奖。',
			example: '投注方案：01 02<br>开奖号码： * * * 01 02，即中后二直选。'
		},
		tplData: createTemplate({
			time: 2,
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, 2)
				ary = ary.map(el => padLeftZero(el))

				let len = this.template.length
				let index = 0
				while (index < len) {
					this.selectedList[index].push(ary[index])
					index++
				}
				return
			}
			while (time > 0) {
				let result = []
				let ary = pokerSplice(1, 11, 2)
				ary = ary.map(el => padLeftZero(el))
				let len = this.template.length
				let index = 0
				while (index < len) {
					result.push(ary[index])
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
	// 后二组选复式
	// ------------------------------------------------------------------------------
	EMH2ZUX: {
		help: {
			desc: '从01-11中任意选择2个或2个以上号码。',
			explain: '从11个号码中选择2个或多个号码，所选号码与当期5个开奖号码中的后2个号码相同，顺序不限，即为中奖。',
			example: '投注方案：01 02<br>开奖号码： * * * 02 01，（后二顺序不限），即中后二组选。'
		},
		tplData: createTemplate({
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, 2)
				ary = ary.map(el => padLeftZero(el))
				this.selectedList.splice(0, 1, ary)
				return
			}
			while (time > 0) {
				let ary = pokerSplice(1, 11, 2)
				let result = [ary.map(el => padLeftZero(el))]
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				let n = cur.length
				if (!n) return 0
				return pre + Combination(n, 2)
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 不定位
	 *******************************************************************************/
	// 后三位
	// ------------------------------------------------------------------------------
	BDWH3W: {
		help: {
			desc: '从01-11中任意选择1个或1个以上号码。',
			explain: '从11个号码中选择1个或多个号码，每注由1个号码组成，只要当期开奖号码中的第三位、第四位、第五位开奖号码包含所选号码，即为中奖。',
			example: '投注方案：01<br>开奖号码：* * 01 * *，* * * 01 *，* * * * 01，即中后三位。'
		},
		tplData: createTemplate({
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(padLeftZero(rand(11, 1)))
				return
			}
			while (time > 0) {
				let result = [padLeftZero(rand(11, 1))]
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 定位胆
	 *******************************************************************************/
	DWD: {
		help: {
			desc: '从任意位置上任意选择1个或1个以上号码。',
			explain: '从第一位至第五位中，任意1个或多个位置上选择1个或1个以上号码，投注号码与相同位置上的开奖号码对位一致，即为中奖。',
			example: '投注方案：第一位 01<br>开奖号码：01 * * * *，即中定位胆。'
		},
		tplData: createTemplate({
			time: 5,
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[rand(4)].push(padLeftZero(rand(11, 1)))
				return
			}
			while (time > 0) {
				let result = ['', '', '', '', '']
				result.splice(rand(4), 1, padLeftZero(rand(11, 1)))
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				return pre + cur.length
			}, 0)
			this.count = sum
			return sum
		}
	},
	/********************************************************************************
	 * 任选复式
	 *******************************************************************************/
	// 任选一中一
	// ------------------------------------------------------------------------------
	RX1Z1: {
		help: {
			desc: '从01-11中任意选择1个或1个以上号码。',
			explain: '从11个号码中选择1个或多个号码，每注由1个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
			example: '投注方案：05<br>开奖号码：08 04 11 05 03，即中任选一中一。'
		},
		tplData: createTemplate({
			min: 1,
			max: 11,
			formatFn: padLeftZero
		}),
		// 随机
		randomSelect: function(time = 0) {
			let rex = this.mode.match(/RX(\d+)Z/)
			let len = rex ? rex[1] : 1

			if (time == 0) {
				this.empty()
				let ary = pokerSplice(1, 11, len)
				ary = ary.map(el => padLeftZero(el))
				this.selectedList.splice(0, 1, ary)
				return
			}
			while (time > 0) {
				let ary = pokerSplice(1, 11, len)
				let result = [ary.map(el => padLeftZero(el))]
				pushCart.call(this, {
					result: result
				})
				time--
			}
		},
		// 计算 注
		selectedCount() {
			let rex = this.mode.match(/RX(\d+)Z/)
			let len = rex ? rex[1] : 1
			let sum = this.selectedList.reduce((pre, cur, idx) => {
				let n = cur.length
				if (!n) return 0
				return pre + Combination(n, len)
			}, 0)
			this.count = sum
			return sum
		}
	}
}
/********************************************************************************
 * 三码
 *******************************************************************************/
// 直选复式
GD11X5.SMQ3ZHX = Object.assign({}, GD11X5.SMH3ZHX)
GD11X5.SMZ3ZHX = Object.assign({}, GD11X5.SMH3ZHX)
GD11X5.SMQ3ZHX.help = {
	desc: '从第一位、第二位、第三位中至少各选择1个号码。',
	explain: '从01-11中各选择3个不重复号码组成一注，所选号码与当期5个开奖号码中的前3个号码相同，且顺序一致，即为中奖。',
	example: '投注方案：01 02 03<br>开奖号码：01 02 03 * *，即中前三直选。'
}
GD11X5.SMZ3ZHX.help = {
	desc: '从第二位、第三位、第四位中至少各选择1个号码。',
	explain: '从01-11中各选择3个不重复号码组成一注，所选号码与当期5个开奖号码中的中间3个号码相同，且顺序一致，即为中奖。',
	example: '投注方案：01 02 03<br>开奖号码： * 01 02 03 *，即中中三直选。'
}
// 组选复式
GD11X5.SMQ3ZUX = Object.assign({}, GD11X5.SMH3ZUX)
GD11X5.SMZ3ZUX = Object.assign({}, GD11X5.SMH3ZUX)
GD11X5.SMQ3ZUX.help = {
	desc: '从01-11中任意选择3个或3个以上号码。',
	explain: '从11个号码中选择3个或多个号码，所选号码与当期5个开奖号码中的前3个号码相同，顺序不限，即为中奖。',
	example: '投注方案：01 02 03<br>开奖号码：03 01 02 * *（前三顺序不限），即中前三组选。'
}
GD11X5.SMZ3ZUX.help = {
	desc: '从01-11中任意选择3个或3个以上号码。',
	explain: '从11个号码中选择3个或多个号码组成一注，所选号码与当期5个开奖号码中的中间3个号码相同，顺序不限，即为中奖。',
	example: '投注方案：01 02 03<br>开奖号码： * 03 01 02 *（中三顺序不限），即中中三组选。'
}
/********************************************************************************
 * 二码
 *******************************************************************************/
GD11X5.EMQ2ZHX = Object.assign({}, GD11X5.EMH2ZHX) // 直选复式
GD11X5.EMQ2ZUX = Object.assign({}, GD11X5.EMH2ZUX) // 组选复式
GD11X5.EMQ2ZHX.help = {
	desc: '从第一位、第二位中至少各选择1个号码。',
	explain: '从01-11中选择2个不重复号码组成一注，所选号码与当期5个开奖号码中的前2个号码相同，且顺序一致，即为中奖。',
	example: '投注方案：01 02<br>开奖号码：01 02 * * *，即中前二直选。'
}
GD11X5.EMQ2ZUX.help = {
	desc: '从01-11中任意选择2个或2个以上号码。',
	explain: '从01-11个号码中选择2个或多个号码，所选号码与当期5个开奖号码中的前2个号码相同，顺序不限，即为中奖。',
	example: '投注方案：01 02<br>开奖号码：02 01 * * *，（前二顺序不限），即中前二组选。'
}
/********************************************************************************
 * 不定位
 *******************************************************************************/
// 三位
GD11X5.BDWQ3W = Object.assign({}, GD11X5.BDWH3W)
GD11X5.BDWZ3W = Object.assign({}, GD11X5.BDWH3W)
GD11X5.BDWQ3W.help = {
	desc: '从01-11中任意选择1个或1个以上号码。',
	explain: '从11个号码中选择1个或多个号码，每注由1个号码组成，只要当期开奖号码中的第一位、第二位、第三位开奖号码包含所选号码，即为中奖。',
	example: '投注方案：01<br>开奖号码：01 * * * *，* 01 * * *，* * 01 * *，即中前三位。'
}
GD11X5.BDWZ3W.help = {
	desc: '从01-11中任意选择1个或1个以上号码。',
	explain: '从11个号码中选择1个或多个号码，每注由1个号码组成，只要当期开奖号码中的第二位、第三位、第四位开奖号码包含所选号码，即为中奖。',
	example: '投注方案：01<br>开奖号码：* 01 * * *，*  * 01 * *，* * * 01 *，即中中三位。'
}
/********************************************************************************
 * 任选复式
 *******************************************************************************/
GD11X5.RX2Z2 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX3Z3 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX4Z4 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX5Z5 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX6Z5 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX7Z5 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX8Z5 = Object.assign({}, GD11X5.RX1Z1)
GD11X5.RX2Z2.help = {
	desc: '从01-11中任意选择2个或2个以上号码。',
	explain: '从11个号码中选择2个或多个号码，每注由2个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04<br>开奖号码：08 04 11 05 03，即中任选二中二。'
}
GD11X5.RX3Z3.help = {
	desc: '从01-11中任意选择3个或3个以上号码。',
	explain: '从11个号码中选择3个或多个号码，每注由3个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 11<br>开奖号码：08 04 11 05 03，即中任选三中三。'
}
GD11X5.RX4Z4.help = {
	desc: '从01-11中任意选择4个或4个以上号码。',
	explain: '从11个号码中选择4个或多个号码，每注由4个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 08 03<br>开奖号码：08 04 11 05 03，即中任选四中四。'
}
GD11X5.RX5Z5.help = {
	desc: '从01-11中任意选择5个或5个以上号码。',
	explain: '从11个号码中选择5个或多个号码，每注由5个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 11 03 08<br>开奖号码：08 04 11 05 03，即中任选五中五。'
}
GD11X5.RX6Z5.help = {
	desc: '从01-11中任意选择6个或6个以上号码。',
	explain: '从11个号码中选择6个或多个号码，每注由6个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08<br>开奖号码：08 04 11 05 03，即中任选六中五。'
}
GD11X5.RX7Z5.help = {
	desc: '从01-11中任意选择7个或7个以上号码。',
	explain: '从11个号码中选择7个或多个号码，每注由7个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08 09<br>开奖号码：08 04 11 05 03，即中任选七中五。'
}
GD11X5.RX8Z5.help = {
	desc: '从01-11中任意选择8个或8个以上号码。',
	explain: '从11个号码中选择8个或多个号码，每注由8个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08 09 01<br>开奖号码：08 04 11 05 03，即中任选八中五。'
}
/********************************************************************************
 * 组选胆拖、任选胆拖
 *******************************************************************************/
GD11X5.SMQ3ZUXDT = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.SMZ3ZUXDT = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.EMQ2ZUXDT = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.EMH2ZUXDT = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT2Z2 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT3Z3 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT4Z4 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT5Z5 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT6Z5 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT7Z5 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.RXDT8Z5 = Object.assign({}, GD11X5.SMH3ZUXDT)
GD11X5.SMQ3ZUXDT.help = {
	desc: '从01-11中，选取3个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
	explain: '从01-11中选择3个或多个号码进行投注，每注需至少包括1个胆码及1个拖码，共3个号码。所选单注号码与当期5个开奖号码中的前3个号码相同，顺序不限，即为中奖。',
	example: '投注方案：胆码 02，拖码 01 06<br>开奖号码：02 01 06 * *（前三顺序不限），即中前三组选胆拖。'
}
GD11X5.SMZ3ZUXDT.help = {
	desc: '从01-11中，选取3个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
	explain: '选择3个或多个号码进行投注，每注需至少包括1个胆码及1个拖码，共3个号码。所选单注号码与当期5个开奖号码中的中间3个号码相同，顺序不限，即为中奖。',
	example: '投注方案：胆码 02，拖码 01 06<br>开奖号码： * 02 01 06 *（中三顺序不限），即中中三组选胆拖。'
}
GD11X5.EMQ2ZUXDT.help = {
	desc: '从01-11中，选取2个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
	explain: '从01-11中选择2个或多个号码进行投注，每注需至少包括1个胆码及1个拖码。所选单注号码与当期5个开奖号码中的前2个号码相同，顺序不限，即为中奖。',
	example: '投注方案：胆码 01，拖码 06<br>开奖号码：06 01 * * *，（前二顺序不限），即中前二组选胆拖。'
}
GD11X5.EMH2ZUXDT.help = {
	desc: '从01-11中，选取2个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。',
	explain: '从01-11中选择2个或多个号码进行投注，每注需至少包括1个胆码及1个拖码。所选单注号码与当期5个开奖号码中的后2个号码相同，顺序不限，即为中奖。',
	example: '投注方案：胆码 01，拖码 06<br>开奖号码：* * * 06 01 ，（后二顺序不限），即中后二组选胆拖。'
}
GD11X5.RXDT2Z2.help = {
	desc: '从01-11中任意选择2个或2个以上号码。',
	explain: '从11个号码中选择2个或多个号码，每注由2个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04<br>开奖号码：08 04 11 05 03，即中任选二中二。'
}
GD11X5.RXDT3Z3.help = {
	desc: '从01-11中任意选择3个或3个以上号码。',
	explain: '从11个号码中选择3个或多个号码，每注由3个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 11<br>开奖号码：08 04 11 05 03，即中任选三中三。'
}
GD11X5.RXDT4Z4.help = {
	desc: '从01-11中任意选择4个或4个以上号码。',
	explain: '从11个号码中选择4个或多个号码，每注由4个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 08 03<br>开奖号码：08 04 11 05 03，即中任选四中四。'
}
GD11X5.RXDT5Z5.help = {
	desc: '从01-11中任意选择5个或5个以上号码。',
	explain: '从11个号码中选择5个或多个号码，每注由5个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 04 11 03 08<br>开奖号码：08 04 11 05 03，即中任选五中五。'
}
GD11X5.RXDT6Z5.help = {
	desc: '从01-11中任意选择6个或6个以上号码。',
	explain: '从11个号码中选择6个或多个号码，每注由6个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08<br>开奖号码：08 04 11 05 03，即中任选六中五。'
}
GD11X5.RXDT7Z5.help = {
	desc: '从01-11中任意选择7个或7个以上号码。',
	explain: '从11个号码中选择7个或多个号码，每注由7个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08 09<br>开奖号码：08 04 11 05 03，即中任选七中五。'
}
GD11X5.RXDT8Z5.help = {
	desc: '从01-11中任意选择8个或8个以上号码。',
	explain: '从11个号码中选择8个或多个号码，每注由8个号码组成，只要当期的5个开奖号码中包含所选号码，即为中奖。',
	example: '投注方案：05 10 04 11 03 08 09 01<br>开奖号码：08 04 11 05 03，即中任选八中五。'
}

export default GD11X5;
