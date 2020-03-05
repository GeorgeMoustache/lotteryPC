<template lang="pug">
.announcement(v-if="openMsg")
  .outer
    .title 公告
      a.close(@click="close()")
    .inner
      .list
        ul.wrap
          li(v-for="(item, index) in msgList" :key="item.id" :class="{active: msgIndex == index}" @click="selectMsg(item.id, index)")
            a {{item.title}}
        Page(simple :current="query.current" :total="total" @on-change="changePage")
      dl.content
        dt(v-text="msg.title")
        dd(v-html="msg.content")
</template>

<script>
import { accountApi } from "@/api";

export default {
  name: 'Announcement',
  inject: ['ivNotice'],
  data() {
    return {
      openMsg: false,
      msgList: [],
      msgIndex: 0,
      msg: {
        title: '',
        content: ''
      },
      query: {
        current: 1,
        size: 10
      }
    }
  },
  created() {
    this.$bus.$on('fetchUserMsg', this.fetchUserMsg)
  },
  beforeDestroy() {
    this.$bus.$off('fetchUserMsg');
  },
  methods: {
    //取得消息中心訊息
    fetchUserMsg() {
      this.$store.dispatch("accountInfo").then(data => {
        //如果是遊客或其他不知名狀況
        if (data === "visitor" || data === "") return;
        
        accountApi.message(this.query).then(data => {
          let { code, list, total } = data;
          if (code != 0) return this.ivNotice('error', '获取消息发生错误');
          if (list.length == 0) return this.ivNotice('info', '平台公告暂无记录');
          this.msgList = list;
          this.msg.title = list[0].title;
          this.msg.content = list[0].content;
          this.total = total;
          this.openMsg = true;
        });
      });
    },
    //切換訊息
    selectMsg(id, index) {
      this.msgIndex = index;
      this.msgList.forEach((item) => {
        if (item.id == id) {
          this.msg.title = item.title;
          this.msg.content = item.content;
        }
      })
    },
    //換頁
    changePage(value) {
      this.msgIndex = 0;
      this.query.current = value;
      this.fetchUserMsg();
    },
    //關閉最新訊息彈窗
    close() {
      // 初始化
      this.msgIndex = 0;
      this.neverShow = false;
      this.msgList = [];
      this.openMsg = false;
      this.query.current = 1;
    },
  }
}
</script>