<template lang="pug">
div
  .profile_record
    //- 頁籤
    .profile-tab
      a(v-for="item in tabList" :key="item.id" :class="{'active': item.id == tabIndex}" @click="selectTab(item.id)") {{item.name}}
  //- 主內容
  .today_profit-view
    .today_profit-wrap
      //- 彩票用模板
      template(v-if="tabIndex == -1")
        ul.head
          li.balance.box
            em.text-error(v-text="info.balance")
            i.ivu-icon.ivu-icon-ios-loop-strong(@click="fetchData")
            p
              span
                Icon(type="social-yen")
                | 余额
              router-link(:to="{path: '/profile/deposit'}") 充值
              router-link(:to="{path: '/profile/withdraw'}") 提现
              router-link(:to="{path: '/profile/record'}") 交易记录
          li.amount.box
            Icon(type="pie-graph")
            .detail
              span 盈亏总额（元）
              em.text-error(v-text="info.amountProfit")
          li.calculate.box
            Icon(type="ios-calculator")
            .detail
              span 盈亏计算公式
              em.text-error 中奖-投注+活动+返点
        .body
          ul.more.box
            li
              em(v-text="info.betMoney")
              span 投注金额
            li
              em(v-text="info.bonusMoney")
              span 中奖金额
            li
              em(v-text="info.activity")
              span 活动礼金
            li
              em(v-text="info.rebate")
              span 返点金额
            li
              em(v-text="info.recharge")
              span 充值金额
            li
              em(v-text="info.withdraw")
              span 提现金额
            li(v-if="info.redPacketOut != null")
              em(v-text="info.redPacketOut")
              span 红包支出
            li(v-if="info.redPacketIn != null")
              em(v-text="info.redPacketIn")
              span 红包领取
            li(v-if="info.redPacketBack != null")
              em(v-text="info.redPacketBack")
              span 红包退回
          Button.share(v-if="shareEnabled" :loading="sharing" @click="shareProfit()" :class="{'lock': !allowSendMsg}")
            span(v-if="!sharing") 分享战绩至聊天室
            span(v-else) 分享中
      //- 第三方遊戲用模板
      template(v-else)
        .tips 資料五分鐘統計一次
        ul.head
          li.balance.box
            em.text-error(v-text="info.totalBalance")
            i.ivu-icon.ivu-icon-ios-loop-strong(@click="fetchData()")
            p
              span
                Icon(type="social-yen")
                | 余额
              router-link(:to="{path: '/profile/moneyTrans'}") 额度转换
              router-link(:to="{path: '/profile/record/', query: {recordType: 'trans'}}") 转换记录
          li.amount.box
            Icon(type="pie-graph")
            .detail
              span 输赢总额
              em.text-error(v-text="info.amountProfit")
        ul.body
          li(v-for="(item, index) in info.platform" :key="index")
            h2 {{item.platName}}
            ul.more.box
              li
                em(v-text="item.betMoney")
                span 有效投注
              li
                em(v-text="item.profit")
                span 输赢金额
              li
                em(v-text="item.transIn")
                span 转入金额
              li
                em(v-text="item.transOut")
                span 转出金额
              li
                em(v-text="item.balance")
                span 余额
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';
import { accountApi, chatApi } from 'api';

export default {
  name: 'TodayProfit',
  inject: ['ivNotice'],
  data() {
    return {
      tabList: [{ id: -1, name: '彩票' }], //頁籤清單
      tabIndex: -1, //選中的頁籤
      info: {}, //資料清單
      roomId: 0, //聊天室房間ID
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      shareEnabled: false, //是否有發炫耀紅包權限
      allowSendMsg: true, //是否有發言權限
      sharing: false, //分享戰績按鈕開關
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO,
    }),
  },
  created() {
    //如果不是測試帳號就顯示完整頁籤
    if (this.accountInfo.type != 3) {
      this.tabList.push(...this.$root.thirdPartyTab);
    }

    this.fetchData();
  },
  methods: {
    //頁籤切換
    selectTab(id) {
      this.tabIndex = id;
      this.fetchData();
    },
    fetchData() {
      //判斷頁籤種類使用對應的 api 方式獲取資料
      let api, params;
      if (this.tabIndex == -1) {
        api = 'todayProfit';
        params = '';

        //如果是彩票分類需額外確認有無分享戰蹟之權限
        chatApi.identityCheck().then(res => {
          let data = res.data;

          //判斷是否可訪問聊天室，聊天室關閉或使用者無訪問權限皆阻檔
          let userRoomAccess = data.permission.userRoomAccess;
          if (this.appConfig.hasChat == 0 || !userRoomAccess) {
            this.shareEnabled = false;
            return;
          } else {
            this.shareEnabled = true;
          }

          //因應多聊天室功能，需取得房間ID及房間名稱
          this.roomId = data.roomId;

          //取得用戶基本權限
          let isRoomManager = data.permission.isRoomManager;
          let allowTalk = data.permission.allowTalk;

          if (!isRoomManager) {
            if (allowTalk) {
              this.allowSendMsg = true;
            } else {
              this.allowSendMsg = false;
            }
          } else {
            this.allowSendMsg = true;
          }
        });
      } else {
        api = 'todayProfitGame';
        params = this.tabIndex;
      }

      accountApi[api](params).then(data => {
        let { code, msg } = data;
        if (code != 0) return this.ivNotice('error', msg);

        //清空資料
        this.info = {};

        //彩票與第三方之 api 結構不同需分開取
        if (this.tabIndex == -1) {
          this.info = data.info;
        } else {
          this.info = data.data;
        }
      });
    },
    //分享戰績到聊天室
    shareProfit() {
      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.sharing = true;

      let params = {};
      params.roomId = this.roomId;

      chatApi.shareProfit(params).then(data => {
        let { code, msg } = data;
        switch (code) {
          case '0':
            this.ivNotice('success', '分享战绩成功');
            break;
          case '204':
            this.ivNotice('error', msg);
            break;
          default:
            this.ivNotice('error', '分享战绩失败');
        }
        this.sharing = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
//第三方提示文字
.tips {
  padding: 0 20px;
  text-align: right;
}

.today_profit-wrap {
  background: #fff;
  em {
    font-style: normal;
  }
  .ivu-icon-ios-loop-strong {
    position: relative;
    top: -3px;
    margin-left: 32px;
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .ivu-icon-ios-loop-strong:hover {
    transform: rotate(180deg);
  }
  .box {
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  ul.head {
    display: table;
    width: 100%;
    li {
      display: table-cell;
      padding: 0 15px;
      height: 100px;
      vertical-align: middle;
      overflow: hidden;
    }
  }

  //余额
  .balance {
    em {
      font-size: 30px;
      line-height: 1;
    }
    p {
      margin-top: 10px;
    }
    span {
      margin-right: 30px;
    }
    a {
      color: #495060;
      border-radius: 4px;
      border: 1px solid #ddd;
      margin: 0 3px;
      padding: 2px 10px;
    }
  }
  .amount,
  .calculate {
    .ivu-icon {
      float: left;
      margin-right: 15px;
      width: 60px;
      height: 60px;
      padding: 16px;
      text-align: center;
      border-radius: 4px;
      background: #fb4046;
      font-size: 28px;
      line-height: 28px;
      color: #fff;
    }
    .detail {
      overflow: hidden;
    }
    em {
      display: block;
      line-height: 1;
    }
  }
  .amount em {
    margin-top: 15px;
    font-size: 28px;
  }
  .calculate em {
    margin-top: 30px;
  }
  // 更多
  .body {
    padding: 0 20px 20px;
  }
  .more {
    display: table;
    width: 100%;
    padding: 20px;
    li {
      display: table-cell;
      text-align: center;
      & + li {
        border-left: 1px dotted #d9d8d8;
      }
    }
    em {
      display: block;
      margin-bottom: 5px;
      font-size: 18px;
    }
  }
  .share {
    margin-top: 15px;
    background: #ff631e;
    border: 1px solid transparent;
    color: #fff;
    &:hover {
      background: #fff;
      border-color: #ff631e;
      color: #ff631e;
    }
    &.lock {
      cursor: not-allowed;
    }
  }
}
</style>