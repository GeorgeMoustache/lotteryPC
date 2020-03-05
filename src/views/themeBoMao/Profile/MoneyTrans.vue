<template lang="pug">
#money-trans
  //- 額度轉換
  .trans
    .section-title 额度转换
    .wrap
      .platform
        .out 
          .title 转出
          Select(style="width:225px" v-model="query.fromPlatId" @on-change="selectTransOut($event)")
            Option.in(v-for="item in walletList" :value="item.platId" :key="item.platId" :label="item.platform")
        .in  
          .title 转入
          Select(style="width:225px" v-model="query.toPlatId" :label-in-value="true" @on-change="selectTransIn($event)")
            Option.in(v-for="item in walletList" :value="item.platId" :key="item.platId" :label="item.platform")
      .money
        Input(v-model="query.quantity" @on-keyup="formatAmount" :maxlength="8" placeholder="单位至元" :disabled="moneyLock")
        Button.submit(:loading="loading" @click="handleSubmit") 提交
        Button.reset(@click="resetMoney()") 重置
      .option
        Radio-group(v-model="query.quantity" type="button")
          Radio(v-for="(item, index) in numList" :label="item" :key="index" :disabled="moneyLock")
          Radio(:label="accountMoney" :disabled="moneyLock") 全部
    Spin(size="large" fix v-if="lock")
  //- 目前額度
  .current 
    .section-title 目前额度
    .wrap
      dl(v-for="(item, index) in walletList" :key="index")
        dt {{item.platform}}
          Poptip(trigger="hover" content="所有整数余额回归至主账户" v-if="item.platId == 0")
            Button(@click="allMoneyBack" :loading="loading")
              span(v-if="!loading") 一键归户
              span(v-if="loading") 处理中...
        dd
          .loading-money(:class="{active: item.statusReady}") 获取帐户余额中，请稍候...
          .remain(v-if="item.balance != '---'" :class="{active: item.statusReady}")
            span ￥{{item.balance}}
          .remain(v-else :class="{active: item.statusReady}") 获取金额失败，请重新操作  
          Button.refresh(:class="{active: item.statusReady}" :disabled="!item.statusReady")
            Icon(type="ios-loop-strong" :id="'refreshing' + item.platId"  @click="refresh(item.platId)")
  //- 額轉未知錯誤提示訊息
  Modal(v-model="errorModal" title="额度转换")
    p {{errorMsg}}
    div(slot="footer")
      Button(v-if="appConfig.serviceUrl != ''" @click="serviceContact") 联系客服
      Button(type="primary" :loading="modal_loading" @click="handleRout()") 前往游戏大厅
</template>
<script>
import { mapGetters } from 'vuex';
import { accountApi, gameBoyApi, lotteryApi } from 'api';

export default {
  name: 'MoneyTrans',
  inject: ['ivNotice'],
  data() {
    return {
      loading: false,
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
      modal_loading: false, //資料加載
      transInLabel: '', //转入平台，预设开元余额
      transUrl: '', //前往游戏大厅链接
      noTransUrl: false,

      errorModal: false, //額轉未知錯誤彈窗
      errorMsg: '',

      hotAlias: '', //預設第一個熱門彩種
    };
  },
  computed: {
    ...mapGetters(['appConfig']),
    //鎖定金額輸入
    moneyLock() {
      if (this.query.fromPlatId == '' || this.query.fromPlatId == undefined) {
        return true;
      }
    },
  },
  created() {
    this.fetchData();
    this.fetchHot();
  },
  methods: {
    //獲取資料
    fetchData() {
      gameBoyApi.allGame().then(data => {
        let { code, msg, wallet } = data;
        if (code != 0) return this.ivNotice('error', msg);

        this.walletList = wallet.filter(item => {
          item.statusReady = false;
          return item.status == 1;
        });

        //取得各平台餘額
        this.walletList.forEach((item, index, array) => {
          this.refresh(item.platId);
          if (index == array.length - 1) {
            if (this.lock) {
              this.lock = false;
            }
          }
        });
      });
    },
    //獲取第一個熱門彩種
    fetchHot() {
      lotteryApi.hots().then(data => {
        let { code, msg, hots } = data;
        if (code != 0) return this.ivNotice('error', msg);
        this.hotAlias = hots[0].alias;
      });
    },
    //判斷轉出平台餘額是否正確
    resetPlatMoney($event) {
      if (!$event) return;
      let resetItem = this.walletList.find(item => {
        return item.platId == $event;
      });

      let money = parseInt(resetItem.balance, 10);

      if (money > this.maxMoney) {
        this.accountMoney = this.maxMoney;
      } else {
        this.accountMoney = money;
      }
    },
    //額度轉出下拉選單事件
    selectTransOut($event) {
      if (!$event) return;
      this.resetPlatMoney($event);
      this.refresh($event);
      this.query.quantity = '';
    },
    //額度轉入下拉選單事件
    selectTransIn($event) {
      if (!$event) return;
      this.lock = true;
      this.transInLabel = $event.label;
      this.refresh($event.value);
      accountApi.getBalance({ params: { platId: $event.value } }).then(data => {
        this.lock = false;
        let { code, transferOverQuantity } = data;
        if (code != 0) return;
        this.maxOutMoney = transferOverQuantity;
      });
    },
    //限制輸入金額為正整數
    formatAmount() {
      this.query.quantity = this.query.quantity.replace(/\D/g, '');
      let quantity = Number(this.query.quantity);
      if (quantity > this.maxMoney) {
        this.query.quantity = this.maxMoney;
      }
    },
    //提交額度轉換
    handleSubmit() {
      //轉出平台空白警告
      if (this.query.fromPlatId == '') return this.ivNotice('error', '转出平台不得为空白');

      //轉入平台空白警告
      if (this.query.toPlatId == '') return this.ivNotice('error', '转入平台不得为空白');

      //轉入與轉出平台相同警告
      if (this.query.toPlatId === this.query.fromPlatId) return this.ivNotice('error', '转入与专出平台不可相同');

      //轉出金額为0警告
      if (this.query.quantity == 0) return this.ivNotice('error', '金额不得为0');

      //轉出金額空白警告
      if (this.query.quantity == '') return this.ivNotice('error', '金额不得为空');

      //將金額轉換成數字方便比對
      let quantity = Number(this.query.quantity);

      //余额不足警告
      if (quantity > this.accountMoney) return this.ivNotice('error', '余额不足');

      //轉出金額超過設定上限警告
      if (quantity > this.maxMoney) return this.ivNotice('error', `转出金额超过上限，上限为${this.maxMoney}元`);

      //官方轉出金額超過第三方設定上限警告
      if (this.query.fromPlatId == 0 && quantity > this.maxOutMoney) return this.ivNotice('error', `转出金额超过上限，平台上限为${this.maxOutMoney}元`);

      //發送 api
      this.handleAjax();
    },
    //發送額轉 api
    handleAjax() {
      let fromPlatId = this.query.fromPlatId;
      let toPlatId = this.query.toPlatId;
      let quantity = this.query.quantity;

      //鎖定處理狀態
      this.loading = true;
      this.lock = true;

      //trigger左方額轉清單的按鈕進入處理狀態
      this.loading = true;
      this.walletList.forEach(item => {
        if (item.platId == fromPlatId || item.platId == toPlatId) {
          item.statusReady = false;
        }
      });

      //組合參數打 api
      let params = `?fromPlatId=${fromPlatId}&toPlatId=${toPlatId}&quantity=${quantity}`;
      accountApi.transfer(params).then(data => {
        //解鎖處理狀態
        this.loading = false;
        this.lock = false;

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
            onOk: () => {
              this.handleRout();
            },
          });
          //更新 header 餘額
          this.$store.dispatch('accountInfo');
          //重置並獲取最新資料
          this.refresh(fromPlatId);
          this.refresh(toPlatId);
          this.resetPlatMoney(fromPlatId);
          this.query.quantity = '';
          return;
        }

        //額度上限不得超過ㄧ千萬
        if (code == 2) {
          this.$Modal.error({
            title: '额度转换',
            content: `转入${this.transInLabel} ${quantity} CNY<br>${msg}`,
            okText: '确定',
          });
          return;
        }

        //餘額不足
        if (code == 3) {
          this.$Modal.confirm({
            title: '额度转换',
            content: `转入${this.transInLabel} ${quantity} CNY<br>${msg}`,
            closable: true,
            okText: '前往游戏大厅',
            onOk: () => {
              this.handleRout();
            },
            cancelText: '去充值',
            onCancel: () => {
              this.$router.push({ path: '/profile/deposit' });
            },
          });
          return;
        }

        //其他未知錯誤
        this.errorModal = true;
        this.errorMsg = msg;

        this.walletList.forEach(item => {
          item.statusReady = true;
        });
      });
    },
    handleRout() {
      if (this.noTransUrl) {
        this.$router.push({ path: `/lottery/${this.hotAlias}` });
      } else {
        window.open(this.transUrl);
      }
    },
    serviceContact() {
      window.open(this.appConfig.serviceUrl);
    },
    //重置參數
    resetMoney() {
      this.query.fromPlatId = '';
      this.query.toPlatId = '';
      this.query.quantity = '';
      this.accountMoney = 0;
    },
    //刷新單筆餘額
    refresh(platId) {
      //在 list 中取得該筆資料來操作
      let item = this.walletList.find(item => {
        return item.platId == platId;
      });

      item.statusReady = false;

      accountApi.getBalance({ params: { platId: platId } }).then(data => {
        if (data.code != 0) {
          this.$Notice.error({
            title: '获取金额失败',
            desc: data.msg,
          });
          item.statusReady = true;
          item.balance = '---';
          return;
        }

        //比對額轉 list 內容取代為新資料
        this.walletList.forEach(item => {
          if (item.platId == platId) {
            item.balance = data.balance;
          }
        });

        item.statusReady = true;
      });
    },
    //一鍵歸戶
    allMoneyBack() {
      this.loading = true;
      this.walletList.forEach(item => {
        item.statusReady = false;
      });
      accountApi.oneClickToPlat().then(data => {
        this.loading = false;
        let { code, msg } = data;
        if (code != 0) {
          this.$Notice.error({
            title: '系统提示',
            desc: msg,
          });
        } else {
          this.$Notice.info({
            title: '系统提示',
            desc: msg,
          });
        }
        this.fetchData();
        this.$store.dispatch('accountInfo');
      });
    },
  },
};
</script>
