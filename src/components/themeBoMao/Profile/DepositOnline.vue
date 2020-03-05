<template lang="pug">
.online
  .pay-list
    a(v-for="(item, index) in list" :key="item.id" :class="[payType[item.type - 1], {active: payItem == index}]" @click="changePayItem(item, index)") {{item.title}} (单笔充值 {{item.range[0]}}-{{item.range[1]}})
  ul.form
    li
      Input(v-model="form.amount" @on-keyup="keyupPrice($event.target.value)" placeholder="请输入充值金额，必填")
      .tip 单笔充值 {{minMoney}}-{{maxMoney}}
  //- 充值說明
  perfect-scrollbar.readme(v-if="note != ''" v-html="note")
  .discount(v-if="discount != ''")
    p 公司入款单次满{{discount.money}}元
    p 优惠{{discount.percent}}%
  .buttons
    Button.submit(@click="confirm()") 确认提交
  Modal(v-model="confirmEnabled" title="温馨提示" ok-text="去支付" @on-ok="submit()")
    p 页面正跳转第三方支付
</template>

<script>
import { accountApi } from 'api';

export default {
  name: 'DepositOnline',
  props: ['list', 'payType', 'discount'],
  inject: ['ivNotice', 'reload'],
  data() {
    return {
      payItem: 0, //選取的支付種類
      
      minMoney: '', //最小金額
      maxMoney: '', //最大金額

      //備註說明文字
      note: '',

      //提交參數
      form: {
        id: '',
        amount: '',
      },
      
      //確認支付彈窗
      confirmEnabled: false
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (!this.list[0]) return;
      let item = this.list[0];
      this.form.id = item.id;
      this.minMoney = item.range[0];
      this.maxMoney = item.range[1];
      this.note = item.note;
    },
    //切換支付種類
    changePayItem(item, index) {
      this.payItem = index;
      let range = item.range;
      this.minMoney = range[0];
      this.maxMoney = range[1];
      this.form.id = item.id;
      this.form.amount = '';
      this.note = item.note;
    },
    //格式化金額為數字
    keyupPrice(value) {
      let formatVal = +String(value).replace(/[^\d]/g, '');
      if (value != formatVal) this.form.amount = formatVal;
    },
    //確認送出
    confirm() {
      let money = Number(this.form.amount);

      //金額不得為0
      if (money == 0 || money == '') return this.ivNotice('error', '金额不得为0或空白');

      //金額超過範圍
      if (money > this.maxMoney || money < this.minMoney) return this.ivNotice('error', '请输入限制范围内的金额')
      
      this.form.amount = money;
      this.confirmEnabled = true;
    },
    //送出
    submit() {
      accountApi.deposit(this.form).then(data => {
        let { code, msg } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.confirmEnabled = false;
        window.open(data.info.url || data.info.h5url);
        this.$Modal.confirm({
          title: '温馨提示',
          content: '请根据支付情况点击下方按钮请不要重复支付。',
          okText: '支付成功',
          cancelText: '未支付',
          onOk: ()=> {
            this.$router.push({path: '/profile/record/0'})
          },
          onCancel: ()=> {
            this.reload();
          }
        })
      });
    }
  },
  watch: {
    'list': 'init'
  }
}
</script>