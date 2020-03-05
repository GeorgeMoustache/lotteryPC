const formatStyle = 'yyyy-MM-dd';

/**
 * 获得某月的天数
 * @param {Number} year 年
 * @param {Number} month 月
 */
function getMonthDays(year, month) {
  let monthStartDate = new Date(year, month, 1);
  let monthEndDate = new Date(year, month + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

// 今日
function getToday() {
  let date = new Date();
  let str = date.Format(formatStyle);
  return [str, str];
}

// 昨天
function getYesterday() {
  let date = new Date().addDays(-1);
  let str = date.Format(formatStyle);
  return [str, str];
}

// 本周
function getThisWeek() {
  let date = new Date();
  let year = date.getFullYear(); // 当前年
  let month = date.getMonth(); // 当前月
  let day4week = date.getDay() == 0 ? 6 : date.getDay() - 1; //今天本周的第几天(中国习惯，周一到周日)
  let day = date.getDate(); // 当前日

  let startDate = new Date(year, month, day - day4week);
  let endDate = new Date(year, month, day + (6 - day4week));
  return [startDate.Format(formatStyle), endDate.Format(formatStyle)];
}

// 上周
function getLastWeek() {
  let date = new Date();
  let year = date.getFullYear(); // 当前年
  let month = date.getMonth(); // 当前月
  let day4week = date.getDay() == 0 ? 6 : date.getDay() - 1; //今天本周的第几天(中国习惯，周一到周日)
  let day = date.getDate(); // 当前日

  let startDate = new Date(year, month, day - day4week - 7);
  let endDate = new Date(year, month, day - day4week - 1);
  return [startDate.Format(formatStyle), endDate.Format(formatStyle)];
}

// 本月
function getThisMonth() {
  let date = new Date();
  let year = date.getFullYear(); // 当前年
  let month = date.getMonth(); // 当前月

  let startDate = new Date(year, month, 1);
  let endDate = new Date(year, month, getMonthDays(year, month));
  return [startDate.Format(formatStyle), endDate.Format(formatStyle)];
}

// 上月
function getLastMonth() {
  let date = new Date();
  let nowYear = date.getFullYear(); // 当前年
  let lastMonthDate = new Date(); // 上月日期
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  let lastMonth = lastMonthDate.getMonth();
  let year = lastMonth == 11 ? nowYear - 1 : nowYear;

  let startDate = new Date(year, lastMonth, 1);
  let endDate = new Date(year, lastMonth, getMonthDays(year, lastMonth));
  return [startDate.Format(formatStyle), endDate.Format(formatStyle)];
}

export default { getToday, getYesterday, getThisWeek, getLastWeek, getThisMonth, getLastMonth };
