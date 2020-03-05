<template lang="pug">
.offline
  //- 支付內容
  .preview(v-if="!(confirmEnabled || resultEnabled)")
    .pay-list
      a(v-for="item in list.bank" :key="item.id" :class="[`bank-${item.type}`, {active: payItem == item.id}]" @click="changePayItem(item)") {{item.bankName}}
      a(v-for="item in list.qrcode" :key="item.accountId" :class="[payType[item.type - 1], {active: payItem == item.accountId}]" @click="changePayItem(item)") {{item.title}}
    ul.form
      li
        Input(v-model="amount" @on-keyup="keyupPrice($event.target.value)" placeholder="请输入充值金额，必填" required)
        .tip 单笔充值 {{minMoney}}-{{maxMoney}}
      li
        Input(type="text" v-model="username" placeholder="请输入存款人真实姓名，必填")
    //- 充值說明
    perfect-scrollbar.readme(v-if="note && note != ''" v-html="note")
    .discount(v-if="discount != ''")
      p 公司入款单次满{{discount.money}}元
      p 优惠{{discount.percent}}%
    .buttons
      Button.submit(@click="confirm()") 下一步
  //- 確認支付視窗
  .confirm(v-if="confirmEnabled")
    .info
      p(v-if="payment == 0") 充值银行：{{bankName}}
      p 收款姓名：{{accountName}}
      p 收款帐号：{{bankCardNo}}
      p(v-if="payment == 0") 开户分行：{{bankAddress}}
      p 充值金額：{{amount}} 元
    img.qrcode(v-if="payment == 1" :src="qrcodeSrc")
    .buttons
      Button.back(@click="back()") 上一步
      Button.submit(@click="submit()") 确认提交
  //- result
  .result(v-if="resultEnabled" :class="resultStatus == 0 ? 'success' : 'failed'")
    .title {{resultTitle}}
    p 充值方式：{{resultPayway}}
    p 充值金额：{{amount}} 人民币
    .buttons
      Button.back(@click="reset()") 返回
      router-link.submit(:to="{path:'/profile/record/0'}" v-if="resultStatus == 0") 查看充值记录
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'DepositOffline',
  props: ['list', 'payType', 'discount'],
  inject: ['ivNotice', 'reload'],
  data() {
    return {
      payItem: 0, //選取的支付種類ID
      payment: 0, //使用銀行入款或掃碼付款[0:銀行, 1:掃碼]
      payApi: '', //使用何種 api 方式付款
      
      minMoney: '', //最小金額
      maxMoney: '', //最大金額

      amount: '', //金額
      username: '', //存款人姓名

      //備註說明文字
      note: '',

      //預覽支付參數
      bankName: '',
      accountName: '',
      bankCardNo: '',
      bankAddress: '',
      qrcodeSrc: '',

      //支付結果參數
      resultStatus: 0,
      resultTitle: '',
      resultPayway: '',

      confirmEnabled: false, //確認支付開關
      resultEnabled: false, //支付結果開關

      //發送參數
      form: {}
    }
  },
  created() {
    this.init();
  },
  methods: {
    //依照付款模式分配參數
    paymentJudgement(item) {
      if (item.id) {
        this.payment = 0;
        this.payApi = 'deposit';
        this.bankName = item.bankName;
        this.accountName = item.accountName;
        this.bankCardNo = item.bankCardNo;
        this.bankAddress = item.bankAddress;
        this.resultPayway = `线下${item.bankName}转账`;
      } else {
        this.payment = 1;
        this.payApi = 'depositQuick';
        this.bankName = ''
        this.accountName = item.accountName;
        this.bankCardNo = item.accountNo;
        this.bankAddress = '';
        this.resultPayway = item.title;
        this.qrcodeSrc = item.src;
      }
      this.note = item.note;
    },
    init() {
      if (!this.list.bank.length && !this.list.qrcode.length) return;
      let item = this.list.bank[0] || this.list.qrcode[0];
      this.payItem = item.id || item.accountId;
      this.minMoney = item.range[0];
      this.maxMoney = item.range[1];
      this.paymentJudgement(item);
    },
    //切換支付種類
    changePayItem(item) {
      this.payItem = item.id || item.accountId;
      let range = item.range;
      this.minMoney = range[0];
      this.maxMoney = range[1];
      this.amount = '';
      this.username = '';
      this.paymentJudgement(item);
    },
    //格式化金額為數字
    keyupPrice(value) {
      let formatVal = +String(value).replace(/[^\d]/g, '');
      if (value != formatVal) this.amount = formatVal;
    },
    //確認訂單
    confirm() {
      let money = Number(this.amount);

      //金額不得為0
      if (money == 0 || money == '') return this.ivNotice('error', '金额不得为0或空白');

      //金額超過範圍
      if (money > this.maxMoney || money < this.minMoney) return this.ivNotice('error', '请输入限制范围内的金额');

      //姓名未輸入
      if (this.username == '') return this.ivNotice('error', '存款人姓名不得为空白');
      
      //組合參數
      let form = this.form;
      form.note = '';
      form.amount = money;

      if (this.payment == 0) {
        form.id = this.payItem;
        form.username = this.username;
      } else {
        form.accountId = this.payItem,
        form.accountName = this.accountName, //(from Api)
        form.accountNo = this.bankCardNo, //(from Api)
        form.prove = this.username
      }

      this.confirmEnabled = true;
    },
    //回上一步
    back() {
      this.confirmEnabled = false;
      this.form = {};
    },
    //返回最初頁面並重置所有參數
    reset() {
      this.confirmEnabled = false;
      this.resultEnabled = false;
      this.amount = '';
      this.username = '';
      this.form = {};
      this.init();
    },
    //送出
    submit() {
      let api = this.payApi;
      accountApi[api](this.form).then(data => {
        let { code, msg } = data;
        this.confirmEnabled = false;
        this.resultEnabled = true;
        if (code != 0) {
          this.resultStatus = 1;
          this.resultTitle = '支付信息提交失敗'
        } else {
          this.resultStatus = 0;
          this.resultTitle = '支付信息提交成功'
        }
      });
    }
  },
  watch: {
    'list': 'init'
  }
}
</script>