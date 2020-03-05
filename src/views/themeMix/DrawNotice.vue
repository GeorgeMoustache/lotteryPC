<template lang="pug">
.draw-view
  .head
    .fn-left
      span.mr10.text-primary 最新开奖
      span.mr15(v-text="today")
      span.text-primary 今日开奖：
    .fn-left
      ul.today-list
        li(v-for="item in todayList" :key="item.alias")
          a(@click="showDetail(item)" v-text="item.label" :class="{'active': selectedLottery && selectedLottery.alias == item.alias}")
  draw-list(v-if="selectedLottery == null" :data="list" v-on:showDetail="showDetail")
  draw-detail(v-else :data.sync="selectedLottery")
  BackTop
</template>

<script>
import { lotteryApi } from 'api';
import { mapGetters } from 'vuex';
import DrawList from 'components/themeMix/Draw/List';
import DrawDetail from 'components/themeMix/Draw/Index';

export default {
  name: 'DrawNotice',
  components: {
    DrawList,
    DrawDetail
  },
  data() {
    return {
      list: [],
      todayList: [],
      selectedLottery: null
    };
  },
  computed: {
    ...mapGetters(['appConfig']),
    today() {
      return this.$root.formatToday(this.appConfig.serverDate);
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let { category } = this.$route.params;
      if (category == null) this.selectedLottery = null;
      this.fetchData();
    },
    fetchData() {
      lotteryApi.drawNotice().then(data => {
        if (data.code != 0) return this.notice(data.msg, 'error');
        this.formatData(data.list);
      });
    },
    formatData(list) {
      let result = [];
      const groupList = this.$root.CATEGORYS;
      groupList.slice(1).forEach(group => { // 排除第一个“全部彩种”
        const { groupId, groupName } = group;
        const ary = list.filter(item => {
          const { column, type } = item;
          return column == 1 && type == groupId;
        });
        result.push({
          label: groupName,
          children: ary,
        });
      });

      const lowList = list.filter(item => item.column == 2);
      if (lowList.length) {
        result.push({
          label: '低频彩',
          children: lowList,
        });
      }
      this.list = result;

      let today = this.today;
      this.todayList = list.filter(item => ~item.openDateTime.indexOf(today));
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
    showDetail(obj) {
      this.selectedLottery = obj;
      this.$router.push({ path: `/drawNotice/${obj.alias}` });
    }
  },
  watch: {
    $route: 'init'
  }
};
</script>

<style lang="scss" scoped>
.draw-view {
  margin: 20px auto;
  border: 1px solid #ececec;
  background: #fff;
  min-height: 762px;
  .text-primary {
    color: $layout-primary;
  }

  .head {
    padding: 5px 15px;
    background: #f5f5f5;
    line-height: 40px;
    font-size: 14px;
    @include clearfix();
  }
  .today-list {
    width: 720px;
    @include clearfix();
    li {
      float: left;
    }
    a {
      padding: 0 10px;
      color: #666;
      &.active,
      &:hover {
        color: $layout-primary;
      }
    }
  }
}
</style>
