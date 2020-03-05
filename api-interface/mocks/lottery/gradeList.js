/**
 * 晋级奖励说明
 * @url lottery/gradeList.action
 */
module.exports = () => {
  return {
    code: 0,
    msg: '',
    gradeList: [
      { grade: 1, gradeName: '农民', gradeGrow: 0, bonus: 0, jumpBonus: 0 },
      { grade: 2, gradeName: '地主', gradeGrow: 10, bonus: 1, jumpBonus: 1 },
      { grade: 3, gradeName: '知县', gradeGrow: 200, bonus: 5, jumpBonus: 6 },
      { grade: 4, gradeName: '通判', gradeGrow: 1000, bonus: 10, jumpBonus: 16 },
      { grade: 5, gradeName: '知府', gradeGrow: 10000, bonus: 58, jumpBonus: 74 },
      { grade: 6, gradeName: '总督', gradeGrow: 50000, bonus: 318, jumpBonus: 392 },
      { grade: 7, gradeName: '巡抚', gradeGrow: 250000, bonus: 1688, jumpBonus: 2080 },
      { grade: 8, gradeName: '丞相', gradeGrow: 1000000, bonus: 6888, jumpBonus: 8968 },
      { grade: 9, gradeName: '帝王', gradeGrow: 5000000, bonus: 38888, jumpBonus: 47856 },
    ],
  };
};
