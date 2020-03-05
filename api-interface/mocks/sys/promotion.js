/**
 * 系统-晋级奖励优惠活动
 *
 * @url sys/promotion.action
 *
 */

module.exports = () => {
  return {
    code: "0",
    msg: "",
    data: {
      gradeData: {
        userGrade: 4,
        growBonus: 0,
        canDraw: 0,
        userGradeGrow: 613251,
        img: "",
        info: "越晋升 越优越",
        id: 0,
        list: [{
          grade: 1,
          gradeName: "农民",
          gradeGrow: 1,
          bonus: 0
        }, {
          grade: 2,
          gradeName: "地主",
          gradeGrow: 2000,
          bonus: 8
        }, {
          grade: 3,
          gradeName: "知县",
          gradeGrow: 20000,
          bonus: 18
        }, {
          grade: 4,
          gradeName: "通判",
          gradeGrow: 200000,
          bonus: 88
        }, {
          grade: 5,
          gradeName: "知府",
          gradeGrow: 1000000,
          bonus: 388
        }, {
          grade: 6,
          gradeName: "总督",
          gradeGrow: 5000000,
          bonus: 1388
        }, {
          grade: 7,
          gradeName: "巡抚",
          gradeGrow: 50000000,
          bonus: 8888
        }, {
          grade: 8,
          gradeName: "丞相",
          gradeGrow: 1000000000,
          bonus: 88888
        }, {
          grade: 9,
          gradeName: "帝王",
          gradeGrow: 1500000000,
          bonus: 188888
        }, {
          grade: 10,
          gradeName: "外星人",
          gradeGrow: 2000000000,
          bonus: 228226
        }],
        jumpBonusRatio: 1,
        type: "1"
      }
    },
  }
};
