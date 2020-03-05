<template lang="pug">
.pay-model
  template(v-if="!result")
    p.pay-tip 请在下列支付方式中任选一种
    .pay-form(v-for="(item, index) in list" :key="item.id")
      h4.text-error(v-text="item.title")
      p.text-gray(v-text="item.desc")
      p.mt15
        pay-form-item(:item="item" @submit="handleSubmit")
  .pay-result(v-else)
    .head
      Icon.icon-success(type="android-checkbox-outline")
      h5 订单提交成功，请扫描以下二维码付款！
      p
        span 订单号：
        span.text-error(v-text="result.orderNo")
        Button(size="small" type="default" @click="copy(result.orderNo)") 复制
        span &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;应付金额：
        span.text-error(v-text="result.amount")
        span 元
    .body
      //- 付款码
      img(v-if="result.qrcodeSrc", :src="result.qrcodeSrc" width="200")
      qrcode-vue.qrcode(v-else, :value="result.url" size="200" level="H")
    .foot
      Button(type="primary" @click="goBack") 上一步
  button(style="display:none;" ref="copybtn" v-clipboard="copyData" @success="handleSuccess" @error="handleError") 复制
</template>

<script>
import PayFormItem from 'components/themeMix/Profile/PayFormItem';
import QrcodeVue from 'qrcode.vue';
import { accountApi } from 'api';

export default {
  name: 'PayQRCode',
  props: ['list'],
  components: {
    PayFormItem,
    QrcodeVue
  },
  data () {
    return {
      result: null,
      copyData: '',
      tid: null
    }
  },
  methods: {
    handleSubmit (data) {
      this.result = data.info
      if (this.result.qrcodeSrc) return;
      this.fetchPayState(this.result.orderNo)
    },
    fetchPayState (no) {
      this.tid = setTimeout(() => {
        accountApi.depositState({
          params: {
            orderNo: no
          }
        }).then(data => {
          if (data.code != 0) return this.fetchPayState(no)
          data.orderState ? this.complete() : this.fetchPayState(no)
        }, err => {
          this.notice('上分失败', 'warning')
        })
      }, 2e3)
    },
    complete () {
      clearTimeout(this.tid)
      this.$Message.success({
        content: '上分成功，请查收',
        duration: 3
      })
    },
    copy (context) {
      this.copyData = context
      // !!!
      setTimeout(() => {
        this.$refs.copybtn.click()
      }, 100)
    },
    handleSuccess (e) {
      this.notice('复制成功', 'success')
    },
    handleError (e) {
      this.notice('复制失败', 'warning')
    },
    notice (msg, type) {
      this.$Message[type](msg)
    },
    goBack () {
      clearTimeout(this.tid)
      this.result = null
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-form {
  margin: 0px 20px 10px;
  min-height: 120px;
  border-radius: 4px;
  background: #e5e5e5;
  font-size: 13px;
  text-align: center;
  h4 {
    padding-top: 10px;
    font-size: 15px;
    font-weight: 700;
  }
}
.pay-tip {
  line-height: 35px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}

.pay-result {
  .icon-success {
    margin: 0 20px 0 100px;
    float: left;
    font-size: 45px;
    color: #3da300;
  }
  h5 {
    font-size: 22px;
    color: #3da300;
  }
  .body {
    padding: 20px 0;
    text-align: center;
  }
  .qrcode {
    width: 200px;
    margin-left: 230px;
  }
  .foot .ivu-btn {
    margin-left: 300px;
  }
}

</style>
