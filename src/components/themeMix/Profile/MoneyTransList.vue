<template lang="pug">
.current 
  .title 目前额度
  .cur-amount
    table
      tr(v-for="(item, index) in walletList" :key="index")
        td {{item.platform}}
        td
          .loading-money(:class="{active: item.statusReady}") 获取帐户余额中，请稍候...
          .remain(v-if="item.balance != '---'" :class="{active: item.statusReady}") 余额
            em ￥{{item.balance}} 
            | CNY
          .remain(v-else :class="{active: item.statusReady}") 获取金额失败，请重新操作  
          Button.refresh(:class="{active: item.statusReady}" :disabled="!item.statusReady")
            Icon(type="ios-loop-strong" :id="'refreshing' + item.platId"  @click="refresh(item.platId)")
          Poptip(trigger="hover" content="所有整数余额回归至主账户" v-if="item.platId == 0")
            Button.money(@click="allMoneyBack" :loading="loading")
              span(v-if="!loading") 一键归户
              span(v-if="loading") 处理中...
</template>

<script>
import { accountApi, gameBoyApi } from 'api';

export default {
  name: 'MoneyTransList',
  inject: ['ivNotice'],
  data() {
    return {
      loading: false,
      walletList: [],
    };
  },
  created() {
    this.fetchData();
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

        //如果父元件需要用到資料就往上傳
        if (this.$parent.walletList) {
          this.$parent.walletList = this.walletList;
        }

        //取得各平台餘額
        this.walletList.forEach((item, index, array) => {
          this.refresh(item.platId);
          if (index == array.length - 1) {
            if (this.$parent.lock) {
              this.$parent.lock = false;
            }
          }
        });
      });
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

        //在額轉下更新可用最大餘額
        let parentFromPlatId = this.$parent.query && this.$parent.query.fromPlatId ? this.$parent.query.fromPlatId : '';
        if (platId === parentFromPlatId) {
          this.$nextTick(() => {
            this.$parent.resetPlatMoney(platId);
          });
        }
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

<style lang="scss" scoped>
//目前額度
.current {
  width: 100%;
  padding: 20px;
  background: #fff;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 18px;
    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 15px;
      background: url('~assets/themeMix/moneytrans-title-current.svg');
      background-size: 100% auto;
    }
  }
  table {
    width: 100%;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    font-size: 14px;
  }
  td {
    position: relative;
    width: 50%;
    padding: 5px 10px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
    &:first-child {
      text-align: center;
    }
  }
  .loading-money {
    display: inline-block;
    width: 190px;
    transition: all 0.3s;
    &.active {
      opacity: 0;
    }
  }
  .remain {
    position: absolute;
    left: -10px;
    top: 7px;
    opacity: 0;
    transition: all 0.3s;
    em {
      color: #f13131;
    }
    &.active {
      left: 9px;
      opacity: 1;
    }
  }
  .refresh {
    margin-right: 20px;
    padding: 0 5px;
    background: #999;
    font-size: 16px;
    color: #fff;
    i {
      animation: loading 1s linear infinite;
    }
    &:hover {
      border-color: transparent;
    }
  }
  .refresh.active {
    background: #ff631e;
    i {
      animation: none;
      transition: all 0.3s;
    }
    &:hover i {
      transform: rotate(180deg);
    }
  }
  .money {
    padding: 3px 10px;
    background: #f13131;
    color: #fff;
    border: none;
    border-radius: 5px;
    &:focus {
      box-shadow: none;
    }
  }
}

@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}
</style>