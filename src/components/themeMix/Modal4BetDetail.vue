<template lang="pug">
div
  Modal(v-model="modal")
    p(slot="header") 注单详情
    p.text-center(v-text="`注单号：${info.no}`")
    table.modal-table
      tr
        th 账号：
        td(v-text="info.username")
        th 单注金额：
        td(v-text="info.price")
      tr
        th 下注时间：
        td(v-text="info.date")
        th 投注注数：
        td(v-text="info.count")
      tr
        th 彩种：
        td(v-text="info.categoryLabel")
        th 投注总额：
        td(v-text="info.cost")
      tr
        th 期号：
        td(v-text="info.issue")
        th 中奖金额：
        td(v-text="info.win")
      tr
        th 玩法：
        td(v-text="info.modeLabel")
        th 盈亏：
        td(v-text="info.profit")
      tr
        th 开奖号码：
        td(colspan="3" v-html="$root.formatNums(info, 'openNum')")
      tr
        th 状态：
        td(colspan="3" v-text="$root.formatState(info)")
      tr
        th(width="80") 下注号码：
        td(colspan="3" v-if="info.betNum")
          template(v-if="info.betNum.length > 100")
            p.ds_betnums(:class="{ellipsis2: !info.showMore}") {{info.betNum}}
              a(@click="toggleDSDetails(info)") {{info.viewMoreText}}
          template(v-else)
            p(v-html="$root.formatNums(info, 'betNum')")
    .open-send(v-if="shareEnabled && info.state == 3" @click="openSendRedpack" :class="{'lock': !allowSendMsg}") 发炫耀红包
    p(slot="footer")
  Modal.redpack-overlay(v-model="openRedpack" width="375")
    .send-redpack
      .title 发炫耀红包
      ul.wrap
        li
          span 我的余额
          .wealth {{accountInfo.wealth}}
          Icon.refresh(type="ios-loop-strong" @click="$store.dispatch('accountInfo')")
        li
          span 发包金额
          input(type="number" v-model="redpack.money" @blur="redpackMoney" :placeholder="`请输入${redpack.minMoney} ~ ${redpack.maxMoney} 的金额`")
        li
          span 红包个数     
          input(type="number" v-model="redpack.number" @blur="redpackSum" :placeholder="`请输入 ${redpack.minNumber} ~ ${redpack.maxNumber} 的个数`")
        li.msg
          span 祝福语
          input(type="text" v-model="redpack.msg" placeholder="祝福语最多10个字" maxlength="10")
      Button.send(:loading="redpackSending" @click="sendRedpack" :disabled="redpackSending")
        span(v-if="!redpackSending") 塞钱进红包
        span(v-else) 发送中
    p(slot="footer")
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from "vuex";
import { chatApi } from '@/api';

export default {
  name: "Modal4BetDetail",
  props: ['show', 'info'],
  inject: ['ivNotice'],
  data() {
    return {
      roomId: 0, //聊天室房間ID
      modal: this.show,
      allowSendMsg: true, //是否有發言權限
      shareEnabled: false, //是否有發炫耀紅包權限
      openRedpack: false,
      redpack: {
        number: null, //紅包個數
        money: null, //红包金额
        msg: '', //留言
        defaultMsg: '恭喜发财',
        userid: '', //用户ID
        type: 2, //红包类型(1、普通红包，2、炫耀红包)
        betType: '', //彩种
        betAmount: '', //中奖金额
        minMoney: Number, //紅包最少金額
        maxMoney: Number, //紅包最多金額
        minNumber: 1, //紅包最少個數
        maxNumber: Number, //紅包最多個數
      },
      redpackSending: false,
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO,
      appConfig: 'appConfig'
    })
  },
  methods: {
    //用聊天室的 check api 取得發紅包的設定
    fetchData() {
      chatApi.identityCheck().then(res => {
        let data = res.data;
        
        //判斷是否可訪問聊天室，聊天室關閉或使用者無訪問權限皆阻檔
        let userRoomAccess = data.permission.userRoomAccess;
        if (this.appConfig.hasChat == 0 || !userRoomAccess) {
          this.shareEnabled = false;
          return
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

        //取得發紅包相關參數
        let redpackConfig = data.redPacketConfig;
        let { maxmoney, minmoney, numble } = redpackConfig;
        this.redpack.userid = data.user.uid;
        this.redpack.maxMoney = maxmoney;
        this.redpack.minMoney = minmoney;
        this.redpack.maxNumber = numble;
      })
    },
    toggleDSDetails(obj) {
      obj.showMore = !obj.showMore;
      obj.viewMoreText = obj.showMore ? "收起" : "...展开";
    },
    //開啟發炫耀紅包畫面
    openSendRedpack() {
      //阻擋測試會員
      if (this.accountInfo.type == 3) return this.ivNotice('error', '已达本日发红包上限');

      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.modal = false;
      this.openRedpack = true;
    },
    //红包金额验证
    redpackMoney() {
      const { money, maxMoney, minMoney } = this.redpack;
      if (!/^\d+$/.test(money) || money > maxMoney || money < minMoney) {
        this.ivNotice('error', `请输入${minMoney}~${maxMoney}的金额`);
        this.redpack.money = null;
      }
    },
    //红包个数校验
    redpackSum() {
      const { number, maxNumber, minNumber } = this.redpack;
      if (!/^\d+$/.test(number) || number > maxNumber || number < minNumber) {
        this.ivNotice('error', `请输入${minNumber}~${maxNumber}的个数`);
        this.redpack.number = null;
      }
    },
    //發送紅包
    sendRedpack() {
      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      //金額輸入錯誤
      if (this.redpack.money == '' || this.redpack.money == null) return this.ivNotice('error', '请输入红包金额');

      //輸入金額超過餘額
      if (parseInt(this.redpack.money) > parseInt(this.info.wealth)) return this.ivNotice('error', '红包金额大于您的帐户余额');

      //數量輸入錯誤
      if (this.redpack.number == '' || this.redpack.number == null) return this.ivNotice('error', '请输入红包个数');

      //發紅包請求
      this.redpackSending = true;
      let form = new FormData();
      form.append('roomId', this.roomId);
      form.append('uid', this.redpack.userid);
      form.append('type', this.redpack.type);
      form.append('title', this.redpack.msg != '' ? this.redpack.msg : this.redpack.defaultMsg);
      form.append('money', this.redpack.money);
      form.append('number', this.redpack.number);
      form.append('odds', 1);
      form.append('betType', this.info.categoryLabel);
      form.append('betAmount', this.info.win);
      

      chatApi.sendRedpack(form).then(res => {
        //發完初始化數值
        this.redpackSending = false;
        this.openRedpack = false;
        this.redpack.msg = '';
        this.redpack.money = '';
        this.redpack.number = '';
        this.redpack.betType = '';
        this.redpack.betAmount = '';
        const { code, msg } = res;
        if (code != 0) return this.ivNotice('error', msg);
        this.ivNotice('success', '发送红包成功，可前往您喜欢的彩种聊天室查看');
      });
    },
    //關閉發紅包
    closeSendRedpack() {
      this.openRedpack = false;
    },
  },
  watch: {
    show(value) {
      this.modal = value;
    },
    modal(value) {
      this.$emit("update:show", value);
    }
  }
};
</script>

<style lang="scss" scoped>
#themeMix {
  .ds_betnums {
    max-width: 380px;
  }

  .open-send {
    display: block;
    width: 100px;
    margin: 15px auto 0 auto;
    background: #ff631e;
    border: 1px solid transparent;
    border-radius: 5px;
    font-size: 12px;
    color: #FFF;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #FFF;
      border-color: #ff631e;
      color: #ff631e;
    }
    &.lock {
      cursor: not-allowed;
    }
  }

  .redpack-overlay {
    .ivu-modal-close {
      top: 4px;
    }
    .ivu-modal-body {
      padding: 0 !important;
      .send-redpack {
        position: static;
        padding-bottom: 20px;
      }
      .title {
        margin-bottom: 0;
      }
      .wrap {
        margin-bottom: 20px;
        padding: 20px;
        li {
          margin: 0 0 20px 0;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
