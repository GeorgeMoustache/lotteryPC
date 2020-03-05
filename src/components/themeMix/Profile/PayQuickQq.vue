<template lang="pug">
.pay-model
  Form(
    ref="form"
    :model="form"
    :rules="rules"
    :label-width="120"
    )
    FormItem(label="充值金额:" prop="amount")
      Input.form-width(
        number
        v-model="form.amount"
        @on-keyup="formatAmount($event.target.value)"
        @on-blur="formatAmount($event.target.value)"
        )
      span.text-warning * 单笔金额最低{{range[0]}}元，最高{{range[1]}}元
    FormItem(v-if="needProve" label="付款方QQ号:" prop="prove")
      Input.form-width(v-model="form.prove")
      span.text-warning * 请输入付款人的QQ号码
    FormItem(label="收款账号:" prop="accountId")
      Select.form-width(v-model="accountIndex" @on-change="selectChange")
        Option(
          v-for="(item, index) in list"
          :key="index.accountId"
          :value="index"
          :label="item.accountNo")
    FormItem(label="存款时间:" prop="datetime")
      DatePicker.form-width(type="datetime" v-model="form.datetime" placeholder="请选择存款时间")
    FormItem(label="QQ昵称信息:")
      dl.select-info
        dd(v-if="src")
          img(:src="src" width="200")
        dd(v-if="src")
          b.text-warning 请使用QQ扫码完成付款，或转账给以下QQ昵称号
        dd 收款帐号：{{form.accountNo}}
        dd 收款人：{{form.accountName}}
        dd 请添加公司QQ为好友，进行转账或红包
    FormItem
      Button(type="primary", :loading="loading", :disabled="loading" @click="handleSubmit('form')") 提交
</template>

<script>
import mixins from './mixin_PayQuick';

export default {
  name: 'payQuickQq',
  mixins: [mixins],
  props: ['list'],
  data() {
    return {
      accountIndex: 0,
      range: [1, 99999],
      needProve: false,
      src: '', // 二维码图片之类的
      form: {
        amount: '', // 充值金额
        orderNum: '',
        accountId: '',
        accountNo: '',
        accountName: '',
        datetime: '',
      },
      loading: false,
      rules: {
        amount: [{ required: true, validator: this.$root.$validateAmount(this) }],
        prove: [{ required: true, message: '请输入QQ昵称' }],
        accountId: [{ required: true, message: '请选择收款账号' }],
        datetime: [{ required: true, message: '请选择存款时间' }],
      },
    };
  },
  created() {
    this.init(0);
  },
};
</script>

<style lang="scss" scoped>
.select-info {
  padding: 10px 20px;
  border: 1px solid #ddd;
}
</style>
