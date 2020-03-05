<template lang="pug">
.rebate-des
  .rebate-nav
    router-link(
      v-for="(item, index) in list",
      :to="{path: `/rebateDes/${index}`}",
      :key="item.index",
      v-text="item.title",
      active-class="active"
      )
  .rebate-main
    ul.rebate-title
      li
        span.mode 玩法
        span.point 返点
      li(v-for="(item, idx) in curData.titles" v-text="item", :key="item + idx")
    //- 节点显示
    .rebate-content(v-show="!showDeltail")
      ul.switch-node(v-for="(child, index) in curData.content", :key="child.point", @click="toggleClick(child, curData)")
        li(v-text="child.point")
        li(v-for="(item, idx) in child.rebates" v-text="`赔率${item}`", :key="idx")
    //- 细节显示
    .rebate-content(v-show="showDeltail")
      template(v-for="(child, index) in nodeData")
        ul.switch-node(v-if="index == 0", :key="child.point", @click="toggleClick(child)")
          li.active(v-text="child.point")
          li(v-for="(item, idx) in child.rebates" v-text="`赔率${item}`", :key="idx")
        ul(v-else, :key="child.point")
          li(v-text="child.point")
          li(v-for="(item, idx) in child.rebates" v-text="`赔率${item}`", :key="idx")
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { agentApi } from 'api';

export default {
  name: 'RebateDes',
  data() {
    return {
      list: [],
      showDeltail: false,
      cacheData: {},
      nodeData: []
    };
  },
  computed: {
    ...mapGetters(['agentRebate']),
    curData() {
      let { list, $route } = this;
      let { index } = $route.params;
      return index <= list.length - 1 ? list[index] : [];
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchAgentRebate();
      this.fetchData();
    },
    ...mapActions(['fetchAgentRebate']),
    fetchData() {
      agentApi.rebateDes().then(data => {
        if (data.code != 0) return this.notice(data.msg, 'warning');
        let list = data.list.map(item => {
          let titles = [];
          let sysRebates = [];
          // format titles
          item.content.forEach(child => {
            let ary = child.split('|');
            if (ary.length == 2) {
              titles.push(ary[0]);
              sysRebates.push(ary[1]);
            }
          });
          item.titles = titles;
          item.sysRebates = sysRebates;

          // format content
          let ary = [];
          let { sysPoint, id } = item;
          let { point } = this.agentRebate.find(item => item.id == id);
          if (point == null) point = '1.0';
          let base = Number(String(point).replace(/(\d+).\d+/, '$1')); // 基数
          if (point - base != 0) ary.push(point);
          Array.apply(null, { length: base }).forEach((n, i) => {
            ary.push((base - i).toFixed(1));
          });
          // [7.5, 7.0..., 0.0]
          ary.push('0.0');

          let content = ary.map(point => {
            return {
              title: item.title,
              point: point,
              rebates: sysRebates.map(rebate => {
                // rebate * (100 - sysPoint - curPoint)/100
                return (Number(rebate) * (100 - (sysPoint * 10 - point * 10) / 10) / 100).toFixed(3);
              })
            };
          });
          item.content = content;

          return item;
        });
        this.list = list;
      });
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
    toggleClick(child, curData) {
      let { title, point } = child;
      if (Number(point) == 0) return;
      this.showDeltail = !this.showDeltail;
      if (!this.showDeltail && curData == null) return;

      let { cacheData } = this;
      let { sysPoint, sysRebates } = curData;
      let k = `${title}-${point}`;

      if (cacheData[k] == null) {
        let start = Number(point);
        let suffix = String(point).replace(/\d+.(\d+)/, '$1');
        let length = suffix > 0 ? suffix : 10;
        let ary = Array.apply(null, { length: length }).map((n, i) => ((point * 10 - i) / 10).toFixed(1));

        let content = ary.map(point => {
          return {
            point: point,
            rebates: sysRebates.map(rebate => {
              // rebate * (100 - sysPoint - curPoint)/100
              return (Number(rebate) * (100 - (sysPoint * 10 - point * 10) / 10) / 100).toFixed(3);
            })
          };
        });
        cacheData[k] = content;
      }

      this.nodeData = cacheData[k];
    }
  },
  watch: {
    '$route.params'() {
      this.showDeltail = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.rebate-nav {
  background: linear-gradient(90deg, #56585f 0, #68686e 50%, #4b4e56);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#56585f",endColorstr="#4b4e56",GradientType=0);
  height: 65px;
  padding: 0 20px;
  position: relative;
  @include clearfix();
  a {
    position: absolute;
    top: 21px;
    width: 143px;
    height: 44px;
    line-height: 50px;
    background: url('~assets/themeMix/rebate_btn.png') no-repeat;
    font-size: 16px;
    color: #333;
    text-align: center;
    text-shadow: 1px 1px 0 #c3c3c3;
  }
  @for $i from 1 through 8 {
    a:nth-child(#{$i}) {
      left: 20px + 115 * ($i - 1);
      z-index: 8 - $i;
    }
  }
  a.active {
    background-image: url('~assets/themeMix/rebate_btn-active.png');
    z-index: 100;
  }
}
.rebate-main {
  padding: 20px;
  @include clearfix();
  ul {
    float: left;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  li {
    overflow: hidden;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #ddd;
    font-size: 12px;
    white-space: nowrap;
    text-align: center;
  }
}
.rebate-title {
  float: left;
  width: 139px;
  border-left: 1px solid #ddd;
  font-weight: 700;
  li:first-child {
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
    }
    &:before {
      top: 0;
      right: 0;
      border-bottom: 40px solid #ddd;
      border-right: 144px solid transparent;
    }
    &:after {
      right: 1px;
      top: 1px;
      border-bottom: 39px solid #fff;
      border-right: 140px solid transparent;
    }
  }
  .mode {
    position: absolute;
    left: 15px;
    bottom: -6px;
    z-index: 1;
  }
  .point {
    position: absolute;
    right: 15px;
    top: -6px;
    z-index: 1;
  }
}
.rebate-content ul {
  width: 100px;
  li:first-child {
    font-size: 16px;
    font-weight: 400;
    background: #f8f8f8;
  }
  &.switch-node li:first-child {
    font-weight: 700;
  }
  &.switch-node:not(:last-child):hover {
    background: #fcfcfc;
  }
  &.switch-node:not(:last-child) li:first-child {
    position: relative;
    cursor: pointer;
    &:before {
      content: '\5C55\5F00';
      position: absolute;
      right: 0;
      top: -10px;
      color: #aaa;
      font-size: 12px;
      font-weight: 400;
    }
    &.active:before {
      content: '\6536\56DE';
    }
  }
}
</style>
