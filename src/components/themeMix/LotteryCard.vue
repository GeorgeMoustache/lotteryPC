<template lang="pug">
ul.lottery-list
  li.lottery-item(v-for="(item, index) in list" :key="item.alias")
    .lottery-card
      .card-head
        .icon
          img(:src="item.icon" :alt="item.label")
        dl.info
          dt(v-text="item.label")
          dd.issue 第 {{item.curIssue}} 期
          dd
            clocker.count-down(:time="item.endTime" format="%H : %M : %S" @on-finish="finish(item, index)")
      .card-foot
        a.btn.btn-default(@click="chartLink(item)")
          i.icon-sprite.icon-trend
          | 开奖走势
        a.btn.btn-primary(@click="betLink(item)")
          i.icon-sprite.icon-bet
          | 立即投注
</template>

<script>
import clocker from 'components/themeMix/Clocker/index';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LotteryCard',
  components: {
    clocker,
  },
  data() {
    return {
      cache: [],
    };
  },
  computed: {
    ...mapGetters(['requesting', 'error', 'websocketMessage', 'sideNav']),
    list() {
      const { hots } = this.sideNav;
      const { cache } = this;
      if (hots && cache.length) {
        return hots.map(item => {
          const { alias } = item;
          const obj = cache.find(el => el.alias == alias);
          this.getEndTime(item);
          return Object.assign(item, obj);
        });
      }
      return [];
    },
  },
  created() {
    this.$store.dispatch('lotteryList').then(data => {
      if (data.code != 0) return this.notice(data.msg, 'warning');
      this.cache = data.list;
    });
  },
  methods: {
    ...mapMutations(['getEndTime']),
    openLink(obj) {
      this.$router.push({ path: `/lottery/history/${obj.alias}` });
    },
    chartLink(obj) {
      this.$router.push({ path: `/trend/${obj.alias}` });
    },
    betLink(obj) {
      this.$router.push({ path: `/lottery/${obj.alias}` });
    },
    finish(obj, index) {
      obj.openNum = '';
      let that = this;
      this.$store.dispatch('refreshIssue', obj).then(() => {
        const { alias } = obj;
        const idx = that.cache.findIndex(item => item.alias == alias);
        that.cache.splice(idx, 1, obj);
      });
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
  },
  watch: {
    websocketMessage(msg) {
      this.list.map(item => {
        if (item.alias == msg.open_lottery) item.openNum = msg.open_code_list;
        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.lottery-item {
  position: relative;
  float: left;
  margin: 10px 0 0 10px;
  padding: 3px;
  width: 48%;
  height: 135px;
  border: 1px solid #e7e7e7;
  background: #f2f2f2;
}

$btn-default-color: #e9e9e9;
$btn-primary-color: #d32036;
.lottery-card {
  overflow: hidden;
  background: #fff;
}

.card-head {
  overflow: hidden;
  padding: 14px 10px;
  font-size: 12px;
  .icon {
    overflow: hidden;
    float: left;
    margin: 8px 15px 0 0;
    width: 50px;
    height: 50px;
    border-radius: 200px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .info {
    overflow: hidden;
    dt {
      margin-bottom: 3px;
      font-size: 14px;
      font-weight: 700;
      color: #666;
    }
  }
  .issue {
    margin-bottom: 5px;
    color: #999;
  }
  .count-down {
    display: inline-block;
    padding: 0 10px;
    border-radius: 3px;
    background: #eee;
    line-height: 20px;
    font-size: 12px;
    color: #666;
  }
}

.card-body {
  padding: 10px;
  line-height: 2;
}

.card-foot {
  display: table;
  width: 100%;
  .btn {
    display: table-cell;
    width: 50%;
    line-height: 30px;
    text-indent: -2px;
    border-top: 1px solid#e7e7e7;
    border-right: 1px solid#e7e7e7;
    background: #f7f7f7;
    text-align: center;
    cursor: pointer;
    color: #666;
  }
  .icon-sprite {
    transform: scale(0.6);
    vertical-align: bottom;
  }
  .btn:last-child {
    border-right: none;
  }
}
</style>