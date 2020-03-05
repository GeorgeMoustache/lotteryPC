import { createTemplate, padLeftZero, pokerSplice, rand, Combination } from './helper';
import TWELVE from './hk6_12';
import getSxwxData from './getSxwx';

const LABLES = {
  // 六合彩
  TMBLM: [
    '特单',
    '特合单',
    '特尾大',
    '特天肖',
    '特大单',
    '特双',
    '特合双',
    '特尾小',
    '特地肖',
    '特大双',
    '特大',
    '特合大',
    '特家肖',
    '特前肖',
    '特小单',
    '特小',
    '特合小',
    '特野肖',
    '特后肖',
    '特小双',
  ],
  SBBB: ['红单', '红双', '红大', '红小', '蓝单', '蓝双', '蓝大', '蓝小', '绿单', '绿双', '绿大', '绿小'],
  SBBBB: [
    '红大单',
    '红大双',
    '红小单',
    '红小双',
    '蓝大单',
    '蓝大双',
    '蓝小单',
    '蓝小双',
    '绿大单',
    '绿大双',
    '绿小单',
    '绿小双',
  ],
  ZMQT: ['总大', '总小', '总单', '总双'],
  TWSTWS: ['0头', '1头', '2头', '3头', '4头', '1尾', '2尾', '3尾', '4尾', '5尾', '6尾', '7尾', '8尾', '9尾', '0尾'],
  ZMTZ1TDX: ['正一大', '正一小', '正一单', '正一双', '正一合单', '正一合双', '正一红', '正一蓝', '正一绿'],
  ZMTZ2TDX: ['正二大', '正二小', '正二单', '正二双', '正二合单', '正二合双', '正二红', '正二蓝', '正二绿'],
  ZMTZ3TDX: ['正三大', '正三小', '正三单', '正三双', '正三合单', '正三合双', '正三红', '正三蓝', '正三绿'],
  ZMTZ4TDX: ['正四大', '正四小', '正四单', '正四双', '正四合单', '正四合双', '正四红', '正四蓝', '正四绿'],
  ZMTZ5TDX: ['正五大', '正五小', '正五单', '正五双', '正五合单', '正五合双', '正五红', '正五蓝', '正五绿'],
  ZMTZ6TDX: ['正六大', '正六小', '正六单', '正六双', '正六合单', '正六合双', '正六红', '正六蓝', '正六绿'],
  ZM16: ['单码', '双码', '大码', '小码', '合单', '合双', '合大', '合小', '红波', '蓝波', '绿波', '尾大', '尾小'],
  ZXZL: ['2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'], // 总肖种类
  TWELVE_STR: '鼠牛虎兔龙蛇马羊猴鸡狗猪',
  TWELVE,
};
// 香港六合彩
const HKSIX = {
	/********************************************************************************
	 * 特码
	 *******************************************************************************/
	// 选码
	// ------------------------------------------------------------------------------
	TMBXM: {
    help: {
      desc: '当期开出的最后一码为特码'
    },
		tplData: createTemplate({
			min: 1,
			max: 49
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(rand(49, 1))
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
	// 两面
	// ------------------------------------------------------------------------------
	TMBLM: {
    help: {
      desc: '两面包括特码的两面和总和的两面，如特码的大、小、家肖、野肖'
    },
		tplData: createTemplate({
			max: 19,
			formatFn: i => {
				return LABLES.TMBLM[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.TMBLM[rand(19)])
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
	 * 色波
	 *******************************************************************************/
	// 色波
	// ------------------------------------------------------------------------------
	SBSB: {
    help: {
      desc: '六合彩49个号码球分红、蓝、绿三种颜色，以特码开出的颜色和投注的颜色相同视为中奖'
    },
		tplData: (() => {
			return [
				[{
					value: '红波',
					summary: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
				}, {
					value: '蓝波',
					summary: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
				}, {
					value: '绿波',
					summary: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']
				}]
			]
		})(),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('红蓝绿'.charAt(rand(2)) + '波')
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
	// 半波
	// ------------------------------------------------------------------------------
  SBBB: {
    help: {
      desc: '六合彩49个号码球分红、蓝、绿三种颜色，以特码开出的颜色和投注的颜色相同视为中奖'
    },
		tplData: createTemplate({
			max: 11,
			formatFn: i => {
				return LABLES.SBBB[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.SBBB[rand(11)])
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
	// 半半波
	// ------------------------------------------------------------------------------
  SBBBB: {
    help: {
      desc: '六合彩49个号码球分红、蓝、绿三种颜色，以特码开出的颜色和投注的颜色相同视为中奖'
    },
		tplData: createTemplate({
			max: 11,
			formatFn: i => {
				return LABLES.SBBBB[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.SBBBB[rand(11)])
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
	 * 特肖
	 *******************************************************************************/
	// 生肖
	// ------------------------------------------------------------------------------
  TXSX: {
    help: {
      desc: '若当期特码号落在下注生肖范围内，视为中奖'
    },
		tplData: LABLES.TWELVE,
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.TWELVE_STR.charAt(rand(11)))
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
	 * 特码
	 *******************************************************************************/
	// 选码
	// ------------------------------------------------------------------------------
	ZMQT: {
		tplData: createTemplate({
			max: 3,
			formatFn: i => {
				return LABLES.ZMQT[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.ZMQT[rand(3)])
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
	 * 五行
	 *******************************************************************************/
	// 种类
	// ------------------------------------------------------------------------------
	WXZL: {
		tplData: (() => {
			let obj = getSxwxData()
			let ary = []
			for (let key in obj) {
				if ('金木水火土'.indexOf(key) > -1) {
					ary.push({
						value: key,
						summary: obj[key].map(el => padLeftZero(el))
					})
				}
			}
			return [ary]
		})(),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push('红蓝绿'.charAt(rand(2)) + '波')
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
	 * 合肖
	 *******************************************************************************/
	// 合肖
	// ------------------------------------------------------------------------------
	HXHX: {
    help: {
      desc: ''
    },
		tplData: LABLES.TWELVE,
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				let ary = pokerSplice(0, 11)
				let twelve = LABLES.TWELVE_STR
				this.selectedList[0].push(twelve.charAt(ary[0]), twelve.charAt(ary[1]))
				return
			}
		},
		// 计算 注
		selectedCount() {
      let needCount = 0
      let sum = this.betNum.length;
      if (sum > 1) {
        needCount = 1;
      }
			this.count = sum
			this.needCount = needCount
			return sum
		}
	},
	/********************************************************************************
	 * 头尾数
	 *******************************************************************************/
	// 头尾数
	// ------------------------------------------------------------------------------
	TWSTWS: {
    help: {
      desc: '特码头数：是指特码属头数的号码；特码尾数：是指特码属尾数的号码'
    },
		tplData: createTemplate({
			max: 14,
			formatFn: i => {
				return LABLES.TWSTWS[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.TWSTWS[rand(14)])
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
	// 正一特大小
	// ------------------------------------------------------------------------------
	ZMTZ1TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ1TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	// 正二特大小
	// ------------------------------------------------------------------------------
	ZMTZ2TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ2TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	// 正三特大小
	// ------------------------------------------------------------------------------
	ZMTZ3TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ3TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	// 正四特大小
	// ------------------------------------------------------------------------------
	ZMTZ4TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ4TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	// 正五特大小
	// ------------------------------------------------------------------------------
	ZMTZ5TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ5TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	// 正六特大小
	// ------------------------------------------------------------------------------
	ZMTZ6TDX: {
		tplData: createTemplate({
			max: 8,
			formatFn: i => {
				return LABLES.ZMTZ6TDX[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES[this.mode][rand(8)])
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
	 * 正码1-6
	 *******************************************************************************/
	// 正码六
	// ------------------------------------------------------------------------------
	ZM16ZM6: {
    help: {
      desc: '正码六：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
    },
		tplData: createTemplate({
			max: 12,
			formatFn: i => {
				return LABLES.ZM16[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.ZM16[rand(12)])
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
	// 尾数
	// ------------------------------------------------------------------------------
	PT1XWSWS: {
    help: {
      desc: '指开奖的7个号码中含有所属生肖的一个或多个号码',
    },
		tplData: (() => {
			let ary = []
			for (let i = 1; i <= 49; i++) {
				ary.push(padLeftZero(i))
			}
			let result = []
			for (let i = 0; i <= 9; i++) {
				result.push({
					value: i + '尾',
					summary: ary.filter(el => el % 10 == i)
				})
			}
			return [result]
		})(),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(rand() + '尾')
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
	 * 7色波
	 *******************************************************************************/
	// 种类
	// ------------------------------------------------------------------------------
	QSBZL: {
    help: {
      desc: '以开出的7个色波，那种颜色最多为中奖。',
    },
		tplData: createTemplate({
			max: 3,
			formatFn: i => {
				return ['红波', '蓝波', '绿波', '和局'][i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(['红波', '蓝波', '绿波', '和局'][rand(3)])
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
	 * 总肖
	 *******************************************************************************/
	// 种类
	// ------------------------------------------------------------------------------
	ZXZL: {
    help: {
      desc: '当期所有开出不同生肖总数，与所投注之预计开出之生肖总数相同，则视为中奖',
    },
		tplData: createTemplate({
			max: 7,
			formatFn: i => {
				return LABLES.ZXZL[i]
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList[0].push(LABLES.ZXZL[rand(7)])
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
	 * 自选不中
	 *******************************************************************************/
	// 自选不中
	// ------------------------------------------------------------------------------
	ZXBZ: {
    help: {
      desc: '挑选6~11个号码为一个组合，当期号码(所有正码与最后开出的特码)皆没有坐落于投注时所挑选之号码组合内，则视为中奖。'
    },
		tplData: createTemplate({
			min: 1,
			max: 49
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				this.selectedList.splice(0, 1, pokerSplice(1, 49, 6))
				return
			}
		},
		// 计算 注
    selectedCount() {
      let sum = this.betNum.length
			this.count = sum
      this.needCount = sum > 5 ? 1 : 0
			return sum
		}
	},
	/********************************************************************************
	 * 连肖连尾
	 *******************************************************************************/
	// 五连肖
	// ------------------------------------------------------------------------------
	LXLW5LX: {
    help: {
      desc: '挑选2~6生肖(排列如同生肖)为一个组合，当期号码(所有正码与最后开出的特码)坐落于投注时所勾选之生肖组合所属号码内，所勾选之生肖皆至少有中一个号码，则视为中奖'
    },
		tplData: LABLES.TWELVE,
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				const rex = this.mode.match(/LXLW(\d+)/)
				const len = rex ? rex[1] : 1
				const ary = pokerSplice(0, 11, len)
				for (let i = 0; i < len; i++) {
					this.selectedList[0].push(LABLES.TWELVE_STR.charAt(ary[i]))
				}
				return
			}
		},
		// 计算 注
		selectedCount() {
      let list = this.betNum;
      let sum = list.length;
			this.count = sum

			const rex = this.mode.match(/LXLW(\d+)/)
      const len = rex ? rex[1] : 1
      this.needCount = !sum ? 0 : Combination(sum, len);
			return sum;
		}
	},
	// 五连尾
	// ------------------------------------------------------------------------------
  LXLW5LW: {
    help: {
      desc: '挑选2〜6个尾数为一组合，当期号码（所有正码与最后出的特码）坐落于投注时所勾选之尾数组合所属号码内，则视为中奖'
    },
		tplData: createTemplate({
			max: 9,
			formatFn: i => {
				return i + '尾'
			}
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				const rex = this.mode.match(/LXLW(\d+)/)
				const len = rex ? rex[1] : 1
				let ary = pokerSplice(0, 9, len)
				ary = ary.map(el => el + '尾')
				this.selectedList.splice(0, 1, ary)
				return
			}
		},
		// 计算 注
		selectedCount() {
			let list = this.betNum
      let sum = list.length
			this.count = sum

			const rex = this.mode.match(/LXLW(\d+)/)
      const len = rex ? rex[1] : 1
      this.needCount = !sum ? 0 : Combination(sum, len);
			return sum
		}
	},
	/********************************************************************************
	 * 连码
	 *******************************************************************************/
	// 三中二
	// ------------------------------------------------------------------------------
	LM3ZE7: {
    help: {
      desc: '投注的每三个号码为一组合，若其中2个是开奖号码中的正码，即为三中二，视为中奖； 若3个都是开奖号码中的正码，即为三中二之中三，其馀情形视为不中奖，如06、07、08为一组合，开奖号码中有06、07两个正码，没有08，即为三中二，按三中二赔付；如开奖 号码中有06、07、08三个正码，即为三中二之中三，按中三赔付；如出现1个或没有，视 为不中奖 。'
    },
		tplData: createTemplate({
			min: 1,
			max: 49
		}),
		// 随机
		randomSelect: function(time = 0) {
			if (time == 0) {
				this.empty()
				const rex = this.mode.match(/LM(\d+)/)
				const len = rex ? rex[1] : 1
				this.selectedList.splice(0, 1, pokerSplice(1, 49, len))
				return
			}
		},
		// 计算 注
		selectedCount() {
			let list = this.betNum
      let sum = list.length
			this.count = sum

			const rex = this.mode.match(/LM(\d+)/)
      const len = rex ? rex[1] : 1
      this.needCount = !sum ? 0 : Combination(sum, len)
			return sum
		}
	}
}
// 正码-选码
// ------------------------------------------------------------------------------
HKSIX.ZMXM = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMXM.help = {
  desc: '六合彩每期开出的前面六个号码为正码，下注号码如在六个正码号码里中奖',
};
// 正码特
// ------------------------------------------------------------------------------
HKSIX.ZMTZ1T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ1T.help = {
  desc: '开出的第一个号码叫正一特，投注的第一个号码与开奖的第一个号码一致，视为中奖',
};
HKSIX.ZMTZ2T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ2T.help = {
  desc: '开出的第二个号码叫正二特，投注的第二个号码与开奖的第二个号码一致，视为中奖',
};
HKSIX.ZMTZ3T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ3T.help = {
  desc: '开出的第三个号码叫正三特，投注的第三个号码与开奖的第三个号码一致，视为中奖',
};
HKSIX.ZMTZ4T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ4T.help = {
  desc: '开出的第四个号码叫正四特，投注的第四个号码与开奖的第四个号码一致，视为中奖',
};
HKSIX.ZMTZ5T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ5T.help = {
  desc: '开出的第五个号码叫正五特，投注的第五个号码与开奖的第五个号码一致，视为中奖',
};
HKSIX.ZMTZ6T = Object.assign({}, HKSIX.TMBXM);
HKSIX.ZMTZ6T.help = {
  desc: '开出的第六个号码叫正六特，投注的第六个号码与开奖的第六个号码一致，视为中奖',
};
// 正码1-6
// ------------------------------------------------------------------------------
HKSIX.ZM16ZM1 = Object.assign({}, HKSIX.ZM16ZM6);
HKSIX.ZM16ZM1.help = {
  desc: '正码一：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
};
HKSIX.ZM16ZM2 = Object.assign({}, HKSIX.ZM16ZM6);
HKSIX.ZM16ZM2.help = {
  desc: '正码二：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
};
HKSIX.ZM16ZM3 = Object.assign({}, HKSIX.ZM16ZM6);
HKSIX.ZM16ZM3.help = {
  desc: '正码三：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
};
HKSIX.ZM16ZM4 = Object.assign({}, HKSIX.ZM16ZM6);
HKSIX.ZM16ZM4.help = {
  desc: '正码四：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
};
HKSIX.ZM16ZM5 = Object.assign({}, HKSIX.ZM16ZM6);
HKSIX.ZM16ZM5.help = {
  desc: '正码五：（合）大、（合）小、（合）单、（合）双、红、蓝、绿、尾大、尾小',
};
// 平特一肖尾数-一肖
// ------------------------------------------------------------------------------
HKSIX.PT1XWS1X = Object.assign({}, HKSIX.TXSX);
HKSIX.PT1XWS1X.help = {
  desc: '指开奖的7个号码中含有所属生肖的一个或多个号码',
};
// 正肖-生肖
HKSIX.ZXSX = Object.assign({}, HKSIX.TXSX);
HKSIX.ZXSX.help = {
  desc: '依据开出的所有正码为主。若当期6个正码，只要有1个落在下注生肖范围内，视为中奖。',
};
// 连肖连尾
// ------------------------------------------------------------------------------
HKSIX.LXLW2LX = HKSIX.LXLW3LX = HKSIX.LXLW4LX = HKSIX.LXLW5LX
HKSIX.LXLW2LW = HKSIX.LXLW3LW = HKSIX.LXLW4LW = HKSIX.LXLW5LW
// 连码(三全中、二全中、中特、特串、四全中)
// ------------------------------------------------------------------------------
// 三全中
HKSIX.LM3QZ10 = Object.assign({}, HKSIX.LM3ZE7);
HKSIX.LM3QZ10.help = {
  desc: '所投注的每三个号码为一组合，若三个号码都是开奖号码之正码，视为中奖，其馀情形视为 不中奖。如06、07、08三个都是开奖号码之正码，视为中奖，如两个正码加上一个特别号码视为不中奖 。'
}
// 二全中
HKSIX.LM2QZ7 = Object.assign({}, HKSIX.LM3ZE7);
HKSIX.LM2QZ7.help = {
  desc: '所投注的每二个号码为一组合，二个号码都是开奖号码之正码，视为中奖，其馀情形视为不 中奖（含一个正码加一个特别号码之情形）。',
};
// 二中特
HKSIX.LM2ZT7 = Object.assign({}, HKSIX.LM3ZE7);
HKSIX.LM2ZT7.help = {
  desc: '所投注的每二个号码为一组合，若其中一 个是正码，一个是特别号码，叫二中特之中特；其馀情形视为不中奖 。',
};
// 特串
HKSIX.LM2TC7 = Object.assign({}, HKSIX.LM3ZE7);
HKSIX.LM2TC7.help = {
  desc: '所投注的每二个号码为一组合，其中一个是正码，一个是特别号码，视为中奖，其馀情形视为 不中奖（含二个号码都是正码之情形） 。',
};
// 四全中
HKSIX.LM4QZ10 = Object.assign({}, HKSIX.LM3ZE7);
HKSIX.LM4QZ10.help = {
  desc: '',
};

export default HKSIX;
