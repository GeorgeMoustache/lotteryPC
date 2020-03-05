<template lang="pug">
.logobar(:class="{theme4: appConfig.themeName == 'theme4'}")
  .layout-wrap
    router-link.logo(v-bind:to="{path: '/'}" v-bind:title="appConfig.AppName")
      img(:src="appConfig.logo")
    .menu
      .login-form(v-if="!isRegLogin")
        login-form(v-if="!accountInfo.username")
        .user-info(v-if="accountInfo.username") 您好，
          span(v-text="accountInfo.username")
          | &nbsp;&nbsp;可用余额：
          template(v-if="!this.$parent.isTheme2")
            span.text-error.wealth(v-text="`￥${loading ? '---' : accountInfo.wealth}`")
            Icon(type="ios-loop-strong" @click.native="refresh" title="刷新")
          template(v-else)
            span.text-error.wealth(v-show="showMoney" v-text="`￥${loading ? '---' : accountInfo.wealth}`")
            Icon(v-show="showMoney" type="ios-loop-strong" @click.native="refresh" title="刷新")
          a.money-toggle(v-if="this.$parent.isTheme2" :class="{active: !showMoney}" @click="moneyToggle()")
        .links(v-if="accountInfo.username")
          router-link(:to="{name: 'profileIndex'}") 会员中心
          router-link(:to="{path: '/profile/deposit'}") 充值
          router-link(:to="{path: '/profile/withdraw'}") 提现
          template(v-if="$root.thirdPartyTab.length")
            router-link(:to="{path: '/profile/moneyTrans'}" v-if="transButtonEnabled") 额度转换
            a(v-else @click="transAlert") 额度转换
          router-link(:to="{path: '/profile/record'}") 交易记录
          router-link.news(:class="{active: noRead > 0}" :to="{path: '/profile/message'}")
            span.number(v-if="noRead > 0") {{noRead}}
            | 消息中心
          a.logout(@click="logout") 退出
      .other-link(v-if="appConfig.serviceUrl != ''")
        a.service(@click="service()") 联系客服
</template>

<script>
import LoginForm from 'components/themeMix/LoginForm';
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi } from '@/api';

export default {
  name: "LogoBar",
  components: {
    LoginForm
  },
  inject: ['ivNotice'],
  data() {
    return {
      loading: false,
      tid: null,
      showMoney: true, //是否顯示可用餘額

      // 公告
      modal: false,
      msgList: [],
      msgIndex: 0,
      remember: false, // 保存读取状态
      noRead: 0, //未讀訊息
      intervalTime: null, //重新獲取資料
      transButtonEnabled: true, //額轉按鈕功能是否啟用
    };
  },
  computed: {
    ...mapGetters({
      appConfig: "appConfig",
      accountInfo: ACCOUNT.ACCOUNTINFO,
      betState: ACCOUNT.BETSTATE,
    }),
    isRegLogin() {
      return /(login|register)/i.test(this.$route.path);
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      //獲取使用者最新資料
      this.fetchUserData();

      //啟用定時獲取
      this.intervalFetch();

      //模板二使用眼睛開關
      this.checkEye();
    },
    //獲取使用者資料
    fetchUserData() {
      this.$store.dispatch("accountInfo").then(data => {
        //如果是遊客或其他不知名狀況
        if (data === "visitor" || data === "") return;
        
        //測試帳號的話就禁用額轉按鈕
        if (this.accountInfo.type == 3) {
          this.transButtonEnabled = false;
        } else {
          this.transButtonEnabled = true;
        }

        //取得消息中心未讀訊息數量
        accountApi.message({current: 1, size: 10, type: 1}).then(data => {
          this.noRead = data.noRead;
        });
      });
    },
    //每 6 分鐘獲取一次使用者資料
    intervalFetch() {
      clearTimeout(this.intervalTime);
      this.intervalTime = setInterval(()=>{
        this.fetchUserData()
      }, 360000)
    },
    //重新獲取帳戶金額
    refresh() {
      this.loading = true;
      clearTimeout(this.tid);
      this.tid = setTimeout(() => {
        this.fetchUserData();
        this.loading = false;
      }, 200);
    },
    //測試帳號點選額轉提醒
    transAlert() {
      accountApi.chkTestAccount().then(data =>{
        let { code, msg } = data;
        if (code === -1) return this.ivNotice('error', msg)
      });
    },
    //會員登出
    logout() {
      this.$store.dispatch("logout", { isReload: true });
    },
    //餘額顯示切換
    moneyToggle() {
      this.showMoney = !this.showMoney;
    },
    checkEye(){
      if(this.$parent.isTheme2){
        this.showMoney = false; //模板二眼睛預測閉眼
      }
    },
    //客服連結
    service() {
      window.open(this.appConfig.serviceUrl, '客服系统', "width=740, height=660");
    }
  },
  watch: {
    betState: "fetchUserData", //投注状态改变，更新用户财富数据
    $route(to) {
      //定時自動更新資料
      this.fetchUserData();
      this.intervalFetch();
      //如果進入消息中心頁面則清空未讀訊息數量
      if (this.$router.currentRoute.path == "/profile/message") {
        accountApi.clearMessage().then(data => {
          if (data.code != 0) return;
          this.noRead = 0;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#themeMix {
  .logobar {
  padding: 0 20px;
  background: #fff;
  .layout-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1280px;
    &::after {
      display: none;
    }
  }
  .logo {
    height: 70px;
    margin: 15px 0;
    img {
      display: block;
      width: auto;
      height: 100%;
    }
  }

  .menu {
    display: flex;
    align-items: center;
  }

  .login-form {
    display: flex;
    align-items: center;
  }

  .user-info {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    .ivu-icon {
      font-size: 16px;
      font-weight: 700;
      color: #888;
      cursor: pointer;
      transition-duration: 0.3s;
      &:hover {
        transform: rotate(360deg);
      }
    }
  }
  .wealth {
    margin: 0 5px;
  }

  .money-toggle {
    display: block;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    background: url('~assets/themeMix/logobar-show.svg') center center no-repeat;
    background-size: 100% auto;
    &.active {
      background-image: url('~assets/themeMix/logobar-hide.svg');
    }
  }

  .links a {
    padding: 0 8px;
    border-left: 1px solid #666;
    color: #666;
    &:hover {
      color: $layout-primary;
    }
    &:first-child {
      border: none;
    }
    .ivu-icon {
      margin-right: 5px;
      font-size: 20px;
    }
    &.news,
    &.logout {
      position: relative;
    }
    &.news {
      padding-left: 30px;
    }
    &.logout {
      margin-left: 5px;
      padding-left: 20px;
      border-left: none;
    }
    &.news::before,
    &.logout::before {
      content: "";
      position: absolute;
      top: -5px;
      display: block;
      background-position: left center;
      background-repeat: no-repeat;
    }

    &.news::before {
      left: 5px;
      width: 19px;
      height: 22px;
      background-image: url('~assets/themeMix/logobar-notify.png');
    }
    &.logout::before {
      left: 0;
      width: 18px;
      height: 21px;
      background-image: url('~assets/themeMix/logobar-logout.png');
    }
    &.news.active::before {
      animation: news 2s linear infinite;
    }
    .number {
      position: absolute;
      left: 13px;
      top: -15px;
      min-width: 18px;
      padding: 0 2px;
      background: #f13131;
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      text-align: center;
    }
  }

  .other-link {
    display: inline-flex;
    margin-left: 17px;
    a {
      display: inline-block;
      margin-right: 15px;
      padding: 8px 16px;
      background: #ed3f14;
      border-radius: 2px;
      font-size: 12px;
      color: #fff;
      &:hover {
        opacity: 0.6;
      }
      &.service {
        margin-right: 0;
      }
    }
  }
  &.theme4 {
    background: #262732;
    .menu {
      color: #FFF;
    }
    .ivu-icon {
      color: #FFF;
    }
    .links a {
      border-color: #FFF;
      color: #FFF;
      &.news::before {
        left: 5px;
        width: 19px;
        height: 22px;
        background-image: url('~assets/themeMix/logobar-notify-white.png');
      }
      &.logout::before {
        left: 0;
        width: 18px;
        height: 21px;
        background-image: url('~assets/themeMix/logobar-logout-white.png');
      }
    }
  }
}

@keyframes news {
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  10% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(45deg);
  }
  20% {
    transform: rotate(0deg);
  }
  21% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
}
</style>
