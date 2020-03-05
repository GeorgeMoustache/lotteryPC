<template lang="pug">
header(:class="{'dark': $route.path != '/'}")
  //- topbar
  .topbar(v-if="topbarEnabled")
    .layout-wrap
      //- 使用者資訊
      .user-info(v-if="isLogin") 欢迎您
        span.name(v-text="accountInfo.username")
        | ,余额：
        span.wealth(v-show="showMoney" v-text="`￥${loading ? '---' : accountInfo.wealth}`")
        a.money-toggle(:class="{active: !showMoney}" @click="moneyToggle()")
        Icon.refresh(v-show="showMoney" type="ios-loop-strong" @click.native="refresh()" title="刷新")
      .links
        //- 登入前功能
        template(v-if="!isLogin")
          router-link(:to="{path: '/register'}") 注册
          router-link(:to="{path: '/login'}") 登录
        //- 登入後功能
        template(v-else)
          .member
            a 会员中心 
            .sub-menu
              ul.wrap
                li
                  .title 投注记录
                  router-link(:to="{path: '/profile/BetRecord/-1'}") 彩票
                  router-link(v-for="item in $root.thirdPartyRecord" :key="item.id" :to="{path: '/profile/BetRecord/'+ item.id}") {{item.name}}
                li
                  .title 资金管理
                  router-link(:to="{path: '/profile/deposit'}") 充值
                  router-link(:to="{path: '/profile/withdraw'}") 提现
                  a(v-if="$root.thirdPartyTab.length" @click="transButton()") 额度转换
                  router-link(:to="{path: '/profile/record/0'}") 充值记录
                  router-link(:to="{path: '/profile/record/1'}") 提现记录
                  router-link(:to="{path: '/profile/record/2'}") 彩票消费
                  router-link(:to="{path: '/profile/record/3'}") 奖金派送
                  router-link(:to="{path: '/profile/record/4'}") 交易明细
                  router-link(:to="{path: '/profile/record/5'}" v-if="$root.thirdPartyRecord.length") 额转记录
                  router-link(:to="{path: '/profile/todayProfit'}") 今日盈亏
                li
                  .title 帐号管理
                  router-link(:to="{path: '/profile/password'}") 密码管理
                  router-link(:to="{path: '/profile/bankCard'}") 银行卡管理
                  router-link(:to="{path: '/profile/information'}") 个人资料
                  a(@click="logout()") 登出
                li(v-if="proxyEnabled")
                  .title 代理中心
                  router-link(:to="{path: '/profile/agent/intro'}") 代理说明
                  router-link(:to="{path: '/profile/agent/agencyReport'}") 代理报表
                  router-link(:to="{path: '/profile/agent/lowerReport'}") 下级报表
                  router-link(:to="{path: '/profile/agent/manageInvite'}") 下级开户
                  router-link(:to="{path: '/profile/agent/member'}") 会员管理
                  router-link(:to="{path: '/profile/agent/recordBet'}") 投注明细
                  router-link(:to="{path: '/profile/agent/recordBill'}") 交易明细
          router-link(:to="{path: '/profile/deposit'}") 充值
          router-link(:to="{path: '/profile/withdraw'}") 提款
          a(v-if="$root.thirdPartyTab.length" @click="transButton()") 额度转换
          a(@click="openMsg()") 平台公告
        //- 共同連結
        template(v-if="appConfig.themeName != 'theme6'")
          a.service(v-if="appConfig.serviceUrl != ''" @click="service()") 客服
          router-link(:to="{path: '/promotion'}") 优惠活动
  //- logobar
  .logobar
    .layout-wrap
      a.logo(@click="logoLink()" :title="appConfig.AppName" v-text="appConfig.AppName" :style="{ backgroundImage: `url(${appConfig.logo})` }" :class="{logined: isLogin}")
      ul.navi
        li(v-if="appConfig.themeName != 'theme6'")
          router-link(:to="{path: '/'}") 首页
        li
          a 彩票
          .sub-menu.lottery
            ul.wrap
              li(v-for="item in lotteryList" :key="item.groupId" v-if="item.groupId != 0")
                img(:src="item.imgSrc")
                .game
                  a(v-for="item in item.children" :key="item.alias" @click="lotteryLink(item.alias)") {{item.label}}
        li(v-for="item in thirdPartyGameList" :key="item.id")
          a(:key="item.id") {{item.name}}
          .sub-menu.thirdparty
            ul.wrap
              li(v-for="childItem in item.children" :key="childItem.platId")
                img.banner(:src="childItem.imgSrc" @error="imgError(childItem.linkEname)")
                Button.enter(:disabled="childItem.status != '1'" v-text="childItem.status == '1' ? '进入游戏' : '平台维护开发中 敬请期待'" @click="openLink(childItem.platId)")
        template(v-if="appConfig.themeName == 'theme6'")
          li
            a.service(v-if="appConfig.serviceUrl != ''" @click="service()") 客服
          li
            router-link(:to="{path: '/promotion'}") 优惠活动
  //- 溫馨提示
  Modal(v-model="tips" title="温馨提示" @on-ok="openGame")
    p 为更好的进行游戏娱乐，将为您打开新的窗口
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi, lotteryApi, gameBoyApi } from '@/api';

export default {
  name: 'LayoutHeader',
  inject: ['ivNotice'],
  data() {
    return {
      isLogin: false, //是否已登入
      loading: false,
      tid: null,
      showMoney: false, //是否顯示可用餘額
      intervalTime: null, //重新獲取資料

      //彩種遊戲列表
      lotteryList: [],

      //第三方相關
      thirdPartyGameList: [], //第三方遊戲列表
      playLink: '', //前往第三方平台連結
      tips: false, //溫馨提示彈窗
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO,
      betState: ACCOUNT.BETSTATE,
    }),
    proxyEnabled() {
      //如果是代理權限帳號就開啟代理選單
      let { username, userType, type } = this.accountInfo;
      if (username && username.substring(0, 5) != 'Guest' && (userType && ~userType.indexOf('代理'))) return true;
    },
    //依照模板及登入狀態決定是否顯示 topbar
    topbarEnabled() {
      if (this.appConfig.themeName == 'theme6') {
        if (this.isLogin) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.fetchUserData();
      this.intervalFetch();
      this.fetchLotteryList();
      this.fetchThirdPartyGame();
    },
    //獲取使用者資料
    fetchUserData() {
      this.$store.dispatch('accountInfo').then(data => {
        //如果是遊客或其他不知名狀況
        if (data === 'visitor' || data === '') {
          this.isLogin = false;
          this.$parent.isLogin = false;
          return;
        }

        //變更登入狀態
        this.isLogin = true;
        this.$parent.isLogin = true;
      });
    },
    //每 6 分鐘獲取一次使用者資料
    intervalFetch() {
      clearTimeout(this.intervalTime);
      this.intervalTime = setInterval(() => {
        this.fetchUserData();
      }, 360000);
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
    //判斷帳號狀態決定額轉按鈕動作
    transButton() {
      accountApi.chkTestAccount().then(data =>{
        let { code, msg } = data;
        if (code == -1) {
          this.ivNotice('error', msg);
        } else {
          this.$router.push({ path: '/profile/moneyTrans' });
        }
      });
    },
    //餘額顯示切換
    moneyToggle() {
      this.showMoney = !this.showMoney;
    },
    //會員登出
    logout() {
      this.$store.dispatch('logout', { isReload: true });
      if (this.appConfig.themeName == 'theme6') {
        this.$router.push({ path: '/' });
      }
    },
    //開啟平台公告
    openMsg() {
      this.$bus.$emit('fetchUserMsg');
    },
    //獲取彩票列表
    fetchLotteryList() {
      lotteryApi.list().then(data => {
        let { code, msg, list } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.lotteryList = this.$root.CATEGORYS;
        this.lotteryList.forEach(item => {
          let categoryItem = item;
          categoryItem.children = [];
          if (item.groupId != 0) {
            //針對模板6做特殊處理
            if (this.appConfig.themeName == 'theme6') {
              categoryItem.imgSrc = require('@/assets/themeBoMao/header-lottery' + item.groupId + '-w.png');
            } else {
              categoryItem.imgSrc = require('@/assets/themeBoMao/header-lottery' + item.groupId + '.png');
            }
          }
          list.forEach(item => {
            if (categoryItem.groupId == item.groupId) {
              categoryItem.children.push(item);
            }
          });
        });
      });
    },
    //獲取第三方列表
    fetchThirdPartyGame() {
      this.thirdPartyGameList = this.$root.thirdPartyTab;
      this.thirdPartyGameList.forEach(item => {
        item.children = [];
        gameBoyApi.allGame({ params: { thirdPartyId: item.id } }).then(data => {
          let { code, msg, wallet } = data;
          item.children.push(...wallet);
          item.children.forEach(item => {
            try {
              item.imgSrc = require('@/assets/themeBoMao/header-thirdparty-' + item.linkEname + '.png');
            } catch (error) {
              item.imgSrc = require('@/assets/themeBoMao/header-thirdparty-cardgame-default.png');
            }
          });
          this.$forceUpdate();
        });
      });
    },
    //點擊logo動作
    logoLink() {
      //模板 6 特別設定
      if (this.appConfig.themeName == 'theme6' && !this.isLogin) {
        this.$router.push({ path: '/' });
      }
    },
    //點擊彩票動作
    lotteryLink(alias) {
      //針對模板 6 特別設定，未登入時點選需彈窗警示
      if (this.appConfig.themeName == 'theme6' && !this.isLogin) {
        this.$Modal.info({
          title: '系统提示',
          content: '您还未登录，请先登录',
          onOk: ()=> {
            if (this.$route.path != '/') {
              this.$router.push({path: '/'})
            }
          }
        });
        return;
      }
      this.$router.push({ path: `/lottery/${alias}` });
    },
    //點擊第三方遊戲動作
    openLink(id) {
      //模版 6 特別設定，未登入時點選第三方需彈窗警示
      if (this.appConfig.themeName == 'theme6' && !this.isLogin) {
        this.$Modal.info({
          title: '系统提示',
          content: '您还未登录，请先登录',
          onOk: ()=> {
            if (this.$route.path != '/') {
              this.$router.push({path: '/'})
            }
          }
        });
        return;
      }

      //如果未登入導向登入頁
      if (!this.isLogin) return this.$router.push({ path: '/login' });

      gameBoyApi.play({ params: { platId: id } }).then(data => {
        let { code, msg, goURL } = data;
        //遊戲維護中
        if (code == 3) {
          this.$Modal.error({
            title: '系统错误',
            content: '游戏维护中',
          });
          return;
        }

        //測試帳號
        if (code == -1) {
          this.$Modal.warning({
            title: '发生问题',
            content: msg || '游戏维护中...',
          });
          return;
        }

        //開發中請期待
        if (code == 99) {
          this.$Modal.warning({
            title: '敬请期待',
            content: msg || '開發中',
          });
          return;
        }

        //取得遊戲的 URL
        this.playLink = goURL;
        //判斷遊戲的餘額
        this.getBalance(id);
      });
    },
    //取得餘額
    getBalance(id) {
      accountApi.getBalance({ params: { platId: id } }).then(data => {
        let { code, msg, balance } = data;
        if (code != 0) {
          this.$Modal.error({
            title: '系统错误',
            content: msg,
          });
          return;
        }

        //餘額不足 1 提示警告
        if (balance < 1) {
          this.$Modal.confirm({
            title: '余额不足',
            content: '账户余额不足<br/>请先进行额度转换',
            okText: '前往游戏',
            closable: true,
            onOk: () => {
              this.tips = true;
            },
            cancelText: '前往额度转换',
            onCancel: () => {
              this.goMoneyTrans();
            },
          });
        } else {
          this.openGame();
        }
      });
    },
    //打開遊戲 (設定時間解決 body overflow 的問題)
    openGame() {
      setTimeout(() => {
        window.open(this.playLink);
      }, 100);
    },
    //前往額度轉換
    goMoneyTrans() {
      this.$router.push({ path: '/profile/moneyTrans' });
    },
    //遊戲錯誤顯示預設圖
    imgError(linkEname) {
      if (linkEname == 'KYGame') {
        item.imgSrc = require('@/assets/themeBoMao/header-thirdparty-cardgame-default.png');
      } else if (linkEname == 'AGLiveCasino') {
        item.imgSrc = require('@/assets/themeBoMao/header-thirdparty-livecasino-default.png');
      }
    },
    //客服連結
    service() {
      window.open(this.appConfig.serviceUrl, '客服系统', "width=740, height=660");
    }
  },
  watch: {
    betState: 'fetchUserData', //投注状态改变，更新用户财富数据
    '$root.thirdPartyTab': {
      handler() {
        this.fetchThirdPartyGame();
      },
      immediate: true,
    },
    $route(to) {
      this.fetchUserData();
      this.intervalFetch();
    },
  },
};
</script>