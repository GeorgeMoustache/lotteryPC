<template lang="pug">
.profile_deposit
  .profile_deposit-main.fn-left
    Tabs(v-model="tabSelected")
      TabPane(v-for="(tab, key) in tabs"
        :label="tab.label"
        :name="tab.id"
        :key="key")
    .content(v-for="(child, childIdx) in template"
      :key="child.id"
      v-show="child.id == tabSelected"
      v-if="template.length && child != null")
      p.tip(v-if="!child.data.length") 暂无支付通道，请用其他支付方式
      template(v-else)
        //- 二维码支付 id=1,2 微信／QQ 支付宝
        pay-QRCode(v-if="/^[12]$/.test(child.id)" :list="child.data")
        //- 在线支付
        //- pay-online(v-else-if="child.id == x" :list="child.data")
        //- 银行转账 id=3
        pay-bank(v-else-if="child.id == 3" :list="child.data")
        //- 快速转账 - alipay id=4
        pay-quick-ali(v-else-if="child.id == 4" :list="child.data" platform="ali")
        //- 快速转账 - qqpay id=5
        pay-quick-qq(v-else-if="child.id == 5" :list="child.data" platform="qq")
        //- 快速转账 - WeChatPay id=6
        pay-quick-wechat(v-else-if="child.id == 6" :list="child.data" platform="wechat")
        //- 快速转账 - 云闪付 id=7
        pay-cloud(v-else-if="child.id == 7" :list="child.data" platform="cloud")
    .footer(v-if="tabs.length")
      //- 微信
      template(v-if="tabSelected == 1")
        h4 操作步骤：
        p ※ 1.微信支付（扫一扫直接到账） 方便快捷，支付完成立即到账。
        p ※ 24小时存款不限次数，免除所有手续费，3分钟火速到账。
        p ※ 存款遇到问题？立即联络在线客服为您服务。
      //- 支付宝
      template(v-else-if="tabSelected == 2")
        h4 操作步骤：
        p ※ 1.支付宝支付（扫一扫直接到账） 方便快捷，支付完成立即到账。
        p ※ 24小时存款不限次数，免除所有手续费，3分钟火速到账。
        p ※ 存款遇到问题？立即联络在线客服为您服务。
      //- 雲閃付
      template(v-else-if="tabSelected == 7")
        h4 操作步骤：
        p ※ 1.云闪付支付（扫一扫直接到账） 方便快捷，支付完成立即到账。
        p ※ 24小时存款不限次数，免除所有手续费，3分钟火速到账。
        p ※ 存款遇到问题？立即联络在线客服为您服务。
</template>
<script>
import { mapGetters } from 'vuex';
import { accountApi } from 'api';
import PayQRCode from 'components/themeMix/Profile/PayQRCode';
import PayBank from 'components/themeMix/Profile/PayBank';
import PayQuickAli from 'components/themeMix/Profile/PayQuickAli';
import PayQuickQq from 'components/themeMix/Profile/PayQuickQq';
import PayQuickWechat from 'components/themeMix/Profile/PayQuickWechat';
import PayCloud from 'components/themeMix/Profile/PayCloud';

export default {
  name: 'ProfileDeposit',
  components: {
    PayQRCode,
    // PayOnline,
    PayBank,
    PayQuickAli,
    PayQuickQq,
    PayQuickWechat,
    PayCloud,
  },
  computed: {
    ...mapGetters(['appConfig']),
  },
  data() {
    return {
      tabSelected: '1',
      tabs: [],
      template: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      accountApi.payType().then(data => {
        const { code, msg, tabs, template } = data;
        if (code != 0) {
          return this.notice(msg, 'warning');
        }
        this.tabs = tabs.map(item => {
          item.id = item.id + '';
          return item;
        });
        this.tabSelected = this.tabs[0].id;
        this.template = template.map((item, index) => {
          return {
            id: tabs[index].id,
            data: item,
          }
        })
      });
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
  },
};
</script>

<style lang="scss" scoped>
.profile_deposit {
  overflow: hidden;
  background: #fff;
  &-main {
    float: none;
    background: #fff;
  }
  .btn {
    display: inline-block;
    width: 150px;
    height: 40px;
    line-height: 40px;
    border: 2px solid #6eabec;
    border-radius: 4px;
    text-align: center;
    color: #6eabec;
  }
  .footer {
    padding: 30px;
    h4 {
      line-height: 35px;
      color: #248ce6;
      font-size: 16px;
    }
    p {
      margin-bottom: 7px;
    }
  }
  .tip {
    padding: 20px 30px;
    font-size: 16px;
    color: #999;
  }
}
</style>
