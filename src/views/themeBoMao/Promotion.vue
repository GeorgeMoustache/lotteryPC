<template lang="pug">
#promotion.container
  .layout-wrap
    .title 优惠活动
    //- 晋级奖励
    .activity-item(v-if="gradeData && gradeData.type != 0", :class='{show: (gradeData.id == routerId) && isShow}')
      .item-header(@click="hanleClick(gradeData)")
        .item-header-left
          img(:src="gradeData.img" alt="晋级奖励")
        .item-header-right
          h2 晋级奖励
          p(v-text="gradeData.info")
          a(href="javascript:;")
      .item-detail
        .list-item
          h3.title 晋级奖励
          template(v-if="gradeData.userGrade != -1")
            p.active-state 当前等级：
              em VIP{{gradeData.userGrade}}
              | 晋级奖励：
              em(v-text="gradeData.growBonus")
              template(v-if="gradeData.userGrade > 1")
                Button(v-if="gradeData.canDraw" type="error" size="large", :loading="loading" @click="getGrowBonus")
                  span(v-if="!loading") 领取
                  span(v-else) 领取中
                Button(v-else size="large" disabled) 领取
              template(v-else)
                Button(type="error" size="large" disabled) 领取
          template(v-else)
            p.active-state 当前等级：
              em 未登录
              | 晋级奖励：
              em 0
              Button(type="error" size="large" disabled) 领取
        .list-item
          h3.title 晋级机制
          table.gridtable
            tr
              th 等级
              th 头衔
              th 成长积分
              th 晋级奖励(元)
              th(v-if="isShowJump") 跳级奖励(元)
            tr(v-for="item in gradeData.list", :key="item.grade")
              td VIP{{item.grade}}
              td {{item.gradeName}}
              td {{item.gradeGrow}}
              td {{item.bonus}}
              td(v-if="isShowJump") {{item.jumpBonus}}
        .list-item
          h3.title 活动说明
          .activity-description
            p 1、会员每晋升一个等级，都能获得奖励，最高可达{{maxGradeBonus}}元。
            p 2、{{appConfig.upgradeType}}1元可获得1成长积分。
            p 3、会员晋升中如产生跳级，例如原先是VIP2，直接晋升至VIP4，那他将同时获得VIP3与VIP4的晋级奖励。
            p 4、VIP等级系统每10分钟统计一次，如{{appConfig.upgradeType}}已达晋级标准但还未显示晋级，请耐心等候，谢谢！
            br
            br
            template(v-if="isShowJump")
              p 例1：奥巴马从VIP1直接晋升到VIP4，他将能获得{{jumpExpressText(1, 4)}}元奖励。
              p 例2：本拉登从VIP2直接晋升到VIP4，他将能获得{{jumpExpressText(2, 4)}}元奖励。
    .activity-item(
      v-for="(item,index) in activityList"
      :key="item.id"
      :class='{show: (item.id == routerId) && isShow}')
      .item-header(@click="hanleClick(item)")
        .item-header-left
          img(:src="item.img" alt="")
        .item-header-right
          h2(v-text="item.name")
          p(v-text="item.info")
          a(href="javascript:;")
      .item-detail(v-html="item.content")
</template>

<script>
import { newsApi, accountApi } from 'api';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Promotion',
  inject: ['ivNotice'],
  data() {
    return {
      allData: [{}],
      activityList: [], // 活动列表
      isShow: false, // 是否显示详情
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['gradeData', 'appConfig']),
    // 最高奖励
    maxGradeBonus() {
      const { list = [] } = this.gradeData;
      return list.reduce((pre, cur) => (pre += cur.bonus), 0);
    },
    isShowJump() {
      const { list } = this.gradeData;
      if (!list.length) return false;
      return this.gradeData.list.some(item => item.jumpBonus != null);
    },
    routerId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(['fetchSysPromotion']),
    init() {
      this.fetchSysPromotion().then(data => {
        this.allData.splice(0, 1, data.gradeData);
      });
      this.fetchData();
    },
    getGrowBonus() {
      this.loading = true;
      accountApi.growBonus().then(data => {
        this.loading = false;
        if (data.code != 0) return this.notice(data.msg, 'error');
        this.gradeData.canDraw = false;
        this.$Modal.success({
          content: data.msg,
        });
      });
    },
    fetchData() {
      const KEY = 'activity';
      const cache = JSON.parse(localStorage.getItem(KEY)) || null;
      // 判断是否有缓存
      if (cache) {
        this.activityList = cache.activityList; // 活动列表
      }
      newsApi.promotion().then(res => {
        if (res.code != 0) return this.notice(res.msg, 'error');
        // 数据赋值
        const { data } = res;
        // 缓存数据
        localStorage.setItem(KEY, JSON.stringify(data));
        this.activityList = data.activityList; // 活动列表

        // 用于计算当前ID在整个data里面的位置
        this.allData = this.allData.concat(this.activityList);

        // 定位
        const { id } = this.$route.params;
        if (id != null) {
          const showObj = this.allData.find(item => item.id == id);
          if (showObj) {
            this.hanleClick(showObj);
          }
        }
      });
    },
    // 事件操作
    hanleClick(showObj) {
      const index = this.allData.findIndex(item => item.id === showObj.id);
      if (index < 0) return;
      this.$nextTick(() => {
        const jump = document.querySelectorAll('.activity-item');
        // 获取需要滚动的距离
        const total = jump[index].offsetTop + 189;
        // Chrome
        document.body.scrollTop = total;
        // Firefox
        document.documentElement.scrollTop = total;
        // Safari
        window.pageYOffset = total;

        this.$router.push({ params: { id: showObj.id } });
        // 列表详情显示隐藏切换
        this.isShow = !this.isShow;
      });
    },
    // 跳级公式
    jumpExpressText(from, to) {
      const { list = [], jumpBonusRatio } = this.gradeData;
      if (!list.length) return '';
      const { ceil, floor } = Math;
      let ary = list.slice(from, to);
      ary = ary.map(item => item.bonus);
      const result = ceil(ary.reduce((pre, cur) => pre + parseInt(cur, 10), 0) * jumpBonusRatio);
      const ratio = floor(jumpBonusRatio * 100);
      return `(${ary.join('+')})*${ratio}%=${result}`;
    },
  },
  watch: {
    $route() {
      this.isShow = true;
    },
  },
};
</script>