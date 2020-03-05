<template lang="pug">
.category_nav(:class="[{'category_nav-type2': !isTheme1}]")
  ul(v-if="isTheme1")
    template(v-for="(folder, index) in folders")
      //- 热门
      template(v-if="index == 0")
        li.nav-item(v-for="(item, idx) in folder.children" :key="idx")
          router-link.nav-btn(:to="{path: `/lottery/${item.alias}`}" :title="item.label")
            .icon
              img(:src="item.icon")
            span.label(v-text="item.label")
      template(v-if="index > 0 && folder.children.length")
        li.nav-item(
          @mouseover="actives[index] = 1"
          @mouseout="actives[index] = 0"
          :class="{'item-last': index == folders.length-1}"
          )
          .item-title-mode2.fn-left
            p(v-text="folder.label")
          .item-content.fn-left
            router-link.nav-text(
              v-for="(item, idx) in folder.children"
              :to="{path: `/lottery/${item.alias}`}"
              v-if="idx < 6"
              :key="idx"
              :title="item.label"
              )
              span.label(v-text="item.label")
          .item-more(v-show="actives[index] && folder.children.length > 6")
            h3.item-more-title(v-text="folder.label")
            router-link.nav-text(
              v-for="(item, idx) in folder.children"
              :to="{path: `/lottery/${item.alias}`}"
              :key="idx"
              :title="item.label"
              )
              span.label(v-text="item.label")
  ul(v-else)
    template(v-for="(folder, index) in folders")
      //- 热门
      template(v-if="index == 0")
        li.nav-item(v-for="(item, idx) in folder.children" :key="idx")
          router-link.nav-btn(:to="{path: `/lottery/${item.alias}`}" :title="item.label")
            .icon
              img(:src="item.icon")
            span.label(v-text="item.label")
      template(v-if="index > 0 && folder.children.length")
        li.nav-item.item-last(
          @mouseover="actives[index] = 1"
          @mouseout="actives[index] = 0"
          )
          .nav-btn
            .icon
              img(src="@/assets/themeMix/navi-more.png")
            span.label {{folder.label}}&gt;&gt;
          .item-more(v-show="actives[index]")
            h3.item-more-title {{folder.label}}&gt;&gt;
            router-link.nav-text(
              v-for="(item, idx) in folder.children"
              :to="{path: `/lottery/${item.alias}`}"
              :key="idx"
              :title="item.label"
              )
              span.label(v-text="item.label")
</template>

<script>
import { mapGetters } from "vuex";
import { accountApi } from "@/api";

export default {
  name: "CategoryNav",
  computed: {
    ...mapGetters(["appConfig", "sideNav"]),
    isTheme1() {
      const { themeName = "theme1" } = this.appConfig;
      return themeName === "theme1";
    },
    folders() {
      let data = this.sideNav;
      if (data.length == 0) return;
      const rootNames = ["热门彩种", "全部彩种"];
      let result = [];

      // 模板1 7个，其他6个
      // const end = this.isTheme1 ? 6 : 5;
      let hostList = data.hots.slice(0, 6);

      result.push({
        label: rootNames[0],
        children: hostList
      });

      result.push({
        label: rootNames[1],
        children: data.list,
        icon: "disc"
      });

      return result;
    }
  },
  data() {
    return {
      actives: {
        1: false,
        2: false,
        3: false
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$store.dispatch("sideNav");
    }
  }
};
</script>

<style lang="scss" scoped>
.category_nav {
  display: none;
  position: absolute;
  left: 0;
  top: 40px;
  width: $layout-sideNav-width;
  border: 1px solid #ddd;
  border-bottom: none;
  border-bottom: 0px;
  background: #fff;
  box-sizing: border-box;
  text-align: left;
  font-weight: normal;
  &.active {
    display: block;
  }
  &.home {
    display: block;
    top: 50px;
  }

  li.nav-item {
    position: relative;
    padding: 14px 10px;
    border-bottom: 1px solid #ddd;
    @include clearfix();
    &:hover {
      background: #f8f8f8;
    }
    a:hover {
      color: $layout-primary;
    }
  }

  .item-title {
    text-align: center;
    line-height: 20px;
    width: 63px;
    padding: 5px 10px 0 5px;
    .ivu-icon {
      font-size: 40px;
      color: #c3c3c3;
    }
    p {
      color: #999;
      line-height: 20px;
    }
  }
  .item-title-mode2 {
    margin: 0 12px;
    padding: 10px;
    width: 34px;
    height: 100px;
    background: #86c429;
    line-height: 20px;
    color: #fff;
  }

  .item-content {
    width: 145px;
    @include clearfix();
  }
  $last-item-height: 126px;
  .item-last {
    height: $last-item-height;
  }
  .item-last .item-more {
    top: auto;
    bottom: -1px;
  }
  .item-more {
    position: absolute;
    top: -1px;
    left: 100%;
    width: 480px;
    padding: 20px 0 20px 20px;
    border: 1px solid #ddd;
    background: #f8f8f8;
    &:before {
      content: "";
      position: absolute;
      left: -1px;
      bottom: 0;
      width: 1px;
      height: $last-item-height - 1px;
      background: #f8f8f8;
    }
    &-title {
      margin-bottom: 10px;
      font-size: 14px;
      color: $layout-primary;
      font-weight: normal;
    }
    .nav-text {
      margin-right: 10px;
      width: 80px;
      line-height: 36px;
    }
  }

  .nav-btn {
    $icon-height: 44px;
    display: block;
    color: #333;
    line-height: 1;
    .icon {
      margin-right: 10px;
      display: inline-block;
      vertical-align: middle;
      width: $icon-height;
      height: $icon-height;
      border-radius: 50%;
      overflow: hidden;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    span {
      vertical-align: middle;
      font-size: 14px;
      line-height: $icon-height;
    }
  }

  .nav-text {
    float: left;
    width: 72px;
    line-height: 32px;
    color: #333;
    font-size: 12px;
  }
}

.category_nav-type2 {
  width: 140px;
  $last-item-height: 58px;
  &.home {
    display:none;
  }
  li.nav-item {
    padding-top: 13px;
    padding-bottom: 13px;
    padding-left: 15px;
    padding-right: 0;
    height: 57px;
  }
  .item-last {
    padding-top: 14px;
    padding-bottom: 14px;
    height: $last-item-height;
  }

  .nav-btn {
    $icon-height: 30px;
    .icon {
      width: $icon-height;
      height: $icon-height;
      background: #fff;
    }
    span {
      line-height: $icon-height;
      font-size: 12px;
    }
  }

  .item-more {
    width: 502px;
    padding: 17px 0 10px 20px;
    &:before {
      height: $last-item-height - 1px;
    }
    &-title {
      margin: 0 0 17px;
      line-height: 1;
      font-size: 12px;
      color: #c00;
    }
    .nav-text {
      @include ellipsis;
      width: 86px;
      margin-bottom: 10px;
      margin-right: 10px;
      line-height: 1;
      white-space: nowrap;
    }
  }
}
</style>
