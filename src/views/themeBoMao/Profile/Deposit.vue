<template lang="pug">
#deposit
  .account 会员账号：{{accountInfo.username}}
  .page-tabs
    a(v-for="(item, index) in tabList" :key="index" v-text="item" :class="{active: tabIndex == index}" @click="changeDepositType(item, index)")
  //- 線上支付
  DepositOnline(v-if="tabIndex == 0 && onlineList.length" :list="onlineList" :payType="payType" :discount="discount")
  //- 線下支付
  DepositOffline(v-if="tabIndex == 1 && (offlineList.bank.length || offlineList.qrcode.length)" :list="offlineList" :payType="payType" :discount="discount")
</template>

<script>
import { ACCOUNT } from "@/store/mutation-types";
import { mapGetters } from "vuex";
import DepositOnline from 'components/themeBoMao/Profile/DepositOnline';
import DepositOffline from 'components/themeBoMao/Profile/DepositOffline';
import { accountApi } from 'api';

export default {
  name: 'Deposit',
  components: {
    DepositOnline,
    DepositOffline
  },
  inject: ['ivNotice'],
  data() {
    return {
      tabList: ['线上支付', '线下支付'], //頁籤列表
      tabIndex: 0, //選中頁籤

      //各支付的 icon 樣式，位置 3 + 4 對應後臺資料庫所以空白，不可移除
      payType: ['wechat', 'alipay', '', '', 'qq', 'unionpay'],

      //線上支付列表
      onlineList: [],

      //線下支付列表
      offlineList: {},

      //優惠折扣項目
      discount: ''
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: ACCOUNT.ACCOUNTINFO
    }),
  },
  created() {
    this.fetchPayType();
  },
  methods: {
    //獲取支付列表
    fetchPayType() {
      accountApi.payTypeBoMao().then(data => {
        let { code, msg, online, offline, discount } = data;
        if (code != 0) return this.ivNotice('error', msg);

        this.onlineList = online;
        this.offlineList = offline;
        this.discount = discount;

        //取得 breadCrumb 路徑
        this.$parent.currentPath = this.tabList[0];
      })
    },
    //切換支付方式
    changeDepositType(item, index) {
      this.tabIndex = index;
      //取得 breadCrumb 路徑
      this.$parent.currentPath = item;
    }
  }
}
</script>
