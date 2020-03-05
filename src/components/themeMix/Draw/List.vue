<template lang="pug">
.draw_list
  .box(v-for="(item, index) in list" :key="index")
    h3.box-title(v-text="item.label")
    table.box-list
      thead
        tr
          th 彩种
          th 期号
          th 开奖时间
          th 开奖号码
          th 投注提示
          th 开奖频率
          th 详情
          th 走势
          th 购买
      tbody
        tr(v-for="(child, idx) in item.children" :key="idx")
          td
            a(@click="showDetail(child)" title="详情")
              h4.lottery-label(v-text="child.label")
          td
            a.lottery-issue(@click="showDetail(child)" title="详情" v-text="child.openIssue")
          td(v-text="child.openDateTime")
          td(style="text-align: left; width: 310px;")
            ul.lottery-balls.ball-md(v-html="$root.formatOpenNum(child)")
            clocker.count-down(:time="child.endTime" format="%H : %M : %S" @on-finish="finish(child)")
          td
            span(v-if="/^HKSIX$/.test(child.alias)") 2到3天开奖1期
            span(v-else v-text="`每天开奖${child.total}期`")
          td
            span(v-if="/^HKSIX$/.test(child.alias)") 2到3天
            span(v-else v-text="`${child.timer}分`")
          td
            a(@click="showDetail(child)" title="详情") 详情
          td
            router-link.trend-link(:to="{path: `/trend/${child.alias}`}" title="走势")
          td
            Button(type="primary" @click="betLink(child.alias)") 我要投注
</template>

<script>
import clocker from 'components/themeMix/Clocker/index';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DrawNotice_List',
  props: ['data'],
  components: {
    clocker
  },
  computed: {
    ...mapGetters(['websocketMessage']),
    list () {
      return this.data.map(item => {
        if (item.children) {
          item.children.map(child => {
            this.getEndTime(child)
            child.isTp2 = /(HKSIX|FT)$/.test(child.alias)
          })
        }
        return item
      })
    }
  },
  methods: {
    ...mapMutations(['getEndTime']),
    finish (lottery) {
      lottery.openNum = ''
      this.$store.dispatch('refreshIssue', lottery)
      setTimeout(this.getEndTime, COUNTDOWN_INTERVAL, lottery)
    },
    showDetail (obj) {
      if (obj.isTp2) {
        let routeData = this.$router.resolve({path: `/trend/${obj.alias}`})
        window.open(routeData.href, '_blank')
      } else {
        this.$emit('showDetail', obj)
      }
    },
    betLink (category) {
      let routeData = this.$router.resolve({path: `/lottery/${category}`})
      window.open(routeData.href, '_blank')
    }
  },
  watch: {
    websocketMessage (msg) {
      this.list.map(item => {
        if (item.children) {
          item.children.map(child => {
            if (child.alias == msg.open_lottery) {
              child.openNum = msg.open_code_list
              child.openIssue = msg.open_issue
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.draw_list {
  .box-title {
    padding: 15px 0 6px 10px;
    font-size: 18px;
    font-weight: normal;
  }
  .box-list {
    th {
      height: 40px;
      background: #f5f5f5;
      text-align: center;
      color: #555;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #f5f5f5;
      text-align: center;
    }
  }
  .lottery-label {
    font-size: 14px;
    font-weight: 700;
    color: $layout-primary;
  }
  .lottery-issue {
    color: #333;
  }
  .trend-link {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    background: url('~assets/themeMix/drawlist-icon.gif') no-repeat;
  }
  .count-down {
    display: none!important;
  }
}
</style>
