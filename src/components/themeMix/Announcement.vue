<template lang="pug">
.announcement(v-if="openMsg" :class="{theme4: appConfig.themeName == 'theme4'}")
  .outer
    .title 系統公告
      a.close(@click="close()")
    .inner
      ul.list
        li(v-for="(item, index) in msgList" :key="item.id" :class="{active: msgIndex == index}" @click="selectMsg(item.id, index)") {{item.title}}
      dl.content
        dt(v-text="msg.title")
        dd(v-html="msg.content")
    .never-show
      Checkbox(v-model="neverShow") 
        span 不再提醒
</template>

<script>
import { mapGetters } from 'vuex';
import { accountApi } from "@/api";

export default {
  name: 'Announcement',
  data() {
    return {
      openMsg: false,
      msgList: [],
      msgIndex: 0,
      msg: {
        title: '',
        content: ''
      },
      neverShow: false,
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
  },
  created() {
    this.fetchUserMsg();
  },
  methods: {
    //取得消息中心未讀訊息
    fetchUserMsg() {
      this.$store.dispatch("accountInfo").then(data => {
        //如果是遊客或其他不知名狀況
        if (data === "visitor" || data === "") return;
        
        //取得消息中心未讀訊息
        accountApi.userMsg().then(data => {
          let { code, list } = data;
          if (code != 0 || list.length == 0) return;
          if (list.length > 10) list.length = 10;
          this.msgList = list;
          this.msg.title = list[0].title;
          this.msg.content = list[0].content;

          //判斷是否已勾選過今日不再顯示
          let cookie = document.cookie;
          if (cookie.match('announcementDate')) {
            let today = new Date().Format('yyyy-MM-dd');
            if (cookie.match(today)) {
              this.openMsg = false;
            } else {
              this.openMsg = true;
            }
          } else {
            this.openMsg = true;
          }
        });
      });
    },
    //切換訊息
    selectMsg(id, index) {
      this.msgIndex = index;
      this.msgList.forEach((item) => {
        if(item.id == id) {
          this.msg.title = item.title;
          this.msg.content = item.content;
        }
      })
    },
    //關閉最新訊息彈窗
    close() {
      if (this.neverShow) {
        let today = new Date().Format('yyyy-MM-dd');
        document.cookie = 'announcementDate=' + today;
      }
      // 初始化
      this.msgIndex = 0;
      this.neverShow = false;
      this.msgList = [];
      this.openMsg = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.announcement {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  z-index: 21;
  .outer {
    width: 710px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
  }
  .title {
    position: relative;
    background: #de3131;
    font-size: 14px;
    color: #FFF;
    line-height: 40px;
    text-align: center;
    .close {
      position: absolute;
      right: 10px;
      top: 13px;
      display: block;
      width: 15px;
      height: 15px;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 6px;
        display: block;
        width: 15px;
        height: 2px;
        background: #FFF;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
  }
  .inner {
    display: flex;
    background: #FFF;
  }
  .list {
    width: 290px;
    padding: 0 15px;
    border-right: 1px solid #d2d2d2;
    li {
      padding: 10px 5px;
      border-bottom: 1px dashed #d2d2d2;
      font-size: 12px;
      color: #707070;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: all .3s;
      &::before {
        content: "";
        position: relative;
        top: 1px;
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 6px;
        background: url('~assets/themeMix/announcement.png');
      }
    }
    li:hover,
    li.active {
      background: #f2f2f2;
      color: #d74c47;
    }
  }
  .content {
    width: 420px;
    height: 390px;
    padding: 30px 35px;
    overflow: auto;
    font-size: 14px;
    color: #707070;
    dt {
      margin-bottom: 30px;
      font-weight: bold;
    }
    dt,dd {
      word-break: break-all;
    }
  }
  .never-show {
    margin: 5px -7px 0 0;
    color: #FFF;
    text-align: right;
    span {
      display: inline-block;
      margin-left: 5px;
      font-size: 14px;
    }
  }
  &.theme4 {
    .title {
      background: #262732;
    }
  }
}
</style>