<template lang="pug">
#draw-notice
  .head
    .date.layout-wrap 最新开奖
      span(v-text="today")
    .category
      .layout-wrap
        span 今日开奖：
        a(v-for="item in todayList" :key="item.alias" @click="selectTab(item)" v-text="item.label" :class="{'active': item.alias == selectedLottery.alias}")
  .draw-detail.layout-wrap
    .filter-tab
      a.tab-item(v-for="(item, index) in filterTabs" :key="index" @click="selectDate(item)" :class="{'active': item.value == query.datetime}" v-text="item.label")
      .custom-date 按日期查询：
        DatePicker(type="date" :value="query.datetime" :clearable="false" :options="options" @on-change="DatePickerChange" style="width: 120px")
    perfect-scrollbar.draw-list
      DrawList(:data="detailData" v-on:finish="finish")
</template>

<script>
import { lotteryApi } from 'api';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DrawNotice',
  inject: ['ivNotice'],
  data() {
    return {
      alias: this.$route.params.category, //彩種 alias
      todayList: [], //今日開獎清單
      selectedLottery: null, //選取彩種

      //開獎公告 index components 用
      detailData: {},
      loading: false,
      query: {
        category: '',
        datetime: ''
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      }
    };
  },
  computed: {
    ...mapGetters(['appConfig', 'websocketMessage']),
    //格式化今天日期
    today() {
      return this.$root.formatToday(this.appConfig.serverDate);
    },
    //快捷選日
    filterTabs () {
      let ary = []
      let date = this.appConfig.serverDate
      if (date == '') return ary
      const names = []
      let d = new Date(date)
      for (let i = 0; i < 3; i++) {
        if (i) d = d.addDays(-1)
        ary.push({
          label: '今昨前'.charAt(i) + '天',
          value: d.Format('yyyy-MM-dd')
        })
      }
      d = null
      this.query.datetime = this.today
      return ary
    }
  },
  created() {
    this.init()
  },
  methods: {
    //開獎公告首頁用
    ...mapMutations(['getEndTime']),
    //初始化開獎公告list內容
    init () {
      this.loading = false
      this.query.category = this.alias
      this.query.datetime = this.today
      this.updateComponents()
      this.fetchTodayList();
      this.fetchData()
    },
    //獲取今日開獎列表
    fetchTodayList() {
      //取得 router 傳入彩種的 alias 
      this.alias = this.$route.params.category;

      lotteryApi.drawNotice().then(data => {
        let { code, msg, list } = data;
        if (code != 0) return this.ivNotice('error', msg);
        
        list.forEach((item) => {1
          if (item.alias == this.alias) {
            this.selectedLottery = item;
          }
        });
        this.todayList = list.filter(item => ~item.openDateTime.indexOf(this.today));
      });
    },
    //切換彩種
    selectTab(item) {
      this.selectedLottery = item;
      this.query.category = item.alias;
      this.$router.push({ path: `/drawNotice/${item.alias}` });
      this.updateComponents()
      this.fetchData()
    },
    //更新開獎公告 list 內容
    updateComponents () {
      let { category } = this.query
      this.$options.components.DrawList = () => {
        return import(`@/components/themeBoMao/Draw/${this.$root.$getSpecies(category)}`)
      }
    },
    //獲取開獎公告詳情
    fetchData() {
      if (this.loading) return
      this.loading = true
      lotteryApi.drawDetail({params: this.query}).then(data => {
        this.loading = false
        let { code, msg } = data;
        if (code != 0) return this.ivNotice('error', msg)
        data.alias = this.query.category
        this.getEndTime(data)
        this.detailData = data
        this.selectedLottery.openNum = data.openNum
        this.selectedLottery.openIssue = data.openIssue
        this.$emit('update:data', this.selectedLottery)
      })
    },
    //倒數計時結束
    finish () {
      this.$store.dispatch('refreshIssue', this.detailData)
      setTimeout(() => {
        this.getEndTime(this.detailData)
      }, COUNTDOWN_INTERVAL)
    },
    //選擇日期
    selectDate (obj) {
      this.query.datetime = obj.value
    },
    //自定義日期更換
    DatePickerChange (value) {
      this.query.datetime = value
    }
  },
  watch: {
    $route: 'fetchData',
    'query.datetime' (value) {
      if (value == '1970-01-01' || value == '') return
      this.fetchData()
    },
    websocketMessage (msg) {
      if (this.query.category != msg.open_lottery) return
      this.detailData.openNum = msg.open_code_list
      this.detailData.openIssue = msg.open_issue
      this.data.openNum = msg.open_code_list
      this.data.openIssue = msg.open_issue
    }
  }
};
</script>