<template lang="pug">
.money-trans
  //- 目前額度
  MoneyTransList(ref="MoneyTransList")
  //- 額度轉換
  .trans
    .title 额度转换
    ul.wrap
      li 
        span 转出
        Select(style="width:225px" v-model="query.fromPlatId" @on-change="selectTransOut($event)")
          Option.in(v-for="item in walletList" :value="item.platId" :key="item.platId" :label="item.platform")
      li 
        span 转入
        Select(style="width:225px" v-model="query.toPlatId" :label-in-value="true" @on-change="selectTransIn($event)")
          Option.in(v-for="item in walletList" :value="item.platId" :key="item.platId" :label="item.platform")
      li 
        span 金额
        Input.money(v-model="query.quantity" @on-keyup="formatAmount" :maxlength="8" placeholder="单位至元" :disabled="query.fromPlatId == ''")
        p.hint 请先选取转出平台再输入金额
      li.option
        Radio-group(v-model="query.quantity" type="button")
          Radio(v-for="(item, index) in numList" :label="item" :key="index" :disabled="query.fromPlatId == ''")
          Radio(:label="accountMoney" :disabled="query.fromPlatId == ''") 全部
    Button.submit(size="small" :loading="loading" @click="handleSubmit") 提交
    Spin(size="large" fix v-if="lock")
  //- 額轉未知錯誤提示訊息
  Modal(v-model="errorModal" title="额度转换")
    p {{errorMsg}}
    div(slot="footer")
      Button(v-if="appConfig.serviceUrl != ''" @click="serviceContact") 联系客服
      Button(type="primary" :loading="modal_loading" @click="handleRout()") 前往游戏大厅
</template>
<script>

import { mapGetters } from 'vuex';
import { accountApi } from 'api';
import MoneyTransList from '@/components/themeMix/Profile/MoneyTransList';

export default {
  name: "MoneyTrans",
  components: {
    MoneyTransList
  },
  inject: ['ivNotice'],
  data() {
    return {
      walletList: [],
      lock: true, //鎖定額轉功能待資料加載的開關
      query: {
        fromPlatId: '', //转出余额
        toPlatId: '', //转入余额
        quantity: '', // 充值金额
      },
      numList: ['100', '200', '500', '1000', '5000'],
      maxMoney: 10000000, //限制最大轉出金額
      maxOutMoney: '', //限制由官方轉出第三方平台時的金額
      accountMoney: 0, //選擇轉出平台時取得該平台的餘額
      loading: false, //資料加載
      transInLabel: '', //转入平台，预设开元余额
      transUrl: '', //前往游戏大厅链接
      noTransUrl: false,

      errorModal: false, //額轉未知錯誤彈窗
      errormsg: '',

    };
  },
  computed: {
    ...mapGetters(['appConfig']),
  },
  methods: {
    //判斷轉出平台餘額是否正確
    resetPlatMoney($event) {
      let resetItem = this.walletList.find((item)=> {
        return item.platId == $event;
      });

      let money = parseInt(resetItem.balance, 10);
      this.accountMoney = money;
    },
    //額度轉出下拉選單事件 
    selectTransOut($event) {
      this.resetPlatMoney($event);
      this.$refs.MoneyTransList.refresh($event);
      this.query.quantity = '';
    },
    //額度轉入下拉選單事件
    selectTransIn($event) {
      this.lock = true;
      this.transInLabel = $event.label
      this.$refs.MoneyTransList.refresh($event.value);
      accountApi.getBalance({params: {platId: $event.value}}).then(data => {
        this.lock = false;
        let { code, transferOverQuantity } = data;
        if (code != 0) return;
        this.maxOutMoney = transferOverQuantity;
      })
    },
    //限制輸入金額為正整數
    formatAmount() {
      this.query.quantity = this.query.quantity.replace(/\D/g,'')
      let quantity = Number(this.query.quantity);
      if(quantity > this.maxMoney) {
        this.query.quantity = this.maxMoney;
      }
    },
    //提交額度轉換
    handleSubmit() {
      //轉出平台空白警告
      if (this.query.fromPlatId == '') return this.ivNotice('error', '转出平台不得为空白');

      //轉入平台空白警告
      if(this.query.toPlatId == '') return this.ivNotice('error', '转入平台不得为空白');

      //轉入與轉出平台相同警告
      if (this.query.toPlatId === this.query.fromPlatId) return this.ivNotice('error', '转入与专出平台不可相同');

      //轉出金額为0警告
      if (this.query.quantity == 0) return this.ivNotice('error', '金额不得为0');

      //轉出金額空白警告
      if (this.query.quantity == '') return this.ivNotice('error', '金额不得为空');

      //將金額轉換成數字方便比對
      let quantity = Number(this.query.quantity)

      //余额不足警告
      if (quantity > this.accountMoney) return this.ivNotice('error', '余额不足');

      //轉出金額超過設定上限警告
      if (quantity > this.maxMoney) return this.ivNotice('error', `转出金额超过上限，上限为${this.maxMoney}元`)

      //官方轉出金額超過第三方設定上限警告
      if (this.query.fromPlatId == 0 && quantity > this.maxOutMoney) return this.ivNotice('error', `转出金额超过上限，平台上限为${this.maxOutMoney}元`)

      //發送 api
      this.handleAjax();
    },
    //發送額轉 api
    handleAjax() {
      let list = this.$refs.MoneyTransList;
      let fromPlatId = this.query.fromPlatId;
      let toPlatId = this.query.toPlatId;
      let quantity = this.query.quantity;

      //鎖定處理狀態
      this.loading = true;
      this.lock = true;
      
      //trigger左方額轉清單的按鈕進入處理狀態
      list.loading = true;
      list.walletList.forEach((item)=> {
        if(item.platId == fromPlatId || item.platId == toPlatId) {
          item.statusReady = false;
        }
      })
      
      //組合參數打 api
      let params = `?fromPlatId=${fromPlatId}&toPlatId=${toPlatId}&quantity=${quantity}`;
      accountApi.transfer(params).then(data => {
        //解鎖處理狀態
        this.loading = false;
        this.lock = false;
        list.loading = false;

        let { msg, code } = data;
        
        //如果轉入平台不是官方平台的話取得 url
        if (data.transUrl) {
          this.transUrl = data.transUrl;  
        } else {
          this.noTransUrl = true;
        }

        //額度轉換成功
        if (code == 0) {
          this.$Modal.success({
            title: '额度转换',
            content: `转入${this.transInLabel} ${quantity} CNY<br>${msg}`,
            closable: true,
            okText: '前往游戏大厅',
            onOk: ()=> {
              this.handleRout();
            }
          })
          //更新 header 餘額
          this.$store.dispatch("accountInfo");
          //重置並獲取最新資料
          list.refresh(fromPlatId);
          list.refresh(toPlatId);
          this.query.quantity = '';
          return
        }
        
        //額度上限不得超過ㄧ千萬
        if (code == 2) {
          this.$Modal.error({
            title: '额度转换',
            content: `转入${this.transInLabel} ${quantity} CNY<br>${msg}`,
            okText: '确定',
          })
          return
        }

        //餘額不足
        if (code == 3) {
          this.$Modal.confirm({
            title: '额度转换',
            content: `转入${this.transInLabel} ${quantity} CNY<br>${msg}`,
            closable: true,
            okText: '前往游戏大厅',
            onOk: ()=> {
              this.handleRout();
            },
            cancelText: '去充值',
            onCancel: ()=> {
              this.$router.push({ path: '/profile/deposit' });
            }
          })
          return
        }

        // 我方以及第三方限额
        if (code == 4) {
          this.$Modal.error({
            title: '额度转换',
            content: msg,
            okText: '确定',
          })
          return
        }

        //其他未知錯誤
        this.errorModal = true;
        this.errorMsg = msg;

        list.walletList.forEach((item) => {
          item.statusReady = true;
        })
      });
    },
    handleRout() {
      if (this.noTransUrl) {
        this.$router.push({ path: "/lottery" });
      } else {
        window.open(this.transUrl);
      }
    },
    serviceContact() {
      window.open(this.appConfig.serviceUrl);
    }
  }
}
</script>

<style lang="scss" scoped>
.money-trans {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.trans {
  position: relative;
  flex-shrink: 0;
  align-self: flex-start;
  width: 300px;
  margin-left: 20px;
  padding: 20px;
  background: #FFF;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 18px;
    &::before {
      content: "";
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 15px;
      background: url('~assets/themeMix/moneytrans-title-change.svg');
      background-size: 100% auto;
    }
  }
  .wrap {
    margin-bottom: 20px;
  }
  .wrap > li {
    margin-top: 20px;
    span {
      margin-right: 10px;
    }
    .hint {
      margin-top: 5px;
      font-size: 12px;
      color: #ff631e;
      text-align: right;
    }
  }
  li:first-child {
    margin: 0;
  }
  .money {
    width: 225px;
  }
  .ivu-radio-wrapper.ivu-radio-group-item {
    height: 24px;
    padding: 0 9.5px;
    line-height: 24px;
    text-align: center;
    &::after {
      height: 24px;
    }
  }
  .ivu-radio-wrapper.ivu-radio-group-item:hover {
    color: #f13131;
  }
  .ivu-radio-wrapper-checked {
    border-color: #f13131;
    box-shadow: -1px 0 0 0 #f13131;
    color: #f13131;
  }
  .submit {
    display: block;
    width: 100px;
    margin: 0 auto;
    background: #f13131;
    color: #FFF;
    border-radius: 5px;
    &:hover {
      border-color: #f13131;
    }
  }
}
</style>
