<template lang="pug">
.topbar(v-if="info.username")
  .layout-wrap
    .notice
      span.label 最新消息
      marquee(v-text="noticeMsg")
</template>

<script>
import { newsApi } from "api";
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from "vuex";

export default {
  name: "TopBar",
  data() {
    return {
      noticeMsg: ""
    };
  },
  computed: {
    ...mapGetters({
      appConfig: "appConfig",
      info: ACCOUNT.ACCOUNTINFO
    }),
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: 1
      };
    }
  },
  created() {
    newsApi.system().then(data => {
      this.noticeMsg = data.notice;
    });
  }
};
</script>

<style lang="scss" scoped>
.topbar {
  padding: 0 20px;
  background: #ececec;
  .layout-wrap {
    width: 100%;
    max-width: 1280px;
    padding: 9px;
  }
  .notice {
    display: flex;
    align-items: center;
    color: #495060;
  }
  .label {
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    &::before {
      content: "";
      display: block;
      width: 22px;
      height: 22px;
      margin-right: 3px;
      background: url('~assets/themeMix/topbar-speaker.svg');
    }
  }
}
</style>
