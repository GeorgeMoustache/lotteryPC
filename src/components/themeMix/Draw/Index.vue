<template lang="pug">
.draw_detail
  .draw_detail-head
    .draw_detail-title
      h2.text-primary(v-text="`${data.label}开奖公告`")
      span.rule(v-if="openStamp" v-html="`开奖时间：${openStamp}`")
    .lottery-openissue 第
      span(v-text="data.openIssue")
      | 期开奖号码
    ul.lottery-balls(v-html="$root.formatOpenNum(data)")
  .draw_detail-filter
    span.mr15(v-text="`${query.datetime}开奖号码`")
    .filter-tab
      a.tab-item(
        v-for="(item, index) in filterTabs"
        :key="index"
        @click="selectDate(item)"
        :class="{'active': item.value == query.datetime}"
        v-text="item.label")
    .fn-right 按日期查询：
      DatePicker(type="date" :value="query.datetime" :clearable="false" :options="options" @on-change="DatePickerChange" style="width: 120px")
  .draw_detail-body
    draw-list(:data="detailData" v-on:finish="finish")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import RULES from 'utils/lottery/rules';
import { lotteryApi } from 'api';

export default {
  name: 'DrawDetail',
  props: ['data'],
  data () {
    return {
      openStamp: '',
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
    }
  },
  computed: {
    ...mapGetters(['appConfig', 'websocketMessage']),
    today () {
      return this.$root.formatToday(this.appConfig.serverDate)
    },
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
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loading = false
      const category = this.data.alias
      this.query.category = category
      this.updateComponents()
      this.openStamp = RULES.OPEN_STAMP[category]
      this.query.datetime = this.today
      this.fetchData()
    },
    updateComponents () {
      let {category} = this.query
      this.$options.components.DrawList = () => {
        return import(`./${this.$root.$getSpecies(category)}`)
      }
    },
    fetchData () {
      if (this.loading) return
      this.loading = true
      lotteryApi.drawDetail({params: this.query}).then(data => {
        this.loading = false
        if (data.code != 0) return this.notice(data.msg, 'error')
        data.alias = this.query.category
        this.getEndTime(data)
        this.detailData = data
        this.data.openNum = data.openNum
        this.data.openIssue = data.openIssue
        this.$emit('update:data', this.data)
      })
    },
    ...mapMutations(['getEndTime']),
    finish () {
      this.$store.dispatch('refreshIssue', this.detailData)
      setTimeout(() => {
        this.getEndTime(this.detailData)
      }, COUNTDOWN_INTERVAL)
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    selectDate (obj) {
      this.query.datetime = obj.value
    },
    DatePickerChange (value) {
      this.query.datetime = value
    }
  },
  watch: {
    'data.alias': 'init',
    'query.datetime' (value) {
      // optimize
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
}
</script>

<style lang="scss" scoped>
.draw_detail {
  min-height: 500px;
  background: #FFF;
  &-head {
    padding: 13px 17px;
  }
  &-title {
    margin-bottom: 10px;
  }
  h2 {
    display: inline-block;
    margin-right: 26px;
    font-size: 26px;
    font-weight: normal;
  }
  .lottery-openissue {
    margin-bottom: 10px;
    span {
      color: $layout-primary;
    }
  }
  .lottery-balls {
    margin-bottom: 10px;
    line-height: 36px;
    font-size: 18px;
  }
  &-filter {
    padding: 0 10px;
    border-bottom: 2px solid $primary-color;
    font-size: 14px;
    .filter-tab {
      display: inline-block;
      vertical-align: middle;
      @include clearfix();
    }
    .tab-item {
      float: left;
      margin-left: -1px;
      width: 80px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #dedede;
      border-bottom: 0;
      background: #fafafa;
      text-align: center;
      font-size: 14px;
      color: #333;
      &.active {
        background: $primary-color;
        border-color: $primary-color;
        color: #fff;
      }
    }
  }
}
</style>
