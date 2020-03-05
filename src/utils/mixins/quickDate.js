const mixins = {
  inject: ['ivNotice'],
  data() {
    return {
      dateAry: ['今天', '昨天', '本周', '上周', '本月', '上月'],

      //自定義時間用
      dateRangeOpt: {
        disabledDate(date) {
          //5356800000 為兩個月的秒數
          return date.valueOf() < Date.now() - 5356800000 || date.valueOf() > Date.now();
        },
      },
      customDate: '',
    };
  },
  methods: {
    quickDate() {
      //設定日期格式
      let dateFormat = 'yyyy-MM-dd';

      //取得今天
      let today = new Date().Format(dateFormat);

      //取得昨日時間
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      //取得本週開始時間
      let thisWeekStart = new Date();
      if (thisWeekStart.getDay() == 0) {
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() - 6);
      } else {
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() + 1);
      }

      //取得上週開始時間
      let lastWeekStart = new Date();
      if (lastWeekStart.getDay() == 0) {
        lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 13);
      } else {
        lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 6);
      }

      //取得上週結束時間
      let lastWeekEnd = new Date();
      if (lastWeekEnd.getDay() == 0) {
        lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 7);
      } else {
        lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay());
      }

      //取得本月開始時間
      let thisMonthStart = new Date();
      thisMonthStart.setDate(1);

      //取得上月開始時間
      let lastMonthStart = new Date();
      lastMonthStart.setDate(1);
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

      //取得上月結束時間
      let lastMonthDays = new Date(lastMonthStart.getYear(), lastMonthStart.getMonth() + 1, 0).getDate();
      let lastMonthEnd = new Date();

      if (lastMonthDays == 31) {
        lastMonthEnd.setMonth(lastMonthEnd.getMonth() - 1);
        lastMonthEnd.setDate(lastMonthDays);
      } else {
        lastMonthEnd.setDate(lastMonthDays);
        lastMonthEnd.setMonth(lastMonthEnd.getMonth() - 1);
      }

      this.query.date = 5;
      this.customDate = '';

      switch (this.dateType) {
        case 0:
          this.query.constomDate = today + ',' + today;
          break;
        case 1:
          this.query.constomDate = yesterday.Format(dateFormat) + ',' + yesterday.Format(dateFormat);
          break;
        case 2:
          this.query.constomDate = thisWeekStart.Format(dateFormat) + ',' + today;
          break;
        case 3:
          this.query.constomDate = lastWeekStart.Format(dateFormat) + ',' + lastWeekEnd.Format(dateFormat);
          break;
        case 4:
          this.query.constomDate = thisMonthStart.Format(dateFormat) + ',' + today;
          break;
        case 5:
          this.query.constomDate = lastMonthStart.Format(dateFormat) + ',' + lastMonthEnd.Format(dateFormat);
          break;
      }

      //選擇同時搜尋
      this.searchData();
    },
    changeCustomDate($event) {
      this.query.date = 5;
      let date = $event;
      let startDate = date[0];
      let endDate = date[1];
      let dateRange = new Date(endDate) - new Date(startDate);

      if (dateRange > 2678400000) {
        this.ivNotice('error', '自选时间范围最多为31天，请重新选择');
        this.customDate = '';
        return;
      }

      if (startDate != '') {
        this.query.constomDate = `${startDate},${endDate}`;
        this.dateType = -1;
      } else {
        this.dateType = 0;
        this.quickDate();
      }
    },
  },
};

export default mixins;
